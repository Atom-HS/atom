// engine/digest.test.ts — o raro tem memória (ato V · DP-F)
import { describe, it, expect } from 'vitest';
import { absenceStep, digestFingerprint, expiryBand, shouldSpeak } from './digest';

describe('expiryBand — o degrau, não o número', () => {
  it('os degraus que viram notícia', () => {
    expect(expiryBand(-3)).toBe('vencido');
    expect(expiryBand(0)).toBe('hoje');
    expect(expiryBand(7)).toBe('semana');
    expect(expiryBand(30)).toBe('mes');
    expect(expiryBand(113)).toBe('janela');
  });

  it('o dia que passa dentro do mesmo degrau não é notícia', () => {
    expect(expiryBand(113)).toBe(expiryBand(112));
    expect(expiryBand(30)).toBe(expiryBand(9));
  });

  it('cruzar o degrau é notícia', () => {
    expect(expiryBand(8)).not.toBe(expiryBand(7));
    expect(expiryBand(1)).not.toBe(expiryBand(0));
    expect(expiryBand(0)).not.toBe(expiryBand(-1));
  });
});

describe('absenceStep — «nunca teve registro» se diz uma vez', () => {
  it('nunca é um estado só', () => {
    expect(absenceStep(null)).toBe('nunca');
  });

  it('anda de 90 em 90 dias', () => {
    expect(absenceStep(91)).toBe(absenceStep(120));
    expect(absenceStep(91)).not.toBe(absenceStep(181));
  });
});

describe('digestFingerprint — a impressão do que há pra dizer', () => {
  const hoje = {
    expiries: [{ id: 'passaporte', daysLeft: 113 }],
    absences: [{ domain: 'health', daysSince: null }],
  };

  it('o dia passando não muda a impressão', () => {
    const amanha = {
      expiries: [{ id: 'passaporte', daysLeft: 112 }],
      absences: [{ domain: 'health', daysSince: null }],
    };
    expect(digestFingerprint(amanha)).toBe(digestFingerprint(hoje));
  });

  it('a ordem da matéria não muda a impressão', () => {
    const trocado = {
      expiries: [{ id: 'b', daysLeft: 5 }, { id: 'a', daysLeft: 5 }],
      absences: [],
    };
    const original = {
      expiries: [{ id: 'a', daysLeft: 5 }, { id: 'b', daysLeft: 5 }],
      absences: [],
    };
    expect(digestFingerprint(trocado)).toBe(digestFingerprint(original));
  });

  it('cruzar o degrau muda a impressão', () => {
    const perto = {
      expiries: [{ id: 'passaporte', daysLeft: 6 }],
      absences: [{ domain: 'health', daysSince: null }],
    };
    expect(digestFingerprint(perto)).not.toBe(digestFingerprint(hoje));
  });

  it('matéria nova muda a impressão', () => {
    const maisUm = {
      expiries: [...hoje.expiries, { id: 'cnh', daysLeft: 40 }],
      absences: hoje.absences,
    };
    expect(digestFingerprint(maisUm)).not.toBe(digestFingerprint(hoje));
  });

  it('nada a dizer é impressão vazia', () => {
    expect(digestFingerprint({ expiries: [], absences: [] })).toBe('');
  });
});

describe('shouldSpeak — o dito só volta quando o estado muda', () => {
  const f = digestFingerprint({
    expiries: [{ id: 'passaporte', daysLeft: 113 }],
    absences: [{ domain: 'health', daysSince: null }],
  });

  it('a primeira vez fala', () => {
    expect(shouldSpeak(f, null)).toBe(true);
  });

  it('a segunda, com tudo igual, cala — as 5 ausências de todo dia morrem aqui', () => {
    expect(shouldSpeak(f, f)).toBe(false);
  });

  it('mudou o estado, fala de novo', () => {
    const perto = digestFingerprint({
      expiries: [{ id: 'passaporte', daysLeft: 6 }],
      absences: [{ domain: 'health', daysSince: null }],
    });
    expect(shouldSpeak(perto, f)).toBe(true);
  });

  it('sem matéria, silêncio — mesmo que ontem tenha havido', () => {
    expect(shouldSpeak('', f)).toBe(false);
    expect(shouldSpeak('', null)).toBe(false);
  });
});
