/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Menu, X, Phone, CalendarRange, KeyRound } from 'lucide-react';

interface NavbarProps {
  onOpenDashboard: () => void;
  onOpenReservation: () => void;
}

export default function Navbar({ onOpenDashboard, onOpenReservation }: NavbarProps) {
  const [scrollActive, setScrollActive] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollActive(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { label: '메인', href: '#home' },
    { label: '소개', href: '#about' },
    { label: '업무 분야', href: '#practices' },
    { label: '승소 사례/칼럼', href: '#insights' },
  ];

  const handleScrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header
      id="app-header"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrollActive
          ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-gray-200 py-3'
          : 'bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100 py-4.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo Brand matching business card HL */}
          <a
            href="#home"
            className="flex items-center space-x-3.5 group"
            onClick={(e) => {
              e.preventDefault();
              handleScrollTo('#home');
            }}
          >
            <div className="flex items-center space-x-3">
              {/* Premium corporate brand monogram from the business card */}
              <svg viewBox="0 0 100 100" className="w-11 h-11 flex-shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Column 1 (Left, Brown) */}
                <rect x="15" y="15" width="14" height="70" fill="#5C3214" />
                
                {/* Crossbar (Brown) */}
                <rect x="29" y="43" width="12" height="14" fill="#5C3214" />
                
                {/* Column 2 - Top (Brown) */}
                <path d="M 41,15 H 55 V 45 L 41,59 Z" fill="#5C3214" />
                
                {/* Column 2 - Bottom (Brown) */}
                <path d="M 41,65 L 55,51 V 85 H 41 Z" fill="#5C3214" />
                
                {/* Column 3 - Top (Grey) */}
                <path d="M 67,15 H 81 V 19 L 67,33 Z" fill="#7B7C7E" />
                
                {/* Column 3 - Bottom (Grey) - includes L's foot */}
                <path d="M 67,39 L 81,25 V 71 H 98 V 85 H 67 Z" fill="#7B7C7E" />
              </svg>
              <div className="flex flex-col select-none leading-none">
                <span className="text-[11.5px] uppercase tracking-[0.14em] text-[#7B7C7E] font-bold font-sans mb-1">
                  HIM Law Office
                </span>
                <div className="flex items-baseline space-x-0.5">
                  <span className="text-[19px] font-bold text-[#5C3214] font-serif leading-none">힘</span>
                  <span className="text-[16px] font-bold text-[#4A4B4D] leading-none">법률사무소</span>
                </div>
              </div>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-11 items-center">
            {menuItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleScrollTo(item.href);
                }}
                className="text-slate-600 hover:text-brand-terracotta text-[15px] sm:text-[15.5px] font-semibold transition-colors duration-200"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Secret Quick Admin Tool */}
            <button
              onClick={onOpenDashboard}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-brand-tan transition-all duration-200"
              title="변호사 대시보드"
              id="btn-admin-console"
            >
              <KeyRound className="w-4 h-4" />
            </button>
            <a
              href="tel:02-6952-3002"
              className="flex items-center space-x-1.5 text-slate-700 hover:text-brand-terracotta text-sm font-semibold transition-colors"
            >
              <Phone className="w-4 h-4 text-[#C05E3D]" />
              <span className="font-mono text-xs">02-6952-3002</span>
            </a>
            <button
              id="sticky-booking-btn"
              onClick={onOpenReservation}
              className="bg-brand-terracotta hover:bg-brand-terracotta-hover text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-md transition-all duration-300 hover:-translate-y-0.5"
            >
              상담 예약하기
            </button>
          </div>

          {/* Mobile Hamburguer */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={onOpenDashboard}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-brand-tan transition-all duration-200"
              title="변호사 대시보드"
            >
              <KeyRound className="w-4.5 h-4.5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-slate-600 hover:text-brand-terracotta hover:bg-slate-100 rounded transition-colors"
              id="mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 shadow-xl animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="px-4 pt-2 pb-6 space-y-3">
            {menuItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleScrollTo(item.href);
                }}
                className="block text-slate-700 hover:text-brand-terracotta font-semibold text-base py-2.5 border-b border-slate-100"
              >
                {item.label}
              </a>
            ))}
            <div className="pt-2 flex flex-col space-y-3">
              <a
                href="tel:02-6952-3002"
                className="flex items-center space-x-2 text-slate-700 text-sm py-1 font-semibold"
              >
                <Phone className="w-4 h-4 text-[#C05E3D]" />
                <span className="font-mono">02-6952-3002</span>
              </a>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenReservation();
                }}
                className="w-full bg-brand-terracotta hover:bg-brand-terracotta-hover text-white text-sm font-bold py-3.5 rounded-full text-center shadow-lg flex items-center justify-center space-x-2"
              >
                <CalendarRange className="w-4.5 h-4.5" />
                <span>상담 예약 신청하기</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
