/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ConsultationType = 'visit' | 'phone';

export type ReservationStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Reservation {
  id: string;
  name: string;
  phone: string;
  email?: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  type: ConsultationType;
  subject: string;
  description: string;
  createdAt: string;
  status: ReservationStatus;
  note?: string;
}

export interface PracticeArea {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  isMain: boolean;
  description: string;
  details: string[];
}

export interface CaseStudy {
  id: string;
  category: string;
  title: string;
  summary: string;
  facts: string;
  strategy: string;
  result: string;
  date: string;
}

export interface LegalColumn {
  id: string;
  category: string;
  title: string;
  summary: string;
  content: string;
  date: string;
  readTime: string;
}
