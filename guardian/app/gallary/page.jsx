"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { supabase } from "@/utils/supabase";
import { useAuth } from "@clerk/nextjs";
import { Lock, ShieldCheck, Fingerprint, Download } from "lucide-react";

const GalleryPage = () => {
  const { userId } = useAuth();
  
  // Security States
  const [isLocked, setIsLocked] = useState(true);
  const [pinInput, setPinInput] = useState("");
  const [dbPin, setDbPin] = useState(null);
  const [pinError, setPinError] = useState(false);

  // Action Auth States
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [verifyPinInput, setVerifyPinInput] = useState("");

  // Data States
  const [snapshots, setSnapshots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchSecurity = async () => {
      if (!userId) return;
      const { data } = await supabase.from("profiles").select("vault_pin").eq("id", userId).single();
      setDbPin(data?.vault_pin || "1234");
    };
    fetchSecurity();
  }, [userId]);

  const fetchSnapshots = async () => {
    if (!userId) return;
    setIsLoading(true);
    const { data, error } = await supabase
      .from("detections")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (!error && data) {
      const formattedData = data.map((d) => ({
        id: d.id,
        src: d.image_url,
        count: d.person_count || 1,
        time: new Date(d.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' , second: '2-digit', hour12: true}),
        date: new Date(d.created_at).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        createdAt: d.created_at,
      }));
      setSnapshots(formattedData);
    }
    setIsLoading(false);
  };

  useEffect(() => { fetchSnapshots(); }, [userId]);

  const handleUnlock = (e) => {
    e.preventDefault();
    if (pinInput === dbPin) { setIsLocked(false); } 
    else { setPinError(true); setPinInput(""); setTimeout(() => setPinError(false), 1500); }
  };

  const handleAuthorizedExecute = async () => {
    if (verifyPinInput !== dbPin) return alert("Invalid PIN");
    const { type, id, imageUrl, range } = pendingAction;

    if (type === "single") {
      await supabase.from("detections").delete().eq("id", id).eq("user_id", userId);
      const fileName = imageUrl.split("/").pop();
      await supabase.storage.from("guardian_snapshots").remove([fileName]);
      setSnapshots(prev => prev.filter(s => s.id !== id));
      setSelectedImage(null);
    } else if (type === "bulk") {
      const now = new Date();
      let cutoff = new Date();
      if (range === "24h") cutoff.setHours(now.getHours() - 24);
      if (range === "7d") cutoff.setDate(now.getDate() - 7);
      if (range === "30d") cutoff.setMonth(now.getMonth() - 1);
      await supabase.from("detections").delete().eq("user_id", userId).gt("created_at", cutoff.toISOString());
      setSnapshots(prev => prev.filter(snap => new Date(snap.createdAt) <= cutoff));
    } else if (type === "clear") {
      await supabase.from("detections").delete().eq("user_id", userId);
      setSnapshots([]);
    }
    setShowConfirmModal(false);
    setPendingAction(null);
    setVerifyPinInput("");
  };

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

  const groupedSnapshots = useMemo(() => {
    return snapshots.reduce((groups, snap) => {
      const date = snap.date;
      if (!groups[date]) groups[date] = [];
      groups[date].push(snap);
      return groups;
    }, {});
  }, [snapshots]);

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#333330] p-6 pt-24 md:pt-32 lg:p-30 relative">
      
      {/* --- RE-DESIGNED DELETE POPUP (SMALLER) --- */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/5 backdrop-blur-md" onClick={() => setShowConfirmModal(false)} />
          <div className="relative bg-white p-8 rounded-[2rem] shadow-2xl border border-black/5 max-w-[320px] w-full space-y-6 text-center animate-in zoom-in-95 duration-200">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Authorize Deletion</p>
            <input 
              type="password" maxLength={4} autoFocus value={verifyPinInput} onChange={(e) => setVerifyPinInput(e.target.value)}
              className="w-full bg-[#F7F6F2] p-4 rounded-xl text-center text-xl tracking-[0.6em] font-mono outline-none border-2 border-transparent focus:border-red-500/20"
              placeholder="••••"
            />
            <button onClick={handleAuthorizedExecute} className="w-full bg-red-500 text-white py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-red-600 transition-all">Confirm Delete</button>
          </div>
        </div>
      )}

      {/* --- MASTER LOCK (SMALLER + LESS BLUR) --- */}
      {isLocked && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-md" />
          <div className="relative bg-white p-10 rounded-[2.5rem] shadow-2xl border border-black/5 max-w-[360px] w-full text-center space-y-8 animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto shadow-lg"><Fingerprint className="text-white w-8 h-8" /></div>
            <div>
              <h2 className="text-2xl font-light italic">Vault Protected</h2>
              <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-30 mt-1">Enter PIN to Access</p>
            </div>
            <form onSubmit={handleUnlock} className="space-y-4">
              <input 
                type="password" maxLength={4} autoFocus value={pinInput} onChange={(e) => setPinInput(e.target.value)}
                placeholder="••••"
                className={`w-full bg-black/5 p-4 rounded-xl text-center text-3xl tracking-[0.6em] font-mono outline-none border-2 transition-all ${pinError ? 'border-red-500' : 'border-transparent focus:bg-white focus:border-blue-500'}`}
              />
              <button type="submit" className="w-full bg-[#1A1A1A] text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all">Unlock Archive</button>
            </form>
          </div>
        </div>
      )}

      {/* --- ORIGINAL HEADER & FEATURES --- */}
      <div className="max-w-7xl mx-auto flex justify-between items-end border-b border-black/5 pb-8 mb-12">
        <div>
          <h1 className="text-[12px] font-black uppercase tracking-[0.4em] opacity-40 mb-2">Evidence Vault</h1>
          <h2 className="text-4xl font-light tracking-tight italic">Captured Activity</h2>
        </div>
        <Link href="/dashboard" className="text-[10px] font-bold uppercase tracking-widest bg-white px-6 py-3 rounded-full shadow-sm hover:shadow-md border border-black/5">Back to Monitor</Link>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">{isLoading ? "Loading..." : `${snapshots.length} Evidence Files found`}</p>
        
        {snapshots.length > 0 && (
          <div className="flex flex-wrap gap-6 items-center">
            {/* BULK DELETE */}
            <div className="flex gap-3 items-center border-r border-black/10 pr-6">
               <span className="text-[9px] font-black uppercase opacity-30">Delete:</span>
               <button onClick={() => {setPendingAction({type: 'bulk', range: '24h'}); setShowConfirmModal(true)}} className="text-[9px] font-bold hover:text-red-500">24H</button>
               <button onClick={() => {setPendingAction({type: 'bulk', range: '7d'}); setShowConfirmModal(true)}} className="text-[9px] font-bold hover:text-red-500">7D</button>
               <button onClick={() => {setPendingAction({type: 'bulk', range: '30d'}); setShowConfirmModal(true)}} className="text-[9px] font-bold hover:text-red-500">1M</button>
            </div>

            {/* DOWNLOAD ALL & CLEAR VAULT */}
            <div className="flex gap-6">
              <button onClick={handleDownloadAll} className="text-[9px] font-bold uppercase tracking-widest text-[#333330] hover:underline">Download All</button>
              <button onClick={() => {setPendingAction({type: 'clear'}); setShowConfirmModal(true)}} className="text-[9px] font-bold uppercase text-red-500 hover:underline">Clear Vault</button>
            </div>
          </div>
        )}
      </div>

      {/* --- GRID --- */}
      <div className="max-w-7xl mx-auto space-y-16">
        {Object.keys(groupedSnapshots).map((date) => (
          <section key={date}>
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#333330] opacity-60 mb-6 border-l-2 border-black/10 pl-4">{date}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {groupedSnapshots[date].map((snap) => (
                <div key={snap.id} onClick={() => setSelectedImage(snap)} className="group relative aspect-square bg-white rounded-3xl overflow-hidden cursor-pointer border-4 border-white shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                  <img src={snap.src} alt="Detection" loading="lazy" className="w-full h-full object-cover grayscale-[50%] group-hover:grayscale-0 transition-all duration-500" />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-[10px] font-bold uppercase tracking-widest bg-black/40 backdrop-blur-md px-4 py-2 rounded-full">View Details</span>
                  </div>
                  <div className="absolute bottom-4 left-4"><p className="text-[10px] font-mono font-bold text-white drop-shadow-lg">{snap.time}</p></div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* --- LIGHTBOX (RESTORED DOWNLOAD) --- */}
       {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 lg:p-12 animate-in fade-in duration-300">
          <div 
            className="absolute inset-0 bg-[#F7F6F2]/80 backdrop-blur-2xl" 
            onClick={() => setSelectedImage(null)} 
          />
          
          <div className="relative bg-white w-full max-w-6xl h-full max-h-[90vh] rounded-[2.5rem] overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.15)] border border-black/5 flex flex-col lg:flex-row">
            
            {/* LEFT: Image Stage */}
            <div className="relative lg:w-2/3 bg-[#111] flex items-center justify-center overflow-hidden group">
              <img 
                src={selectedImage.src} 
                className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105" 
                alt="Enlarged evidence" 
              />
              <div className="absolute top-8 left-8 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[9px] font-mono text-white/50 tracking-[0.3em] uppercase">High-Precision Log</span>
              </div>
            </div>

            {/* RIGHT: Information Panel */}
            <div className="lg:w-1/3 p-8 lg:p-12 flex flex-col justify-between bg-white/50 backdrop-blur-md">
              <div className="space-y-10">
                <div className="flex justify-between items-center">
                  <button 
                    onClick={() => setSelectedImage(null)} 
                    className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest opacity-40 hover:opacity-100 transition-all"
                  >
                    <span className="group-hover:-translate-x-1 transition-transform">←</span> Close
                  </button>
                  <span className="text-[9px] font-mono font-black opacity-20 tracking-tighter">SEC_LOG_{selectedImage.id.slice(0,5)}</span>
                </div>

                <div className="space-y-8">
                   <div className="group">
                     <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/30 mb-2">Exact Capture Time</p>
                     {/* Added tabular-nums so the seconds don't jump around visually */}
                     <p className="text-4xl font-light tracking-tighter tabular-nums text-[#1a1a1a]">
                        {selectedImage.time.split(' ')[0]}
                        <span className="text-sm font-bold ml-2 opacity-40 uppercase">{selectedImage.time.split(' ')[1]}</span>
                     </p>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-4 border-y border-black/5 py-8">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/30 mb-2">Calendar</p>
                        <p className="text-sm font-semibold">{selectedImage.date}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/30 mb-2">Subjects</p>
                        <p className="text-sm font-semibold">{selectedImage.count} Detected</p>
                      </div>
                   </div>

                   <div>
                     <div className="inline-flex items-center gap-3 px-4 py-2 bg-red-50 rounded-full border border-red-100/50">
                       <p className="text-[10px] font-black text-red-600 uppercase tracking-widest">Verified Evidence</p>
                     </div>
                   </div>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex flex-col gap-3 pt-8">
                <button 
                  onClick={() => handleDownload(selectedImage.src, `guardian-${selectedImage.time.replace(/[: ]/g, "-")}.webp`)}
                  className="w-full bg-[#333330] text-white py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black hover:shadow-xl transition-all active:scale-[0.98]"
                >
                  Download Evidence
                </button>
                <button 
                  onClick={() => handleDelete(selectedImage.id, selectedImage.src)} 
                  className="w-full group flex items-center justify-center gap-2 text-red-500 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-red-50/50 transition-colors"
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