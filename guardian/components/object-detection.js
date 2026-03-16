"use client";

import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { load as cocoSSDLoad } from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";
import { renderPredictions } from "@/utils/render-predictions";

const ObjectDetection = () => {
  const [isLoading, setIsLoading] = useState(true);
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const requestRef = useRef(null); // To store the animation frame ID

  // 1. Load the model once
  const initModel = async () => {
    setIsLoading(true);
    try {
      // Warm up the backend (WebGL or WebGPU)
      await tf.ready();
      const net = await cocoSSDLoad();
      setIsLoading(false);
      
      // Start the detection loop
      startDetection(net);
    } catch (error) {
      console.error("Model failed to load:", error);
    }
  };

  // 2. Optimized Detection Loop
  const startDetection = (net) => {
    const detect = async () => {
      if (
        webcamRef.current &&
        webcamRef.current.video?.readyState === 4 &&
        canvasRef.current
      ) {
        const video = webcamRef.current.video;
        const { videoWidth, videoHeight } = video;

        // Sync canvas dimensions
        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;

        // Detect objects (Threshold set to 0.6 for accuracy)
        const detectedObjects = await net.detect(video, undefined, 0.6);

        const context = canvasRef.current.getContext("2d");
        renderPredictions(detectedObjects, context);
      }

      // Instead of setInterval, call the next frame
      requestRef.current = requestAnimationFrame(detect);
    };

    requestRef.current = requestAnimationFrame(detect);
  };

  useEffect(() => {
    initModel();

    // 3. CLEANUP: This stops the AI when you leave the page
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  return (
    <div className="mt-8 flex flex-col items-center">
      {isLoading ? (
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-t-[#333330] border-gray-200 rounded-full animate-spin" />
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A1A09A]">
            Initializing Neural Engine...
          </p>
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-2xl border border-white/20 shadow-2xl bg-black mt-10">
          <Webcam
            ref={webcamRef}
            audio={false}
            muted
            className="w-full max-w-4xl h-auto"
            videoConstraints={{
              facingMode: "user",
              width: 1280,
              height: 720
            }}
          />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full pointer-events-none z-10"
          />
          
          {/* Status Overlay */}
          <div className="absolute top-4 right-4 z-20">
            <div className="bg-black/50 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[8px] text-white font-bold uppercase tracking-widest">Live Feed</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ObjectDetection;