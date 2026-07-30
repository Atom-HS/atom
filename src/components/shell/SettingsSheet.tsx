// shell/SettingsSheet.tsx — a casa: settings vira sheet, não lugar (D54 · obra 5)
// Pull discreto no puxador acima da nav → esta folha. Sobrevivem perfil,
// conectores e export (06_paginas-internas_mapa). O tema morreu: o mundo
// é um só (D57). A aba /settings foi embora com a porta do TopBar.

import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/app-store';
import { useItems } from '@/hooks/useItems';
import { useAuth } from '@/hooks/useAuth';
import { useConnectors } from '@/hooks/useConnectors';
import { exportService } from '@/service/export-service';
import { readTaxonomy, isApplied, taxonomySummary } from '@/engine/taxonomy';
import type { TaxonomyReport } from '@/service/connector-service';
import { toast } from '@/store/toast-store';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface SettingsSheetProps {
  onClose: () => void;
}

export function SettingsSheet({ onClose }: SettingsSheetProps) {
  const user = useAppStore((s) => s.user);
  const { items } = useItems();
  const { signOut, signInWithGoogle } = useAuth();
  const { getStatus, syncCalendar, syncGmail, disconnect, syncState, taxonomy, idaBusy, needsReconnect } = useConnectors();
  const isGoogleUser = user?.app_metadata?.provider === 'google';
  const googleConn = getStatus('google');

  // a ida (D68): preview → assentimento → estado quieto → desfazer
  const [idaPlan, setIdaPlan] = useState<TaxonomyReport | null>(null);
  const idaRecord = readTaxonomy(googleConn?.metadata);
  const idaViva = isApplied(idaRecord);

  // a lente sabe de si (D46): a casa se move sozinha e a sheet diz — estado,
  // nunca promessa. O horário é o do cron (migration 016: 21:15 UTC = 07:15
  // Brisbane); a «última volta» é o last_sync_at que toda volta carimba.
  const ultimaVolta = googleConn?.lastSyncAt
    ? formatDistanceToNow(parseISO(googleConn.lastSyncAt), { addSuffix: true, locale: ptBR })
    : null;

  const handleIdaPreview = async () => {
    const report = await taxonomy('preview');
    if (report) setIdaPlan(report);
  };

  const handleIdaApply = async () => {
    const report = await taxonomy('apply');
    setIdaPlan(null);
    if (report) {
      const created = (report.labels ?? []).filter((l) => l.action === 'created').length
        + (report.calendar?.action === 'created' ? 1 : 0);
      toast.success(created > 0 ? `a lei vive lá fora — ${created} nascendo agora` : 'a lei já vivia lá fora');
    }
  };

  const handleIdaRemove = async () => {
    const report = await taxonomy('remove');
    if (report) toast.success('a estrutura saiu — como se nunca tivesse entrado');
  };

  const email = user?.email ?? '';
  const name = user?.user_metadata?.full_name ?? email.split('@')[0];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleExportJSON = async () => {
    await exportService.exportAsJSON(items);
    toast.success('backup JSON baixado');
  };

  const handleExportObsidian = async () => {
    await exportService.exportBatchObsidian(items, items);
    toast.success('vault Obsidian baixado');
  };

  return (
    <div className="fixed inset-0 z-40 mx-auto w-full max-w-[430px]" role="dialog" aria-label="A casa">
      {/* backdrop — toque fora fecha */}
      <button className="absolute inset-0 bg-black/50" onClick={onClose} aria-label="Fechar" />

      <div className="absolute bottom-0 left-0 right-0 max-h-[80dvh] overflow-y-auto bg-card border border-border border-b-0 rounded-t-[22px] px-4 pt-3 pb-8 shadow-[0_-20px_60px_rgba(0,0,0,.5)]">
        <div className="w-9 h-1 rounded-full bg-border mx-auto mb-4" />

        {/* perfil */}
        <div className="flex items-center gap-3 mb-4 px-1">
          <div className="w-11 h-11 rounded-full bg-gold-bg flex items-center justify-center text-base text-gold">
            {name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm text-text truncate">{name}</div>
            <div className="text-xs text-text-muted truncate">{email}</div>
          </div>
        </div>

        {/* bocas & conectores */}
        <SectionLabel>bocas &amp; conectores</SectionLabel>
        <div className="bg-surface border border-border-soft rounded-[14px] overflow-hidden mb-4">
          {!isGoogleUser && (
            <div className="px-4 py-3 text-[12px] text-text-muted border-b border-border-soft">
              entre com Google pra ligar Calendar e Gmail
            </div>
          )}
          <ConnectorRow
            name="Google Calendar"
            status={getStatus('google')}
            syncing={syncState === 'syncing'}
            onSync={isGoogleUser ? syncCalendar : undefined}
            onDisconnect={isGoogleUser ? () => disconnect('google') : undefined}
          />
          <ConnectorRow
            name="Gmail"
            note="boca, nunca lugar (D56)"
            status={getStatus('google')}
            syncing={syncState === 'syncing'}
            onSync={isGoogleUser ? syncGmail : undefined}
            onDisconnect={isGoogleUser ? () => disconnect('google') : undefined}
          />
          <ConnectorRow name="Google Drive" comingSoon />

          {/* a ida (D68) — o Genesis legisla pra fora: cria estrutura, nunca move conteúdo */}
          {isGoogleUser && (
            <div className="px-4 py-3 border-t border-border-soft">
              <div className="text-[13px] text-text">a lei projetada</div>
              {needsReconnect ? (
                <>
                  <p className="text-[11px] text-text-muted mt-0.5">
                    pra criar labels e o calendário, o Google precisa te perguntar de novo — um login resolve.
                  </p>
                  <button
                    onClick={() => signInWithGoogle()}
                    className="font-mono text-[10.5px] px-2.5 py-1 rounded-full text-gold bg-gold-bg mt-2"
                    style={{ border: '1px solid color-mix(in srgb, var(--color-gold) 30%, var(--color-border-soft))' }}
                  >
                    reconectar com Google
                  </button>
                </>
              ) : idaPlan ? (
                <>
                  <p className="text-[11px] text-text-muted mt-0.5">
                    {(idaPlan.labels ?? []).filter((l) => l.action === 'create').length} labels{' '}
                    <span className="font-mono">Atom/</span> a nascer no Gmail
                    {idaPlan.calendar?.action === 'create' ? ' · calendário «Atom» no GCal' : ''}
                    {(idaPlan.labels ?? []).some((l) => l.action === 'exists') ? ' · o que já existe fica como está' : ''}
                    {(idaPlan.labels ?? []).some((l) => l.action === 'off' || l.action === 'disabled') ? ' · o que você desligou segue desligado' : ''}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={handleIdaApply}
                      disabled={idaBusy}
                      className="font-mono text-[10.5px] px-2.5 py-1 rounded-full text-gold bg-gold-bg disabled:opacity-50"
                      style={{ border: '1px solid color-mix(in srgb, var(--color-gold) 30%, var(--color-border-soft))' }}
                    >
                      {idaBusy ? 'projetando…' : 'aceitar ✓'}
                    </button>
                    <button onClick={() => setIdaPlan(null)} className="text-[11px] text-text-muted">
                      agora não
                    </button>
                  </div>
                </>
              ) : idaViva ? (
                <>
                  <p className="text-[11px] text-text-muted mt-0.5">{taxonomySummary(idaRecord)}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={handleIdaPreview}
                      disabled={idaBusy}
                      className="text-[11px] text-text-muted disabled:opacity-50"
                    >
                      {idaBusy ? 'olhando…' : 'reprojetar'}
                    </button>
                    <button onClick={handleIdaRemove} disabled={idaBusy} className="text-[11px] text-error">
                      desfazer tudo
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-[11px] text-text-muted mt-0.5">
                    os 9 domínios como labels <span className="font-mono">Atom/</span> no Gmail + calendário «Atom» —
                    cria estrutura, nunca mexe no seu conteúdo.
                  </p>
                  <button
                    onClick={handleIdaPreview}
                    disabled={idaBusy}
                    className="font-mono text-[10.5px] px-2.5 py-1 rounded-full text-gold bg-gold-bg mt-2 disabled:opacity-50"
                    style={{ border: '1px solid color-mix(in srgb, var(--color-gold) 30%, var(--color-border-soft))' }}
                  >
                    {idaBusy ? 'olhando lá fora…' : 'ver o plano'}
                  </button>
                </>
              )}
            </div>
          )}

          {/* o estado quieto do cron — a casa que olha sozinha se declara */}
          {isGoogleUser && googleConn?.status === 'connected' && (
            <p className="px-4 py-3 border-t border-border-soft font-mono text-[10px] text-text-faint">
              a casa olha sozinha todo dia às 07:15
              {' · '}
              {ultimaVolta ? `última volta ${ultimaVolta}` : 'ainda sem volta registrada'}
            </p>
          )}
        </div>

        {/* exportar */}
        <SectionLabel>exportar — seus dados são seus</SectionLabel>
        <div className="bg-surface border border-border-soft rounded-[14px] overflow-hidden mb-4">
          <ExportRow label="backup JSON" description="todo o tronco como JSON" onClick={handleExportJSON} />
          <ExportRow label="vault Obsidian" description="todo o tronco como .md" onClick={handleExportObsidian} />
        </div>

        {/* sobre */}
        <p className="font-mono text-[10px] text-text-faint text-center mb-4">
          Atom · Genesis v5.0.4 · o mundo é um só (D57)
        </p>

        <button
          onClick={() => signOut()}
          className="w-full py-3 text-center text-sm text-error border border-error/20 rounded-xl"
        >
          sair da conta
        </button>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-text-faint mb-1.5 px-1">{children}</div>;
}

function ExportRow({ label, description, onClick }: { label: string; description: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full flex items-center justify-between px-4 py-3 border-b border-border-soft last:border-0 text-left">
      <div>
        <div className="text-[13px] text-text">{label}</div>
        <div className="text-[11px] text-text-muted">{description}</div>
      </div>
      <span className="font-mono text-xs text-gold-dim">↓</span>
    </button>
  );
}

function ConnectorRow({
  name, note, status, syncing, comingSoon, onSync, onDisconnect,
}: {
  name: string;
  note?: string;
  status?: { provider: string; status: string; lastSyncAt: string | null; metadata: Record<string, unknown> };
  syncing?: boolean;
  comingSoon?: boolean;
  onSync?: () => void;
  onDisconnect?: () => void;
}) {
  const isConnected = status?.status === 'connected';
  const lastSync = status?.lastSyncAt
    ? formatDistanceToNow(parseISO(status.lastSyncAt), { addSuffix: true, locale: ptBR })
    : null;

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-border-soft last:border-0">
      <div className="min-w-0 flex-1">
        <div className="text-[13px] text-text">{name}</div>
        <div className="text-[11px] text-text-muted">
          {comingSoon ? 'em breve' : isConnected ? `ligado${lastSync ? ` · sync ${lastSync}` : ''}` : note ?? 'desligado'}
        </div>
      </div>
      {!comingSoon && isConnected && (
        <div className="flex items-center gap-2 shrink-0">
          {onSync && (
            <button
              onClick={onSync}
              disabled={syncing}
              className="font-mono text-[10.5px] px-2.5 py-1 rounded-full text-gold bg-gold-bg disabled:opacity-50"
              style={{ border: '1px solid color-mix(in srgb, var(--color-gold) 30%, var(--color-border-soft))' }}
            >
              {syncing ? 'sincronizando…' : 'sincronizar'}
            </button>
          )}
          {onDisconnect && (
            <button onClick={onDisconnect} className="text-[11px] text-error" aria-label={`Desligar ${name}`}>
              ×
            </button>
          )}
        </div>
      )}
    </div>
  );
}
