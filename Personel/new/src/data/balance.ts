import type { KingMood } from '../types/game'

export const HALF_HOUR_MS = 30 * 60 * 1000
export const LEDGER_MERIT_MULTIPLIER = 3
export const LEDGER_HEAT_DECAY_PER_SECOND = 0.005
export const LEDGER_BASE_INSPECTION_CHANCE = 0.05
export const LEDGER_HEAT_INSPECTION_SCALE = 0.005

export const KING_MOODS: Record<KingMood, {
  label: string
  emoji: string
  color: string
  meritMultiplier: number
  mentalCostMultiplier: number
  promotionBonus: number
  ledgerRiskBonus: number
}> = {
  pleased: {
    label: '흐뭇',
    emoji: '😊',
    color: 'text-green-300',
    meritMultiplier: 1.15,
    mentalCostMultiplier: 0.9,
    promotionBonus: 5,
    ledgerRiskBonus: -0.05,
  },
  calm: {
    label: '평온',
    emoji: '😐',
    color: 'text-stone-300',
    meritMultiplier: 1,
    mentalCostMultiplier: 1,
    promotionBonus: 0,
    ledgerRiskBonus: 0,
  },
  irritated: {
    label: '불편',
    emoji: '😠',
    color: 'text-orange-300',
    meritMultiplier: 1.4,
    mentalCostMultiplier: 1.2,
    promotionBonus: -3,
    ledgerRiskBonus: 0.05,
  },
  furious: {
    label: '격노',
    emoji: '💢',
    color: 'text-red-300',
    meritMultiplier: 2.2,
    mentalCostMultiplier: 1.5,
    promotionBonus: -8,
    ledgerRiskBonus: 0.12,
  },
}

export function pickKingMood(): KingMood {
  const roll = Math.random()
  if (roll < 0.12) return 'pleased'
  if (roll < 0.65) return 'calm'
  if (roll < 0.9) return 'irritated'
  return 'furious'
}

export function getLedgerHeatGainPerSecond(ledgerHeat: number) {
  if (ledgerHeat >= 70) return 0.09
  if (ledgerHeat >= 50) return 0.06
  if (ledgerHeat >= 30) return 0.04
  return 0.02
}

export function getLedgerInspectionChance(ledgerHeat: number, kingMood: KingMood) {
  return Math.max(
    0.05,
    Math.min(
      0.8,
      LEDGER_BASE_INSPECTION_CHANCE +
        ledgerHeat * LEDGER_HEAT_INSPECTION_SCALE +
        KING_MOODS[kingMood].ledgerRiskBonus
    )
  )
}
