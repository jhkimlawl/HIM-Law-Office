/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Mail, Phone, MapPin, Printer, Smartphone, Youtube } from 'lucide-react';

interface FooterProps {
  onOpenDashboard: () => void;
}

export default function Footer({ onOpenDashboard }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-navy-950 border-t border-brand-navy-850 pt-20 pb-12 relative overflow-hidden" id="app-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Split */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-16 border-b border-brand-navy-900">
          
          {/* Logo & Corporate block */}
          <div className="md:col-span-5 space-y-6">
            <div className="flex items-center space-x-2.5">
              <svg viewBox="0 0 100 100" className="w-8 h-8 flex-shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Column 1 (Left, Brown) */}
                <rect x="15" y="15" width="14" height="70" fill="#A67C52" />
                
                {/* Crossbar (Brown) */}
                <rect x="29" y="43" width="12" height="14" fill="#A67C52" />
                
                {/* Column 2 - Top (Brown) */}
                <path d="M 41,15 H 55 V 45 L 41,59 Z" fill="#A67C52" />
                
                {/* Column 2 - Bottom (Brown) */}
                <path d="M 41,65 L 55,51 V 85 H 41 Z" fill="#A67C52" />
                
                {/* Column 3 - Top (Grey) */}
                <path d="M 67,15 H 81 V 19 L 67,33 Z" fill="#A0A2A6" />
                
                {/* Column 3 - Bottom (Grey) - includes L's foot */}
                <path d="M 67,39 L 81,25 V 71 H 98 V 85 H 67 Z" fill="#A0A2A6" />
              </svg>
              <div className="flex flex-col select-none leading-none">
                <span className="text-[10px] uppercase tracking-[0.12em] text-[#A0A2A6] font-medium font-sans mb-0.5">
                  HIM Law Office
                </span>
                <div className="flex items-baseline space-x-0.5">
                  <span className="text-[14px] font-bold text-[#A67C52] font-serif leading-none">힘</span>
                  <span className="text-[12px] font-semibold text-slate-300 leading-none">법률사무소</span>
                </div>
              </div>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              대한변호사협회 등록 부동산 전문 변호사이자 전 대형로펌 파트너 출신 김재현 변호사가 수사의 출발부터 판결까지 의뢰인의 권리를 직접 지킵니다.
            </p>

            {/* Regulatory registry indicator & YouTube badge */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-1">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-brand-navy-900 border border-brand-navy-800 rounded font-sans text-[10px] text-slate-400 self-start">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-tan"></span>
                <span>서울지방변호사회 소속 부동산전문 대표변호사 직접수행</span>
              </div>
              <a
                href="https://www.youtube.com/@%ED%9E%98%EB%B3%80%ED%98%B8%EC%82%AC%EA%B9%80%EC%9E%AC%ED%98%84"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 px-3 py-1 bg-red-950/40 border border-[#4d1414] hover:border-red-600/50 rounded font-sans text-[10px] text-slate-300 hover:text-white transition duration-200 self-start"
              >
                <Youtube className="w-3.5 h-3.5 text-[#FF0000]" />
                <span>유튜브 ‘힘변호사’ 채널</span>
              </a>
            </div>
          </div>

          {/* Core Info & Business details (Card extracted) */}
          <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-8">
            
            {/* Left Block: Contact elements */}
            <div className="space-y-4">
              <h5 className="font-serif text-xs font-bold text-white uppercase tracking-wider">Contact & Communications</h5>
              <div className="space-y-3 font-mono text-xs text-slate-400">
                <div className="flex items-center space-x-2.5">
                  <Smartphone className="w-4 h-4 text-brand-tan flex-shrink-0" />
                  <span>M. 010-8098-7790</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <Phone className="w-4 h-4 text-brand-tan flex-shrink-0" />
                  <span>T. 02-6952-3002 <span className="text-[10px] text-brand-cognac">(전용 채널)</span></span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <Printer className="w-4 h-4 text-brand-tan flex-shrink-0" />
                  <span>F. 070-7507-3008</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <Mail className="w-4 h-4 text-brand-tan flex-shrink-0" />
                  <span>E. <a href="mailto:jhk@himlaw.co.kr" className="hover:text-brand-tan hover:underline">jhk@himlaw.co.kr</a></span>
                </div>
              </div>
            </div>

            {/* Right Block: Address & Attorney detail */}
            <div className="space-y-4">
              <h5 className="font-serif text-xs font-bold text-white uppercase tracking-wider">Office Location</h5>
              <div className="space-y-3 text-xs text-slate-400">
                <div className="flex items-start space-x-2.5">
                  <MapPin className="w-4 h-4 text-brand-tan flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed">
                    서울특별시 강남구 학동로 335, 10층 <br/>
                    (논현동, 다른타워) (우)06060 <br/>
                    <span className="font-mono text-[10px] text-slate-500 font-normal">10F, Dareun Tower, 335 Hakdong-ro, Gangnam-gu, Seoul 06060</span>
                  </span>
                </div>
                <div className="pt-2 border-t border-brand-navy-900 inline-block">
                  <span className="text-[11px] text-slate-500">대표 변호사 : <strong>김재현 (Kim Jai Hyeon)</strong></span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
          <p className="leading-normal text-left">
            © {currentYear} HIM Law Office | 힘 법률사무소. All Rights Reserved. <br/>
            본 사이트 내 이력, 판결사례, 칼럼의 모든 저작권은 힘 법률사무소 김재현 변호사에게 있으며 무단 복제를 금합니다.
          </p>
          <div className="flex space-x-4">
            {/* Secret entrance to control backup console */}
            <button
              onClick={onOpenDashboard}
              type="button"
              className="hover:text-brand-tan transition duration-200"
              id="footer-back-office-link"
            >
              변호사 비서 로그인
            </button>
            <span>|</span>
            <a href="#about" className="hover:text-slate-300">개인정보처리방침</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
