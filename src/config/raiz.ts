// config/raiz.ts — 9 Raiz life domains + session doors
// Raiz = the Genesis applied to life. Not just productivity — everything.
// Philosophy: "uma gaveta por vez" — see what exists before changing anything.
// Zero new schema. Existing types + tags #domain:* + #raiz.
// Tom (D60): «você», acentos — a taxonomy projetada lá fora NÃO lê os
// labels daqui (engine/taxonomy congela os nomes ASCII).

import type { AtomModule } from '@/types/item';

export interface RaizDomain {
  key: string;
  label: string;
  emoji: string;
  module: AtomModule;
  prompt: string;
  examples: string[];
}

export const RAIZ_DOMAINS: RaizDomain[] = [
  {
    key: 'identity',
    label: 'identidade',
    emoji: '🔑',
    module: 'bridge',
    prompt: 'quais contas e logins você tem?',
    examples: ['email pessoal', 'email do trabalho', 'gmail antigo', 'conta apple', 'login do banco'],
  },
  {
    key: 'documents',
    label: 'documentos',
    emoji: '📄',
    module: 'bridge',
    prompt: 'onde estão seus documentos importantes?',
    examples: ['passaporte', 'contrato do aluguel', 'certidão', 'receitas médicas', 'diploma'],
  },
  {
    key: 'health',
    label: 'saúde',
    emoji: '❤️',
    module: 'body',
    prompt: 'como está seu corpo e sua saúde agora?',
    examples: ['academia', 'exame pendente', 'remédio que tomo', 'dentista atrasado', 'sono ruim'],
  },
  {
    key: 'finance',
    label: 'finanças',
    emoji: '💰',
    module: 'finance',
    prompt: 'onde está o seu dinheiro?',
    examples: ['conta corrente', 'cartão de crédito', 'investimento', 'dívida', 'assinatura mensal'],
  },
  {
    key: 'storage',
    label: 'arquivos',
    emoji: '☁️',
    module: 'bridge',
    prompt: 'onde você guarda seus arquivos digitais?',
    examples: ['google drive', 'icloud', 'hd externo', 'dropbox', 'fotos no celular'],
  },
  {
    key: 'memories',
    label: 'memórias',
    emoji: '📸',
    module: 'family',
    prompt: 'onde estão suas fotos e memórias?',
    examples: ['google photos', 'icloud photos', 'fotos no whatsapp', 'álbum físico', 'vídeos antigos'],
  },
  {
    key: 'time',
    label: 'tempo',
    emoji: '📅',
    module: 'bridge',
    prompt: 'como você organiza seu tempo?',
    examples: ['google calendar', 'agenda física', 'alarmes', 'nenhum sistema', 'monday.com'],
  },
  {
    key: 'communication',
    label: 'comunicação',
    emoji: '💬',
    module: 'social',
    prompt: 'por onde você se comunica?',
    examples: ['whatsapp', 'email', 'instagram', 'telegram', 'slack', 'linkedin'],
  },
  {
    key: 'projects',
    label: 'projetos',
    emoji: '🚀',
    module: 'work',
    prompt: 'quais projetos estão na sua cabeça agora?',
    examples: ['projeto do trabalho', 'ideia de negócio', 'reforma', 'curso', 'side project'],
  },
];

// 3 doors for guided sessions — different APPROACHES, not quantities
export interface RaizDoor {
  key: string;
  emoji: string;
  title: string;
  description: string;
  tag: string;
  recommended?: boolean;
  domainKeys: string[];
}

export const RAIZ_DOORS: RaizDoor[] = [
  {
    key: 'easy',
    emoji: '✨',
    title: 'o mais fácil',
    description: 'comunicação ou calendário — quick win pra criar momentum.',
    tag: 'pra quem precisa de uma vitória rápida',
    domainKeys: ['communication', 'time', 'projects'],
  },
  {
    key: 'pain',
    emoji: '🎯',
    title: 'o que mais incomoda',
    description: 'o que tira sono. resolver alivia rápido — e o alívio move o resto.',
    tag: 'pra quem sabe onde dói',
    domainKeys: ['finance', 'health', 'identity', 'documents', 'storage'],
  },
  {
    key: 'guide',
    emoji: '○',
    title: 'me guia',
    description: 'identidade primeiro — contas, emails, logins. de dentro pra fora.',
    tag: 'pra quem tá perdido',
    recommended: true,
    domainKeys: ['identity', 'documents', 'health', 'finance', 'storage', 'memories', 'time', 'communication', 'projects'],
  },
];

export type RaizDoorKey = (typeof RAIZ_DOORS)[number]['key'];
