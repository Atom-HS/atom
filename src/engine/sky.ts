// engine/sky.ts — o céu no horário real (Onda 3 · face HOJE)
// Puro. Sol nasce/põe calculado de verdade (NOAA simplificado) pra lat/lon
// da casa; a lua carrega a fase real. Misticismo discreto: o arco do dia
// é um mapa do céu, não um enfeite — parecer-ux §HOJE.

export interface SunTimes {
  sunriseMin: number; // minutos locais desde 00:00
  sunsetMin: number;
  zenithMin: number;
}

export interface SkyNow {
  isDay: boolean;
  t: number;          // 0..1 — posição ao longo do arco (dia: sol · noite: lua)
  glyph: string;      // ☀ ou fase da lua
  phaseName: string;  // "lua crescente", "lua cheia"...
  minutes: number;    // minutos locais agora
}

// A casa: Brisbane. Quando o app tiver perfil de lugar, vem de lá.
export const HOME_LAT = -27.47;
export const HOME_LON = 153.03;

const RAD = Math.PI / 180;

// NOAA simplificado — bom pra ±2 min, de sobra pro arco.
export function sunTimes(date: Date, lat: number = HOME_LAT, lon: number = HOME_LON): SunTimes {
  const start = new Date(date.getFullYear(), 0, 0);
  const doy = Math.floor((date.getTime() - start.getTime()) / 86_400_000);
  const g = (2 * Math.PI / 365) * (doy - 1 + (12 - 12) / 24);

  const eqtime =
    229.18 * (0.000075 + 0.001868 * Math.cos(g) - 0.032077 * Math.sin(g)
      - 0.014615 * Math.cos(2 * g) - 0.040849 * Math.sin(2 * g));
  const decl =
    0.006918 - 0.399912 * Math.cos(g) + 0.070257 * Math.sin(g)
    - 0.006758 * Math.cos(2 * g) + 0.000907 * Math.sin(2 * g)
    - 0.002697 * Math.cos(3 * g) + 0.00148 * Math.sin(3 * g);

  const cosHa =
    (Math.cos(90.833 * RAD) - Math.sin(lat * RAD) * Math.sin(decl)) /
    (Math.cos(lat * RAD) * Math.cos(decl));
  const ha = Math.acos(Math.min(1, Math.max(-1, cosHa))) / RAD;

  const tzOffset = -date.getTimezoneOffset(); // minutos a leste de UTC
  const sunriseUtc = 720 - 4 * (lon + ha) - eqtime;
  const sunsetUtc = 720 - 4 * (lon - ha) - eqtime;
  const norm = (m: number) => ((m % 1440) + 1440) % 1440;

  return {
    sunriseMin: norm(sunriseUtc + tzOffset),
    sunsetMin: norm(sunsetUtc + tzOffset),
    zenithMin: norm((sunriseUtc + sunsetUtc) / 2 + tzOffset),
  };
}

const SYNODIC = 29.53058867;
// Época: lua nova de 06 jan 2000 18:14 UTC = dia unix 10962.76
const NEW_MOON_EPOCH_DAYS = 10962.76;

export function moonAge(date: Date): number {
  const days = date.getTime() / 86_400_000;
  return (((days - NEW_MOON_EPOCH_DAYS) % SYNODIC) + SYNODIC) % SYNODIC;
}

const PHASES: Array<{ name: string; glyph: string }> = [
  { name: 'lua nova', glyph: '●' },
  { name: 'lua crescente', glyph: '☽' },
  { name: 'quarto crescente', glyph: '☽' },
  { name: 'gibosa crescente', glyph: '☽' },
  { name: 'lua cheia', glyph: '○' },
  { name: 'gibosa minguante', glyph: '☾' },
  { name: 'quarto minguante', glyph: '☾' },
  { name: 'lua minguante', glyph: '☾' },
];

export function moonPhase(date: Date): { name: string; glyph: string } {
  const age = moonAge(date);
  const idx = Math.floor((((age + SYNODIC / 16) % SYNODIC) / SYNODIC) * 8) % 8;
  return PHASES[idx];
}

export function skyNow(date: Date = new Date(), lat = HOME_LAT, lon = HOME_LON): SkyNow {
  const { sunriseMin, sunsetMin } = sunTimes(date, lat, lon);
  const minutes = date.getHours() * 60 + date.getMinutes();
  const isDay = minutes >= sunriseMin && minutes <= sunsetMin;
  const phase = moonPhase(date);

  let t: number;
  if (isDay) {
    t = (minutes - sunriseMin) / (sunsetMin - sunriseMin);
  } else {
    const nightLen = 1440 - (sunsetMin - sunriseMin);
    const since = minutes > sunsetMin ? minutes - sunsetMin : minutes + (1440 - sunsetMin);
    t = since / nightLen;
  }

  return {
    isDay,
    t: Math.min(1, Math.max(0, t)),
    glyph: isDay ? '☀' : phase.glyph,
    phaseName: phase.name,
    minutes,
  };
}

export function fmtMin(m: number): string {
  const h = Math.floor(m / 60), mm = Math.round(m % 60);
  return `${h}:${String(mm).padStart(2, '0')}`;
}
