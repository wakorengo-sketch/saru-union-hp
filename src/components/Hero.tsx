"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, ArrowRight } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Typewriter hook                                                    */
/* ------------------------------------------------------------------ */
function useTypewriter(text: string, speed = 38, startDelay = 600) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    let interval: ReturnType<typeof setInterval>;
    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        i += 1;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [text, speed, startDelay]);

  return { displayed, done };
}

/* ------------------------------------------------------------------ */
/*  Genre options for the circle-finder pills                          */
/* ------------------------------------------------------------------ */
const GENRES = ["音楽", "スポーツ", "文化・芸術", "その他"] as const;

/* ------------------------------------------------------------------ */
/*  Hero                                                               */
/* ------------------------------------------------------------------ */
export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [genres, setGenres] = useState<string[]>([]);

  const { displayed, done } = useTypewriter(
    "どんなサークルと出会うかで、\nあなたの人生は大きく変わる。",
  );

  /* ---- Desktop mouse scrubbing / mobile autoplay ---- */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Mobile (<1024): normal looping autoplay, no scrubbing.
    if (window.innerWidth < 1024) {
      video.loop = true;
      video.autoplay = true;
      const tryPlay = () => video.play().catch(() => {});
      if (video.readyState >= 2) tryPlay();
      else video.addEventListener("loadeddata", tryPlay, { once: true });
      return () => video.removeEventListener("loadeddata", tryPlay);
    }

    // Desktop: pause playback, scrub via horizontal mouse movement.
    video.pause();
    let prevX: number | null = null;
    let target = 0;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      if (window.innerWidth < 1024) return;
      const duration = video.duration || 0;
      if (!duration) return;
      if (prevX === null) {
        prevX = e.clientX;
        return;
      }
      const delta = e.clientX - prevX;
      prevX = e.clientX;
      target += (delta / window.innerWidth) * 0.8 * duration;
      target = Math.min(Math.max(target, 0), duration);
    };

    const tick = () => {
      const duration = video.duration || 0;
      if (duration) {
        const current = video.currentTime;
        const next = current + (target - current) * 0.12;
        if (Math.abs(next - current) > 0.001) {
          try {
            video.currentTime = next;
          } catch {
            /* seeking not ready yet */
          }
        }
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  const toggleGenre = (g: string) =>
    setGenres((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g],
    );

  return (
    <section className="relative bg-white text-neutral-900 flex flex-col lg:block lg:min-h-screen">
      {/* ---------- Background video ---------- */}
      <div className="order-last lg:order-none relative lg:absolute lg:inset-0 lg:z-0 overflow-hidden pointer-events-none w-full aspect-square md:aspect-video lg:aspect-auto lg:h-full bg-neutral-50 lg:bg-transparent">
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover object-right lg:object-right-bottom"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260601_110537_3a579fa0-7bbc-4d94-9d25-0e816c7840f5.mp4"
        />
        {/* readability veil on desktop so text stays legible over video */}
        <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-white via-white/85 to-transparent" />
      </div>

      {/* ---------- Content ---------- */}
      <div className="relative z-10 flex flex-col order-first lg:order-none w-full bg-white lg:bg-transparent pb-8 lg:pb-0 lg:min-h-screen">
        <main
          id="spade-hero"
          className="w-full max-w-7xl mx-auto px-6 py-12 flex-1 flex flex-col justify-center"
        >
          {/* eyebrow */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="uppercase tracking-[0.22em] text-xs sm:text-sm text-[#738273] mb-6 mt-16 lg:mt-0"
          >
            和光大学サークル連合
          </motion.p>

          {/* Headline (typewriter) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl lg:text-[76px] font-normal tracking-tight text-black leading-[1.08] mb-8 select-none w-full whitespace-pre-wrap">
              {displayed}
              {!done && (
                <span className="inline-block w-[2px] h-[1.1em] bg-black align-middle ml-[2px] animate-blink" />
              )}
            </h1>
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p className="text-lg md:text-xl text-[#5A635A] leading-relaxed font-normal mb-14 max-w-2xl">
              和光大学には何かに特化したサークルが沢山あります。
              <br />
              大学生活、せっかくなら関わってみませんか？
            </p>
          </motion.div>

          {/* Genre-select pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl"
          >
            <h2 className="text-2xl font-medium tracking-tight mb-2 text-[#1C2E1E]">
              どんなサークルを探してる？
            </h2>
            <p className="opacity-85 text-[#738273] mb-8">
              気になるジャンルを選んでね（複数選択OK）
            </p>

            <div className="flex flex-wrap gap-3">
              {GENRES.map((g) => {
                const active = genres.includes(g);
                return (
                  <motion.button
                    key={g}
                    type="button"
                    onClick={() => toggleGenre(g)}
                    whileTap={{ scale: 0.96 }}
                    className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-base transition-colors ${
                      active
                        ? "bg-[#1C2E1E] text-white shadow-md shadow-emerald-950/5"
                        : "bg-white text-[#1C2E1E] border border-[#F1F3F1] hover:bg-[#F1F3F1]/55"
                    }`}
                  >
                    <AnimatePresence>
                      {active && (
                        <motion.span
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                          <Check className="w-4 h-4" strokeWidth={3} />
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {g}
                  </motion.button>
                );
              })}
            </div>

            {/* Status banner */}
            <div className="mt-6">
              <AnimatePresence mode="wait">
                {genres.length === 0 ? (
                  <motion.p
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    exit={{ opacity: 0 }}
                    className="italic text-xs text-[#738273]"
                  >
                    上のジャンルをタップして選んでください。
                  </motion.p>
                ) : (
                  <motion.div
                    key="banner"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 24 }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#FAFBF9] border border-[#F1F3F1] rounded-2xl px-5 py-4">
                      <span className="text-sm text-[#1C2E1E]">
                        「{genres.join("、")}」のサークルを見る
                      </span>
                      <button
                        type="button"
                        className="inline-flex items-center gap-1.5 text-[#4D6D47] uppercase text-xs font-semibold tracking-wide hover:gap-2.5 transition-all"
                      >
                        探してみる
                        <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </main>
      </div>
    </section>
  );
}
