import React from 'react'
import { Camera, Mail, ShieldCheck, Zap, Lock, ArrowRight, Power, ShieldAlert, EyeOff, Target } from 'lucide-react';
import Link from 'next/link';
import { ClerkProvider, Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'

const Navbar = () => {
      
return(

    <div className="fixed top-6 left-0 w-full z-50 px-6">
  <nav className="max-w-3xl mx-auto bg-white/60 backdrop-blur-xl border border-white/40 px-6 py-3 rounded-full flex items-center justify-between shadow-[0_8px_32px_0_rgba(0,0,0,0.04)]">
    
    {/* Logo Section */}
    {/* Logo Section */}
<div className="flex items-center gap-2.5 group cursor-pointer">
  <div className="w-8 h-8 bg-[#333330] rounded-xl flex items-center justify-center shadow-sm group-hover:rotate-6 transition-transform">
    <ShieldCheck size={16} className="text-[#F7F6F2]" />
  </div>
  {/* REMOVED opacity-90 and changed to text-slate-900 for brightness */}
  <span className="text-sm font-black tracking-[-0.02em] uppercase text-slate-900 hidden sm:block">
    Guardian
  </span>
</div>

{/* Links - Updated from A1A09A to 7A7973 for better visibility */}
<div className="flex gap-8 text-[9px] font-bold tracking-[0.2em] text-[#7A7973] uppercase">

  <Link href="/about" className="hover:text-[#333330] transition-colors">
    About
  </Link>
  <Link href="/gallary" className="hover:text-[#333330] transition-colors">
    Logs
  </Link>
 
</div>

    {/* Action Button */}
    {/* <button className="bg-[#333330] text-white px-5 py-2 rounded-full text-[10px] font-bold hover:bg-black transition-all active:scale-95 shadow-lg shadow-black/5">
      SignIn
    </button> */}
    <Show when="signed-out">
            
              <SignUpButton>
                <button className="bg-[#333330] text-white px-5 py-2 rounded-full text-[10px] font-bold hover:bg-black transition-all active:scale-95 shadow-lg shadow-black/5">
      SignIn
    </button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <UserButton />
            </Show>
  </nav>
</div>


)
  
}

export default Navbar