// components/project/ProjectSheet.tsx — o projeto como camada (DP-E · DP-I)
// A pill do HOJE abre isto; /projects morre no gate (D40/D48). Só o que a
// vivência provou que importa: a presença (a MESMA linha do engine que a
// pill mostra), os filhos com estado ·/○, o próximo como convite, a
// quietude. Criar projeto, filtros e agrupamento eram chrome de
// gerenciador (benchmark 16) — não entram.

import { useEffect } from 'react';
import { useNav } from '@/hooks/useNav';
import { presenceLine } from '@/engine/project';
import type { ProjectPresence } from '@/engine/project';

export function ProjectSheet({ presence, onClose }: { presence: ProjectPresence; onClose: () => void }) {
  const { selectItem } = useNav();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const abrir = (id: string) => {
    onClose();
    selectItem(id);
  };

  // abertos primeiro, selados depois — a leitura desce do vivo pro quieto
  const filhos = [...presence.children].sort(
    (a, b) => Number(a.status === 'completed') - Number(b.status === 'completed'),
  );

  return (
    <div className="fixed inset-0 z-40 mx-auto w-full max-w-[430px]" role="dialog" aria-label="Projeto">
      <button className="absolute inset-0 bg-black/50" onClick={onClose} aria-label="Fechar" />

      <div className="absolute bottom-0 left-0 right-0 max-h-[85dvh] overflow-y-auto bg-card border border-border border-b-0 rounded-t-[22px] px-4 pt-3 pb-8 shadow-[0_-20px_60px_rgba(0,0,0,.5)]">
        <div className="w-9 h-1 rounded-full bg-border mx-auto mb-3" />
        <div className="px-1 mb-4">
          <h2 className="text-[15px] font-medium text-text-heading">⛓ {presence.project.title}</h2>
          {/* estado, nunca julgamento (D46) — a linha vem do engine */}
          <p className="text-[12px] text-text-muted">{presenceLine(presence)}</p>
        </div>

        {/* o próximo como convite — o filho aberto mais antigo */}
        {presence.next && (
          <button
            onClick={() => abrir(presence.next!.id)}
            className="w-full text-left bg-surface border border-gold-dim/30 rounded-xl px-3.5 py-3 mb-3"
          >
            <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-text-faint block mb-1">
              o próximo
            </span>
            <span className="text-sm text-text">{presence.next.title}</span>
          </button>
        )}

        {/* os filhos, com a maturação no fim da linha (· aberto · ○ selado) */}
        {filhos.length > 0 ? (
          <div className="px-1">
            {filhos.map((c) => {
              const selado = c.status === 'completed';
              return (
                <button
                  key={c.id}
                  onClick={() => abrir(c.id)}
                  className="w-full flex items-baseline gap-2 py-2 text-left border-b border-border-soft/50 last:border-0"
                >
                  <span className={`flex-1 text-[13px] truncate ${selado ? 'text-text-faint' : 'text-text'}`}>
                    {c.title}
                  </span>
                  <span className="font-mono text-[11px] text-text-faint shrink-0">{selado ? '○' : '·'}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <p className="px-1 text-[13px] text-text-muted">vazio — um projeto sem items é vazio</p>
        )}
      </div>
    </div>
  );
}
