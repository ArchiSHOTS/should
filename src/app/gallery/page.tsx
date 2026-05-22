"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import MnemonicAuth from "@/components/MnemonicAuth";
import GrowthGallery from "@/components/GrowthGallery";
import type { AuthState } from "@/types";

export default function GalleryPage() {
  const [auth, setAuth] = useState<AuthState | null>(null);
  const [showAuth, setShowAuth] = useState(false);

  // Restore session from sessionStorage on mount
  useEffect(() => {
    const stored = sessionStorage.getItem("sip_mnemonic");
    if (stored) {
      setAuth({ mnemonic: stored });
    }
  }, []);

  function handleAuth(state: AuthState) {
    sessionStorage.setItem("sip_mnemonic", state.mnemonic);
    setAuth(state);
    setShowAuth(false);
  }

  function handleLogout() {
    sessionStorage.removeItem("sip_mnemonic");
    setAuth(null);
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <SiteHeader>
        <Link
          href="/think"
          className="text-sm text-stone-400 hover:text-sage transition-colors"
        >
          ← Think
        </Link>
        {auth ? (
          <button
            onClick={handleLogout}
            className="text-sm text-stone-400 hover:text-stone-600 transition-colors"
          >
            Lock journal
          </button>
        ) : (
          <button
            onClick={() => setShowAuth(true)}
            className="text-sm font-medium text-sage hover:text-sage-dark transition-colors"
          >
            Unlock journal
          </button>
        )}
      </SiteHeader>

      <main className="max-w-2xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-serif text-stone-800 mb-2">
            Growth Gallery
          </h1>
          <p className="text-stone-500 text-sm leading-relaxed">
            Your private record of thoughts paused, reconsidered, and saved.
            {auth && (
              <span className="ml-1 text-sage font-medium">Unlocked ✓</span>
            )}
          </p>
        </div>

        {auth ? (
          <GrowthGallery auth={auth} />
        ) : (
          <div className="text-center py-20">
            <p className="text-5xl mb-5">🔒</p>
            <h2 className="text-xl font-serif text-stone-700 mb-3">
              This journal is locked.
            </h2>
            <p className="text-sm text-stone-400 mb-8 max-w-sm mx-auto leading-relaxed">
              Enter your 12-word passphrase to decrypt and view your saved
              thoughts.
            </p>
            <button
              onClick={() => setShowAuth(true)}
              className="px-8 py-3 bg-sage text-white rounded-full font-medium hover:bg-sage-dark transition-colors"
            >
              Unlock with passphrase
            </button>
          </div>
        )}
      </main>

      {showAuth && (
        <MnemonicAuth
          onAuth={handleAuth}
          onClose={() => setShowAuth(false)}
        />
      )}

      <SiteFooter />
    </div>
  );
}
