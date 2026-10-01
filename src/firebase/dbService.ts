// src/firebase/dbService.ts
// Firestore CRUD helpers for medical reports, saved analyses, and user data

import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from './config';
import type { MedicalReport, SymptomAnalysisResult } from '../types';

// ─── Types ───────────────────────────────────────────────────────────────────
export interface SavedReport {
  id: string;
  userId: string;
  report: MedicalReport;
  savedAt: Timestamp;
  title: string;
}

export interface SavedAnalysis {
  id: string;
  userId: string;
  analysis: SymptomAnalysisResult;
  symptoms: string[];
  savedAt: Timestamp;
}

// ─── Medical Reports ────────────────────────────────────────────────────────

/** Save a medical report to Firestore */
export async function saveMedicalReport(
  userId: string,
  report: MedicalReport
): Promise<string> {
  const col = collection(db, 'users', userId, 'reports');
  const docRef = await addDoc(col, {
    userId,
    report,
    title: report.clinicalImpression?.primaryDiagnosis ?? 'Medical Report',
    savedAt: serverTimestamp(),
  });
  return docRef.id;
}

/** Fetch all saved reports for a user */
export async function getUserReports(userId: string): Promise<SavedReport[]> {
  const col = collection(db, 'users', userId, 'reports');
  const q = query(col, orderBy('savedAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as SavedReport));
}

/** Delete a specific report */
export async function deleteReport(userId: string, reportId: string): Promise<void> {
  await deleteDoc(doc(db, 'users', userId, 'reports', reportId));
}

// ─── Symptom Analyses ────────────────────────────────────────────────────────

/** Save a symptom analysis result */
export async function saveAnalysis(
  userId: string,
  analysis: SymptomAnalysisResult,
  symptoms: string[]
): Promise<string> {
  const col = collection(db, 'users', userId, 'analyses');
  const docRef = await addDoc(col, {
    userId,
    analysis,
    symptoms,
    savedAt: serverTimestamp(),
  });
  return docRef.id;
}

/** Fetch all saved analyses for a user */
export async function getUserAnalyses(userId: string): Promise<SavedAnalysis[]> {
  const col = collection(db, 'users', userId, 'analyses');
  const q = query(col, orderBy('savedAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as SavedAnalysis));
}

/** Delete a specific analysis */
export async function deleteAnalysis(userId: string, analysisId: string): Promise<void> {
  await deleteDoc(doc(db, 'users', userId, 'analyses', analysisId));
}

// ─── User Profile ────────────────────────────────────────────────────────────

/** Fetch the Firestore user profile document */
export async function getUserProfile(userId: string): Promise<Record<string, unknown> | null> {
  const snap = await getDoc(doc(db, 'users', userId));
  return snap.exists() ? (snap.data() as Record<string, unknown>) : null;
}

/** Update user profile fields */
export async function updateUserProfile(
  userId: string,
  fields: Record<string, unknown>
): Promise<void> {
  await setDoc(doc(db, 'users', userId), fields, { merge: true });
}
