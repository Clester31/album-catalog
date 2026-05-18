"use client";

import { useEffect, useRef } from "react";
import SignInFeatures from "@/components/clerk/SignInFeatures";

export default function SplashScreen() {
  const bgRef = useRef<HTMLImageElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      target.current = {
        x: (e.clientX / window.innerWidth - 0.25) * 18,
        y: (e.clientY / window.innerHeight - 0.25) * 12,
      };
    };

    const animate = () => {
      current.current.x += (target.current.x - current.current.x) * 0.12;
      current.current.y += (target.current.y - current.current.y) * 0.12;
      if (bgRef.current) {
        bgRef.current.style.transform = `scale(1.0) translate(${current.current.x}px, ${current.current.y}px)`;
      }
      animRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    animRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <div className="w-screen h-[calc(100vh-3rem)] items-center justify-center flex flex-col gap-4 overflow-hidden relative">
      <img
        ref={bgRef}
        src="/splash_bg.png"
        alt=""
        className="absolute -z-10 blur-sm w-full h-full object-cover will-change-transform"
      />
      <div className="flex flex-col items-center justify-center gap-4 bg-black/90 p-8 rounded-4xl shadow-lg">
        <h1 className="text-6xl bg-gradient-to-r from-emerald-500 to-blue-500 text-transparent bg-clip-text font-semibold">Welcome to My Album Catalog</h1>
        <p className="text-xl w-2/3 text-center">
          All your ratings and reviews for your favorite songs and albums in
          one place. Create an account to get started
        </p>
        <div>
          <SignInFeatures />
        </div>
      </div>
    </div>
  );
}