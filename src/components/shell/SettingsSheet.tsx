// shell/SettingsSheet.tsx — a casa: settings vira sheet, não lugar (D54 · obra 5)
// Pull discreto no puxador acima da nav → esta folha. Sobrevivem perfil,
// conectores e export (06_paginas-internas_mapa). O tema morreu: o mundo
// é um só (D57). A aba /settings foi embora com a porta do TopBar.

import { useEffect } from 'react';
import { useAppStore } from '@/store/app-store';
import { useItems } from '@/hooks/useItems';
import { useAuth } from '@/hooks/useAuth';
import { useConnectors } from '@/hooks/useConnectors';
import { exportService } from '@/service/export-service';
import { toast } from '@/store/toast-store';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface SettingsSheetProps {
  onClose: () => void;
}

export function SettingsSheet({ onClose }: SettingsSheetProps) {
  const user = useAppStore((s) => s.user);
  const { items } = useItems();
  const { signOut } = useAuth();
  const { getStatus, syncCalendar, syncGmail, disconnect, syncState } = useConnectors();
  const isGoogleUser = user?.app_metadata?.provider === 'google';

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
        </div>

        {/* exportar */}
        <SectionLabel>exportar — seus dados são seus</SectionLabel>
        <div className="bg-surface border border-border-soft rounded-[14px] overflow-hidden mb-4">
          <ExportRow label="backup JSON" description="todo o tronco como JSON" onClick={handleExportJSON} />
          <ExportRow label="vault Obsidian" description="todo o tronco como .md" onClick={handleExportObsidian} />
        </div>

        {/* sobre */}
        <p className="font-mono text-[10px] text-text-faint text-center mb-4">
          Atom · Genesis v5.0.1 · o mundo é um só (D57)
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
