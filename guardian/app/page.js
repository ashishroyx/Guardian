'use client';

import React, { useState, useEffect } from 'react';
import { Camera, Mail, ShieldCheck, Zap, Lock, ArrowRight, Power, ShieldAlert, EyeOff, Target } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#333330] font-sans selection:bg-[#E2E1DA] py-30">
      
      {/* 1. TOP STATUS BAR */}
      {/* <div className="bg-white/50 border-b border-[#E2E1DA] py-3 px-8 text-[9px] font-bold tracking-[0.3em] text-[#A1A09A] uppercase flex justify-between">
        <span>System Status: Optimal</span>
        <span className="text-[#333330] italic">Security is a right, not a luxury</span>
      </div> */}

      {/* 2. SOFT NAVIGATION */}
      
        {/* <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-10 h-10 bg-[#333330] rounded-2xl flex items-center justify-center shadow-sm">
            <ShieldCheck size={20} className="text-[#F7F6F2]" />
          </div>
          <span className="text-lg font-semibold tracking-[-0.03em] uppercase opacity-80 font-sans">Guardian</span>
        </div>
        
        <div className="hidden md:flex gap-12 text-[10px] font-bold tracking-[0.2em] text-[#A1A09A] uppercase">
          <a href="#logic" className="hover:text-[#333330] transition-colors">The Tech</a>
          <a href="#privacy" className="hover:text-[#333330] transition-colors">Privacy</a>
          <a href="#about" className="hover:text-[#333330] transition-colors">Mission</a>
        </div>

        <button className="bg-white border border-[#E2E1DA] text-[#333330] px-6 py-2.5 rounded-full text-xs font-bold shadow-sm hover:shadow-md transition-all active:scale-95">
          Initialize System
        </button> */}

        {/* 1. FLOATING NAVIGATION */}


{/* Spacer to prevent hero content from hiding under the fixed nav */}


<header className="max-w-7xl mx-auto px-10 pt-3 pb-32">
  <div className="grid lg:grid-cols-2 gap-24 items-center">
    
    <div className={`transition-all duration-[1500ms] ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <span className="text-[10px] font-bold tracking-[0.3em] text-[#A1A09A] uppercase mb-6 block italic">
        The Open-Source Security Project
      </span>
      
      <h1 className="text-6xl md:text-8xl font-light text-[#333330] leading-[1.05] tracking-[-0.05em] mb-10">
        Security is <br />
        <span className="text-[#A1A09A] ">not a luxury.</span> <br />
        It's a right.
      </h1>
      
      <p className="text-xl text-[#7A7973] leading-relaxed mb-12 max-w-md font-light">+
        I built Guardian because you shouldn’t have to pay a monthly subscription to feel safe. 
        Forget expensive CCTV kits. Use the hardware you already own to detect threats for 
        <span className="text-[#333330] font-medium italic underline decoration-[#E2E1DA] underline-offset-4"> zero cost.</span>
      </p>
      
      <div className="flex items-center gap-6">
        <button className="bg-[#333330] text-white px-10 py-4 rounded-full font-bold text-sm hover:bg-black transition-all shadow-xl shadow-black/5 flex items-center gap-3 group">
          <Link href="/dashboard">
            Get Started
          </Link> 
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
        {/* <div className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-white border border-[#E2E1DA]">
          <div className="flex flex-col">
            <p className="text-[10px] font-black text-[#333330] uppercase tracking-widest leading-none mb-1">Fee: $0.00</p>
            <p className="text-[9px] font-bold text-[#A1A09A] uppercase tracking-widest leading-none">Subscription: None</p>
          </div>
        </div> */}
      </div>
    </div>

    {/* 4. CALM PREVIEW CARD */}
    <div className="relative flex justify-center ">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#E2E1DA] rounded-full blur-[100px] opacity-0" />
      
      <div className="relative bg-white/60 backdrop-blur-xl border border-white p-8 rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.04)] w-full max-w-md">
         <div className="aspect-[4/5] bg-[#F0EFED] rounded-[2.2rem] overflow-hidden relative flex flex-col items-center justify-center group">
            <div className="w-16 h-16 rounded-full border border-[#D1D0C9] flex items-center justify-center mb-4 transition-transform duration-1000 group-hover:scale-110">
              <Camera size={24} className="text-[#A1A09A]" />
            </div>
            <p className="text-[9px] font-bold tracking-[0.3em] text-[#A1A09A] uppercase">Awaiting Feed</p>
            
            <div className="absolute top-6 left-6 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#333330]/20" />
              <span className="text-[8px] font-bold text-[#A1A09A] tracking-widest uppercase italic">Local_Node</span>
            </div>

            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#333330]/10 to-transparent animate-scan" />
         </div>
      </div>
    </div>

  </div>
</header>

      {/* 5. REFINED FEATURES */}
      <section id="logic" className="bg-white/40 border-y border-[#E2E1DA] py-32 px-10">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-20">
          <Feature 
            title="Neural Edge" 
            desc="Detection runs 100% in your browser using TensorFlow.js. We don't just see motion; we specifically classify human presence." 
          />
          <Feature 
            title="Auto-Evidence" 
            desc="The moment a person enters the frame, a snapshot is captured and mailed directly to your inbox via Nodemailer." 
          />
          <Feature 
            title="Zero-Cloud Privacy" 
            desc="Your video stream never touches a server. All processing happens in volatile memory and vanishes on exit." 
          />
        </div>
      </section>

      {/* 6. PROJECT MISSION */}
      <section  className="py-32 max-w-4xl mx-auto px-10 text-center">
         <ShieldCheck className="mx-auto mb-8 text-[#E2E1DA]" size={80} />
         <h2 className="text-3xl font-black text-[#333330] tracking-tight mb-8 uppercase italic leading-none">
           The most powerful security <br /> is the one you already own.
         </h2>
         <p className="text-[#7A7973] leading-relaxed mb-12 text-lg font-light">
           I built Guardian because you shouldn’t have to pay a monthly fee to feel safe. 
           By utilizing the NPU and camera on your laptop or phone, we create a professional 
           surveillance node without the hardware bills.
         </p>
        
         
      </section>

      {/* 7. FOOTER */}
      <footer className="py-24 px-10 border-t border-[#E2E1DA] bg-white flex flex-col items-center text-center">
         <p className="text-[19px] font-black text-[#A1A09A] tracking-[0.5em] uppercase mb-4">
           Guardian
         </p>
         <div className="flex justify-center gap-7 text-[10px] font-bold text-[#A1A09A] uppercase tracking-widest opacity-50">
            <span>No Cookies</span>
            <span>No Trackers</span>
            <span>No Subscriptions</span>
         </div>
      </footer>

      {/* CSS For Scan Animation */}
      <style jsx global>{`
        @keyframes scan {
          0% { transform: translateY(0); }
          100% { transform: translateY(400px); }
        }
        .animate-scan {
          animation: scan 4s linear infinite;
        }
      `}</style>
    </div>
  );
}

function Feature({ title, desc }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="w-8 h-[1px] bg-[#333330]" />
      <h3 className="text-sm font-bold uppercase tracking-widest text-[#333330] italic">{title}</h3>
      <p className="text-base text-[#7A7973] leading-relaxed font-light">{desc}</p>
    </div>
  );
}