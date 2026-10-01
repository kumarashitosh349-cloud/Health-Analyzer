// src/components/UserMenu.tsx
// User avatar + dropdown menu shown in the app header when signed in

import React, { useState, useRef, useEffect } from 'react';
import { LogOut, User, Save, ChevronDown, Database, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { signOutUser } from '../firebase/authService';

interface UserMenuProps {
  onOpenSavedReports: () => void;
}

export function UserMenu({ onOpenSavedReports }: UserMenuProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  if (!user) return null;

  const initials = user.displayName
    ? user.displayName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : user.email?.[0]?.toUpperCase() ?? 'U';

  return (
    <div className="relative" ref={ref}>
      <button
        id="user-menu-btn"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-[#E0E5EC] shadow-[4px_4px_8px_#b8b9be,-4px_-4px_8px_#ffffff] hover:shadow-[6px_6px_12px_#b8b9be,-6px_-6px_12px_#ffffff] border border-white/50 rounded-2xl pl-3 pr-2 py-2 transition-all"
      >
        {/* Avatar */}
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt="avatar"
            className="w-7 h-7 rounded-full object-cover ring-2 ring-blue-500/30"
          />
        ) : (
          <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-black">
            {initials}
          </div>
        )}
        <span className="text-xs font-bold text-slate-700 max-w-[80px] truncate hidden sm:block">
          {user.displayName?.split(' ')[0] ?? user.email?.split('@')[0]}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-[#E0E5EC] shadow-[8px_8px_20px_#b8b9be,-8px_-8px_20px_#ffffff] border border-white/50 rounded-2xl py-2 z-50">
          {/* User info header */}
          <div className="px-4 py-3 border-b border-slate-200/60">
            <div className="flex items-center gap-3">
              {user.photoURL ? (
                <img src={user.photoURL} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-black text-sm">
                  {initials}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800 truncate">{user.displayName ?? 'User'}</p>
                <p className="text-xs text-slate-400 truncate">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              <Shield className="w-3 h-3 text-green-600" />
              <span className="text-[10px] text-green-600 font-bold uppercase">Verified Account</span>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <button
              onClick={() => { onOpenSavedReports(); setOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-white/50 transition-colors"
            >
              <Save className="w-4 h-4 text-blue-500" />
              <span>Saved Reports</span>
              <span className="ml-auto text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">DB</span>
            </button>

            <button
              onClick={() => { onOpenSavedReports(); setOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-white/50 transition-colors"
            >
              <Database className="w-4 h-4 text-indigo-500" />
              <span>My Health History</span>
            </button>

            <button
              onClick={() => { onOpenSavedReports(); setOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-white/50 transition-colors"
            >
              <User className="w-4 h-4 text-slate-500" />
              <span>Profile</span>
            </button>
          </div>

          <div className="border-t border-slate-200/60 pt-1">
            <button
              id="sign-out-btn"
              onClick={async () => { setOpen(false); await signOutUser(); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors rounded-b-2xl"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
