// pages/Landing.tsx — a porta de entrada, na pele do mundo (D57)
// Pré-auth. A porta não mente sobre o que há dentro: breu quente,
// dourado raro, as geometrias do caminho. Logo, uma linha, entrar.

interface LandingPageProps {
  onLogin: () => void;
}

export function LandingPage({ onLogin }: LandingPageProps) {
  return (
    <div className="min-h-dvh bg-bg flex flex-col items-center justify-center px-4" style={{ width: '100%' }}>
      <div className="text-center" style={{ width: '100%', maxWidth: '360px' }}>
        {/* o ponto — onde tudo começa */}
        <div className="mb-8">
          <div
            className="w-16 h-16 mx-auto rounded-full flex items-center justify-center bg-gold-bg"
            style={{ border: '1px solid color-mix(in srgb, var(--color-gold) 35%, var(--color-border))' }}
          >
            <span className="w-2 h-2 rounded-full" style={{ background: 'var(--color-gold)' }} />
          </div>
        </div>

        <h1 className="font-mono text-2xl tracking-[0.2em] uppercase text-text mb-3">atom</h1>
        <p className="text-base text-text-muted font-light leading-relaxed mb-2">
          sistema operacional pessoal
        </p>
        <p className="text-[13px] text-text-faint italic leading-relaxed mb-8">
          emoção precede ação, reflexão fecha o ciclo.
          do ponto ao círculo.
        </p>

        {/* as geometrias do caminho */}
        <div className="font-mono text-gold tracking-[0.35em] text-[15px] mb-8">
          · — △ □ ⬠ ⬡ ○
        </div>

        <button
          onClick={onLogin}
          className="rounded-xl px-8 py-3.5 text-sm font-mono text-gold bg-gold-bg"
          style={{ border: '1px solid color-mix(in srgb, var(--color-gold) 35%, var(--color-border))' }}
        >
          entrar
        </button>
      </div>
    </div>
  );
}
