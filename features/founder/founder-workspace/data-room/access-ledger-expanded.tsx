"use client";
import React, { useState } from 'react';
import { Eye, Mail, XOctagon, ChevronDown, ChevronRight, Monitor, Smartphone, Globe, Clock, History } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { WorkspaceActionModal } from "@/features/founder/founder-workspace/workspace-ui";

interface LinkSession { id: string; duration: string; device: 'desktop' | 'mobile'; browser: string; location: string; activity: string; }
interface InvestorLink { id: string; recipient: string; fund: string; initial: string; views: number; completion: string; requiresEmail: boolean; isActive: boolean; revoked: boolean; sessions: LinkSession[]; }

export default function AccessLedgerExpanded() {
  const [expandedRowId, setExpandedRowId] = useState<string | null>('1');
  const [pendingRevoke, setPendingRevoke] = useState<InvestorLink | null>(null);
  const [links, setLinks] = useState<InvestorLink[]>([
    {
      id: '1', recipient: 'Takeru Hishinuma', fund: 'Kizuna Ventures', initial: 'TH', views: 12, completion: '85%', requiresEmail: true, isActive: true, revoked: false,
      sessions: [
        { id: 's1', duration: '4m 20s', device: 'desktop', browser: 'Mac Safari', location: 'Singapore', activity: 'Spent 90s on Slide 4 (SpacetimeDB)' },
        { id: 's2', duration: '0m 12s', device: 'mobile', browser: 'iPhone iOS', location: 'Da Nang', activity: 'Bounced on Slide 1' },
      ]
    },
    {
      id: '2', recipient: 'Maya Watanabe', fund: 'Sequoia Scout Network', initial: 'MW', views: 3, completion: '100%', requiresEmail: false, isActive: true, revoked: false,
      sessions: [{ id: 's3', duration: '15m 10s', device: 'desktop', browser: 'Windows Chrome', location: 'San Francisco', activity: 'Downloaded Financial Model' }]
    },
    { id: '3', recipient: 'An Hoang Le', fund: 'Campus Angel Syndicate', initial: 'AL', views: 0, completion: '0%', requiresEmail: true, isActive: false, revoked: false, sessions: [] },
  ]);

  const toggleRow = (id: string) => setExpandedRowId(expandedRowId === id ? null : id);

  const toggleActive = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLinks(links.map(l => l.id === id ? { ...l, isActive: !l.isActive } : l));
  };

  const revoke = (id: string, recipient: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPendingRevoke(links.find((link) => link.id === id) ?? null);
  };

  const confirmRevoke = () => {
    if (!pendingRevoke) return;
    setLinks(links.map(l => l.id === pendingRevoke.id ? { ...l, isActive: false, revoked: true } : l));
    setPendingRevoke(null);
  };

  const thCls = "pb-3 text-[10px] font-body font-bold text-ink-muted uppercase tracking-widest";

  return (
    <div className="border border-hairline bg-surface-1 shadow-framer-edge rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-heading font-bold text-ink text-lg">Deep Access Ledger</h3>
        <span className="text-xs text-ink-muted">{links.filter(l => l.isActive && !l.revoked).length} active links</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-hairline">
              <th className="pb-3 w-8" />
              <th className={thCls + " pl-2"}>Recipient / Fund</th>
              <th className={thCls + " text-center"}>Security</th>
              <th className={thCls + " text-right"}>Views</th>
              <th className={thCls + " text-right"}>Completion</th>
              <th className={thCls + " pl-4 text-center"}>Status</th>
              <th className={thCls + " text-right pr-2"}>Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline">
            {links.map((link) => (
              <React.Fragment key={link.id}>
                <tr onClick={() => toggleRow(link.id)} className={"transition-colors group cursor-pointer " + (link.revoked ? "opacity-40" : "hover:bg-surface-2")}>
                  <td className="py-4 pl-2">
                    {expandedRowId === link.id
                      ? <ChevronDown className="h-4 w-4 text-ink" />
                      : <ChevronRight className="h-4 w-4 text-ink-muted group-hover:text-ink" />}
                  </td>
                  <td className="py-4 pl-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-surface-2 text-ink border border-hairline flex items-center justify-center font-body font-black text-[11px] shrink-0">
                        {link.initial}
                      </div>
                      <div>
                        <div className={"font-bold text-sm " + (link.revoked ? "line-through text-ink-muted" : "text-ink")}>{link.recipient}</div>
                        <div className="text-ink-muted text-[11px] mt-0.5">{link.fund}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 text-center">
                    {link.requiresEmail
                      ? <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-surface-2 text-ink border border-hairline"><Mail className="h-3 w-3" /> Email Req</span>
                      : <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-surface-2 text-ink-muted">Open Link</span>}
                  </td>
                  <td className="py-4">
                    <span className="flex items-center justify-end gap-1.5 font-mono font-medium text-ink text-sm">
                      <Eye className="h-3.5 w-3.5 text-ink-muted" /> {link.views}
                    </span>
                  </td>
                  <td className="py-4 font-mono font-bold text-ink text-right text-sm">{link.completion}</td>
                  <td className="py-4 text-center pl-4">
                    {link.revoked
                      ? <span className="text-[10px] font-bold text-ink-muted uppercase tracking-wider">Revoked</span>
                      : (
                        <label className="relative inline-flex items-center cursor-pointer" onClick={e => e.stopPropagation()}>
                          <input type="checkbox" className="sr-only peer" checked={link.isActive} onChange={(e) => toggleActive(link.id, e as any)} />
                          <div className="w-8 h-4 bg-surface-2 border border-hairline rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-ink after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-ink" />
                        </label>
                      )}
                  </td>
                  <td className="py-4 text-right pr-2">
                    {!link.revoked && (
                      <button
                        className="bg-surface-2 text-ink-muted border border-hairline px-2.5 py-1 text-xs rounded-lg font-body font-bold hover:bg-red-950 hover:text-red-400 hover:border-red-900 transition-colors inline-flex items-center gap-1.5"
                        onClick={e => revoke(link.id, link.recipient, e)}
                      >
                        <XOctagon className="h-3 w-3" /> Revoke
                      </button>
                    )}
                  </td>
                </tr>
                {expandedRowId === link.id && (
                  <tr className="bg-surface-2">
                    <td colSpan={7} className="py-4 px-6 border-b border-hairline">
                      <div className="rounded-xl border border-hairline bg-surface-1 p-4">
                        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-hairline">
                          <History className="h-4 w-4 text-ink-muted" />
                          <span className="font-body font-bold text-xs text-ink">Session Inspector</span>
                        </div>
                        {link.sessions.length > 0 ? (
                          <div className="space-y-3">
                            {link.sessions.map((s) => (
                              <div key={s.id} className="grid grid-cols-12 gap-4 items-center bg-surface-2 border border-hairline p-2.5 rounded-lg">
                                <div className="col-span-2 flex items-center justify-end gap-2 text-ink-muted font-mono text-xs">
                                  <Clock className="h-3.5 w-3.5 opacity-50" /><span>{s.duration}</span>
                                </div>
                                <div className="col-span-3 flex items-center gap-2 text-ink-muted font-mono text-xs border-l border-hairline pl-4">
                                  {s.device === 'desktop' ? <Monitor className="h-3.5 w-3.5 opacity-50" /> : <Smartphone className="h-3.5 w-3.5 opacity-50" />}
                                  {s.browser}
                                </div>
                                <div className="col-span-2 flex items-center gap-2 text-ink-muted font-mono text-xs border-l border-hairline pl-4">
                                  <Globe className="h-3.5 w-3.5 opacity-50" />{s.location}
                                </div>
                                <div className="col-span-5 flex items-center text-ink-muted text-xs border-l border-hairline pl-4 truncate">{s.activity}</div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="py-4 text-center text-xs text-ink-muted">No sessions recorded yet.</div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <WorkspaceActionModal
        open={Boolean(pendingRevoke)}
        onClose={() => setPendingRevoke(null)}
        title="Revoke access?"
        description={pendingRevoke ? `${pendingRevoke.recipient} will no longer be able to view this data room link.` : undefined}
        footer={
          <>
            <Button variant="secondary" onClick={() => setPendingRevoke(null)}>Cancel</Button>
            <Button onClick={confirmRevoke}>
              <XOctagon className="size-4" />
              Revoke access
            </Button>
          </>
        }
      >
        <div className="rounded-xl border border-hairline bg-surface-2 p-4 text-body-framer-sm text-ink-muted">
          This is a deterministic demo action. The ledger row will remain visible as revoked so the presenter can show access control history.
        </div>
      </WorkspaceActionModal>
    </div>
  );
}
