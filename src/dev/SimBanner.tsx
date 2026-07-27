// dev/SimBanner.tsx — o aviso da semana simulada
// Visível sempre que a sim está ligada: ninguém confunde ficção com tronco.
import { simActive } from './sim-week';

export function SimBanner() {
  if (!simActive()) return null;
  return (
    <div className="sticky top-0 z-30 text-center text-[11px] font-mono py-1.5 px-3 bg-warning/15 text-warning border-b border-warning/25">
      🜂 semana simulada — só neste aparelho, o tronco está intocado · <a href="?sim=0" className="underline">desligar</a>
    </div>
  );
}
