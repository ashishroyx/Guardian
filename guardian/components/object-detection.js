"use client";

import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { load as cocoSSDLoad } from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";
import { renderPredictions } from "@/utils/render-predictions";
import { supabase } from "@/utils/supabase";
import { useAuth } from "@clerk/nextjs"; // ✅ ADDED CLERK IMPORT

const ObjectDetection = () => {
  const { userId } = useAuth(); // ✅ ADDED USERID HOOK
  const [isLoading, setIsLoading] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const requestRef = useRef(null);
  const lastSnapshotTimeRef = useRef(0);

  const initModel = async () => {
    setIsLoading(true);
    try {
      await tf.ready();
      const net = await cocoSSDLoad();
      setIsLoading(false);
      startDetection(net);
    } catch (error) {
      console.error("Model failed to load:", error);
    }
  };

  const takeSnapshot = async (count, maxScore) => {
    // Safety check: Don't upload if no user is logged in
    if (!userId) {
      console.error("No user ID found. Are you logged in?");
      return;
    }

    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      const fileName = `detection-${Date.now()}.webp`;

      try {
        const res = await fetch(imageSrc);
        const blob = await res.blob();

        const { data: storageData, error: storageError } = await supabase.storage
          .from("guardian_snapshots")
          .upload(fileName, blob);

        if (storageError) throw storageError;

        const { data: { publicUrl } } = supabase.storage
          .from("guardian_snapshots")
          .getPublicUrl(fileName);

        const { error: dbError } = await supabase
          .from("detections")
          .insert([
            {
              image_url: publicUrl,
              label: "person",
              confidence: parseFloat(maxScore.toFixed(2)),
              person_count: count, 
              user_id: userId, // ✅ LINKING TO CLERK USER
            },
          ]);

        if (dbError) throw dbError;

        console.log(`Cloud Backup Successful for user: ${userId}`);
      } catch (error) {
        console.error("Cloud Error:", error.message);
      }
    }
  };

  const startDetection = (net) => {
    const detect = async () => {
      if (
        isCameraOn && 
        webcamRef.current &&
        webcamRef.current.video?.readyState === 4 &&
        canvasRef.current
      ) {
        const video = webcamRef.current.video;
        const { videoWidth, videoHeight } = video;

        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;

        const detectedObjects = await net.detect(video, undefined, 0.6);
        
        const detectedPeople = detectedObjects.filter(
          obj => obj.class === "person" && obj.score > 0.7
        );
        
        const now = Date.now();
        if (detectedPeople.length > 0 && now - lastSnapshotTimeRef.current > 5000) {
          const maxScore = Math.max(...detectedPeople.map(p => p.score));
          takeSnapshot(detectedPeople.length, maxScore);
          lastSnapshotTimeRef.current = now;
        }

        const context = canvasRef.current.getContext("2d");
        renderPredictions(detectedObjects, context);
      }
      requestRef.current = requestAnimationFrame(detect);
    };
    requestRef.current = requestAnimationFrame(detect);
  };

  useEffect(() => {
    initModel();
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isCameraOn && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  }, [isCameraOn]);

  return (
    <div className="mt-8 flex flex-col items-center min-h-screen justify-center pb-20">
      {isLoading ? (
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-t-[#333330] border-gray-200 rounded-full animate-spin" />
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A1A09A]">
            Initializing Neural Engine...
          </p>
        </div>
      ) : (
        <>
          <div className="relative overflow-hidden rounded-2xl border border-white/20 shadow-2xl bg-black mt-10">
            {isCameraOn ? (
              <Webcam
                ref={webcamRef}
                audio={false}
                muted
                screenshotFormat="image/webp"
                className="w-full max-w-4xl h-auto"
                videoConstraints={{ facingMode: "user", width: 1280, height: 720 }}
              />
            ) : (
              <div className="w-full max-w-4xl lg:w-[800px] lg:h-[450px] flex items-center justify-center text-white/20 uppercase tracking-widest text-xs">
                Camera Paused
              </div>
            )}
            
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full pointer-events-none z-10"
            />
            
            {isCameraOn && (
              <div className="absolute top-4 right-4 z-20">
                <div className="bg-black/50 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-[8px] text-white font-bold uppercase tracking-widest">Live Feed</span>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsCameraOn(!isCameraOn)}
            className="mt-6 px-6 py-2 bg-[#333330] text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-colors"
          >
            {isCameraOn ? "Turn Camera Off" : "Turn Camera On"}
          </button>
        </>
      )}
    </div>
  );
};

export default ObjectDetection;