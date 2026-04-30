"use client";

import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { IPLedgerHeader } from '@/components/founder-workspace/ip-ledger/ip-ledger-header';
import { IPLedgerTabs } from '@/components/founder-workspace/ip-ledger/ip-ledger-tabs';
import { RegisterSection } from '@/components/founder-workspace/ip-ledger/register-section';
import { VerifySection } from '@/components/founder-workspace/ip-ledger/verify-section';

export default function IPLedgerPage() {
  const [activeTab, setActiveTab] = useState<'register' | 'verify'>('register');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const handleCopy = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  return (
    <div className="px-8 py-10 max-w-6xl mx-auto space-y-2 bg-white min-h-screen animate-in fade-in duration-500">
      <IPLedgerHeader />
      <IPLedgerTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <AnimatePresence mode="wait">
        {activeTab === 'register' ? (
          <RegisterSection key="reg" handleCopy={handleCopy} copiedHash={copiedHash} />
        ) : (
          <VerifySection key="ver" />
        )}
      </AnimatePresence>
    </div>
  );
}