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
      
      <header className="max-w-7xl mx-auto px-10 pt-3 pb-32">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          
          <div className={`transition-all duration-[1500ms] ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 mb-6 block italic">
              The Open Source Security Initiative
            </span>
            
            <h1 className="text-6xl md:text-8xl font-light text-[#333330] leading-[1.05] tracking-[-0.05em] mb-10">
              Security is <br />
              <span className="text-[#A1A09A] ">no longer</span> <br />
              for sale.
            </h1>
            
            <p className="text-xl text-[#7A7973] leading-relaxed mb-12 max-w-md font-light">
              Guardian is a **fully open-source** AI surveillance protocol. 
              Eliminate expensive hardware and recurring subscriptions. Deploy 
              <span className="text-[#333330] font-medium italic underline decoration-[#E2E1DA] underline-offset-4"> transparent code</span> 
              on the hardware you already own.
            </p>
            
            <div className="flex items-center gap-6">
              <button className="bg-[#333330] text-white px-10 py-4 rounded-full font-bold text-sm hover:bg-black transition-all shadow-xl shadow-black/5 flex items-center gap-3 group">
                <Link href="/dashboard">
                  Deploy System
                </Link> 
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          
          <div className="relative flex justify-center ">
            <div className="relative bg-white/60 backdrop-blur-xl border border-white p-8 rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.04)] w-full max-w-md">
               <div className="aspect-[4/5] bg-[#F0EFED] rounded-[2.2rem] overflow-hidden relative flex flex-col items-center justify-center group">
                  <div className="w-16 h-16 rounded-full border border-[#D1D0C9] flex items-center justify-center mb-4 transition-transform duration-1000 group-hover:scale-110">
                    <Camera size={24} className="text-[#A1A09A]" />
                  </div>
                  <p className="text-[9px] font-bold tracking-[0.3em] text-[#A1A09A] uppercase">Active Neural Monitoring</p>
                  
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#333330]/10 to-transparent animate-scan" />
               </div>
            </div>
          </div>

        </div>
      </header>

      
      <section id="logic" className="bg-white/40 border-y border-[#E2E1DA] py-32 px-10">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-20">
          <Feature 
            title="Edge-AI Intelligence" 
            desc="Detection runs 100% in your browser. We utilize open-source Neural Engines to classify human presence without sending data to the cloud." 
          />
          <Feature 
            title="Instant Evidence" 
            desc="The moment a person enters the frame, Guardian logs the event. Automated captures are archived to your secure dashboard instantly." 
          />
          <Feature 
            title="Privacy by Design" 
            desc="Since Guardian is open source, you can audit the code yourself. We don't track, we don't store, and we never harvest your data." 
          />
        </div>
      </section>

      
      <section className="py-32 max-w-4xl mx-auto px-10 text-center">
          <ShieldCheck className="mx-auto mb-8 text-[#E2E1DA]" size={80} />
          <h2 className="text-3xl font-black text-[#333330] tracking-tight mb-8 uppercase italic leading-none">
            Transparency is the <br /> ultimate security.
          </h2>
          <p className="text-[#7A7973] leading-relaxed mb-12 text-lg font-light">
            Guardian is an open-source project built on the belief that security shouldn't be a subscription. 
            By leveraging community-driven AI and local processing, we provide professional 
            human detection for everyone, at zero cost, with zero secrets.
          </p>
      </section>

      
      <footer className="py-24 px-10 border-t border-[#E2E1DA] bg-white flex flex-col items-center text-center">
          <p className="text-[19px] font-black text-[#A1A09A] tracking-[0.5em] uppercase mb-4">
            Guardian
          </p>
          <div className="flex justify-center gap-7 text-[10px] font-bold text-[#A1A09A] uppercase tracking-widest opacity-50">
            <span>Open Source Project</span>
            <span>No Trackers</span>
            <span>Community Driven</span>
          </div>
      </footer>

    
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