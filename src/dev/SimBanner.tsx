// dev/SimBanner.tsx — o aviso da semana simulada (dev-only)
// O banner âmbar com atalhos das faces morreu com o shell novo (D41):
// a nav agora é · ⬡ ✳ e a porta é o mundo. Sobrou só a segunda função —
// avisar quando ?sim=1 está ligada (tronco intocado). Sem sim, nada aparece;
// liga-se pela URL (?sim=1), como o e2e determinístico vai usar.
import { simActive } from './sim-week';

export function SimBanner() {
  if (!simActive()) return null;
  return (
    <div className="text-[11px] font-mono py-1.5 px-3 bg-warning-bg text-warning border-b border-warning/25 text-center">
      🜂 semana simulada · tronco intocado · <a href="?sim=0" className="underline">desligar</a>
    </div>
  );
}
