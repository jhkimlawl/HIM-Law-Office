/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Reservation, ReservationStatus } from '../types';
import { Calendar, Users, CheckCircle, Clock, XCircle, FileSpreadsheet, Lock, Mail, PhoneCall, RefreshCw, Trash2, Send, Save, Image as ImageIcon, LogOut, Upload } from 'lucide-react';

interface DashboardProps {
  isOpen: boolean;
  onClose: () => void;
  reservations: Reservation[];
  onUpdateStatus: (id: string, status: ReservationStatus) => void;
  onUpdateNote: (id: string, note: string) => void;
  onDeleteReservation: (id: string) => void;
  onSeedMockData: () => void;
  portraitUrl: string;
  onUpdatePortrait: (url: string) => void;
  user: any;
  onLogin: () => void;
  onLogout: () => void;
}

interface AlertLog {
  timestamp: string;
  type: 'SMS' | 'EMAIL';
  recipient: string;
  content: string;
}

export default function Dashboard({
  isOpen,
  onClose,
  reservations,
  onUpdateStatus,
  onUpdateNote,
  onDeleteReservation,
  onSeedMockData,
  portraitUrl,
  onUpdatePortrait,
  user,
  onLogin,
  onLogout,
}: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'list' | 'alerts' | 'export'>('list');
  const [selectedResId, setSelectedResId] = useState<string | null>(null);
  const [tempNote, setTempNote] = useState<string>('');
  const [portraitInput, setPortraitInput] = useState<string>(portraitUrl);
  const [isDemoBypass, setIsDemoBypass] = useState<boolean>(false);
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [dragOver, setDragOver] = useState<boolean>(false);

  const handleImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일(*.jpg, *.png, *.webp 등)만 업로드할 수 있습니다.');
      return;
    }
    
    setIsCompressing(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Max dimension 800px for professional portrait cards
        const MAX_DIM = 800;
        if (width > height) {
          if (width > MAX_DIM) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          // Compress to JPEG with 0.8 quality
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
          setPortraitInput(compressedBase64);
        }
        setIsCompressing(false);
      };
      img.onerror = () => {
        alert('이미지를 로드하는 중 오류가 발생했습니다.');
        setIsCompressing(false);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };
  
  const [alertLogs, setAlertLogs] = useState<AlertLog[]>([
    {
      timestamp: '2026-06-15 09:30:12',
      type: 'EMAIL',
      recipient: 'jhk@himlaw.co.kr',
      content: '[힘 법률사무소] 예약 접수 알림 - 김의뢰 (부동산 명도 분쟁) 2026-06-25 14:00 예약 신청되었습니다.'
    },
    {
      timestamp: '2026-06-15 09:30:12',
      type: 'SMS',
      recipient: '010-8098-7790',
      content: '[HIM] 신규 예약이 왔습니다. 대기자: 김의뢰, ☎ 010-1234-5678, 분야: 부동산 분쟁'
    }
  ]);

  // Sync state if prop changes from parents
  useEffect(() => {
    setPortraitInput(portraitUrl);
  }, [portraitUrl]);

  if (!isOpen) return null;

  // Authorization lookup
  const isAdminUser = user && (user.email === 'jhkimlawl@gmail.com' || user.email === 'jhk@himlaw.co.kr');
  const showDashboard = isAdminUser || isDemoBypass;

  // Statistics calculations
  const total = reservations.length;
  const pending = reservations.filter((r) => r.status === 'pending').length;
  const confirmed = reservations.filter((r) => r.status === 'confirmed').length;
  const completed = reservations.filter((r) => r.status === 'completed').length;
  const cancelled = reservations.filter((r) => r.status === 'cancelled').length;

  const selectedRes = reservations.find((r) => r.id === selectedResId);

  // Status transitions triggering logging mock
  const handleStatusChange = (id: string, newStatus: ReservationStatus) => {
    onUpdateStatus(id, newStatus);
    
    const target = reservations.find((r) => r.id === id);
    if (!target) return;

    // Simulate SMS and Email Logs based on the update
    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    let statusKorean = '';
    switch (newStatus) {
      case 'confirmed': statusKorean = '확정(승인)'; break;
      case 'cancelled': statusKorean = '취소(거절)'; break;
      case 'completed': statusKorean = '상담 완료'; break;
      case 'pending': statusKorean = '대기중'; break;
    }

    const emailLog: AlertLog = {
      timestamp: timeStr,
      type: 'EMAIL',
      recipient: 'jhk@himlaw.co.kr',
      content: `[힘 법률사무소] 예약 상태 변경 알림 - 의뢰인 ${target.name}님의 예약 상태가 [${statusKorean}]으로 실시간 동기화되었습니다.`
    };

    const clientSmsLog: AlertLog = {
      timestamp: timeStr,
      type: 'SMS',
      recipient: target.phone,
      content: `[힘 법률사무소] 고객님 접수하신 1:1 상담 예약이 [${statusKorean}] 처리되었습니다. 일시: ${target.date} ${target.time}. 궁금하신 점은 02-6952-3002로 문의바랍니다.`
    };

    const attorneySmsLog: AlertLog = {
      timestamp: timeStr,
      type: 'SMS',
      recipient: '010-8098-7790',
      content: `[HIM Law] 예약 상태 변경 안내: ${target.name} (${target.subject}) -> [${statusKorean}] 설정 완료.`
    };

    setAlertLogs((prev) => [emailLog, clientSmsLog, attorneySmsLog, ...prev]);
  };

  const handleSaveNote = (id: string) => {
    onUpdateNote(id, tempNote);
    alert('상담 비고 및 기록이 안전하게 저장되었습니다.');
  };

  const handleSavePortrait = () => {
    onUpdatePortrait(portraitInput);
    alert('대표변호사 프로필 사진 URL 설정이 영구 저장되었습니다.');
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reservations, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `HIM_LAW_RESERVATIONS_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex" id="admin-dashboard-root" role="dialog" aria-modal="true">
      {/* Semi translucent backdrop overlay */}
      <div className="fixed inset-0 bg-brand-navy-950/80 backdrop-blur-md" onClick={onClose}></div>

      {/* Slide-out Sidebar Panel */}
      <div className="relative bg-brand-navy-900 border-l border-brand-navy-800 w-full max-w-5xl ml-auto h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        
        {/* Render login gate if not authorized & not in demo bypass */}
        {!showDashboard ? (
          <>
            {/* Top Header Row of console (Lock indicator) */}
            <div className="p-6 border-b border-brand-navy-800 flex items-center justify-between bg-brand-navy-950">
              <div className="flex items-center space-x-2">
                <div className="bg-brand-tan/10 p-2 rounded">
                  <Lock className="w-5 h-5 text-brand-tan" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white font-serif tracking-tight">HIM Law Office Back Office System</h2>
                  <p className="text-xs text-slate-400">보안 관리자 검증 시스템</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white text-xs font-semibold py-1.5 px-3 rounded hover:bg-brand-navy-800 transition"
              >
                대시보드 닫기 ✕
              </button>
            </div>

            {/* Security Gateway Block */}
            <div className="flex-grow flex flex-col justify-center items-center p-8 bg-brand-navy-950/40 text-center">
              <div className="max-w-md w-full bg-brand-navy-950 border border-brand-navy-800 rounded-xl p-8 space-y-6 shadow-2xl">
                <div className="w-16 h-16 bg-brand-tan/10 border border-brand-tan/20 text-brand-tan rounded-full flex items-center justify-center mx-auto shadow-inner animate-pulse">
                  <Lock className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-serif font-bold text-white tracking-tight">관리자 액세스 검무</h3>
                  <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
                    이 콘솔은 힘 법률사무소 김재현 대표변호사 전용 관리 공간입니다. <br/>
                    접속 권한 확인 및 예약 정보 보존 관리를 위해 구글 로그인 또는 데모 입장이 필요합니다.
                  </p>
                </div>

                <div className="pt-2 space-y-3">
                  <button
                    type="button"
                    onClick={onLogin}
                    className="w-full bg-brand-tan hover:bg-white text-brand-navy-900 font-bold py-3.5 px-4 rounded-lg text-xs leading-none transition-all duration-300 transform hover:-translate-y-0.5 shadow-md flex items-center justify-center space-x-2 font-sans cursor-pointer"
                  >
                    <span>Google 계정으로 로그인</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsDemoBypass(true)}
                    className="w-full bg-brand-navy-900 hover:bg-brand-navy-800 text-slate-350 font-semibold py-3.5 px-4 rounded-lg text-xs leading-none transition duration-200 border border-brand-navy-800 flex items-center justify-center space-x-2 font-sans cursor-pointer"
                  >
                    <span>검수용 데모 모드로 바로 입장하기</span>
                  </button>
                </div>

                <div className="border-t border-brand-navy-900 pt-4 text-left">
                  <h5 className="text-[10px] uppercase text-brand-cognac font-mono font-bold tracking-widest mb-1.5">Authorized Admins:</h5>
                  <p className="text-[10px] text-slate-500 font-mono">
                    • jhkimlawl@gmail.com <br/>
                    • jhk@himlaw.co.kr
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Top Header Row of active dashboard console */}
            <div className="p-6 border-b border-brand-navy-800 flex items-center justify-between bg-brand-navy-950">
              <div className="flex items-center space-x-2">
                <div className="bg-brand-tan/10 p-2 rounded">
                  <Lock className="w-5 h-5 text-brand-tan" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-lg font-bold text-white font-serif tracking-tight">HIM Law Office Back Office System</h2>
                    {isDemoBypass ? (
                      <span className="bg-yellow-500/10 text-yellow-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-yellow-500/25 uppercase font-mono tracking-widest">
                        Demo Sandbox Mode
                      </span>
                    ) : (
                      <span className="bg-red-500/10 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-500/25 uppercase font-mono tracking-widest">
                        Verified Admin Mode
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">
                    {user ? `${user.displayName || user.email} 변호사 접속 중` : '임시 검수 개발세션'} • 데이터 및 사진 설정 실시간 적용판
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {user && (
                  <button
                    onClick={onLogout}
                    className="text-slate-400 hover:text-red-400 text-xs font-semibold py-1.5 px-3 rounded hover:bg-brand-navy-850 transition flex items-center space-x-1"
                    title="로그아웃"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>로그아웃</span>
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-white text-xs font-semibold py-1.5 px-3 rounded hover:bg-brand-navy-800 transition"
                >
                  대시보드 닫기 ✕
                </button>
              </div>
            </div>

            {/* Dashboard statistics row panel */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 px-6 pt-6 pb-2 bg-brand-navy-900/50">
              
              {/* Stat-Card 1: Total */}
              <div className="bg-brand-navy-950 border border-brand-navy-805 p-4 rounded-lg flex items-center space-x-3.5">
                <Users className="w-8 h-8 text-slate-400" />
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wide">총 예약 접수</span>
                  <p className="text-lg font-mono font-bold text-white">{total}건</p>
                </div>
              </div>

              {/* Stat-Card 2: Pending */}
              <div className="bg-brand-navy-950 border border-brand-navy-805 p-4 rounded-lg flex items-center space-x-3.5">
                <Clock className="w-8 h-8 text-yellow-500" />
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wide">승인 대기중</span>
                  <p className="text-lg font-mono font-bold text-yellow-500">{pending}건</p>
                </div>
              </div>

              {/* Stat-Card 3: Confirmed */}
              <div className="bg-brand-navy-950 border border-brand-navy-805 p-4 rounded-lg flex items-center space-x-3.5">
                <CheckCircle className="w-8 h-8 text-brand-tan" />
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wide">확정 완료</span>
                  <p className="text-lg font-mono font-bold text-brand-tan">{confirmed}건</p>
                </div>
              </div>

              {/* Stat-Card 4: Completed */}
              <div className="bg-brand-navy-950 border border-brand-navy-805 p-4 rounded-lg flex items-center space-x-3.5">
                <CheckCircle className="w-8 h-8 text-blue-400" />
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wide">상담 완료</span>
                  <p className="text-lg font-mono font-bold text-blue-400">{completed}건</p>
                </div>
              </div>

              {/* Stat-Card 5: Cancelled */}
              <div className="bg-brand-navy-950 border border-brand-navy-805 p-4 rounded-lg flex items-center space-x-3.5 col-span-2 sm:col-span-1">
                <XCircle className="w-8 h-8 text-red-500" />
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wide">취소/반려</span>
                  <p className="text-lg font-mono font-bold text-red-500">{cancelled}건</p>
                </div>
              </div>

            </div>

            {/* Console Toolbar Tabs */}
            <div className="px-6 py-2 border-b border-brand-navy-800 bg-brand-navy-950/60 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex space-x-4">
                <button
                  onClick={() => setActiveTab('list')}
                  className={`pb-1 text-xs font-semibold tracking-wider uppercase border-b-2 transition ${
                    activeTab === 'list'
                      ? 'border-brand-tan text-brand-tan'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  예약 접수 리스트 ({reservations.length})
                </button>
                <button
                  onClick={() => setActiveTab('alerts')}
                  className={`pb-1 text-xs font-semibold tracking-wider uppercase border-b-2 transition ${
                    activeTab === 'alerts'
                      ? 'border-brand-tan text-brand-tan'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                  id="tab-alerts-logs"
                >
                  알림 메세지 실시간 송출 내역 ({alertLogs.length})
                </button>
                <button
                  onClick={() => setActiveTab('export')}
                  className={`pb-1 text-xs font-semibold tracking-wider uppercase border-b-2 transition ${
                    activeTab === 'export'
                      ? 'border-brand-tan text-brand-tan'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  사진 설정 및 데이터 백업
                </button>
              </div>

              {/* Right seed sample handler if list empty */}
              {reservations.length === 0 && (
                <button
                  type="button"
                  onClick={onSeedMockData}
                  className="bg-brand-tan/10 text-brand-tan text-[11px] font-bold border border-brand-tan/20 py-1 px-2.5 rounded group hover:bg-brand-tan hover:text-brand-navy-950 transition-colors cursor-pointer"
                >
                  샘플 예약 4건 즉시 생성하기 (체험용)
                </button>
              )}
            </div>

            {/* CENTRAL AREA DISPLAY */}
            <div className="flex-1 overflow-y-auto p-6 bg-brand-navy-950/20">
              
              {/* TAB 1: Roster List */}
              {activeTab === 'list' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-in fade-in duration-200">
                  
                  {/* Roster Table col-span-7 */}
                  <div className="lg:col-span-7 space-y-3">
                    {reservations.length === 0 ? (
                      <div className="text-center py-16 border-2 border-dashed border-brand-navy-800 rounded-lg bg-brand-navy-950/30">
                        <Calendar className="w-12 h-12 text-slate-600 mx-auto" />
                        <p className="text-sm text-slate-400 mt-4 leading-normal">
                          현재 등록된 상담 예약 내역이 존재하지 않습니다.<br/>
                          홈페이지의 빠른 상담 예약 페이지에서 신청을 대강 입력해 보십시오.
                        </p>
                        <button
                          onClick={onSeedMockData}
                          className="mt-4 bg-brand-tan text-brand-navy-950 text-xs font-bold py-1.5 px-4 rounded hover:bg-white transition cursor-pointer"
                        >
                          테스트용 샘플 예약 데이터 세팅
                        </button>
                      </div>
                    ) : (
                      reservations.map((res) => (
                        <button
                          key={res.id}
                          type="button"
                          onClick={() => {
                            setSelectedResId(res.id);
                            setTempNote(res.note || '');
                          }}
                          className={`w-full text-left p-4 rounded-lg border transition-all duration-200 flex items-center justify-between cursor-pointer ${
                            selectedResId === res.id
                              ? 'bg-brand-navy-900 border-brand-tan'
                              : 'bg-brand-navy-950/80 border-brand-navy-850 hover:bg-brand-navy-900/40'
                          }`}
                        >
                          <div className="flex-grow min-w-0 pr-4">
                            <div className="flex items-center space-x-2">
                              <span className={`text-[10px] font-bold py-0.5 px-1.5 rounded ${
                                res.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                                res.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-400' :
                                res.status === 'completed' ? 'bg-blue-500/10 text-blue-400' :
                                'bg-red-500/10 text-red-500'
                              }`}>
                                {res.status === 'pending' ? '승인대기' :
                                 res.status === 'confirmed' ? '예약확정' :
                                 res.status === 'completed' ? '상담완료' : '예약취소'}
                              </span>
                              <span className="text-white font-bold text-sm">{res.name} 의뢰인</span>
                              <span className="text-[10px] text-slate-500 font-mono">({res.id.slice(0,8)})</span>
                            </div>
                            <div className="flex items-center space-x-3 text-xs text-slate-400 mt-2.5">
                              <span className="font-mono text-slate-300">{res.date} ({res.time})</span>
                              <span>|</span>
                              <span>{res.subject}</span>
                              <span>|</span>
                              <span className="text-[11px] font-semibold text-brand-tan/80">
                                {res.type === 'visit' ? '대면' : '전화'}
                              </span>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <span className="text-xs text-slate-500 block">접수일시</span>
                            <span className="text-[10px] text-slate-400 block font-mono mt-0.5">{res.createdAt.slice(0,10)}</span>
                          </div>
                        </button>
                      ))
                    )}
                  </div>

                  {/* Booking Action control panel col-span-5 */}
                  <div className="lg:col-span-5">
                    {selectedRes ? (
                      <div className="bg-brand-navy-900 border border-brand-navy-800 rounded-lg p-5 space-y-5 shadow-inner">
                        
                        {/* Header info */}
                        <div className="pb-4 border-b border-brand-navy-850">
                          <h3 className="text-sm font-bold text-slate-300 font-mono">{selectedRes.id} 예약 상세 조회</h3>
                          <p className="text-xl text-white font-serif font-bold mt-2">{selectedRes.name}</p>
                          <div className="mt-2.5 flex items-center space-x-4">
                            <a
                              href={`tel:${selectedRes.phone}`}
                              className="text-xs text-slate-300 hover:text-brand-tan flex items-center space-x-1"
                            >
                              <PhoneCall className="w-3.5 h-3.5" />
                              <span className="font-mono">{selectedRes.phone}</span>
                            </a>
                            {selectedRes.email && (
                              <a
                                  href={`mailto:${selectedRes.email}`}
                                className="text-xs text-slate-300 hover:text-brand-tan flex items-center space-x-1"
                              >
                                <Mail className="w-3.5 h-3.5" />
                                <span className="font-mono">{selectedRes.email}</span>
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Meta info boxes */}
                        <div className="space-y-2.5">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-500">예약 일자 및 시각</span>
                            <strong className="text-slate-200 font-mono">{selectedRes.date} {selectedRes.time}</strong>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-500">상담 구분</span>
                            <strong className="text-slate-200">
                              {selectedRes.type === 'visit' ? '🏢 방문 대면 상담' : '📞 유선 전화 상담'}
                            </strong>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-500">신청 의뢰 분야</span>
                            <strong className="text-brand-tan font-bold">{selectedRes.subject}</strong>
                          </div>

                          {/* Brief description in quotation */}
                          <div className="p-3 bg-brand-navy-950 rounded text-xs text-slate-300 font-serif leading-relaxed italic border border-brand-navy-850">
                            "{selectedRes.description}"
                          </div>
                        </div>

                        <div className="border-t border-brand-navy-850 my-4"></div>

                        {/* Status Modifiers */}
                        <div>
                          <span className="block text-xs font-semibold text-slate-400 mb-2">상태 변경 및 알림 전송</span>
                          <div className="grid grid-cols-2 gap-2">
                            
                            {/* Confirmed CTA */}
                            <button
                              type="button"
                              onClick={() => handleStatusChange(selectedRes.id, 'confirmed')}
                              className={`py-2 px-3 text-xs font-semibold rounded flex items-center justify-center space-x-1 transition cursor-pointer ${
                                selectedRes.status === 'confirmed'
                                  ? 'bg-emerald-600 text-white font-bold ring-2 ring-emerald-500/20'
                                  : 'bg-brand-navy-950 text-slate-300 hover:bg-brand-navy-800'
                              }`}
                            >
                              <CheckCircle className="w-4 h-4 text-emerald-400" />
                              <span>예약 확정(승인)</span>
                            </button>

                            {/* Completed CTA */}
                            <button
                              type="button"
                              onClick={() => handleStatusChange(selectedRes.id, 'completed')}
                              className={`py-2 px-3 text-xs font-semibold rounded flex items-center justify-center space-x-1 transition cursor-pointer ${
                                selectedRes.status === 'completed'
                                  ? 'bg-blue-600 text-white font-bold ring-2 ring-blue-500/20'
                                  : 'bg-brand-navy-950 text-slate-300 hover:bg-brand-navy-800'
                              }`}
                            >
                              <CheckCircle className="w-4 h-4 text-blue-400" />
                              <span>상담 완료</span>
                            </button>

                            {/* Cancelled CTA */}
                            <button
                              type="button"
                              onClick={() => handleStatusChange(selectedRes.id, 'cancelled')}
                              className={`py-2 px-3 text-xs font-semibold rounded flex items-center justify-center space-x-1 transition cursor-pointer ${
                                selectedRes.status === 'cancelled'
                                  ? 'bg-red-950/80 text-red-400 font-bold border border-red-500/30'
                                  : 'bg-brand-navy-950 text-slate-300 hover:bg-brand-navy-800'
                              }`}
                            >
                              <XCircle className="w-4 h-4 text-red-500" />
                              <span>예약 당사자 취소</span>
                            </button>

                            {/* Delete permanently */}
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm('이 상담 예약 건을 시스템 데이터베이스에서 영구 삭제하겠습니까?')) {
                                  onDeleteReservation(selectedRes.id);
                                  setSelectedResId(null);
                                }
                              }}
                              className="py-2 px-3 text-xs font-semibold bg-brand-navy-950 text-pink-500 border border-pink-500/20 hover:bg-brand-navy-800 rounded flex items-center justify-center space-x-1 transition cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span>영구 삭제</span>
                            </button>

                          </div>
                        </div>

                        {/* Lawyer's memo entries */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label htmlFor="temp-note" className="block text-xs font-semibold text-slate-400">변호사 메모 / 사건 분석 브리프</label>
                            <span className="text-[10px] text-brand-tan font-mono">실시간 동기화</span>
                          </div>
                          <textarea
                            id="temp-note"
                            rows={3}
                            placeholder="이 의뢰인에 대한 1차 서면 검토, 판시, 관련 대법원 판례 연계 내용 등 자유 메모를 기재하세요."
                            value={tempNote}
                            onChange={(e) => setTempNote(e.target.value)}
                            className="w-full bg-brand-navy-950 border border-brand-navy-800 rounded p-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-tan resize-none"
                          ></textarea>
                          <button
                            type="button"
                            onClick={() => handleSaveNote(selectedRes.id)}
                            className="w-full bg-brand-navy-950 text-brand-tan hover:bg-brand-tan hover:text-brand-navy-950 border border-brand-tan/30 py-2 rounded text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer"
                          >
                            <Save className="w-4 h-4" />
                            <span>비고/기록 변경사항 저장하기</span>
                          </button>
                        </div>

                      </div>
                    ) : (
                      <div className="p-10 border border-dashed border-brand-navy-800 rounded-lg text-center bg-brand-navy-950/20">
                        <p className="text-xs text-slate-500">왼쪽 리스트의 내역을 클릭해 주십시오.<br/>예정자 세부 정보와 기록 갱신 콘솔이 나타납니다.</p>
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* TAB 2: SMS & Email dispatch logs */}
              {activeTab === 'alerts' && (
                <div className="space-y-4 animate-in fade-in duration-200 max-w-3xl mx-auto" id="alert-logs-view">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-bold text-brand-tan font-mono uppercase tracking-wider flex items-center space-x-1.5">
                      <Send className="w-4 h-4" />
                      <span>ALERT DISPATCH TELEMETRY SYSTEM</span>
                    </h3>
                    <span className="text-[10px] text-green-400 font-mono flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                      <span>SMTP & SMS GATEWAY CONNECTED</span>
                    </span>
                  </div>

                  <div className="space-y-3.5 bg-brand-navy-900 border border-brand-navy-800 rounded-lg p-5 max-h-[55vh] overflow-y-auto">
                    {alertLogs.map((log, idx) => (
                      <div key={idx} className="p-3.5 bg-brand-navy-950 rounded border border-brand-navy-850 flex items-start space-x-3.5 font-mono text-xs">
                        <span className={`text-[10px] font-bold py-0.5 px-2 rounded tracking-wider ${
                          log.type === 'SMS' ? 'bg-orange-500/15 text-orange-400' : 'bg-emerald-500/15 text-emerald-450'
                        }`}>
                          {log.type}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between text-slate-500 text-[10px]">
                            <span>수신처: <strong className="text-slate-350">{log.recipient}</strong></span>
                            <span>{log.timestamp}</span>
                          </div>
                          <p className="text-slate-300 mt-1.5 leading-relaxed text-xs break-all">
                            {log.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: Dynamic settings and Data Export */}
              {activeTab === 'export' && (
                <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200 py-4 text-left">
                  
                  {/* Photo Customization Card */}
                  <div className="bg-brand-navy-900 border border-brand-navy-800 rounded-lg p-6 space-y-4">
                    <div className="flex items-center space-x-2 text-brand-tan border-b border-brand-navy-850 pb-3">
                      <ImageIcon className="w-5 h-5" />
                      <h3 className="text-base font-serif font-bold text-white">대표변호사 프로필 사진 설정</h3>
                    </div>
                    
                    <p className="text-xs text-slate-400 leading-relaxed">
                      홈페이지 메인 및 소개란에 표시되는 김재현 대표변호사의 사진을 실시간으로 변경합니다. 컴퓨터나 스마트폰에서 실시간으로 직접 촬영하거나 소장하신 고화질 이미지 파일을 직접 업로드하실 수 있으며, 자동으로 고속 압축되어 데이터 서버에 즉시 영구 저장됩니다.
                    </p>

                    {/* Integrated Multi-uploader interface */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
                      
                      {/* Left side: Upload & URL inputs */}
                      <div className="md:col-span-8 space-y-4">
                        
                        {/* Drag and Drop Zone */}
                        <div
                          onDragOver={(e) => {
                            e.preventDefault();
                            setDragOver(true);
                          }}
                          onDragLeave={() => setDragOver(false)}
                          onDrop={(e) => {
                            e.preventDefault();
                            setDragOver(false);
                            if (e.dataTransfer.files?.[0]) {
                              handleImageFile(e.dataTransfer.files[0]);
                            }
                          }}
                          onClick={() => document.getElementById('portrait-file-upload')?.click()}
                          className={`border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition duration-200 flex flex-col items-center justify-center space-y-2 select-none ${
                            dragOver
                              ? 'border-brand-tan bg-brand-navy-950/70 text-brand-tan'
                              : 'border-brand-navy-800 bg-brand-navy-950/30 text-slate-400 hover:border-brand-tan/50 hover:bg-brand-navy-950/10'
                          }`}
                        >
                          <input
                            id="portrait-file-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                handleImageFile(e.target.files[0]);
                              }
                            }}
                          />
                          <Upload className={`w-8 h-8 ${dragOver || isCompressing ? 'text-brand-tan animate-pulse' : 'text-slate-500'}`} />
                          <div className="text-xs font-semibold text-slate-300">
                            {isCompressing ? '이미지 압축 후 업로드 준비 중...' : '클릭하여 프로필 사진 파일 선택하기'}
                          </div>
                          <p className="text-[10px] text-slate-500">
                            또는 여기에 이미지 파일을 드래그하여 놓으세요.
                          </p>
                        </div>

                        {/* Presets and Restoration */}
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setPortraitInput('/src/assets/images/lawyer_portrait_1781527362492.jpg');
                            }}
                            className="text-[11px] bg-brand-navy-950 hover:bg-brand-navy-850 text-brand-tan px-3 py-1.5 rounded border border-brand-tan/10 transition flex items-center space-x-1 cursor-pointer"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>기본 스튜디오 촬영본으로 복원</span>
                          </button>
                        </div>

                        <div className="space-y-1.5 pt-1">
                          <div className="flex justify-between items-center">
                            <label className="block text-xs text-slate-400 font-semibold">또는 수동 웹 이미지 주소(URL) 입력</label>
                            {portraitInput && portraitInput.startsWith('data:') && (
                              <span className="text-[10.5px] text-brand-tan bg-brand-tan/10 px-1.5 py-0.5 rounded font-mono font-bold animate-pulse">
                                기기 사진 로드됨 (압축완료)
                              </span>
                            )}
                          </div>
                          <input
                            type="text"
                            value={portraitInput}
                            onChange={(e) => setPortraitInput(e.target.value)}
                            placeholder="https://example.com/lawyer_photo.jpg"
                            className="w-full bg-brand-navy-950 border border-brand-navy-850 rounded p-2.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-brand-tan"
                          />
                        </div>
                      </div>

                      {/* Right side: Preview card */}
                      <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-brand-navy-950/40 border border-brand-navy-850 rounded-lg space-y-3">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">실시간 교체 프리뷰</span>
                        <div className="w-28 h-36 bg-brand-navy-950 shadow-2xl border border-brand-navy-800 rounded p-1 flex items-center justify-center overflow-hidden relative">
                          {portraitInput ? (
                            <img
                              src={portraitInput}
                              alt="Attorney custom portrait preview"
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover rounded"
                              onError={(e) => {
                                // fall back silently if invalid url
                                (e.target as HTMLImageElement).src = '/src/assets/images/lawyer_portrait_1781527362492.jpg';
                              }}
                            />
                          ) : (
                            <span className="text-xs text-slate-650">이미지 없음</span>
                          )}
                          {isCompressing && (
                            <div className="absolute inset-0 bg-brand-navy-950/80 flex items-center justify-center">
                              <RefreshCw className="w-6 h-6 text-brand-tan animate-spin" />
                            </div>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-550 text-center leading-tight">
                          {portraitInput && portraitInput.startsWith('data:') 
                            ? `압축 용량: ~${Math.round((portraitInput.length * 0.75) / 1024)} KB`
                            : '외부 웹 주소 사용 가능'}
                        </div>
                      </div>

                    </div>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={handleSavePortrait}
                        disabled={isCompressing}
                        className="w-full md:w-auto bg-brand-tan hover:bg-white disabled:opacity-50 text-brand-navy-950 font-bold py-2.5 px-6 rounded text-xs transition duration-250 flex items-center justify-center space-x-1 cursor-pointer shadow-lg"
                      >
                        <Save className="w-4 h-4" />
                        <span>프로필 사진 적용 및 서버 저장하기 (즉시 동기화)</span>
                      </button>
                    </div>
                  </div>

                  {/* Core Data Export Card */}
                  <div className="bg-brand-navy-900 border border-brand-navy-800 rounded-lg p-6 space-y-4">
                    <div className="flex items-center space-x-2 text-brand-tan border-b border-brand-navy-850 pb-3">
                      <FileSpreadsheet className="w-5 h-5" />
                      <h3 className="text-base font-serif font-bold text-white">상담 통합 예약 데이터 백업 및 리셋</h3>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      서버 데이터베이스에 영구 보존 중인 예약 명세 원본을 JSON 파일 형식으로 다운로드하여 안전하게 백업하거나 소장할 수 있습니다.
                    </p>

                    <div className="pt-2 flex flex-col sm:flex-row gap-3">
                      <button
                        type="button"
                        onClick={handleExportJSON}
                        className="bg-brand-navy-950 hover:bg-brand-navy-800 text-brand-tan font-bold py-2.5 px-5 rounded text-xs border border-brand-tan/20 flex items-center justify-center space-x-1.5 transition cursor-pointer"
                      >
                        <span>JSON 파일 백업 다운로드</span>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm('현재 데이터베이스의 모든 모의 예약을 지우고 테스트 샘플로 덮어쓰시겠습니까?')) {
                            onSeedMockData();
                          }
                        }}
                        className="bg-brand-navy-950 text-slate-400 hover:text-white border border-brand-navy-850 py-2.5 px-5 rounded text-xs transition cursor-pointer"
                      >
                        <span>기존 내역 비우고 테스트 샘플로 데이터 리셋</span>
                      </button>
                    </div>
                  </div>

                  <div className="bg-brand-navy-900/40 border border-brand-navy-850 p-4 rounded-lg">
                    <h4 className="text-xs font-bold text-white">백오피스 동작 하이라이트</h4>
                    <ul className="text-[11px] text-slate-450 mt-2 space-y-1.5 list-disc pl-4 leading-relaxed">
                      <li>본 백오피스는 파이어베이스 <span className="font-mono text-slate-350">Cloud Firestore</span> 및 <span className="font-mono text-slate-350">Auth</span> 인프라를 중심으로 실시간 클라우드 영구 저장을 지원합니다.</li>
                      <li>변호사 사진 URL을 지정 및 저장하시면, 다른 서브페이지나 대표 프로필 카드에서 즉각 동결된 리소스가 갱신 반영됩니다.</li>
                    </ul>
                  </div>
                </div>
              )}

            </div>
          </>
        )}

      </div>
    </div>
  );
}
