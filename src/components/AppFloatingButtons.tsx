/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { CalendarRange, Phone, ArrowUp } from 'lucide-react';

interface AppFloatingButtonsProps {
  onOpenReservation: () => void;
}

export default function AppFloatingButtons({ onOpenReservation }: AppFloatingButtonsProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleBookingClick = () => {
    onOpenReservation();
    const reservationSection = document.querySelector('#reservation');
    if (reservationSection) {
      reservationSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end space-y-3" id="floating-actions-container">
      
      {/* Scroll to Top Trigger */}
      {isVisible && (
        <button
          onClick={scrollToTop}
          type="button"
          className="p-3 rounded-full bg-brand-navy-900 border border-brand-navy-800 text-brand-tan hover:bg-brand-tan hover:text-brand-navy-950 shadow-2xl transition-all duration-300 hover:-translate-y-1"
          title="맨 위로 가기"
          id="btn-scroll-to-top"
        >
          <ArrowUp className="w-5 h-5 animate-pulse" />
        </button>
      )}

      {/* Floating Direct Call Button */}
      <a
        href="tel:02-6952-3002"
        className="flex items-center space-x-2 bg-brand-navy-900 border border-brand-tan/30 text-white text-xs font-semibold px-4.5 py-3 rounded-full shadow-2xl hover:bg-brand-navy-850 hover:-translate-y-1 transition-all duration-300"
        title="변호사 직접 유선 상담"
        id="btn-floating-call"
      >
        <Phone className="w-4.5 h-4.5 text-brand-tan animate-bounce" />
        <span className="hidden sm:inline font-mono">02-6952-3002</span>
        <span className="sm:hidden font-sans">직통전화</span>
      </a>

      {/* Floating Action Reservation Button (Terracotta Color) */}
      <button
        onClick={handleBookingClick}
        type="button"
        className="flex items-center space-x-2 bg-brand-terracotta hover:bg-brand-terracotta-hover text-white text-xs sm:text-sm font-bold px-5 py-3.5 rounded-full shadow-2xl hover:-translate-y-1 transition-all duration-300"
        title="빠른 상담 예약"
        id="btn-floating-booking"
      >
        <CalendarRange className="w-5 h-5 animate-pulse" />
        <span>실시간 상담 예약</span>
      </button>

    </div>
  );
}
