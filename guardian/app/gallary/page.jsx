"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/utils/supabase";
import { useAuth } from "@clerk/nextjs"; // Added for security

const GalleryPage = () => {
  const { userId } = useAuth(); // Added for security
  const [snapshots, setSnapshots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchSnapshots = async () => {
    if (!userId) return; // Only fetch if logged in
    setIsLoading(true);
    const { data, error } = await supabase
      .from("detections")
      .select("*")
      .eq("user_id", userId) // Filter by your ID
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch Error:", error.message);
    } else {
      const formattedData = data.map((d) => ({
        id: d.id,
        src: d.image_url,
        count: d.person_count || 1, // Added count data
        time: new Date(d.created_at).toLocaleTimeString(),
        date: new Date(d.created_at).toLocaleDateString(),
      }));
      setSnapshots(formattedData);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchSnapshots();
  }, [userId]);

  const handleDownloadAll = () => {
    snapshots.forEach((snap, index) => {
      setTimeout(() => {
        const link = document.createElement("a");
        link.href = snap.src;
        link.download = `guardian-alert-${snap.time.replace(/[: ]/g, "-")}.webp`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, index * 200);
    });
  };

  const handleDownload = (src, filename) => {
    const link = document.createElement("a");
    link.href = src;
    link.download = filename || "guardian-capture.jpg";
    link.click();
  };

const handleDelete = async (id, imageUrl) => {
    try {
      const { error, count } = await supabase
        .from("detections")
        .delete({ count: 'exact' }) // This tells us if a row was actually removed
        .eq("id", id)
        .eq("user_id", userId);

      if (error) throw error;
      
      // If count is 0, it means the DB found the row but RLS blocked the delete
      if (count === 0) {
        alert("Security Error: You do not have permission to delete this.");
        return;
      }

      const fileName = imageUrl.split("/").pop();
      await supabase.storage.from("guardian_snapshots").remove([fileName]);

      setSnapshots((prev) => prev.filter((snap) => snap.id !== id));
      setSelectedImage(null);
    } catch (error) {
      console.error("Delete failed:", error.message);
    }
  };

  const handleClearVault = async () => {
    if (confirm("Are you sure? This will wipe the cloud vault.")) {
      const { error } = await supabase
        .from("detections")
        .delete()
        .eq("user_id", userId);
      
      if (!error) setSnapshots([]);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#333330] p-6 lg:p-30">
      {/* --- HEADER --- */}
      <div className="max-w-7xl mx-auto flex justify-between items-end border-b border-black/5 pb-8 mb-12">
        <div>
          <h1 className="text-[12px] font-black uppercase tracking-[0.4em] opacity-40 mb-2">Evidence Vault</h1>
          <h2 className="text-4xl font-light tracking-tight">Captured Activity</h2>
        </div>
        <Link href="/dashboard" className="text-[10px] font-bold uppercase tracking-widest bg-white px-6 py-3 rounded-full shadow-sm hover:shadow-md transition-all border border-black/5">
          Back to Live Monitor
        </Link>
      </div>

      <div className="max-w-7xl mx-auto flex justify-between items-center mb-6">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">
          {isLoading ? "Loading..." : `${snapshots.length} Evidence Files found`}
        </p>
        
        {snapshots.length > 0 && (
          <div className="flex gap-4">
            <button onClick={handleDownloadAll} className="text-[9px] font-bold uppercase tracking-widest text-[#333330] hover:underline">
              Download All (.ZIP)
            </button>
            <button onClick={handleClearVault} className="text-[9px] font-bold uppercase tracking-widest text-red-500 hover:underline">
              Clear Vault
            </button>
          </div>
        )}
      </div>

      {/* --- GRID --- */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {snapshots.map((snap) => (
          <div 
            key={snap.id} 
            onClick={() => setSelectedImage(snap)}
            className="group relative aspect-square bg-white rounded-3xl overflow-hidden cursor-pointer border-4 border-white shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
          >
            <img src={snap.src} alt="Detection" className="w-full h-full object-cover grayscale-[50%] group-hover:grayscale-0 transition-all duration-500" />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-[10px] font-bold uppercase tracking-widest bg-black/40 backdrop-blur-md px-4 py-2 rounded-full">View Details</span>
            </div>
            <div className="absolute bottom-4 left-4">
               <p className="text-[10px] font-mono font-bold text-white drop-shadow-lg">{snap.time}</p>
            </div>
          </div>
        ))}
      </div>

      {/* --- LIGHTBOX MODAL --- */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-12">
          <div className="absolute inset-0 bg-[#F7F6F2]/90 backdrop-blur-xl" onClick={() => setSelectedImage(null)} />
          <div className="relative bg-white w-full max-w-5xl rounded-[3rem] overflow-hidden shadow-2xl border border-black/5 flex flex-col lg:flex-row">
            <div className="lg:w-2/3 bg-black flex items-center justify-center">
              <img src={selectedImage.src} className="max-h-[70vh] object-contain" alt="Enlarged evidence" />
            </div>
            <div className="lg:w-1/3 p-12 flex flex-col justify-between">
              <div>
                <button onClick={() => setSelectedImage(null)} className="text-[10px] font-bold uppercase tracking-widest opacity-30 hover:opacity-100 mb-12">Close</button>
                <div className="space-y-6">
                   <div>
                     <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-1">Timestamp</p>
                     <p className="text-2xl font-light">{selectedImage.time}</p>
                   </div>
                   <div>
                     <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-1">Date</p>
                     <p className="text-2xl font-light">{selectedImage.date}</p>
                   </div>
                   <div>
                     <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-1">Subjects</p>
                     <p className="text-2xl font-light">{selectedImage.count} Person(s)</p>
                   </div>
                   <div>
                     <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-1">Status</p>
                     <p className="text-sm font-bold text-red-500 uppercase tracking-widest">Verified Threat</p>
                   </div>
                </div>
              </div>
              <div className="flex flex-col gap-3 mt-12">
                <button 
                  onClick={() => handleDownload(selectedImage.src, `guardian-${selectedImage.time}.webp`)}
                  className="w-full bg-[#333330] text-white py-4 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-black transition-colors"
                >
                  Download Evidence
                </button>
                <button 
                  onClick={() => handleDelete(selectedImage.id, selectedImage.src)} 
                  className="w-full border border-red-200 text-red-500 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-red-50 transition-colors"
                >
                  Delete Permanently
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;