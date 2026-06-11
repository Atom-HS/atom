// pages/Hoje.tsx — Face HOJE (walking skeleton · E2.1)
// O dia como espinha: arco → chegada → fixos → items do dia → soul log → fechar.
// Versão CRUA de propósito (método: esqueleto ponta-a-ponta antes de beleza).
// Wireframe de referência: docs/release-v1/mockups/cara-do-atom-teste-abc.html
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useItems } from '@/hooks/useItems';
import { useSoulStore } from '@/store/soul-store';
import { getCurrentPeriod } from '@/types/ui';
import { AuroraCheckin } from '@/components/home/AuroraCheckin';
import type { AtomItem } from '@/types/item';

function isTodayISO(iso: string | null | undefined): boolean {
  if (!iso) return false;
  const d = new Date(iso);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

function timeOf(iso: string): string {
  return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

export function HojePage() {
  const navigate = useNavigate();
  const { items, isLoading } = useItems();
  const soul = useSoulStore();
  const period = getCurrentPeriod();

  const { fixos, criadosHoje, soulLog } = useMemo(() => {
    const all = (items ?? []) as AtomItem[];
    const fixos = all
      .filter((i) => {
        const start = (i.body as Record<string, unknown> | null)?.start;
        return typeof start === 'string' && isTodayISO(start);
      })
      .sort((a, b) =>
        String((a.body as Record<string, unknown>).start).localeCompare(
          String((b.body as Record<string, unknown>).start),
        ),
      );
    const criadosHoje = all.filter(
      (i) => isTodayISO(i.created_at) && i.type !== 'checkpoint' && i.type !== 'wrap',
    );
    const soulLog = all
      .filter((i) => isTodayISO(i.created_at) && (i.type === 'checkpoint' || i.type === 'wrap'))
      .sort((a, b) => a.created_at.localeCompare(b.created_at));
    return { fixos, criadosHoje, soulLog };
  }, [items]);

  return (
    <div className="max-w-md mx-auto px-4 pb-24">
      <AuroraCheckin />

      {/* arco do dia */}
      <div className="pt-4 text-center">
        <svg viewBox="0 0 340 66" className="w-full h-16 overflow-visible">
          <path d="M 20 58 Q 170 -26 320 58" fill="none" stroke="var(--color-border)" strokeWidth="2" />
          <circle cx="20" cy="58" r="3.5" fill="var(--color-aurora)" />
          <circle cx="170" cy="14" r="4" fill="var(--color-zenite-mid)" />
          <circle cx="320" cy="58" r="3.5" fill="var(--color-crepusculo)" />
        </svg>
        <div className="flex justify-between px-3 text-[11.5px] font-medium text-text-muted">
          <span className={period.key === 'aurora' ? 'text-warning font-semibold' : ''}>aurora</span>
          <span className={period.key === 'zenite' ? 'text-warning font-semibold' : ''}>zênite</span>
          <span className={period.key === 'crepusculo' ? 'text-warning font-semibold' : ''}>crepúsculo</span>
        </div>
      </div>

      {/* chegada — Zustand é cache de sessão; a fonte de verdade é o tronco */}
      {(() => {
        const auroraDoTronco = soulLog.find(
          (i) => i.type === 'checkpoint' && i.tags?.includes('aurora'),
        );
        const soulBody = (auroraDoTronco?.body as Record<string, unknown> | null)?.soul as
          | { emotion_before?: string | null }
          | undefined;
        const emotion = soul.emotion ?? soulBody?.emotion_before ?? null;
        const intention = soul.intention ?? auroraDoTronco?.notes ?? null;
        return (
          <div className="text-center my-4">
            {emotion ? (
              <>
                <p className="text-lg italic font-medium text-text-heading">“cheguei {emotion}”</p>
                {intention && <p className="text-xs text-text-muted mt-1">{intention}</p>}
              </>
            ) : (
              <p className="text-sm text-text-muted">o dia ainda não chegou — a aurora pergunta</p>
            )}
          </div>
        );
      })()}

      {/* fixos de hoje */}
      <section className="bg-card border border-border rounded-xl p-4 mb-3">
        <h4 className="text-[11px] font-semibold tracking-wider text-text-muted mb-2">fixos de hoje</h4>
        {fixos.length === 0 && <p className="text-sm text-text-muted">nenhum bloco duro hoje</p>}
        {fixos.map((i) => (
          <div key={i.id} className="flex gap-3 py-1.5 text-sm border-b border-surface last:border-0">
            <span className="text-text-muted text-xs pt-0.5">
              {timeOf(String((i.body as Record<string, unknown>).start))}
            </span>
            <span className="text-text">{i.title}</span>
          </div>
        ))}
      </section>

      {/* o que nasceu hoje */}
      <section className="bg-card border border-border rounded-xl p-4 mb-3">
        <h4 className="text-[11px] font-semibold tracking-wider text-text-muted mb-2">nasceu hoje</h4>
        {isLoading && <p className="text-sm text-text-muted">…</p>}
        {!isLoading && criadosHoje.length === 0 && (
          <p className="text-sm text-text-muted">nada capturado ainda</p>
        )}
        {criadosHoje.map((i) => (
          <div key={i.id} className="py-1.5 text-sm text-text border-b border-surface last:border-0">
            {i.title}
            <span className="text-xs text-text-muted ml-2">{i.type ?? '·'}</span>
          </div>
        ))}
      </section>

      {/* soul log */}
      <section className="bg-card border border-border rounded-xl p-4 mb-4">
        <h4 className="text-[11px] font-semibold tracking-wider text-text-muted mb-2">soul log · hoje</h4>
        {soulLog.length === 0 && <p className="text-sm text-text-muted">o dia ainda não escreveu</p>}
        {soulLog.map((i) => (
          <div key={i.id} className="flex gap-2 py-1.5 text-[13px] text-text-muted">
            <span className="text-accent-light text-xs pt-0.5">{timeOf(i.created_at)}</span>
            <span>{i.title}</span>
          </div>
        ))}
      </section>

      {/* fechar o dia → wrap existente */}
      <button
        onClick={() => navigate('/wrap')}
        className="w-full py-3.5 rounded-xl text-sm font-medium border border-border text-accent bg-surface"
      >
        ○ fechar o dia
      </button>
    </div>
  );
}
