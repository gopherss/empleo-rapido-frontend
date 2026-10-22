export const CURRENCIES = [
  'BOB',
  'USD',
  'EUR',
  'ARS',
  'BRL',
  'PEN',
  'CLP',
  'COP',
] as const
export type Currency = (typeof CURRENCIES)[number]

export const CURRENCY_LABELS: Record<Currency, string> = {
  BOB: 'Boliviano (Bs)',
  USD: 'Dolar estadounidense (US$)',
  EUR: 'Euro (EUR)',
  ARS: 'Peso argentino (AR$)',
  BRL: 'Real brasileno (R$)',
  PEN: 'Sol peruano (S/)',
  CLP: 'Peso chileno (CLP$)',
  COP: 'Peso colombiano (COL$)',
}

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  BOB: 'Bs',
  USD: 'US$',
  EUR: 'EUR',
  ARS: 'AR$',
  BRL: 'R$',
  PEN: 'S/',
  CLP: 'CLP$',
  COP: 'COL$',
}

export const CURRENCY_OPTIONS = CURRENCIES.map((value) => ({
  value,
  label: CURRENCY_LABELS[value],
}))

export const WORK_CATEGORIES = [
  'PLOMERIA',
  'ELECTRICIDAD',
  'CARPINTERIA',
  'PINTURA',
  'ALBANILERIA',
  'CERRAJERIA',
  'GAS',
  'ELECTRODOMESTICOS',
  'JARDINERIA',
  'LIMPIEZA',
  'AIRE_ACONDICIONADO',
  'TECHOS',
  'MUDANZAS',
  'OTROS',
] as const
export type WorkCategory = (typeof WORK_CATEGORIES)[number]

export const CATEGORY_LABELS: Record<WorkCategory, string> = {
  PLOMERIA: 'Plomeria',
  ELECTRICIDAD: 'Electricidad',
  CARPINTERIA: 'Carpinteria',
  PINTURA: 'Pintura',
  ALBANILERIA: 'Albanileria',
  CERRAJERIA: 'Cerrajeria',
  GAS: 'Gas',
  ELECTRODOMESTICOS: 'Electrodomesticos',
  JARDINERIA: 'Jardineria',
  LIMPIEZA: 'Limpieza',
  AIRE_ACONDICIONADO: 'Aire acondicionado',
  TECHOS: 'Techos',
  MUDANZAS: 'Mudanzas',
  OTROS: 'Otros',
}

export const CATEGORY_OPTIONS = WORK_CATEGORIES.map((value) => ({
  value,
  label: CATEGORY_LABELS[value],
}))
