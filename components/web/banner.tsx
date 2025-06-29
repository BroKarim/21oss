"use client";

import { memo } from "react";

//from 21
const BoltBannerContent = memo(function BoltBannerContent() {
  return (
    <a href="https://hackathon.dev" target="_blank" className="h-[110px] rounded-lg z-50 border-b border-border bg-muted transition-[left] duration-200 ease-in-out">
      <div className="flex items-center justify-center relative h-[100px]">
        <img
          className="w-full h-[110px] rounded-lg object-cover absolute top-0 left-0"
          src="https://images.unsplash.com/photo-1750072167202-b54f7a2c6bc7?q=80&w=2013&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Bolt Banner"
        />
      </div>
    </a>
  );
});

export function BoltBanner() {
  return <BoltBannerContent />;
}
