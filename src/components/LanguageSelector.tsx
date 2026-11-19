'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';

const LANGUAGES = [
  { code: 'es', label: 'Español', flag: 'ES' },
  { code: 'en', label: 'English', flag: 'EN' },
  { code: 'de', label: 'Deutsch', flag: 'DE' },
  { code: 'fr', label: 'Français', flag: 'FR' },
  { code: 'it', label: 'Italiano', flag: 'IT' },
];

export default function LanguageSelector() {
  const [currentLang, setCurrentLang] = useState('es');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code: string) => {
    setCurrentLang(code);
    setIsOpen(false);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (code === 'es') {
        url.searchParams.delete('lang');
      } else {
        url.searchParams.set('lang', code);
      }
      window.history.replaceState({}, '', url.toString());
    }
  };

  const selected = LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];

  return (
    <div className="relative inline-block text-left font-mono" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Seleccionar idioma"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 bg-white hover:bg-gray-50 hover:border-black text-xs font-bold text-black shadow-2xs transition-all cursor-pointer"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Globe className="w-3.5 h-3.5 text-black" />
        <span>{selected.flag}</span>
        <span className="uppercase text-[11px] font-black">{selected.code}</span>
        <ChevronDown className="w-3 h-3 text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 origin-top-right rounded-2xl bg-white p-1.5 shadow-xl border border-gray-200 z-50 animate-soft-appear">
          {LANGUAGES.map((lang) => {
            const isCurrent = lang.code === currentLang;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleSelect(lang.code)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isCurrent ? 'bg-gray-100 text-black' : 'text-gray-700 hover:bg-gray-50 hover:text-black'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{lang.flag}</span>
                  <span>{lang.label}</span>
                </div>
                {isCurrent && <Check className="w-3.5 h-3.5 text-black" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
