"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

type Post = {
  category: string;
  categoryColor: string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  href: string;
};

/* Placeholder latest posts — these will come from microCMS.
   `image` is the article's own 16:9 thumbnail (text baked in by design),
   so it is shown uncropped and never has an overlay on top of it. */
const POSTS: Post[] = [
  {
    category: "イベント告知",
    categoryColor: "#B5405F",
    title: "作業中のVtuberの隣で寝落ちできるASMR配信",
    excerpt:
      "テスト期間のおともに。作業がはかどる、ゆるっと聴けるASMRライブ配信をお届けします。",
    date: "2026.07.10",
    image: "/samples/sample-1.jpg",
    href: "#articles",
  },
  {
    category: "活動レポート",
    categoryColor: "#C2703D",
    title: "初心者に麻雀を教える、初見歓迎ライブ！",
    excerpt:
      "ルールを知らなくても大丈夫。ゼロから一緒に、麻雀の楽しさを味わう配信の記録。",
    date: "2026.07.05",
    image: "/samples/sample-2.jpg",
    href: "#articles",
  },
  {
    category: "お知らせ",
    categoryColor: "#4D6D47",
    title: "月刊コラム『BUY WITH THE PUNCHES』1月号",
    excerpt:
      "今月の散財レポート、ガジェット対決、そしてアフリカ食紀行まで。読みどころ満載でお届け。",
    date: "2026.01.05",
    image: "/samples/sample-3.jpg",
    href: "#articles",
  },
  {
    category: "インタビュー",
    categoryColor: "#3D6DC2",
    title: "古屋呂敏さんと巡る、ポートレート×フォト散歩",
    excerpt:
      "フォトグラファーと街を歩きながら、ポートレート撮影のコツと視点を探るインタビュー企画。",
    date: "2026.06.28",
    image: "/samples/sample-4.jpg",
    href: "#articles",
  },
];

export default function FeaturedBanner() {
  const [index, setIndex] = useState(0);
  const [reduced, setReduced] = useState(false);
  const [failed, setFailed] = useState<Record<number, boolean>>({});
  const pausedRef = useRef(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Catch a placeholder that failed to load *before* hydration (SSR race):
  // if the current image is complete but has no pixels, mark it failed.
  useEffect(() => {
    const im = imgRef.current;
    if (im && im.complete && im.naturalWidth === 0) {
      setFailed((f) => ({ ...f, [index]: true }));
    }
  }, [index]);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => {
      if (!pausedRef.current) setIndex((v) => (v + 1) % POSTS.length);
    }, 6000);
    return () => clearInterval(id);
  }, [reduced]);

  const go = (dir: number) =>
    setIndex((v) => (v + dir + POSTS.length) % POSTS.length);

  const post = POSTS[index];

  return (
    <section
      id="top"
      className="relative w-full bg-[#F4F5F0] lg:min-h-screen flex items-center pt-28 pb-16 lg:py-24"
      onMouseEnter={() => (pausedRef.current = true)}
      onMouseLeave={() => (pausedRef.current = false)}
    >
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-8">
        <p className="uppercase tracking-[0.28em] text-xs sm:text-sm text-[#738273] mb-8">
          最新のお知らせ / NEWS
        </p>

        <div className="grid lg:grid-cols-[1fr_1.15fr] gap-8 lg:gap-14 items-center">
          {/* ---- Text panel (real HTML text — SEO & a11y friendly) ---- */}
          <div className="order-2 lg:order-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <div className="flex items-center gap-4 mb-5">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white text-[#1C2E1E] text-xs font-semibold px-3 py-1.5 shadow-sm">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: post.categoryColor }}
                    />
                    {post.category}
                  </span>
                  <span className="text-sm text-[#738273] tabular-nums">
                    {post.date}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-[2.5rem] font-medium leading-[1.3] tracking-tight text-[#1C2E1E] text-balance mb-5">
                  {post.title}
                </h2>

                <p className="text-[#5A635A] leading-relaxed mb-8 max-w-lg">
                  {post.excerpt}
                </p>

                <a
                  href={post.href}
                  className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-[#4D6D47] hover:gap-3 transition-all"
                >
                  続きを読む
                  <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                </a>
              </motion.div>
            </AnimatePresence>

            {/* Controls */}
            <div className="flex items-center gap-4 mt-10">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="前の記事"
                  onClick={() => go(-1)}
                  className="w-10 h-10 rounded-full border border-[#1C2E1E]/25 text-[#1C2E1E] flex items-center justify-center hover:bg-[#1C2E1E] hover:text-white transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  aria-label="次の記事"
                  onClick={() => go(1)}
                  className="w-10 h-10 rounded-full border border-[#1C2E1E]/25 text-[#1C2E1E] flex items-center justify-center hover:bg-[#1C2E1E] hover:text-white transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                {POSTS.map((p, i) => (
                  <button
                    key={p.title}
                    type="button"
                    aria-label={`${i + 1}番目の記事へ`}
                    onClick={() => setIndex(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === index
                        ? "w-8 bg-[#1C2E1E]"
                        : "w-2.5 bg-[#1C2E1E]/25 hover:bg-[#1C2E1E]/50"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ---- Thumbnail (16:9, uncropped, no overlay) ---- */}
          <div className="order-1 lg:order-2">
            <a
              href={post.href}
              className="group block relative aspect-video w-full rounded-2xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(28,46,30,0.35)] ring-1 ring-black/5"
            >
              <AnimatePresence>
                <motion.img
                  key={index}
                  ref={imgRef}
                  src={
                    failed[index]
                      ? `https://picsum.photos/seed/${index}/768/432`
                      : post.image
                  }
                  alt={post.title}
                  onError={() =>
                    setFailed((f) => ({ ...f, [index]: true }))
                  }
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </AnimatePresence>
              {/* subtle hover affordance only — no text over the artwork */}
              <div className="absolute inset-0 bg-[#1C2E1E]/0 group-hover:bg-[#1C2E1E]/5 transition-colors" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
