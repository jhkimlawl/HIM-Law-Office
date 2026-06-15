/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Award, GraduationCap, Briefcase, FileCheck, Quote, CornerDownRight, Youtube } from 'lucide-react';

interface AboutSectionProps {
  customPortraitUrl?: string;
}

export default function AboutSection({ customPortraitUrl }: AboutSectionProps) {
  const defaultPortrait = "/src/assets/images/lawyer_portrait_1781527362492.jpg";
  const [activeTab, setActiveTab] = useState<'profile' | 'career' | 'trainings'>('profile');

  const educationList = [
    { text: '서울대학교 경영학과 졸업', sub: '엘리트 경영/재무 및 종합적 자산 지식 바탕의 세무·부동산 법률 분석' },
    { text: '서울대학교 국제대학원 일본연구소 Junior Fellow', sub: '글로벌 통상 및 해외 유수 학술 협업 체계 참여' },
    { text: '북경사범대학교 (Beijing Normal University) 학술파견', sub: '중국 경제법 및 국제 거래 실무 교류' },
    { text: '조지아 공과대학교 (Georgia Institute of Technology) 학술파견', sub: '미국 테크/특허 비즈니스 연관 실무 파견' },
    { text: '규슈대학교 (Kyushu University) 학술파견', sub: '동아시아 계약 구조 및 기업 지배구조 연구' },
    { text: '한국외국어대학교 법학전문대학원 졸업', sub: '다양한 분야를 섭렵한 종합 법학 실무 역량 고도화' },
    { text: '대한민국 변호사시험 합격', sub: '변호사 자격 및 전문 법률 실무 전담 자격 취득' }
  ];

  const experienceList = [
    { text: '전 대기업 근무', sub: '대기업 사내 사업 개발 및 비즈니스 현업 인프라 실무 노하우' },
    { text: '전 법무법인 리츠 변호사', sub: '부동산 개발 및 기업 송무 심화 실무 수행' },
    { text: '전 로엘법무법인 파트너 변호사', sub: '메이저 대형 로펌 파트너로서 고난도 민·형사 및 건설 분쟁 총괄' },
    { text: '현 힘 법률사무소 대표 변호사 겸 서울지방변호사회 소속 부동산 전문 변호사', sub: '대한변호사협회 등록 전문성 기반의 1인 대표변호사 직접 소통 실현' }
  ];

  const specialTrainings = [
    { year: '2026', title: '서울지방변호사회 형사 특별연수 수료', category: '형사' },
    { year: '2025', title: '서울지방변호사회 건설·부동산 특별연수 수료', category: '부동산' },
    { year: '2025', title: '서울지방변호사회 민사(조정) 특별연수 수료', category: '민사' },
    { year: '2025', title: '서울지방변호사회 공법(공정거래법) 특별연수 수료', category: '공정거래' },
    { year: '2025', title: '서울지방변호사회 채무자회생법 특별연수 수료', category: '도산/회생' },
    { year: '2024', title: '서울지방변호사회 민사(집행) 특별연수 수료', category: '강제집행' },
    { year: '2024', title: '서울지방변호사회 가사 특별연수 수료', category: '상속/가족' },
    { year: '2022', title: '대한변호사협회 노무 아카데미 수료', category: '노동' }
  ];

  return (
    <section id="about" className="py-24 bg-brand-navy-950 relative overflow-hidden">
      {/* Background radial elements for luxury polish */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-brand-tan/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-brand-cognac/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-brand-tan font-mono uppercase tracking-widest text-xs font-bold">ABOUT THE ATTORNEY</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-serif font-semibold tracking-tight text-white leading-snug">
            화려한 약력과 이력이 증명하는<br className="sm:hidden"/> 압도적인 변론의 힘
          </h2>
          <div className="mt-4 h-1 w-12 bg-brand-tan mx-auto"></div>
          <p className="mt-5 text-slate-200 text-sm sm:text-base leading-relaxed tracking-tight">
            대형 로펌 파트너 출신 변호사로서 지닌 강력한 소송 데이터베이스를 앞세워, <br className="hidden sm:block" />
            상담 단계부터 변론서 작성, 법정 다툼까지 사무장 없이 김재현 변호사가 100% 직접 책임집니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start" id="attorney-profile-grid">
          
          {/* Portrait Column */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative group w-full max-w-sm">
              {/* Outer decorative borders representing premium classic frames */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-brand-tan to-brand-cognac rounded-lg blur opacity-25 group-hover:opacity-35 transition duration-300"></div>
              <div className="relative bg-brand-navy-900 border border-brand-navy-700 p-3 rounded-lg shadow-2xl">
                <img
                  src={customPortraitUrl || defaultPortrait}
                  alt="김재현 대표변호사"
                  referrerPolicy="no-referrer"
                  className="w-full h-auto rounded object-cover shadow-inner grayscale-15 group-hover:grayscale-0 transition-all duration-500"
                />
                <div className="mt-4 text-center">
                  <span className="text-brand-tan font-mono text-xs tracking-wider uppercase font-semibold">CEO & FOUNDER ATTORNEY</span>
                  <h3 className="text-xl font-serif text-white font-medium mt-1">김재현 <span className="text-sm text-slate-200 font-sans ml-1">대표변호사</span></h3>
                  <p className="text-xs text-brand-cognac font-mono tracking-widest mt-0.5 font-bold">KIM JAI HYEON</p>
                </div>
              </div>

              {/* Badges Overlay */}
              <div className="absolute -bottom-5 -right-3 bg-brand-navy-900 border border-brand-tan/40 px-4 py-2.5 rounded-lg shadow-xl flex items-center space-x-2 select-none">
                <Award className="w-5 h-5 text-brand-tan" />
                <div className="text-left">
                  <p className="text-[10px] text-slate-300 leading-none">대한변협 등록</p>
                  <p className="text-xs text-brand-tan font-bold mt-0.5 leading-none font-sans">부동산 전문 변호사</p>
                </div>
              </div>
            </div>

            {/* Philosophy block */}
            <div className="mt-12 w-full max-w-sm bg-brand-navy-900/50 border border-brand-navy-800 rounded-lg p-5">
              <Quote className="w-8 h-8 text-brand-tan/30 mb-3" />
              <p className="text-sm text-slate-100 font-serif italic leading-relaxed tracking-tight">
                "대형 로펌의 성과는 시스템에서 오지만, 1인 변호사의 기적은 집요함과 완결성에서 비롯합니다. 상담만 받고 손을 떼는 로펌의 한계를 지우고 처음부터 끝까지 당신과 동행합니다."
              </p>
              <div className="mt-4 flex items-center space-x-2">
                <div className="h-[1px] w-4 bg-brand-tan"></div>
                <span className="text-xs text-brand-tan font-sans uppercase tracking-wider font-semibold">HIM LAW OFFICE PHILOSOPHY</span>
              </div>
            </div>
          </div>

          {/* Credentials Column */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Custom Tab GNB */}
            <div className="flex border-b border-brand-navy-800">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex items-center space-x-2 pb-4 text-sm font-medium border-b-2 transition-all duration-300 ${
                  activeTab === 'profile'
                    ? 'border-brand-tan text-brand-tan font-bold'
                    : 'border-transparent text-slate-300 hover:text-white'
                } flex-1 sm:flex-none sm:px-6`}
              >
                <GraduationCap className="w-4.5 h-4.5" />
                <span>학력 및 글로벌 이력</span>
              </button>
              <button
                onClick={() => setActiveTab('career')}
                className={`flex items-center space-x-2 pb-4 text-sm font-medium border-b-2 transition-all duration-300 ${
                  activeTab === 'career'
                    ? 'border-brand-tan text-brand-tan font-bold'
                    : 'border-transparent text-slate-300 hover:text-white'
                } flex-1 sm:flex-none sm:px-6`}
              >
                <Briefcase className="w-4.5 h-4.5" />
                <span>핵심 실무 경력</span>
              </button>
              <button
                onClick={() => setActiveTab('trainings')}
                className={`flex items-center space-x-2 pb-4 text-sm font-medium border-b-2 transition-all duration-300 ${
                  activeTab === 'trainings'
                    ? 'border-brand-tan text-brand-tan font-bold'
                    : 'border-transparent text-slate-300 hover:text-white'
                } flex-1 sm:flex-none sm:px-6`}
              >
                <FileCheck className="w-4.5 h-4.5" />
                <span>연구 및 특별연수 수료</span>
              </button>
            </div>

            {/* TAB CONTENT 1: Education */}
            {activeTab === 'profile' && (
              <div className="space-y-4 pt-2 animate-in fade-in duration-300" id="experience-education" role="tabpanel">
                <div className="bg-brand-navy-900 border border-brand-navy-800 p-6 space-y-4">
                  <h4 className="text-base text-brand-tan font-bold flex items-center space-x-2">
                    <GraduationCap className="w-4 h-4" />
                    <span>학문적 우수성과 글로벌 파견 경험</span>
                  </h4>
                  <div className="border-t border-brand-navy-800 my-3"></div>
                  <ul className="space-y-4">
                    {educationList.map((item, idx) => (
                      <li key={idx} className="flex items-start space-x-3 group">
                        <div className="mt-1.5 w-1.5 h-1.5 bg-brand-tan rounded-full group-hover:scale-125 transition-transform"></div>
                        <div className="flex-1">
                          <span className="text-white font-medium text-sm sm:text-base block tracking-tight">{item.text}</span>
                          <span className="text-xs sm:text-sm text-slate-305 block mt-0.5 leading-relaxed tracking-tight">{item.sub}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* TAB CONTENT 2: Career */}
            {activeTab === 'career' && (
              <div className="space-y-4 pt-2 animate-in fade-in duration-300" id="experience-careers" role="tabpanel">
                <div className="bg-brand-navy-900 border border-brand-navy-800 p-6 space-y-4">
                  <h4 className="text-base text-brand-tan font-bold flex items-center space-x-2">
                    <Briefcase className="w-4 h-4" />
                    <span>대기업에서 대형 로펌 파트너까지</span>
                  </h4>
                  <div className="border-t border-brand-navy-800 my-3"></div>
                  <ul className="space-y-5">
                    {experienceList.map((item, idx) => (
                      <li key={idx} className="flex items-start space-x-3 group">
                        <div className="mt-1 w-5 h-5 rounded-full bg-brand-navy-800 border border-brand-tan/30 flex items-center justify-center text-xs font-mono font-bold text-brand-tan group-hover:bg-brand-tan group-hover:text-brand-navy-950 transition-colors">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <span className="text-white font-semibold text-sm sm:text-base block tracking-tight">{item.text}</span>
                          <span className="text-xs sm:text-sm text-slate-300 block mt-1 leading-relaxed tracking-tight">{item.sub}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 p-4 bg-brand-navy-950/70 rounded border border-brand-navy-800/80 flex items-start space-x-2">
                    <CornerDownRight className="w-4 h-4 text-brand-tan flex-shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed tracking-tight">
                      대기업 사내 실무에서의 비즈니스 감각과 국내 메이저 법인 (로엘법무법인) 파트너 변호사 실무 노하우는 고난도 법인 민형사 소송 및 분쟁에서 상대방을 무력화하는 핵심 힘이 됩니다.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT 3: Special Trainings */}
            {activeTab === 'trainings' && (
              <div className="space-y-4 pt-2 animate-in fade-in duration-300" id="experience-trainings" role="tabpanel">
                <div className="bg-brand-navy-900 border border-brand-navy-800 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-base text-brand-tan font-bold flex items-center space-x-2">
                      <FileCheck className="w-4 h-4" />
                      <span>부단한 연구: 서울회 소속 특별 연수 수행 내역</span>
                    </h4>
                    <span className="text-xs text-brand-tan font-mono font-bold">총 8개 수료</span>
                  </div>
                  <div className="border-t border-brand-navy-800 my-3"></div>
                  
                  {/* Grid Timeline list */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-4">
                    {specialTrainings.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-brand-navy-950 border border-brand-navy-800 rounded flex flex-col justify-between hover:border-brand-tan/30 transition-all duration-200"
                      >
                        <span className="text-[10px] text-brand-tan font-mono uppercase bg-brand-tan/10 py-0.5 px-1.5 rounded self-start font-semibold">
                          {item.year} • {item.category}
                        </span>
                        <p className="text-xs sm:text-sm text-white font-medium mt-2 leading-relaxed tracking-tight">
                          {item.title}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Premium YouTube Banner Integration */}
            <div className="bg-gradient-to-r from-red-950/30 to-brand-navy-900 border border-red-900/40 hover:border-red-600/50 rounded-lg p-5 flex flex-col sm:flex-row items-center justify-between gap-5 transition duration-300">
              <div className="flex items-start space-x-4">
                <div className="w-11 h-11 bg-[#FF0000] rounded-full flex items-center justify-center text-white shrink-0 shadow-lg shadow-red-950/50">
                  <Youtube className="w-5.5 h-5.5 fill-current" />
                </div>
                <div className="text-left col-span-1">
                  <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5 tracking-tight">
                    공식 유튜브 채널 <span className="text-red-500 font-extrabold">‘힘변호사’</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-200 mt-1 leading-relaxed tracking-tight">
                    대한변협 등록 부동산전문 김재현 대표변호사가 직접 설명하는 생생한 실전 소송 꿀팁과 핵심 해결책을 손쉽게 만나보세요.
                  </p>
                </div>
              </div>
              <a
                href="https://www.youtube.com/@%ED%9E%98%EB%B3%80%ED%98%B8%EC%82%AC%EA%B9%80%EC%9E%AC%ED%98%84"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#FF0000] hover:bg-[#CC0000] text-white text-xs sm:text-sm font-bold px-4.5 py-2.5 rounded transition-colors duration-200 shrink-0 text-center flex items-center justify-center space-x-1.5 shadow-md hover:shadow-red-950/50"
              >
                <span>채널 바로가기</span>
                <span className="text-[10px]">▶</span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
