// src/firebase/authService.ts
// All Firebase Authentication helper functions

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  User,
  UserCredential,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './config';

const googleProvider = new GoogleAuthProvider();

// ─── Sign Up with Email & Password ─────────────────────────────────────────
export async function signUpWithEmail(
  email: string,
  password: string,
  displayName: string
): Promise<UserCredential> {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(credential.user, { displayName });
  // Create user profile document in Firestore
  await createUserProfile(credential.user, { displayName });
  return credential;
}

// ─── Sign In with Email & Password ─────────────────────────────────────────
export async function signInWithEmail(
  email: string,
  password: string
): Promise<UserCredential> {
  return signInWithEmailAndPassword(auth, email, password);
}

// ─── Sign In with Google ────────────────────────────────────────────────────
export async function signInWithGoogle(): Promise<UserCredential> {
  const credential = await signInWithPopup(auth, googleProvider);
  // Create profile doc if first-time Google sign-in
  const profileRef = doc(db, 'users', credential.user.uid);
  const profileSnap = await getDoc(profileRef);
  if (!profileSnap.exists()) {
    await createUserProfile(credential.user, {
      displayName: credential.user.displayName || 'User',
    });
  }
  return credential;
}

// ─── Sign Out ───────────────────────────────────────────────────────────────
export async function signOutUser(): Promise<void> {
  return signOut(auth);
}

// ─── Reset Password ─────────────────────────────────────────────────────────
export async function resetPassword(email: string): Promise<void> {
  return sendPasswordResetEmail(auth, email);
}

// ─── Create / Update Firestore User Profile ─────────────────────────────────
export async function createUserProfile(
  user: User,
  extra: Record<string, unknown> = {}
): Promise<void> {
  const profileRef = doc(db, 'users', user.uid);
  await setDoc(
    profileRef,
    {
      uid: user.uid,
      email: user.email,
      displayName: extra.displayName ?? user.displayName ?? 'User',
      photoURL: user.photoURL ?? null,
      createdAt: serverTimestamp(),
      ...extra,
    },
    { merge: true }
  );
}

// ─── Auth State Observer ────────────────────────────────────────────────────
export function observeAuthState(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
