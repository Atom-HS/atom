// components/hoje/BilheteCard.tsx — a fala rara (Onda 4 obra 1 · spec 03 v2)
// Indigo: quem fala é o E., não a casa (D61). Sem X, sem badge, sem som —
// se lê e se solta; some sozinho na abertura seguinte. Sem bilhete, nada
// aqui — nem placeholder (placeholder é cota, cota é fábrica de frase
// bonita).

import { useBilhete } from '@/hooks/useBilhete';

export function BilheteCard() {
  const { bilhete } = useBilhete();
  if (!bilhete) return null;

  return (
    <div
      className="rounded-lg px-4 py-3 my-4 bg-accent-bg"
      style={{ borderLeft: '2px solid var(--color-accent)' }}
    >
      <p className="text-[13.5px] leading-relaxed text-accent-lighter">{bilhete.texto}</p>
    </div>
  );
}
