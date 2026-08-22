'use client';

import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

export default function BackToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 380) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Volver arriba"
      className="fixed bottom-20 sm:bottom-6 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-[#13322E] text-white shadow-xl hover:bg-[#16B8AA] hover:scale-110 active:scale-95 transition-all duration-300 border border-white/20 cursor-pointer animate-fade-in"
    >
      <ChevronUp className="h-5 w-5" />
    </button>
  );
}
