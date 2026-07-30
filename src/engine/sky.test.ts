// engine/sky.test.ts — o céu calculado (Onda 3)
// Nota: sunTimes usa o fuso LOCAL da máquina; os asserts absolutos valem
// em Brisbane (+10, sem DST). Pra CI em outro fuso, os testes absolutos
// convertem pelo offset da máquina.
import { describe, it, expect } from 'vitest';
import { sunTimes, moonAge, moonPhase, skyNow, fmtMin, HOME_LAT, HOME_LON } from './sky';

// converte um horário local de Brisbane pro fuso da máquina que roda o teste
function brisbaneToLocal(min: number, date: Date): number {
  const machineOffset = -date.getTimezoneOffset();
  return ((min - 600 + machineOffset) % 1440 + 1440) % 1440;
}

describe('sunTimes (Brisbane)', () => {
  it('inverno: nasce ~6:3x, põe ~17:1x (±10 min)', () => {
    const d = new Date(2026, 6, 26, 12, 0); // 26 jul
    const { sunriseMin, sunsetMin } = sunTimes(d, HOME_LAT, HOME_LON);
    expect(Math.abs(sunriseMin - brisbaneToLocal(6 * 60 + 33, d))).toBeLessThan(10);
    expect(Math.abs(sunsetMin - brisbaneToLocal(17 * 60 + 16, d))).toBeLessThan(10);
  });

  it('verão: dia mais longo que o de inverno', () => {
    const inverno = sunTimes(new Date(2026, 6, 26, 12, 0), HOME_LAT, HOME_LON);
    const verao = sunTimes(new Date(2026, 11, 21, 12, 0), HOME_LAT, HOME_LON);
    const len = (s: { sunriseMin: number; sunsetMin: number }) => s.sunsetMin - s.sunriseMin;
    expect(len(verao)).toBeGreaterThan(len(inverno) + 120);
  });
});

describe('moonAge / moonPhase', () => {
  it('na época da lua nova (06 jan 2000), idade ~0', () => {
    const age = moonAge(new Date(Date.UTC(2000, 0, 6, 18, 14)));
    expect(age < 0.6 || age > 28.9).toBe(true);
  });

  it('~14.8 dias depois, lua cheia', () => {
    expect(moonPhase(new Date(Date.UTC(2000, 0, 21, 5, 0))).name).toBe('lua cheia');
  });

  it('idade sempre em [0, 29.53)', () => {
    for (const d of [new Date(2026, 6, 26), new Date(2030, 3, 1), new Date(1999, 0, 1)]) {
      const a = moonAge(d);
      expect(a).toBeGreaterThanOrEqual(0);
      expect(a).toBeLessThan(29.5306);
    }
  });
});

describe('skyNow', () => {
  it('meio-dia é dia com sol perto do meio do arco', () => {
    const d = new Date(2026, 6, 26, 12, 0);
    const s = skyNow(d);
    expect(s.isDay).toBe(true);
    expect(s.glyph).toBe('☀');
    expect(s.t).toBeGreaterThan(0.3);
    expect(s.t).toBeLessThan(0.7);
  });

  it('madrugada é noite com glifo de lua', () => {
    const s = skyNow(new Date(2026, 6, 26, 3, 0));
    expect(s.isDay).toBe(false);
    expect(['●', '○', '☽', '☾']).toContain(s.glyph);
    expect(s.t).toBeGreaterThan(0);
    expect(s.t).toBeLessThan(1);
  });
});

describe('fmtMin', () => {
  it('formata minutos como h:mm', () => {
    expect(fmtMin(391)).toBe('6:31');
    expect(fmtMin(1029)).toBe('17:09');
  });
});
