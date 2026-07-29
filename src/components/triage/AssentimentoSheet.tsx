// components/triage/AssentimentoSheet.tsx — a porta do gesto (ato II · D40/D54)
// Assentir não é lugar: é camada, no mesmo idioma da casa (SettingsSheet).
// Puxa do HOJE, sela o que a lente trouxe, fecha. A tela /pipeline pode
// morrer no gate (D48) sem levar o gesto junto.

import { useEffect } from 'react';
import { Assentimento } from './Assentimento';

export function AssentimentoSheet({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-40 mx-auto w-full max-w-[430px]" role="dialog" aria-label="Esperando leitura">
      <button className="absolute inset-0 bg-black/50" onClick={onClose} aria-label="Fechar" />

      <div className="absolute bottom-0 left-0 right-0 max-h-[85dvh] overflow-y-auto bg-card border border-border border-b-0 rounded-t-[22px] px-4 pt-3 pb-8 shadow-[0_-20px_60px_rgba(0,0,0,.5)]">
        <div className="w-9 h-1 rounded-full bg-border mx-auto mb-3" />
        <div className="px-1 mb-3">
          <h2 className="text-[15px] font-medium text-text-heading">esperando leitura</h2>
          <p className="text-[12px] text-text-muted">
            o que a lente trouxe — a leitura já veio pronta; você sela ou troca
          </p>
        </div>
        <Assentimento />
      </div>
    </div>
  );
}
