import React from 'react'
import { ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { Show, SignUpButton, UserButton } from '@clerk/nextjs'

const Navbar = () => {
      
return(
  <div className="fixed top-6 left-0 w-full z-50 px-6">
    {/* Shape and padding kept exactly as your original */}
    <nav className="max-w-3xl mx-auto bg-white/60 backdrop-blur-xl border border-white/40 px-6 py-3 rounded-full flex items-center justify-between shadow-[0_8px_32px_0_rgba(0,0,0,0.04)]">
      
      {/* Logo Section - Original Size */}
      <div className="flex items-center gap-2.5 group cursor-pointer shrink-0">
        <div className="w-8 h-8 bg-[#333330] rounded-xl flex items-center justify-center shadow-sm group-hover:rotate-6 transition-transform">
          <ShieldCheck size={16} className="text-[#F7F6F2]" />
        </div>
        {/* Hidden on mobile, shown on SM (phones) and up */}
        <span className="text-sm font-black tracking-[-0.02em] uppercase text-slate-900 hidden sm:block">
          Guardian
        </span>
      </div>

      {/* Links - Responsive Gap and Text Size */}
      {/* Mobile: gap-3 | Tablet: gap-6 | Desktop: gap-10 */}
      <div className="flex gap-3 sm:gap-6 lg:gap-10 text-[8px] sm:text-[9px] lg:text-[10px] font-bold tracking-[0.2em] text-[#7A7973] uppercase items-center">
        <Link href="/dashboard" className="hover:text-[#333330] transition-colors whitespace-nowrap">
          Dash
        </Link>
        <Link href="/camera" className="hover:text-[#333330] transition-colors whitespace-nowrap">
          Cam
        </Link>
        <Link href="/gallary" className="hover:text-[#333330] transition-colors whitespace-nowrap">
          Gallery
        </Link>
        <Link href="/profile" className="hover:text-[#333330] transition-colors whitespace-nowrap">
          Profile
        </Link>
      </div>

      {/* Action Button Section - Original Size */}
      <div className="flex shrink-0 ml-2">
        <Show when="signed-out">
          <SignUpButton>
            <button className="bg-[#333330] text-white px-5 py-2 rounded-full text-[10px] font-bold hover:bg-black transition-all active:scale-95 shadow-lg shadow-black/5">
              SignIn
            </button>
          </SignUpButton>
        </Show>
        <Show when="signed-in">
          <UserButton afterSignOutUrl="/" />
        </Show>
      </div>
    </nav>
  </div>
)
  
}

export default Navbar