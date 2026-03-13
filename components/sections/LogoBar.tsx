"use client";
import { useEffect, useRef } from "react";
import { CLIENTS } from "@/app/data";
import { useTranslations } from "next-intl";

const LOGO_TOKEN = "pk_HaV_0DKNSxSsORx1ud0r6A";

export default function LogoBar() {
  const t = useTranslations("logoBar");
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let pos = 0;
    let animId: number;
    let paused = false;
    const speed = 0.6;

    const step = () => {
      if (!paused) {
        pos += speed;
        if (pos >= track.scrollWidth / 2) pos = 0;
        track.style.transform = `translateX(-${pos}px)`;
      }
      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);

    const pause = () => { paused = true; };
    const resume = () => { paused = false; };
    track.parentElement?.addEventListener("mouseenter", pause);
    track.parentElement?.addEventListener("mouseleave", resume);

    return () => {
      cancelAnimationFrame(animId);
      track.parentElement?.removeEventListener("mouseenter", pause);
      track.parentElement?.removeEventListener("mouseleave", resume);
    };
  }, []);

  const items = [...CLIENTS, ...CLIENTS];

  return (
    <section className="border-b border-[#e8e5e0] py-14 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-10">
        <p className="text-center text-[10px] font-extrabold tracking-widest uppercase text-charcoal/35">
          {t("label")}
        </p>
      </div>

      <div className="relative overflow-hidden">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        {/* Track — each item is 1/6 of viewport width so exactly 6 fit */}
        <div ref={trackRef} className="flex items-center w-max" style={{ willChange: "transform" }}>
          {items.map((c, i) => (
            <div
              key={`${c.domain}-${i}`}
              className="flex items-center justify-center flex-shrink-0 hover:scale-105 transition-transform duration-300 px-4"
              style={{ width: "clamp(120px, 16.666vw, 200px)" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://img.logo.dev/${c.domain}?token=${LOGO_TOKEN}&size=120&format=png`}
                alt={c.name}
                className="h-20 w-auto max-w-[180px] object-contain"
                loading="lazy"
                onError={(e) => {
                  const el = e.currentTarget;
                  el.style.display = "none";
                  const span = document.createElement("span");
                  span.textContent = c.name;
                  span.style.cssText = "font-weight:800;font-size:0.9rem;color:#6b6969;white-space:nowrap";
                  el.parentElement?.appendChild(span);
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
