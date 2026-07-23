// home/ReviewBanner.tsx — o convite da escada (Fase 4 · spec §2.4)
// Discreto por lei: convida, não cobra. Só aparece quando um degrau acordou.
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useItems } from '@/hooks/useItems';
import { nextAvailableReview } from '@/engine/meaning';

export function ReviewBanner() {
  const navigate = useNavigate();
  const { items } = useItems();
  const available = useMemo(() => nextAvailableReview(items ?? []), [items]);

  if (!available) return null;

  return (
    <button
      onClick={() => navigate('/review')}
      className="w-full text-left bg-card border border-accent/20 rounded-xl px-4 py-3 mb-3 hover:border-accent/40 transition-colors"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-text font-medium">🪜 {available.rung.invite}</p>
          <p className="text-xs text-text-muted mt-0.5">
            {available.reads.length} {available.rung.reads === 'wrap' ? 'dias' : 'sínteses'} acumulados
          </p>
        </div>
        <span className="text-accent text-sm">→</span>
      </div>
    </button>
  );
}
