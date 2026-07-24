"use client";
import React, { useState } from 'react';
import { Shield, FileCheck2, Fingerprint, Building2 } from 'lucide-react';

const Toggle = ({ active, onClick }: { active: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={"relative inline-flex h-5 w-9 items-center rounded-full transition-colors " + (active ? "bg-ink" : "bg-surface-2 border border-hairline")}
  >
    <span className={"inline-block h-3.5 w-3.5 transform rounded-full bg-on-primary transition-transform " + (active ? "translate-x-[18px]" : "translate-x-1")} />
  </button>
);

export default function SecurityPresets() {
  const [nda, setNda] = useState(true);
  const [watermark, setWatermark] = useState(true);
  const [domain, setDomain] = useState(false);

  const controls = [
    { icon: FileCheck2, label: 'Enforce NDA Gate', desc: 'Block access until digital NDA is checked and signed by the counterparty.', value: nda, set: () => setNda(!nda) },
    { icon: Fingerprint, label: 'Dynamic Email Watermark', desc: "Stamps reader's email onto the canvas to heavily deter physical or digital leaks.", value: watermark, set: () => setWatermark(!watermark) },
    { icon: Building2, label: 'Restrict to Corporate Domains', desc: 'Blocks generic emails (@gmail.com, @yahoo.com) from authenticating.', value: domain, set: () => setDomain(!domain) },
  ];

  return (
    <div className="bg-surface-1 border border-hairline shadow-framer-edge rounded-xl p-6 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-surface-2 rounded-xl text-ink"><Shield className="h-4 w-4" /></div>
        <h3 className="font-heading font-bold text-ink text-lg">Access Controls</h3>
      </div>
      <div className="flex-1 flex flex-col gap-5">
        {controls.map((c, i) => (
          <React.Fragment key={i}>
            <label className="flex items-start justify-between gap-4 group cursor-pointer">
              <div className="flex gap-3">
                <c.icon className="h-4 w-4 text-ink-muted mt-0.5 shrink-0" />
                <div>
                  <div className="font-body font-bold text-sm text-ink">{c.label}</div>
                  <p className="text-xs text-ink-muted mt-1 leading-relaxed">{c.desc}</p>
                </div>
              </div>
              <Toggle active={c.value} onClick={c.set} />
            </label>
            {i < controls.length - 1 && <div className="h-px w-full bg-hairline" />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}