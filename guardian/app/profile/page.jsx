"use client";
import React, { useState, useEffect } from "react"; // Added useEffect
import { supabase } from "@/utils/supabase";
import { useUser } from "@clerk/nextjs";
import { ShieldCheck, Lock, User, Activity, ChevronRight } from "lucide-react";

export default function ProfilePage() {
  const { user } = useUser();
  const [pinData, setPinData] = useState({ current: "", next: "", confirm: "" });
  const [status, setStatus] = useState({ type: "", msg: "" });
  
  
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleUpdatePin = async (e) => {
    e.preventDefault();
    setStatus({ type: "info", msg: "Verifying credentials..." });

    if (pinData.next !== pinData.confirm) {
      return setStatus({ type: "error", msg: "New PINs do not match" });
    }

    try {
      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('vault_pin')
        .eq('id', user.id)
        .maybeSingle(); 

      if (fetchError) throw fetchError;

      const currentStoredPin = profile?.vault_pin || "1234";

      if (pinData.current !== currentStoredPin) {
        return setStatus({ type: "error", msg: "Current PIN is incorrect" });
      }

      const { error: upsertError } = await supabase
        .from('profiles')
        .upsert({ 
          id: user.id, 
          vault_pin: pinData.next,
          email: user.primaryEmailAddress?.emailAddress,
          full_name: user.fullName,
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' });

      if (upsertError) throw upsertError;

      setStatus({ type: "success", msg: "Vault access updated" });
      setPinData({ current: "", next: "", confirm: "" });

    } catch (err) {
      console.error("Full Error:", err);
      setStatus({ type: "error", msg: err.message || "Connection failure" });
    }
  };

  
  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-[#F7F6F2] p-6 pt-28 md:pt-32 lg:p-30 font-sans text-[#333330] relative z-0">
      <div className="max-w-3xl mx-auto space-y-6 md:space-y-10">
        
        
        <header className="flex justify-between items-end border-b border-black/5 pb-6 md:pb-10">
          <div>
            <div className="flex items-center gap-2 mb-2 md:mb-3">
              <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <h1 className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600">Profile</h1>
            </div>
            <h2 className="text-3xl md:text-5xl font-light italic tracking-tight">Settings</h2>
          </div>
          
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
          
          
          <div className="lg:col-span-5 space-y-6">
            <section className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-black/5 shadow-sm overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                <User size={120} />
              </div>
              
              <div className="relative z-10 space-y-6 md:space-y-8">
                {user?.imageUrl ? (
                  <img 
                    src={user.imageUrl} 
                    alt={user.fullName || "User"} 
                    className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl object-cover border-4 border-[#F7F6F2] shadow-inner"
                  />
                ) : (
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-[#F7F6F2] rounded-2xl md:rounded-3xl flex items-center justify-center text-2xl md:text-3xl font-light border border-black/5 shadow-inner">
                    {user?.firstName?.[0] || <User size={24} className="opacity-30" />}
                  </div>
                )}
                
                <div>
                  <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest opacity-30 mb-1">User Identity</p>
                  <p className="text-xl md:text-2xl font-medium tracking-tight">{user?.fullName}</p>
                </div>

                <div className="pt-4 md:pt-6 border-t border-black/5">
                  <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest opacity-30 mb-1">Primary Email</p>
                  <p className="text-xs md:text-sm font-medium opacity-70 break-all">{user?.primaryEmailAddress?.emailAddress}</p>
                </div>

                <div className="flex items-center gap-2 pt-2 md:pt-4">
                    <span className="px-3 py-1 bg-green-50 text-green-600 text-[8px] md:text-[9px] font-bold uppercase tracking-widest rounded-full border border-green-100">Authenticated</span>
                </div>
              </div>
            </section>
            
            <div className="px-6 md:px-8 flex items-center justify-between text-[8px] md:text-[9px] font-black uppercase tracking-widest opacity-20 italic">
               <span>System V.04</span>
               <Activity size={12} />
            </div>
          </div>

          
          <div className="lg:col-span-7">
            <section className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-black/5 shadow-xl transition-all duration-500 hover:shadow-2xl">
              <div className="flex items-center justify-between mb-6 md:mb-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 md:p-3 bg-blue-50 rounded-xl md:rounded-2xl border border-blue-100/50">
                    <Lock className="text-blue-600 w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  <h3 className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em]">Vault Credentials</h3>
                </div>
              </div>

              <form onSubmit={handleUpdatePin} className="space-y-6 md:space-y-8">
                <div className="space-y-4 md:space-y-6">
                  <div className="group">
                    <label className="text-[8px] md:text-[9px] font-black uppercase tracking-widest opacity-30 ml-4 mb-2 block group-focus-within:text-blue-600 transition-colors">Authorization PIN</label>
                    <input 
                      type="password" placeholder="CURRENT PIN"
                      suppressHydrationWarning
                      className="w-full bg-[#F7F6F2] p-4 md:p-5 rounded-xl md:rounded-2xl outline-none focus:ring-2 ring-blue-500/10 text-center tracking-[0.4em] md:tracking-[0.8em] font-mono text-lg md:text-xl transition-all placeholder:tracking-normal placeholder:text-[10px]"
                      value={pinData.current} onChange={e => setPinData({...pinData, current: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="group">
                       <label className="text-[8px] md:text-[9px] font-black uppercase tracking-widest opacity-30 ml-4 mb-2 block group-focus-within:text-blue-600 transition-colors">New Key</label>
                       <input 
                        type="password" placeholder="NEW PIN"
                        suppressHydrationWarning
                        className="w-full bg-[#F7F6F2] p-4 md:p-5 rounded-xl md:rounded-2xl outline-none focus:ring-2 ring-blue-500/10 text-center tracking-[0.4em] md:tracking-[0.8em] font-mono text-lg md:text-xl transition-all placeholder:tracking-normal placeholder:text-[10px]"
                        value={pinData.next} onChange={e => setPinData({...pinData, next: e.target.value})}
                      />
                    </div>
                    <div className="group">
                       <label className="text-[8px] md:text-[9px] font-black uppercase tracking-widest opacity-30 ml-4 mb-2 block group-focus-within:text-blue-600 transition-colors">Confirm Key</label>
                       <input 
                        type="password" placeholder="CONFIRM"
                        suppressHydrationWarning
                        className="w-full bg-[#F7F6F2] p-4 md:p-5 rounded-xl md:rounded-2xl outline-none focus:ring-2 ring-blue-500/10 text-center tracking-[0.4em] md:tracking-[0.8em] font-mono text-lg md:text-xl transition-all placeholder:tracking-normal placeholder:text-[10px]"
                        value={pinData.confirm} onChange={e => setPinData({...pinData, confirm: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                {status.msg && (
                  <div className={`p-3 md:p-4 rounded-xl flex items-center justify-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${status.type === 'error' ? 'bg-red-50 text-red-500 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
                    <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">{status.msg}</span>
                  </div>
                )}

                <button 
                  suppressHydrationWarning
                  className="w-full group bg-[#1A1A1A] text-white py-4 md:py-6 rounded-2xl md:rounded-3xl text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] hover:bg-black transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                >
                  Commit Changes <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}