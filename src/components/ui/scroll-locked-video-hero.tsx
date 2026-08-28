"use client";

import React, { useEffect, useRef, useState } from "react";

export interface MetroHeroProps {
  videoSrc?: string;
  title?: string;
  scrollHint?: string;
  tagline?: string;
  signature?: { name: string; url: string } | false;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const DEFAULT_VIDEO = "https://raw.githubusercontent.com/gughigug/metro-hero-assets/main/Subway_doors_open_to_city_202608242331.mp4";
const SANS = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

const COL_TEXT = "#f2f4f8";

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

export default function MetroHero({
  videoSrc = DEFAULT_VIDEO,
  title = "Your Coding Progress, All in One Place.",
  scrollHint = "SCROLL TO REVEAL",
  tagline = "Track. Solve. Improve.",
  signature = false,
  className,
  style,
  children
}: MetroHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!videoRef.current || !containerRef.current) return;

    const videoEl: HTMLVideoElement = videoRef.current;
    const containerEl: HTMLDivElement = containerRef.current;

    let duration = 0;
    let rafId = 0;
    let targetProgress = 0;
    let currentProgress = 0;
    let isSeeking = false;
    let pendingTime: number | null = null;

    const onLoadedData = () => {
      duration = videoEl.duration || 0;
      setReady(true);
    };
    videoEl.addEventListener("loadeddata", onLoadedData);

    const onSeeked = () => {
      isSeeking = false;
      if (pendingTime !== null) {
        const t = pendingTime;
        pendingTime = null;
        isSeeking = true;
        videoEl.currentTime = t;
      }
    };
    videoEl.addEventListener("seeked", onSeeked);

    function seekTo(t: number) {
      if (isSeeking) {
        pendingTime = t;
        return;
      }
      isSeeking = true;
      videoEl.currentTime = t;
    }

    const onScroll = () => {
      if (!containerEl) return;
      const rect = containerEl.getBoundingClientRect();
      const totalScrollable = containerEl.clientHeight - window.innerHeight;
      if (totalScrollable <= 0) return;

      const currentScroll = -rect.top;
      const progress = clamp(currentScroll / totalScrollable, 0, 1);
      targetProgress = progress;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    function frame() {
      currentProgress += (targetProgress - currentProgress) * 0.18;

      if (duration > 0) {
        seekTo(currentProgress * duration);
      }

      if (videoRef.current) {
        const scale = 1 + currentProgress * 0.05;
        videoRef.current.style.transform = `scale(${scale})`;
      }

      if (titleRef.current) {
        const t = 1 - clamp(currentProgress / 0.4, 0, 1);
        titleRef.current.style.opacity = String(t);
        titleRef.current.style.transform = `translateY(${(1 - t) * -30}px) scale(${0.95 + t * 0.05})`;
        titleRef.current.style.filter = `blur(${(1 - t) * 12}px)`;
      }

      if (hintRef.current) {
        const opacity = 1 - clamp(currentProgress / 0.15, 0, 1);
        hintRef.current.style.opacity = String(opacity);
      }

      if (taglineRef.current) {
        const t = clamp((currentProgress - 0.7) / 0.3, 0, 1);
        taglineRef.current.style.opacity = String(t);
        taglineRef.current.style.transform = `translateY(${(1 - t) * 24}px) scale(${0.96 + t * 0.04})`;
        taglineRef.current.style.filter = `blur(${(1 - t) * 10}px)`;
      }

      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${currentProgress})`;
      }

      rafId = requestAnimationFrame(frame);
    }

    rafId = requestAnimationFrame(frame);

    return () => {
      videoEl.removeEventListener("loadeddata", onLoadedData);
      videoEl.removeEventListener("seeked", onSeeked);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[260vh] ${className || ""}`}
      style={style}
    >
      <div className="sticky top-0 w-full h-screen overflow-hidden bg-[#05070d] flex items-center justify-center">
        <video
          ref={videoRef}
          src={videoSrc}
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
          style={{
            opacity: ready ? 1 : 0,
            transformOrigin: "center center",
            willChange: "transform",
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(5,7,13,0.65) 0%, rgba(5,7,13,0.25) 45%, rgba(5,7,13,0.85) 100%)",
            pointerEvents: "none",
          }}
        />

        <div
          ref={titleRef}
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 6%",
            textAlign: "center",
            pointerEvents: "none",
          }}
        >
          <span
            style={{
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: "clamp(32px, 6vw, 76px)",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: COL_TEXT,
              textShadow: "0 4px 35px rgba(0,0,0,0.8)",
              display: "inline-block",
              willChange: "transform, filter, opacity",
            }}
          >
            {title}
          </span>
        </div>

        {tagline && (
          <div
            ref={taglineRef}
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 8%",
              textAlign: "center",
              opacity: 0,
              pointerEvents: "none",
            }}
          >
            <span
              style={{
                fontFamily: SANS,
                fontWeight: 700,
                fontSize: "clamp(22px, 3.8vw, 44px)",
                lineHeight: 1.25,
                letterSpacing: "-0.01em",
                color: COL_TEXT,
                textShadow: "0 4px 28px rgba(0,0,0,0.8)",
              }}
            >
              {tagline}
            </span>
          </div>
        )}

        {children && (
          <div
            style={{
              position: "absolute",
              bottom: "clamp(70px, 14vh, 120px)",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 10,
            }}
          >
            {children}
          </div>
        )}

        <div
          ref={hintRef}
          style={{
            position: "absolute",
            left: "50%",
            bottom: "clamp(18px, 4vh, 36px)",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            color: "rgba(240,244,248,0.85)",
            fontFamily: SANS,
            fontSize: "clamp(10px, 1.4vw, 12px)",
            fontWeight: 600,
            letterSpacing: "0.3em",
            transition: "opacity 0.4s ease",
            pointerEvents: "none",
          }}
        >
          <span>{scrollHint}</span>
          <svg width="14" height="18" viewBox="0 0 14 18" style={{ animation: "metro-hero-bounce 1.6s ease-in-out infinite" }}>
            <style>{`
              @keyframes metro-hero-bounce {
                0%, 100% { transform: translateY(0); opacity: 0.5; }
                50% { transform: translateY(5px); opacity: 1; }
              }
            `}</style>
            <path d="M7 1 L7 17 M2 12 L7 17 L12 12" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 3,
            background: "rgba(255,255,255,0.15)",
          }}
        >
          <div
            ref={progressBarRef}
            style={{
              height: "100%",
              width: "100%",
              background: "linear-gradient(90deg, #2563EB, #3B82F6)",
              transform: "scaleX(0)",
              transformOrigin: "left center",
            }}
          />
        </div>

        {signature && (
          <span
            style={{
              position: "absolute",
              right: "clamp(12px, 2.5vw, 24px)",
              bottom: "clamp(10px, 2vw, 18px)",
              fontFamily: SANS,
              fontWeight: 500,
              fontSize: "clamp(11px, 1.4vw, 13px)",
              letterSpacing: "0.01em",
              color: "rgba(220,224,232,0.6)",
              zIndex: 2,
            }}
          >
            by{" "}
            <a
              href={signature.url}
              style={{
                color: "rgba(220,224,232,0.6)",
                textDecoration: "none",
                transition: "color 0.2s ease",
              }}
            >
              {signature.name}
            </a>
          </span>
        )}
      </div>
    </div>
  );
}
