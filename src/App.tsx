/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Reservation, ReservationStatus } from './types';
import Navbar from './components/Navbar';
import AboutSection from './components/AboutSection';
import PracticesSection from './components/PracticesSection';
import InsightsSection from './components/InsightsSection';
import ReservationSection from './components/ReservationSection';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';
import AppFloatingButtons from './components/AppFloatingButtons';
import { ArrowDown, Award, CheckCircle, Scale, Shield, Users, Mail, Phone, Clock, KeySquare, Sparkles, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

// Firebase Client Imports
import { db, auth, googleProvider } from './lib/firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { collection, doc, setDoc, getDoc, deleteDoc, onSnapshot, query, orderBy } from 'firebase/firestore';

const SEED_RESERVATIONS: Reservation[] = [
  {
    id: 'HIM-17815273000',
    name: '홍길동',
    phone: '010-1234-5678',
    email: 'hong@example.com',
    date: '2026-06-25',
    time: '10:00',
    type: 'visit',
    subject: '부동산 상가 보증금 반환 소송',
    description: '임대차 보증금 1억 2천만 원 미반환 사건으로 계약 해지 내용증명은 송달했으나, 집주인이 자가 수선 의무 불이행에 기한 손해배상 공제를 주장하며 지급을 고의 거부하고 있는 사태를 상담하고자 함.',
    createdAt: new Date().toISOString(),
    status: 'confirmed',
    note: '대법원 판례상 보증금 동시이행 항변과 세입자 수선 소명 내용 대조하여 다음 동석 전 자초지종 조치 예정.'
  },
  {
    id: 'HIM-17815274000',
    name: '이영희',
    phone: '010-9876-5432',
    date: '2026-06-25',
    time: '15:05',
    type: 'phone',
    subject: '형사 수사 피의 대배 자문',
    description: '공동 동업 과정에서 사기 및 배임 혐의로 기습 형사 고소를 당하여, 다음 주 서대문경찰서 첫 출석 신문에 변호사님 실시간 경찰 조사 동석을 조율하고 싶어 연락드렸습니다.',
    createdAt: new Date().toISOString(),
    status: 'pending'
  },
  {
    id: 'HIM-17815275000',
    name: '정기업',
    phone: '010-5555-4444',
    email: 'corp@example.com',
    date: '2026-06-26',
    time: '13:00',
    type: 'visit',
    subject: '건설 수수 공사대금 미정산 청구',
    description: '중소 시공사 원도급 계약 완료 후 준공 검사 승인 받았으나, 발주처가 사소한 유격 균열을 근거로 전체 공사 지체상금 조율 및 보수대금 지급을 거절하여 명확한 유치권 착안 및 청구를 기획 중.',
    createdAt: new Date().toISOString(),
    status: 'confirmed',
    note: '준공검사조서 및 공사 정산 확약 서약서 원본 수령 완료. 가처분 보전 청구 병행 준비.'
  },
  {
    id: 'HIM-17815276000',
    name: '최소인',
    phone: '010-2222-3333',
    date: '2026-06-28',
    time: '11:00',
    type: 'phone',
    subject: '가사 이혼 유류분 반환 청구',
    description: '선친이 사망하면서 남긴 논현동 빌딩 전반을 장남에게만 유상 증여하여, 차녀로서 정당한 몫을 보장받기 위한 한도 초과 유류분 반환 시효 소명 및 청구 대관 상담.',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    status: 'completed',
    note: '피상속인이 장자에게 위조 증여 등기한 내역 조사 대조 전 완료함.'
  }
];

export default function App() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('');
  
  // Custom Dynamic Portrait Configuration 
  const [portraitUrl, setPortraitUrl] = useState<string>("/src/assets/images/lawyer_portrait_1781527362492.jpg");
  
  // Custom auth state
  const [user, setUser] = useState<User | null>(null);

  // Main Banner Slides State
  const [currentSlide, setCurrentSlide] = useState(0);
  const mainSlides = [
    {
      id: 1,
      tag: "핵심 가치 • CLIENT-FIRST ADVOCACY",
      title: "가장 힘겨운 순간,\n당신의 온전한 법률 조력자가 되겠습니다.",
      description: "HIM Law Office는 철저한 사건 분석과 정교한 법리 구성을 갖추어,\n의뢰인의 권리와 권익을 흔들림 없이 수호합니다.",
      cta: "1:1 빠른 법률 상담 신청",
    },
    {
      id: 2,
      tag: "결과 중심 • EXECUTIVE SOLUTION",
      title: "대형로펌 파트너 출신의 노하우와\n압도적인 사건 전담 몰입감.",
      description: "사무장 대리 진행 없이 서울대 졸업, 대형 법무법인 파트너 출신 김재현 대표변호사가\n전략 수립부터 재판까지 전 과정을 직접 책임지고 해결합니다.",
      cta: "대표변호사 직접 상담 예약",
    },
    {
      id: 3,
      tag: "행동 유도 • DIRECT BOOKING CONSULTATION",
      title: "승소를 향해 나아가는\n가장 명쾌하고 확실한 첫 걸음.",
      description: "고민은 덜어내고 편리한 시간대에 맞춰 예약을 진행하십시오.\n오직 당신만을 겨냥한 최상의 맞춤형 승소 솔루션을 즉시 제시하겠습니다.",
      cta: "지금 상담 예약하기 →",
    }
  ];

  // Auto transition for Main Banner
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % mainSlides.length);
    }, 6500);
    return () => clearInterval(slideInterval);
  }, []);

  // 1. Fetch portrait url on start
  useEffect(() => {
    const fetchPortrait = async () => {
      try {
        const docRef = doc(db, "settings", "lawyer_profile");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().portraitUrl) {
          setPortraitUrl(docSnap.data().portraitUrl);
        } else {
          // Check cache fallback
          const cached = localStorage.getItem('him_law_portrait_url');
          if (cached) setPortraitUrl(cached);
        }
      } catch (err) {
        console.warn("Firestore settings load failed, reading local storage:", err);
        const cached = localStorage.getItem('him_law_portrait_url');
        if (cached) setPortraitUrl(cached);
      }
    };
    fetchPortrait();
  }, []);

  // 2. Auth status sync
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  // 3. Sync reservations list (Firestore listen if admin, fall back to localStorage)
  useEffect(() => {
    let unsubscribe = () => {};
    // Check if current user is admin
    const isAdmin = user && (user.email === 'jhkimlawl@gmail.com' || user.email === 'jhk@himlaw.co.kr');
    
    if (isAdmin) {
      try {
        const q = query(collection(db, "reservations"), orderBy("createdAt", "desc"));
        unsubscribe = onSnapshot(q, (snapshot) => {
          const list: Reservation[] = [];
          snapshot.forEach((doc) => {
            list.push(doc.data() as Reservation);
          });
          setReservations(list);
          localStorage.setItem('him_law_reservations', JSON.stringify(list));
        }, (err) => {
          console.warn("Firestore snapshot loading failed, applying local cache:", err);
          const stored = localStorage.getItem('him_law_reservations');
          setReservations(stored ? JSON.parse(stored) : SEED_RESERVATIONS);
        });
      } catch (e) {
        console.warn("Firestore subscription initiation failed:", e);
      }
    } else {
      // Normal guest mode / unauthenticated
      const stored = localStorage.getItem('him_law_reservations');
      if (stored) {
        setReservations(JSON.parse(stored));
      } else {
        localStorage.setItem('him_law_reservations', JSON.stringify(SEED_RESERVATIONS));
        setReservations(SEED_RESERVATIONS);
      }
    }
    return () => unsubscribe();
  }, [user]);

  // Reservation write handles
  const handleAddReservation = async (newRes: Reservation) => {
    const updated = [newRes, ...reservations];
    setReservations(updated);
    localStorage.setItem('him_law_reservations', JSON.stringify(updated));

    // Save to Firestore so that Admin sees it in real time
    try {
      await setDoc(doc(db, "reservations", newRes.id), newRes);
      console.log("Reservation synced successfully with Cloud Firestore.");
    } catch (err) {
      console.warn("Firestore reservation write skipped or unauthorized:", err);
    }
  };

  const handleUpdateStatus = async (id: string, status: ReservationStatus) => {
    const updated = reservations.map((res) =>
      res.id === id ? { ...res, status } : res
    );
    setReservations(updated);
    localStorage.setItem('him_law_reservations', JSON.stringify(updated));

    // Sync state modification to Firestore
    try {
      const target = reservations.find(r => r.id === id);
      if (target) {
        await setDoc(doc(db, "reservations", id), {
          ...target,
          status,
        });
      }
    } catch (err) {
      console.warn("Firestore status sync failed:", err);
    }
  };

  const handleUpdateNote = async (id: string, note: string) => {
    const updated = reservations.map((res) =>
      res.id === id ? { ...res, note } : res
    );
    setReservations(updated);
    localStorage.setItem('him_law_reservations', JSON.stringify(updated));

    // Sync lawyer memo/brief update to Firestore
    try {
      const target = reservations.find(r => r.id === id);
      if (target) {
        await setDoc(doc(db, "reservations", id), {
          ...target,
          note,
        });
      }
    } catch (err) {
      console.warn("Firestore memo update failed:", err);
    }
  };

  const handleDeleteReservation = async (id: string) => {
    const updated = reservations.filter((res) => res.id !== id);
    setReservations(updated);
    localStorage.setItem('him_law_reservations', JSON.stringify(updated));

    // Delete representation doc from Firestore too
    try {
      await deleteDoc(doc(db, "reservations", id));
    } catch (err) {
      console.warn("Firestore document deletion failed:", err);
    }
  };

  const handleSeedMockData = async () => {
    setReservations(SEED_RESERVATIONS);
    localStorage.setItem('him_law_reservations', JSON.stringify(SEED_RESERVATIONS));
    
    // Seed firestore if current user has admin status
    const isAdmin = user && (user.email === 'jhkimlawl@gmail.com' || user.email === 'jhk@himlaw.co.kr');
    if (isAdmin) {
      try {
        for (const res of SEED_RESERVATIONS) {
          await setDoc(doc(db, "reservations", res.id), res);
        }
      } catch (err) {
        console.warn("Firestore mock seeding failed:", err);
      }
    }
    alert('테스트용 최신 예약 샘플 4건이 정상 로팅 완료되었습니다!');
  };

  const handleUpdatePortrait = async (newUrl: string) => {
    setPortraitUrl(newUrl);
    localStorage.setItem('him_law_portrait_url', newUrl);

    // Sync config document to Firestore settings
    try {
      await setDoc(doc(db, "settings", "lawyer_profile"), {
        id: "lawyer_profile",
        portraitUrl: newUrl,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      console.warn("Firestore profile customization write skipped:", err);
    }
  };

  const handleAuthLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error("Popup authenticated flow failed: ", err);
      alert("구글 로그인을 완료할 수 없습니다. 팝업 차단 설정을 해제하시거나 브라우저 허용 쿠키를 점검해 보십시오.");
    }
  };

  const handleAuthLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Logout failed: ", err);
    }
  };

  const handleSelectPracticeSubject = (subjectName: string) => {
    setSelectedSubject(subjectName);
  };

  const handleOpenReservation = () => {
    setSelectedSubject('');
  };

  const handleScrollToReservation = () => {
    const section = document.querySelector('#reservation');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-brand-navy-900 flex flex-col font-sans selection:bg-brand-tan/30 selection:text-brand-navy-900">
      
      {/* Top sticky/fixed navigation */}
      <Navbar
        onOpenDashboard={() => setIsAdminOpen(true)}
        onOpenReservation={handleOpenReservation}
      />

      {/* Main Screen Layout */}
      <main className="flex-1">

        {/* 1. HERO SLIDING BANNER SECTION */}
        <section
          id="home"
          className="relative min-h-[580px] sm:min-h-[640px] lg:h-[75vh] flex items-center bg-brand-navy-950 overflow-hidden pt-28 sm:pt-32"
        >
          {/* Wide-angle premium office backdrop image with dark corporate overlays */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 scale-[1.01]"
            style={{ 
              backgroundImage: 'url("https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80")',
              backgroundBlendMode: 'multiply'
            }}
          />
          {/* Gradient Overlays for premium dark aesthetic and perfect readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-brand-navy-950 via-brand-navy-950/85 to-[#050D1A]/90 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-950 via-transparent to-brand-navy-950/40 z-10" />
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-brand-navy-950 to-transparent z-10" />

          {/* Decorative subtle golden rays in background */}
          <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-brand-tan/5 rounded-full blur-[80px] pointer-events-none z-10"></div>

          {/* Banner Slides Carousel Area */}
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 h-full flex flex-col justify-center">
            <div className="relative min-h-[300px] sm:min-h-[340px] md:min-h-[320px] flex items-center">
              
              {mainSlides.map((slide, idx) => {
                const isActive = idx === currentSlide;
                return (
                  <div
                    key={slide.id}
                    className={`w-full transition-all duration-700 absolute left-0 right-0 transform ${
                      isActive 
                        ? 'opacity-100 translate-x-0 scale-100 pointer-events-auto' 
                        : 'opacity-0 translate-x-8 scale-[0.98] pointer-events-none'
                    }`}
                  >
                    <div className="max-w-4xl space-y-5 text-left">
                      {/* Badge / TAG */}
                      <span className="inline-flex items-center space-x-2 text-[10px] sm:text-xs text-brand-tan uppercase tracking-[0.2em] font-bold">
                        <span className="w-2 h-2 rounded-full bg-brand-tan animate-pulse inline-block"></span>
                        <span>{slide.tag}</span>
                      </span>

                      {/* Main Title - Beautiful Serif display typography paired nicely */}
                      <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-[45px] font-serif font-bold text-white tracking-tight leading-[1.3] sm:leading-[1.25] whitespace-pre-line antialiased drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
                        {slide.title}
                      </h1>

                      {/* Sub Description */}
                      <p className="text-slate-100 text-xs sm:text-sm md:text-base leading-relaxed font-sans font-medium max-w-3xl pr-4 whitespace-pre-line antialiased drop-shadow-[0_2px_8px_rgba(0,0,0,0.75)] opacity-95">
                        {slide.description}
                      </p>

                      {/* Interactive Trigger Button inside the slide block */}
                      <div className="pt-4 flex flex-col sm:flex-row items-start gap-4">
                        <button
                          onClick={handleScrollToReservation}
                          className="group inline-flex items-center space-x-2.5 py-3 px-6 sm:px-7 bg-brand-tan hover:bg-[#8C6940] text-brand-navy-950 hover:text-white font-bold text-xs sm:text-sm tracking-wider rounded-sm shadow-xl transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
                        >
                          <span>{slide.cta}</span>
                          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Slider Interface Controls */}
            <div className="flex items-center justify-between mt-12 sm:mt-16 border-t border-white/10 pt-6">
              
              {/* Pagination Dots */}
              <div className="flex items-center space-x-3">
                {mainSlides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === currentSlide 
                        ? 'w-8 bg-brand-tan' 
                        : 'w-2 bg-white/20 hover:bg-white/40'
                    }`}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Incremental Navigation Arrows */}
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentSlide((prev) => (prev - 1 + mainSlides.length) % mainSlides.length)}
                  className="w-10 h-10 rounded-full border border-white/10 hover:border-brand-tan text-white/60 hover:text-brand-tan hover:bg-white/5 flex items-center justify-center transition-all"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setCurrentSlide((prev) => (prev + 1) % mainSlides.length)}
                  className="w-10 h-10 rounded-full border border-white/10 hover:border-brand-tan text-white/60 hover:text-brand-tan hover:bg-white/5 flex items-center justify-center transition-all"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

            </div>

          </div>
        </section>

        {/* 2. NUMBERS FOR TRUST (Roel Benchmarked Section) */}
        <section className="bg-brand-navy-900 border-y border-brand-navy-800 py-16 lg:py-20 relative overflow-hidden">
          {/* Background decorative luxury grid lines */}
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#9F784D_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            
            {/* Introductory statement of trust numbers */}
            <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
              <span className="text-brand-tan font-mono uppercase tracking-[0.2em] text-[11px] font-bold block mb-3 leading-none">
                수치로 증명하는 신뢰 • PROVEN TRUST
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
                HIM Law Office의 결과를 증명하는 지표
              </h2>
              <div className="w-12 h-[2px] bg-brand-tan mx-auto mt-4"></div>
            </div>

            {/* Key metrics grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center" id="trust-numbers-metrics-grid">
              
              {/* Stat Card 1 */}
              <div className="bg-brand-navy-950/40 border border-white/5 hover:border-brand-tan/15 p-6 rounded-sm transition-all duration-300 group">
                <div className="text-brand-tan text-3xl sm:text-4xl font-serif font-extrabold tracking-tight mb-3">
                  1,020<span className="text-xl sm:text-2xl text-[#8C9096] ml-0.5">+</span><span className="text-sm font-sans font-medium text-slate-400 block sm:inline sm:ml-1">건</span>
                </div>
                <div className="text-[#9F784D] text-[10px] font-mono tracking-wider uppercase mb-1">MAJOR PRACTICE CASES</div>
                <h3 className="text-base text-white font-medium mb-2 font-serif">주요 수행 사례</h3>
                <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
                  다양한 소송과 전략적 기업 자문, 그리고 대표적인 부동산 분쟁을 직접 치뤄온 독보적 성공 지표
                </p>
              </div>

              {/* Stat Card 2 */}
              <div className="bg-brand-navy-950/40 border border-white/5 hover:border-brand-tan/15 p-6 rounded-sm transition-all duration-300 group">
                <div className="text-brand-tan text-3xl sm:text-4xl font-serif font-extrabold tracking-tight mb-3">
                  2,000<span className="text-xl sm:text-2xl text-[#8C9096] ml-0.5">억원+</span>
                </div>
                <div className="text-[#9F784D] text-[10px] font-mono tracking-wider uppercase mb-1">ACCUMULATED CASE VALUE</div>
                <h3 className="text-base text-white font-medium mb-2 font-serif">주요 수행 금액</h3>
                <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
                  대형 로펌 파트너 출신으로서 대형 분쟁, 고액 자산 소송 및 민사 사건을 대리하며 증명한 누적 가액
                </p>
              </div>

              {/* Stat Card 3 */}
              <div className="bg-brand-navy-950/40 border border-white/5 hover:border-brand-tan/15 p-6 rounded-sm transition-all duration-300 group">
                <div className="text-brand-tan text-3xl sm:text-4xl font-serif font-extrabold tracking-tight mb-3">
                  96<span className="text-xl sm:text-2xl text-[#8C9096] ml-0.5">%</span><span className="text-sm font-sans font-medium text-slate-400 block sm:inline sm:ml-1">+</span>
                </div>
                <div className="text-[#9F784D] text-[10px] font-mono tracking-wider uppercase mb-1">CLIENT SATISFACTION RATE</div>
                <h3 className="text-base text-white font-medium mb-2 font-serif">고객 만족도 / 승소율</h3>
                <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
                  압도적인 디테일과 한 소송에 대한 끝없는 집념으로 의뢰인의 가장 완벽한 결과를 확보합니다.
                </p>
              </div>

              {/* Stat Card 4 */}
              <div className="bg-brand-navy-950/40 border border-white/5 hover:border-brand-tan/15 p-6 rounded-sm transition-all duration-300 group">
                <div className="text-brand-tan text-3xl sm:text-4xl font-serif font-extrabold tracking-tight mb-3">
                  100<span className="text-xl sm:text-2xl text-[#8C9096] ml-0.5">%</span>
                </div>
                <div className="text-[#9F784D] text-[10px] font-mono tracking-wider uppercase mb-1">1:1 ATTORNEY DIRECT INTERACTION</div>
                <h3 className="text-base text-white font-medium mb-2 font-serif">변호사 직접 1:1 상담</h3>
                <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
                  사무장의 형식적인 대리 또는 우회 없는, 김재현 대표변호사가 전면 책임지는 고밀도 책임 상담
                </p>
              </div>

            </div>

            {/* Crucial required: Standard 1:1 fast consultation entry trigger button */}
            <div className="text-center mt-12">
              <button
                onClick={handleScrollToReservation}
                className="inline-flex items-center space-x-2 bg-brand-tan hover:bg-[#8C6940] text-brand-navy-950 hover:text-white font-bold text-xs sm:text-sm px-10 py-4 rounded-sm tracking-wider uppercase shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-0.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>1:1 빠른 법률상담 신청</span>
              </button>
            </div>

          </div>
        </section>

        {/* 3. PHILOSOPHY PANEL - core statements */}
        <section className="bg-slate-50 py-20 relative border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-4 text-center">
            <span className="text-[#C05E3D] font-mono uppercase tracking-[0.25em] text-xs font-bold block mb-3">BRAND CREDO</span>
            <blockquote className="mt-4 text-xl sm:text-2xl font-serif text-brand-navy-900 italic leading-relaxed max-w-4xl mx-auto px-4">
              "한 사람의 인생이 걸린 소송을 단순 업무 숫자로만 취급하지 않겠습니다. 대형 로펌의 성과는 시스템에서 오지만, 한 사람만을 위한 승소 기적은 오직 완벽한 몰입과 집요함에서 비롯합니다."
            </blockquote>
            <div className="mt-6 flex items-center justify-center space-x-3 text-[#51719C] text-sm font-semibold">
              <span className="font-serif text-brand-navy-900 font-bold">김재현 대표변호사</span>
              <span>•</span>
              <span className="text-xs">HIM Law Office | 힘 법률사무소</span>
            </div>
          </div>
        </section>

        {/* 4. MODULAR SECTIONS */}
        
        {/* AboutSection.tsx: Bio & Tab education credentials (now accepting portraitUrl dynamically) */}
        <AboutSection customPortraitUrl={portraitUrl} />

        {/* PracticesSection.tsx: Practice areas grid with filter callback */}
        <PracticesSection onSelectPractice={handleSelectPracticeSubject} />

        {/* InsightsSection.tsx: Case studies & Analytical legal columns */}
        <InsightsSection />

        {/* ReservationSection.tsx: Beautiful step-by-step custom date schedule calender */}
        <ReservationSection
          reservations={reservations}
          onAddReservation={handleAddReservation}
          selectedSubject={selectedSubject}
        />

      </main>

      {/* Footer component containing exact business card details */}
      <Footer onOpenDashboard={() => setIsAdminOpen(true)} />

      {/* Floating Call to Action Buttons / widgets */}
      <AppFloatingButtons onOpenReservation={handleOpenReservation} />

      {/* BACK-OFFICE SECURE CONSOLE MODAL DASHBOARD */}
      <Dashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        reservations={reservations}
        onUpdateStatus={handleUpdateStatus}
        onUpdateNote={handleUpdateNote}
        onDeleteReservation={handleDeleteReservation}
        onSeedMockData={handleSeedMockData}
        portraitUrl={portraitUrl}
        onUpdatePortrait={handleUpdatePortrait}
        user={user}
        onLogin={handleAuthLogin}
        onLogout={handleAuthLogout}
      />

    </div>
  );
}
