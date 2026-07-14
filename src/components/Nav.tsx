"use client";

import { useEffect, useState } from "react";

const NAV_LINKS = [
  { label: "サークル", href: "#circles" },
  { label: "記事", href: "#articles" },
  { label: "協賛", href: "#sponsors" },
  { label: "連合について", href: "#about" },
];

export default function Nav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-30 px-5 sm:px-8 py-4 sm:py-5 flex flex-row justify-between items-center text-[#1C2E1E] transition-colors duration-300 ${
          scrolled
            ? "bg-white/80 backdrop-blur-md border-b border-black/5"
            : "bg-transparent"
        }`}
      >
        {/* Logo */}
        <a href="#top" className="flex flex-row items-center gap-3 text-current">
          <span className="text-[21px] sm:text-[26px] tracking-tight font-medium select-none">
            サークル連合
          </span>
          <span className="text-[25px] sm:text-[30px] select-none tracking-[-0.02em] font-medium leading-none mb-1">
            &#10033;
          </span>
        </a>

        {/* Desktop nav links */}
        <nav className="hidden md:flex flex-row text-[23px] text-current">
          {NAV_LINKS.map((link, i) => (
            <span key={link.label} className="flex flex-row">
              <a
                href={link.href}
                className="hover:opacity-60 transition-opacity"
              >
                {link.label}
              </a>
              {i < NAV_LINKS.length - 1 && (
                <span className="opacity-40">,&nbsp;</span>
              )}
            </span>
          ))}
        </nav>

        {/* Desktop CTA */}
        <a
          href="#contact"
          className="hidden md:inline text-[23px] text-current underline underline-offset-2 hover:opacity-60 transition-opacity"
        >
          お問い合わせ
        </a>

        {/* Mobile hamburger */}
        <button
          type="button"
          aria-label="メニュー"
          onClick={() => setIsMobileMenuOpen((v) => !v)}
          className="md:hidden flex flex-col justify-center items-center gap-[5px] w-8 h-8"
        >
          <span
            className={`w-6 h-[2px] bg-current transition-all duration-300 ${
              isMobileMenuOpen ? "rotate-45 translate-y-[7px]" : ""
            }`}
          />
          <span
            className={`w-6 h-[2px] bg-current transition-all duration-300 ${
              isMobileMenuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`w-6 h-[2px] bg-current transition-all duration-300 ${
              isMobileMenuOpen ? "-rotate-45 -translate-y-[7px]" : ""
            }`}
          />
        </button>
      </header>

      {/* Mobile nav overlay */}
      <div
        className={`md:hidden fixed inset-0 z-20 bg-white/95 backdrop-blur-sm transition-opacity duration-300 flex flex-col items-center justify-center gap-8 ${
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {NAV_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-3xl text-black hover:opacity-60 transition-opacity"
          >
            {link.label}
          </a>
        ))}
        <a
          href="#contact"
          onClick={() => setIsMobileMenuOpen(false)}
          className="text-3xl text-black underline underline-offset-4"
        >
          お問い合わせ
        </a>
      </div>
    </>
  );
}
