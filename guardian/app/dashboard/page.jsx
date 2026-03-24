"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { supabase } from "@/utils/supabase";
import { useAuth, useUser } from "@clerk/nextjs";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Cell, AreaChart, Area 
} from "recharts";
import { ShieldAlert, X } from "lucide-react";

const DashboardPage = () => {
  const { userId } = useAuth();
  const { user } = useUser();
  const [stats, setStats] = useState([]);
  const [recentLogs, setRecentLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  
  const [showSecurityAlert, setShowSecurityAlert] = useState(false);

  useEffect(() => {
    if (!userId) return;
    fetchDashboardData();
    checkVaultSecurity(); 
  }, [userId]);

  const checkVaultSecurity = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("vault_pin")
      .eq("id", userId)
      .single();

    
    if (!data || data.vault_pin === "1234") {
      setShowSecurityAlert(true);
    }
  };

  const fetchDashboardData = async () => {
    setIsLoading(true);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data, error } = await supabase
      .from("detections")
      .select("*")
      .eq("user_id", userId)
      .gt("created_at", sevenDaysAgo.toISOString())
      .order("created_at", { ascending: false });

    if (!error && data) {
      processChartData(data);
      setRecentLogs(data.slice(0, 5));
    }
    setIsLoading(false);
  };

  const processChartData = (data) => {
    const hours = Array.from({ length: 24 }, (_, i) => ({
      hour: `${i}:00`,
      count: 0,
      fullHour: i
    }));

    const now = new Date();
    data.forEach(item => {
      const itemDate = new Date(item.created_at);
      if (now - itemDate < 24 * 60 * 60 * 1000) {
        const hour = itemDate.getHours();
        hours[hour].count++;
      }
    });
    setStats(hours);
  };

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#333330] p-6 pt-24 md:pt-32">
      
     
      {showSecurityAlert && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/5 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-black/5 max-w-sm w-full relative animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setShowSecurityAlert(false)}
              className="absolute top-6 right-6 opacity-20 hover:opacity-100 transition-opacity"
            >
              <X size={20} />
            </button>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-blue-50 rounded-full">
                <ShieldAlert className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-medium tracking-tight">Security Action Required</h3>
              <p className="text-sm opacity-60 leading-relaxed">
                Please change your gallery password. Your current PIN is the default <span className="font-bold text-black">1234</span>. 
              </p>
              <Link 
                href="/profile" 
                onClick={() => setShowSecurityAlert(false)}
                className="w-full bg-[#333330] text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all"
              >
                Update Security Now
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-10">
        
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-black/5 pb-8 gap-4">
          <div>
            <h1 className="text-[12px] font-black uppercase tracking-[0.4em] opacity-40 mb-2">Systems Online</h1>
            <h2 className="text-4xl font-light tracking-tight">
              Hello, <span className="font-semibold text-black">{user?.firstName || "Guardian"}</span>
            </h2>
            <p className="text-sm opacity-50 mt-1">Here is your security overview for the last 24 hours.</p>
          </div>
          <Link href="/gallary" className="text-[10px] font-bold uppercase tracking-widest bg-[#333330] text-white px-8 py-4 rounded-full shadow-lg hover:bg-black transition-all">
            View Full Evidence Vault
          </Link>
        </header>

        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         
          <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 border border-black/5 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-[10px] font-black uppercase tracking-widest opacity-40">Activity Density (24h)</h3>
              <span className="px-3 py-1 bg-green-50 text-green-600 text-[9px] font-bold rounded-full border border-green-100 uppercase">Live Stream Active</span>
            </div>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#333330" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#333330" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#00000008" />
                  <XAxis 
                    dataKey="hour" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 10, fontWeight: 'bold', opacity: 0.4}}
                  />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.05)', fontSize: '12px' }}
                    cursor={{ stroke: '#00000010', strokeWidth: 2 }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#333330" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorCount)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        
          <div className="space-y-6">
            <div className="bg-[#333330] text-white rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden">
               <div className="relative z-10">
                 <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-50 mb-6">Weekly Pulse</p>
                 <p className="text-5xl font-light mb-2">{recentLogs.length * 7 || 0}</p>
                 <p className="text-xs opacity-60">Avg. Detections / Week</p>
               </div>
               <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 border border-black/5 shadow-sm">
              <h3 className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-6">Top Spotted Today</h3>
              <div className="space-y-4">
                {recentLogs.length > 0 ? recentLogs.map((log, i) => (
                  <div key={log.id} className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                      <img src={log.image_url} alt="Snap" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                    </div>
                    <div className="flex-1 border-b border-black/5 pb-2">
                      <p className="text-xs font-bold">{new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      <p className="text-[10px] opacity-40 uppercase tracking-tighter">{log.person_count} Person Detected</p>
                    </div>
                  </div>
                )) : (
                  <p className="text-xs opacity-40 italic">No recent activity detected.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        
        <div className="bg-white rounded-[2.5rem] p-10 border border-black/5 shadow-sm">
          <h3 className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-8">System Report Summary</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-black/5 text-[10px] font-black uppercase opacity-30">
                  <th className="pb-4">Capture Time</th>
                  <th className="pb-4">Incident Log</th>
                  <th className="pb-4">Subject Count</th>
                  <th className="pb-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {recentLogs.map((log) => (
                  <tr key={log.id} className="group border-b border-black/[0.02] hover:bg-[#F7F6F2]/50 transition-colors">
                    <td className="py-5 font-mono text-[11px] font-bold">{new Date(log.created_at).toLocaleTimeString()}</td>
                    <td className="py-5 font-light">At Destination</td>
                    <td className="py-5">
                      <span className="px-3 py-1 bg-red-50 text-red-600 text-[10px] font-bold rounded-full">
                        {log.person_count} PERSON
                      </span>
                    </td>
                    <td className="py-5 text-right">
                      <Link href="/gallery" className="text-[9px] font-black uppercase tracking-widest opacity-30 group-hover:opacity-100 hover:text-black">Inspect</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;