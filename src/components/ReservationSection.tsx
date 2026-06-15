/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Phone, Users, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { Reservation, ConsultationType } from '../types';

interface ReservationSectionProps {
  reservations: Reservation[];
  onAddReservation: (newRes: Reservation) => void;
  selectedSubject: string;
}

export default function ReservationSection({
  reservations,
  onAddReservation,
  selectedSubject,
}: ReservationSectionProps) {
  // Input states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [type, setType] = useState<ConsultationType>('visit');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  // Calendar states
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // 0-based
  const [selectedDateStr, setSelectedDateStr] = useState<string>(''); // YYYY-MM-DD
  const [selectedTime, setSelectedTime] = useState<string>('');

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [recentBooking, setRecentBooking] = useState<Reservation | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle autofill when selectedSubject changes
  useState(() => {
    if (selectedSubject) {
      setSubject(selectedSubject);
    }
  });

  // Sync state if selectedSubject changes in parent
  useState(() => {
    setSubject(selectedSubject);
  });

  // Days in month calculation
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay(); // 0 is Sunday, 1 is Monday ...
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayIndex = getFirstDayOfMonth(currentYear, currentMonth);

  const monthNames = [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
  ];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Time Slots
  const timeSlots = [
    '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  // Check if slot in YYYY-MM-DD is booked
  const isTimeSlotBooked = (dateStr: string, timeStr: string) => {
    return reservations.some(
      (res) => res.date === dateStr && res.time === timeStr && res.status !== 'cancelled'
    );
  };

  const dayCells = [];
  // Blank padding cells
  for (let i = 0; i < firstDayIndex; i++) {
    dayCells.push(<div key={`empty-${i}`} className="h-10"></div>);
  }

  // Active Days
  for (let day = 1; day <= daysInMonth; day++) {
    const cellDate = new Date(currentYear, currentMonth, day);
    const dayOfWeek = cellDate.getDay();
    const isPast = cellDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const isSunday = dayOfWeek === 0;
    const isSaturday = dayOfWeek === 6;

    // Format target day string helper
    const monthFormatted = String(currentMonth + 1).padStart(2, '0');
    const dayFormatted = String(day).padStart(2, '0');
    const dateQueryStr = `${currentYear}-${monthFormatted}-${dayFormatted}`;

    const isSelected = selectedDateStr === dateQueryStr;

    // Display state
    let cellClass = "h-10 flex items-center justify-center text-xs font-semibold rounded-full cursor-pointer transition-all duration-200 ";
    let cellDisabled = false;

    if (isPast || isSunday) {
      cellClass += "text-slate-600 cursor-not-allowed hover:bg-transparent ";
      cellDisabled = true;
    } else if (isSelected) {
      cellClass += "bg-brand-tan text-brand-navy-950 font-bold shadow-md scale-105 ";
    } else {
      if (isSaturday) {
        cellClass += "text-blue-400 hover:bg-brand-navy-800/80 ";
      } else {
        cellClass += "text-slate-200 hover:bg-brand-navy-800/80 ";
      }
    }

    const selectDateCell = () => {
      if (cellDisabled) return;
      setSelectedDateStr(dateQueryStr);
      setSelectedTime(''); // Reset time on date switch
    };

    dayCells.push(
      <button
        key={`day-${day}`}
        type="button"
        disabled={cellDisabled}
        onClick={selectDateCell}
        className={cellClass}
      >
        {day}
      </button>
    );
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDateStr) {
      setErrorMessage('예약하실 상담 날짜를 달력에서 클릭해 주세요.');
      return;
    }
    if (!selectedTime) {
      setErrorMessage('예약하실 상담 시간을 아래 시간표에서 선택해 주세요.');
      return;
    }
    if (!name.trim()) {
      setErrorMessage('의뢰인의 성명을 입력해 주세요.');
      return;
    }
    const phoneClean = phone.replace(/[^0-9]/g, '');
    if (phoneClean.length < 9) {
      setErrorMessage('올바른 연락처 번호를 입력해 주세요.');
      return;
    }

    setErrorMessage('');

    // Generate real appointment
    const newReservation: Reservation = {
      id: `HIM-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      date: selectedDateStr,
      time: selectedTime,
      type,
      subject: subject.trim() || '일반 법률 상담',
      description: description.trim() || '변호사 직접 상담 검토 요청',
      createdAt: new Date().toISOString(),
      status: 'pending',
    };

    onAddReservation(newReservation);
    setRecentBooking(newReservation);
    setFormSubmitted(true);

    // Reset fields
    setName('');
    setPhone('');
    setEmail('');
    setDescription('');
    setSelectedDateStr('');
    setSelectedTime('');
  };

  const handleResetForm = () => {
    setFormSubmitted(false);
    setRecentBooking(null);
  };

  return (
    <section id="reservation" className="py-24 bg-brand-navy-950 relative border-t border-brand-navy-900">
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-brand-terracotta/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Block */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-brand-tan font-mono uppercase tracking-widest text-xs font-bold">RESERVATION SYSTEM</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-serif font-semibold tracking-tight text-white leading-snug">
            10초 간결하고 신속한 실시간 상담 예약
          </h2>
          <div className="mt-4 h-1 w-12 bg-brand-tan mx-auto"></div>
          <p className="mt-5 text-slate-200 text-sm sm:text-base leading-relaxed tracking-tight">
            복잡한 공인인증서 없이, 원하는 날짜와 시간을 선택 후 간단 사건 개요를 넘기시면 대표변호사의 일정 검토를 거쳐 확정 문자 및 접수 요강이 발송됩니다.
          </p>
        </div>

        {formSubmitted && recentBooking ? (
          /* SUCCESS STATE PANEL */
          <div className="max-w-xl mx-auto bg-brand-navy-900 border border-brand-tan/40 p-8 rounded-lg shadow-2xl text-center animate-in fade-in zoom-in-95 duration-300" id="reservation-success-panel">
            <CheckCircle className="w-16 h-16 text-brand-tan mx-auto mb-6" />
            <h3 className="text-2xl font-serif font-bold text-white">상담 예약 접수 완료</h3>
            <p className="text-slate-300 text-sm mt-3 leading-relaxed">
              의뢰인 <strong className="text-brand-tan font-medium">{recentBooking.name}</strong>님의 법률 상담 일정이 정상 예약 신청되었습니다.
            </p>

            {/* Recipt list */}
            <div className="my-6 p-4 bg-brand-navy-950 rounded text-left border border-brand-navy-800 space-y-2.5">
              <div className="flex justify-between text-xs text-slate-400">
                <span>상담 고유 번호</span>
                <span className="font-mono font-medium text-slate-200">{recentBooking.id}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>예정 일자</span>
                <span className="font-mono font-medium text-slate-200">{recentBooking.date}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>예정 시간</span>
                <span className="font-mono text-brand-tan font-bold">{recentBooking.time}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>상담 종류</span>
                <span className="text-slate-200">
                  {recentBooking.type === 'visit' ? '🏢 방문 대면 상담' : '📞 1:1 유선 전화 상담'}
                </span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>신청 분야</span>
                <span className="text-slate-200">{recentBooking.subject}</span>
              </div>
            </div>

            {/* Simulated alert delivery logs widget */}
            <div className="mt-4 p-3 bg-brand-tan/5 border border-brand-tan/10 rounded text-left">
              <h4 className="text-[11px] font-bold text-brand-tan font-mono uppercase flex items-center space-x-1">
                <Sparkles className="w-3 h-3" />
                <span>REAL-TIME SMS/EMAIL LOG SYSTEM</span>
              </h4>
              <p className="text-[10px] text-slate-400 mt-1 leading-snug">
                예약 원본이 변호사 지정 수신처로 전송되었습니다: <br/>
                📬 이메일 접수: <span className="font-mono text-white">jhk@himlaw.co.kr</span><br/>
                📱 변호사 문자 발송: <span className="font-mono text-white">010-8098-7790</span>
              </p>
            </div>

            <p className="text-xs text-slate-400 mt-5 leading-normal">
              * 대표변호사 일과 조율 후 30분 이내에 확정 승인 알림 카카오톡 메시지가 등록된 전화번호로 수신됩니다. 긴급 상담인 경우 법률사무소 직통전화(<span className="font-mono text-white">02-6952-3002</span>)로 즉시 연락 바랍니다.
            </p>

            <button
              onClick={handleResetForm}
              className="mt-8 w-full bg-brand-navy-800 hover:bg-brand-navy-700 text-slate-300 hover:text-white py-2.5 rounded font-semibold text-xs transition-colors"
            >
              새 예약 추가로 잡기
            </button>
          </div>
        ) : (
          /* RESERVATION FORM & CALENDAR SECTIONS */
          <form onSubmit={handleFormSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" id="reservation-form">
            
            {/* Left: Beautiful Calendar & Slots */}
            <div className="lg:col-span-5 bg-brand-navy-900 border border-brand-navy-850 p-5 rounded-lg shadow-xl">
              
              {/* Header inside calendar */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <CalendarIcon className="w-4.5 h-4.5 text-brand-tan" />
                  <span>상담 일시 선택</span>
                </h3>
                
                {/* Month switch links */}
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={handlePrevMonth}
                    className="p-1 hover:bg-brand-navy-800 rounded text-slate-400 hover:text-white transition-colors"
                  >
                    &lt;
                  </button>
                  <span className="text-xs font-mono text-brand-tan font-bold">
                    {currentYear}년 {monthNames[currentMonth]}
                  </span>
                  <button
                    type="button"
                    onClick={handleNextMonth}
                    className="p-1 hover:bg-brand-navy-800 rounded text-slate-400 hover:text-white transition-colors"
                  >
                    &gt;
                  </button>
                </div>
              </div>

              {/* Day of Week labels */}
              <div className="grid grid-cols-7 text-center mb-2">
                {['일', '월', '화', '수', '목', '금', '토'].map((d, id) => (
                  <span
                    key={id}
                    className={`text-[10px] font-bold ${
                      id === 0 ? 'text-red-500' : id === 6 ? 'text-blue-400' : 'text-slate-400'
                    }`}
                  >
                    {d}
                  </span>
                ))}
              </div>

              {/* Days dynamic grid */}
              <div className="grid grid-cols-7 gap-y-1 gap-x-1 mb-6">
                {dayCells}
              </div>

              {/* Time Slots Area */}
              <div className="border-t border-brand-navy-800 pt-5">
                <h4 className="text-xs font-bold text-slate-300 flex items-center space-x-1.5 mb-3.5">
                  <Clock className="w-4 h-4 text-brand-tan" />
                  <span>예약 가능 시간 선택 {selectedDateStr && `(${selectedDateStr})`}</span>
                </h4>

                {selectedDateStr ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {timeSlots.map((time) => {
                      const taken = isTimeSlotBooked(selectedDateStr, time);
                      const isTimeSelected = selectedTime === time;

                      let btnStyle = "py-2 text-xs font-semibold rounded text-center transition-all duration-200 ";

                      if (taken) {
                        btnStyle += "bg-brand-navy-950 text-slate-600 cursor-not-allowed border border-dashed border-brand-navy-850 ";
                      } else if (isTimeSelected) {
                        btnStyle += "bg-brand-terracotta text-white font-bold ring-2 ring-brand-terracotta/40 ";
                      } else {
                        btnStyle += "bg-brand-navy-950 text-slate-300 border border-brand-navy-800 hover:border-brand-tan/50 hover:text-brand-tan ";
                      }

                      return (
                        <button
                          key={time}
                          type="button"
                          disabled={taken}
                          onClick={() => setSelectedTime(time)}
                          className={btnStyle}
                        >
                          <span className="block">{time}</span>
                          {taken && <span className="text-[9px] font-medium text-red-500/80 block leading-none">예약불가</span>}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-4 text-center rounded bg-brand-navy-950/40 border border-brand-navy-850/60">
                    <p className="text-xs text-slate-500 leading-normal">
                      달력에서 예약 가능한 일자를 먼저 클릭하시면 <br/> 해당일 시간표가 가동됩니다.
                    </p>
                  </div>
                )}
              </div>

            </div>

            {/* Right: Form block */}
            <div className="lg:col-span-7 bg-brand-navy-900 border border-brand-navy-850 p-6 sm:p-8 rounded-lg shadow-xl">
              
              <div className="mb-6">
                <h3 className="text-base text-white font-semibold">의뢰서 정보 입력</h3>
                <p className="text-slate-300 text-xs sm:text-sm mt-1">
                  작성해주신 기초 내용을 기반으로 김재현 변호사가 1차 서면 법리 분석을 검토한 후 상담에 착수합니다.
                </p>
              </div>

              {/* Consultation Type Selector cards */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                
                {/* Type Visit */}
                <button
                  type="button"
                  onClick={() => setType('visit')}
                  className={`p-3 rounded border text-left flex flex-col justify-between transition-all ${
                    type === 'visit'
                      ? 'bg-brand-tan/5 border-brand-tan text-brand-tan ring-1 ring-brand-tan/20'
                      : 'bg-brand-navy-950 border-brand-navy-800 text-slate-300 hover:border-slate-750'
                  }`}
                >
                  <Users className="w-5 h-5 mb-2" />
                  <span className="text-xs font-bold block">대면 방문 상담</span>
                  <span className="text-[10px] text-slate-300 block mt-0.5">사무실 방문대면</span>
                </button>

                {/* Type Phone */}
                <button
                  type="button"
                  onClick={() => setType('phone')}
                  className={`p-3 rounded border text-left flex flex-col justify-between transition-all ${
                    type === 'phone'
                      ? 'bg-brand-tan/5 border-brand-tan text-brand-tan ring-1 ring-brand-tan/20'
                      : 'bg-brand-navy-950 border-brand-navy-800 text-slate-300 hover:border-slate-755'
                  }`}
                >
                  <Phone className="w-5 h-5 mb-2" />
                  <span className="text-xs font-bold block">유선 전화 상담</span>
                  <span className="text-[10px] text-slate-300 block mt-0.5">전화로 간편상담</span>
                </button>

              </div>

              <div className="space-y-4">
                
                {/* Grid name & phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-100 mb-1.5" htmlFor="input-name">
                      성명 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="input-name"
                      placeholder="김의뢰"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-brand-navy-950 border border-brand-navy-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-tan"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-100 mb-1.5" htmlFor="input-phone">
                      연락처 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="input-phone"
                      placeholder="010-1234-5678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-brand-navy-950 border border-brand-navy-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-tan"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-100 mb-1.5" htmlFor="input-email">
                      이메일 <span className="text-slate-400">(선택)</span>
                    </label>
                    <input
                      type="email"
                      id="input-email"
                      placeholder="client@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-brand-navy-950 border border-brand-navy-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-tan"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-100 mb-1.5" htmlFor="input-subject">
                      사건 상담 분야 <span className="text-slate-400">(선택)</span>
                    </label>
                    <input
                      type="text"
                      id="input-subject"
                      placeholder="예: 부동산 빌라 대금, 임대차 분쟁, 보증금 등"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-brand-navy-950 border border-brand-navy-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-tan"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-100 mb-1.5" htmlFor="input-desc">
                    사건 내용 요약 / 요청 사항 <span className="text-slate-400">(선택)</span>
                  </label>
                  <textarea
                    id="input-desc"
                    rows={4}
                    placeholder="사건이 발생한 일시, 핵심 분쟁 내용 및 계약 사항 등에 대해 기재해 주시면 보다 정확한 기초 법리 검토가 가능합니다."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-brand-navy-950 border border-brand-navy-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-tan resize-none"
                  ></textarea>
                </div>

                {/* Live error alerts */}
                {errorMessage && (
                  <div className="p-3 bg-red-950/40 border border-red-500/30 rounded flex items-center space-x-2 text-red-400 text-xs text-left" id="reservation-error-alert">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Dynamic selected slot disclaimer */}
                {selectedDateStr && selectedTime && (
                  <div className="p-3 bg-brand-tan/10 border border-brand-tan/20 rounded text-xs text-left text-slate-300">
                    📅 선택 일정: <strong className="text-white">{selectedDateStr}일 {selectedTime}분</strong> 상담 신청 대기 중
                  </div>
                )}

                {/* Form submit btn in Terracotta color as requested */}
                <button
                  type="submit"
                  id="btn-reservation-submit"
                  className="w-full bg-brand-terracotta hover:bg-brand-terracotta-hover text-white py-3.5 rounded font-bold text-sm tracking-widest shadow-lg transition-transform duration-200 active:scale-95 flex items-center justify-center space-x-2 cursor-pointer leading-none"
                >
                  <span>원하는 시간에 빠른 상담 최종 신청하기</span>
                </button>

              </div>

            </div>
          </form>
        )}

      </div>
    </section>
  );
}
