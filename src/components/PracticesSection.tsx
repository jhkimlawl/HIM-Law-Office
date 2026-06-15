/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Home, Scale, ShieldAlert, HeartHandshake, CheckCircle2, ChevronRight } from 'lucide-react';
import { PRACTICE_AREAS } from '../data';

// SVG matching wrapper
const iconMap: { [key: string]: any } = {
  Home: Home,
  Scale: Scale,
  ShieldAlert: ShieldAlert,
  HeartHandshake: HeartHandshake,
};

interface PracticesSectionProps {
  onSelectPractice: (subject: string) => void;
}

export default function PracticesSection({ onSelectPractice }: PracticesSectionProps) {
  const [selectedAreaId, setSelectedAreaId] = useState<string>('real-estate');

  const selectedArea = PRACTICE_AREAS.find((area) => area.id === selectedAreaId) || PRACTICE_AREAS[0];

  const handleConsultationClick = (title: string) => {
    // Autofill subject and scroll to reservation
    onSelectPractice(title);
    const reservationSection = document.querySelector('#reservation');
    if (reservationSection) {
      reservationSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="practices" className="py-24 bg-brand-navy-900 relative">
      {/* Visual background lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b10_1px,transparent_1px),linear-gradient(to_bottom,#1e293b10_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 animate-fade-in">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-xl">
            <span className="text-brand-tan font-mono uppercase tracking-widest text-xs font-bold">PRACTICE AREAS</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-serif font-semibold tracking-tight text-white">
              엄격하게 검증된 전방위 전문 솔루션
            </h2>
            <div className="mt-4 h-1 w-12 bg-brand-tan"></div>
          </div>
          <p className="text-slate-200 text-sm sm:text-base leading-relaxed max-w-lg tracking-tight">
            각 분야별 고난도 분쟁 해결 데이터를 축적하여, 서울중앙지방법원 및 전국 각급 법원에서 무수한 승소 인용 결정을 이끌어 냈습니다.
          </p>
        </div>

        {/* Bento Interactive Practice grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Area List Navigation Cards */}
          <div className="lg:col-span-5 space-y-4">
            {PRACTICE_AREAS.map((area) => {
              const IconComp = iconMap[area.icon];
              const isSelected = area.id === selectedAreaId;
              
              return (
                <button
                  key={area.id}
                  onClick={() => setSelectedAreaId(area.id)}
                  className={`w-full text-left p-5 rounded-lg border transition-all duration-300 relative overflow-hidden flex items-start space-x-4 ${
                    isSelected
                      ? 'bg-brand-navy-950 border-brand-tan shadow-xl'
                      : 'bg-brand-navy-900/60 border-brand-navy-800 hover:bg-brand-navy-950/40 hover:border-brand-navy-700/60'
                  }`}
                  id={`practice-tab-${area.id}`}
                >
                  {/* Highlight bar inside card */}
                  {isSelected && (
                    <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-brand-tan to-brand-cognac animate-slide-in-y"></div>
                  )}

                  {/* Icon */}
                  <div className={`p-2.5 rounded-md ${
                    isSelected ? 'bg-brand-tan/10 text-brand-tan' : 'bg-brand-navy-800 text-slate-300'
                  }`}>
                    {IconComp && <IconComp className="w-6 h-6" />}
                  </div>

                  {/* Labels */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1.5">
                      <span className="font-serif font-semibold text-base sm:text-lg text-white block truncate">
                        {area.title}
                      </span>
                      {area.isMain && (
                        <span className="bg-brand-terracotta/10 text-brand-terracotta text-[10px] font-bold py-0.5 px-2 rounded-full border border-brand-terracotta/20">
                          핵심 전문
                        </span>
                      )}
                    </div>
                    <span className={`text-xs block mt-1 line-clamp-1 font-sans ${isSelected ? 'text-brand-tan font-medium' : 'text-slate-300'}`}>
                      {area.subtitle}
                    </span>
                  </div>

                  <ChevronRight className={`w-5 h-5 transition-transform duration-300 self-center ${
                    isSelected ? 'translate-x-1 text-brand-tan font-bold' : 'text-slate-400'
                  }`} />
                </button>
              );
            })}
          </div>

          {/* Right Selected Detail Panel */}
          <div className="lg:col-span-7" id="practice-detail-panel">
            <div className="bg-brand-navy-950 border border-brand-navy-800 rounded-lg p-6 sm:p-8 h-full flex flex-col justify-between shadow-2xl relative overflow-hidden">
              {/* Subtle design element */}
              <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-brand-tan/5 border border-brand-tan/10 pointer-events-none"></div>

              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-brand-tan font-mono uppercase tracking-widest font-bold">{selectedArea.subtitle}</span>
                </div>
                <h3 className="text-2xl font-serif text-white font-semibold mt-2">{selectedArea.title}</h3>
                <p className="text-slate-100 text-sm sm:text-base leading-relaxed mt-4 font-sans tracking-tight">
                  {selectedArea.description}
                </p>

                <div className="border-t border-brand-navy-800 my-6"></div>

                <h4 className="text-sm font-bold text-white tracking-wide uppercase mb-4">주요 소송 및 청구 분야</h4>
                
                {/* Check list of details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                  {selectedArea.details.map((detail, idx) => (
                    <div key={idx} className="flex items-start space-x-2 group">
                      <CheckCircle2 className="w-4.5 h-4.5 text-brand-tan mt-0.5 flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-slate-200 group-hover:text-white transition-colors tracking-tight">
                        {detail}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom autofiller button */}
              <div className="mt-8 pt-6 border-t border-brand-navy-900 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs text-slate-300 font-medium">
                  * 사무장 협의 없음, 대표변호사 1:1 상담 진행
                </span>
                <button
                  id={`btn-consult-area-${selectedArea.id}`}
                  onClick={() => handleConsultationClick(selectedArea.title)}
                  className="w-full sm:w-auto bg-brand-terracotta hover:bg-brand-terracotta-hover text-white text-xs sm:text-sm font-semibold px-6 py-3 rounded shadow-md hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center space-x-2 leading-none"
                >
                  <span>[{selectedArea.title}] 분야 즉시 상담 신청하기</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
