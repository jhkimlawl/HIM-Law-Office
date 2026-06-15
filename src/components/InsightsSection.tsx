/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { CASE_STUDIES, LEGAL_COLUMNS } from '../data';
import { CaseStudy, LegalColumn } from '../types';
import { BookOpen, FolderCheck, ArrowUpRight, Clock, Eye, X, CheckSquare, Calendar } from 'lucide-react';

export default function InsightsSection() {
  const [activeFilter, setActiveFilter] = useState<'cases' | 'columns'>('cases');
  const [selectedCase, setSelectedCase] = useState<CaseStudy | null>(null);
  const [selectedColumn, setSelectedColumn] = useState<LegalColumn | null>(null);

  const displayCase = (c: CaseStudy) => {
    setSelectedCase(c);
  };

  const displayColumn = (col: LegalColumn) => {
    setSelectedColumn(col);
  };

  return (
    <section id="insights" className="py-24 bg-brand-navy-950 relative overflow-hidden">
      {/* Visual background decor */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-brand-tan/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-brand-tan font-mono uppercase tracking-widest text-xs font-bold">INSIGHTS & SUCCESS CASES</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-serif font-semibold tracking-tight text-white leading-snug">
            승소 결과와 날카로운 칼럼으로 증명합니다
          </h2>
          <div className="mt-4 h-1 w-12 bg-brand-tan mx-auto"></div>
          <p className="mt-5 text-slate-200 text-sm sm:text-base leading-relaxed tracking-tight">
            대법원 및 각 하급심 법원의 기류를 정확히 파악하여 법정 판세의 주도권을 장악하는 노하우. 힘 법률사무소의 실제 소송 분석 보고서입니다.
          </p>
        </div>

        {/* Toggle Filter Bar */}
        <div className="flex justify-center mb-12">
          <div className="bg-brand-navy-900 border border-brand-navy-800 p-1.5 rounded-lg flex space-x-2">
            <button
              onClick={() => setActiveFilter('cases')}
              className={`flex items-center space-x-2 py-2 px-5 text-sm font-bold rounded-md transition-all duration-300 ${
                activeFilter === 'cases'
                  ? 'bg-brand-tan text-brand-navy-950 shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
              id="filter-case-studies"
            >
              <FolderCheck className="w-4.5 h-4.5" />
              <span>실제 승소 사례 ({CASE_STUDIES.length})</span>
            </button>
            <button
              onClick={() => setActiveFilter('columns')}
              className={`flex items-center space-x-2 py-2 px-5 text-sm font-bold rounded-md transition-all duration-300 ${
                activeFilter === 'columns'
                  ? 'bg-brand-tan text-brand-navy-950 shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
              id="filter-legal-columns"
            >
              <BookOpen className="w-4.5 h-4.5" />
              <span>김재현 변호사 전문 칼럼 ({LEGAL_COLUMNS.length})</span>
            </button>
          </div>
        </div>

        {/* Card Lists Display */}
        {activeFilter === 'cases' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300" id="list-cases">
            {CASE_STUDIES.map((item) => (
              <div
                key={item.id}
                className="bg-brand-navy-900/50 border border-brand-navy-850 rounded-lg p-6 hover:border-brand-tan/40 hover:bg-brand-navy-900 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] sm:text-xs text-brand-tan font-mono uppercase bg-brand-tan/10 py-1 px-2.5 rounded font-bold tracking-wide">
                      {item.category}
                    </span>
                    <span className="text-xs text-slate-300 font-mono flex items-center space-x-1 font-medium">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{item.date} 판결</span>
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-serif text-white font-bold mt-4 line-clamp-1 group-hover:text-brand-tan transition-colors tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-200 mt-2.5 leading-relaxed line-clamp-3 tracking-tight font-sans">
                    {item.summary}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-brand-navy-850 flex items-center justify-between">
                  <span className="text-[11px] text-brand-cognac font-bold font-mono tracking-tight">
                    대표변호사 100% 직접 실무 판결
                  </span>
                  <button
                    onClick={() => displayCase(item)}
                    className="text-xs text-brand-tan font-bold group-hover:underline flex items-center space-x-1"
                  >
                    <span>전체 판결내용 & 전략 분석</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300" id="list-columns">
            {LEGAL_COLUMNS.map((item) => (
              <div
                key={item.id}
                className="bg-brand-navy-900/50 border border-brand-navy-850 rounded-lg p-6 hover:border-brand-tan/40 hover:bg-brand-navy-900 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center space-x-3 text-xs text-slate-300 font-mono font-medium">
                    <span className="text-brand-tan font-bold font-serif">[{item.category} 칼럼]</span>
                    <span>•</span>
                    <span className="flex items-center space-x-0.5">
                      <Clock className="w-3 h-3" />
                      <span>{item.readTime} 분 소요</span>
                    </span>
                  </div>
                  <h3 className="text-base font-serif text-white font-bold leading-snug mt-3 line-clamp-2 group-hover:text-brand-tan transition-colors tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-200 mt-3.5 leading-relaxed line-clamp-3 tracking-tight font-sans">
                    {item.summary}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-brand-navy-850 flex items-center justify-between">
                  <span className="text-xs text-slate-300 font-mono font-bold">{item.date}</span>
                  <button
                    onClick={() => displayColumn(item)}
                    className="text-xs text-brand-navy-950 font-bold hover:bg-brand-tan/90 py-1.5 px-3 rounded bg-brand-tan flex items-center space-x-1 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>칼럼 읽기</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal: Case Study Detail */}
        {selectedCase && (
          <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true" id="modal-case-detail">
            {/* Overlay background */}
            <div
              className="fixed inset-0 bg-brand-navy-950/85 backdrop-blur-sm transition-opacity"
              onClick={() => setSelectedCase(null)}
            ></div>

            <div className="flex min-h-screen items-center justify-center p-4">
              <div className="relative w-full max-w-2xl bg-brand-navy-900 border border-brand-navy-805 rounded-lg shadow-2xl p-6 sm:p-8 animate-in scale-in duration-200">
                
                {/* Close Button */}
                <button
                  onClick={() => setSelectedCase(null)}
                  className="absolute top-4 right-4 text-slate-300 hover:text-white p-1.5 hover:bg-brand-navy-800 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Header */}
                <div className="pb-4 border-b border-brand-navy-800 pr-8">
                  <span className="text-xs text-brand-tan font-bold font-mono uppercase tracking-wide px-2.5 py-1 bg-brand-tan/10 rounded">
                    판결 성공 사례 • {selectedCase.category}
                  </span>
                  <h3 className="text-lg sm:text-xl font-serif text-white font-bold mt-2.5 leading-snug">
                    {selectedCase.title}
                  </h3>
                </div>

                {/* Content Sections */}
                <div className="mt-6 space-y-5 max-h-[60vh] overflow-y-auto pr-2">
                  
                  {/* Facts */}
                  <div>
                    <h4 className="text-xs font-bold text-brand-tan tracking-wider uppercase flex items-center space-x-1">
                      <CheckSquare className="w-3.5 h-3.5" />
                      <span>1. 기초 사실관계 및 쟁점</span>
                    </h4>
                    <p className="mt-2 text-sm text-slate-100 leading-relaxed pl-4 border-l-2 border-brand-navy-800 tracking-tight font-sans">
                      {selectedCase.facts}
                    </p>
                  </div>

                  {/* Strategy */}
                  <div>
                    <h4 className="text-xs font-bold text-brand-tan tracking-wider uppercase flex items-center space-x-1">
                      <CheckSquare className="w-3.5 h-3.5" />
                      <span>2. 김재현 대표변호사 핵심 해결전략</span>
                    </h4>
                    <p className="mt-2 text-sm text-slate-100 leading-relaxed pl-4 border-l-2 border-brand-navy-800 tracking-tight font-sans">
                      {selectedCase.strategy}
                    </p>
                  </div>

                  {/* Verdict */}
                  <div className="bg-brand-navy-950 p-4 rounded border border-brand-navy-800">
                    <h4 className="text-xs font-bold text-brand-terracotta tracking-wider uppercase flex items-center space-x-1">
                      <CheckSquare className="w-3.5 h-3.5" />
                      <span>3. 소송 결과 (최종 판결 내용)</span>
                    </h4>
                    <p className="mt-2 text-sm sm:text-base font-serif text-slate-50 leading-relaxed font-bold tracking-tight">
                      {selectedCase.result}
                    </p>
                  </div>

                </div>

                {/* Footer buttons */}
                <div className="mt-8 pt-4 border-t border-brand-navy-800 flex justify-end space-x-3">
                  <button
                    onClick={() => setSelectedCase(null)}
                    className="px-4 py-2 text-xs font-bold text-slate-300 hover:text-white"
                  >
                    닫기
                  </button>
                  <a
                    href="#reservation"
                    onClick={() => {
                      setSelectedCase(null);
                      const scrollTarget = document.querySelector('#reservation');
                      if (scrollTarget) scrollTarget.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="bg-brand-tan text-brand-navy-950 px-4 py-2.5 rounded text-xs font-bold hover:bg-white transition-colors shadow-md"
                  >
                    이 유사 사건 특별 상담 받기
                  </a>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* Modal: Legal Column Detail */}
        {selectedColumn && (
          <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true" id="modal-column-detail">
            <div
              className="fixed inset-0 bg-brand-navy-950/85 backdrop-blur-sm transition-opacity"
              onClick={() => setSelectedColumn(null)}
            ></div>

            <div className="flex min-h-screen items-center justify-center p-4">
              <div className="relative w-full max-w-2xl bg-brand-navy-900 border border-brand-navy-800 rounded-lg shadow-2xl p-6 sm:p-8 animate-in scale-in duration-200">
                
                <button
                  onClick={() => setSelectedColumn(null)}
                  className="absolute top-4 right-4 text-slate-300 hover:text-white p-1.5 hover:bg-brand-navy-800 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="pb-4 border-b border-brand-navy-800 pr-8">
                  <div className="flex items-center space-x-2 text-xs text-slate-300 font-medium">
                    <span className="text-brand-tan font-bold">김재현의 리걸 포커스</span>
                    <span>•</span>
                    <span>{selectedColumn.category} 분야</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-serif text-white font-bold mt-2.5 leading-snug">
                    {selectedColumn.title}
                  </h3>
                </div>

                {/* Column Body Text */}
                <div className="mt-6 text-sm sm:text-base text-slate-100 leading-relaxed pr-2 max-h-[60vh] overflow-y-auto whitespace-pre-wrap font-serif tracking-tight">
                  {selectedColumn.content}
                </div>

                <div className="mt-8 pt-4 border-t border-brand-navy-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span className="text-xs text-slate-300 font-mono font-medium">작성일: {selectedColumn.date} • 힘 법률사무소 명의 보호 칼럼</span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedColumn(null)}
                      className="px-4 py-2 text-xs font-bold text-slate-300 hover:text-white"
                    >
                      닫기
                    </button>
                    <a
                      href="#reservation"
                      onClick={() => {
                        setSelectedColumn(null);
                        const scrollTarget = document.querySelector('#reservation');
                        if (scrollTarget) scrollTarget.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="bg-brand-terracotta text-white px-4 py-2.5 rounded text-xs font-bold hover:bg-brand-terracotta-hover transition-colors shadow-md"
                    >
                      이 칼럼 관련 1:1 상담 예약
                    </a>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
