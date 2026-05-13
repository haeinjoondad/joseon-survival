import type { Player, WorkType } from '../types/game'
import { WORKS } from '../data/works'
import {
  KING_MOODS,
  LEDGER_MERIT_MULTIPLIER,
  getMsToNextInspection,
  getLedgerInspectionChance,
} from '../data/balance'

const COMPLAINT_REPUTATION_PER_HOUR = 3
const ROBE_COMPLAINT_REPUTATION_BONUS_PER_LEVEL = 0.02
const STAT_LABELS = {
  writing: { emoji: '🖌️', label: '필력' },
  sense: { emoji: '👁️', label: '눈치' },
  politics: { emoji: '🏛️', label: '정치력' },
}

function formatMinutes(ms: number) {
  return `${Math.max(1, Math.ceil(ms / 60000))}분`
}

function getRiskLabel(chance: number) {
  if (chance >= 0.5) return '매우 높음'
  if (chance >= 0.3) return '높음'
  if (chance >= 0.15) return '보통'
  return '낮음'
}

interface Props {
  player: Player
  onSetWork: (work: WorkType) => void
  onSetLedgerManipulation: (enabled: boolean) => void
  onRecover: () => void
  onRecoverStamina: () => void
}

export function WorkPanel({ player, onSetWork, onSetLedgerManipulation, onRecover, onRecoverStamina }: Props) {
  const mood = KING_MOODS[player.kingMood]
  const msToNextInspection = getMsToNextInspection()
  const ledgerInspectionChance = player.ledgerManipulation
    ? getLedgerInspectionChance(player.ledgerHeat, player.kingMood)
    : 0
  const canRecoverStamina = player.stamina < 100 && player.salary >= 50

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
      <h2 className="text-hanji text-sm font-bold text-center mb-4">── 오늘의 업무 ──</h2>

      <button
        onClick={() => onSetLedgerManipulation(!player.ledgerManipulation)}
        className={`w-full rounded-lg border px-3 py-2 text-left transition-colors ${
          player.ledgerManipulation
            ? 'bg-red-950/70 border-red-700'
            : 'bg-stone-800 border-stone-700 hover:border-stone-500'
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-hanji text-sm font-bold">📒 장부 조작</div>
            <div className="text-stone-400 text-xs">공적 x3 · 15분/45분 감찰 위험</div>
          </div>
          <div className={`text-xs font-bold shrink-0 ${player.ledgerManipulation ? 'text-red-300' : 'text-stone-500'}`}>
            {player.ledgerManipulation ? '조작 중' : '꺼짐'}
          </div>
        </div>
        {player.ledgerManipulation && (
          <div className="mt-1 space-y-0.5 text-xs text-red-300">
            <div>
              다음 감찰까지 {formatMinutes(msToNextInspection)} · 의심도 {Math.floor(player.ledgerHeat)} · 위험 {getRiskLabel(ledgerInspectionChance)}({Math.floor(ledgerInspectionChance * 100)}%)
            </div>
            <div className="text-red-200/80">
              왕심 {mood.label}: 감찰 위험 {mood.ledgerRiskBonus >= 0 ? '+' : ''}{Math.round(mood.ledgerRiskBonus * 100)}% · 의심도 70 이상 적발 시 강등 가능
            </div>
          </div>
        )}
      </button>

      {WORKS.map(work => {
        const isActive = player.currentWork === work.id
        const statVal = player.stats[work.statScaling]
        const statBonus = 1 + (statVal - 1) * 0.1
        const brushBonus = 1 + (player.equipment.brush - 1) * 0.05
        const deskBonus = 1 + (player.equipment.desk - 1) * 0.03
        const staminaPenalty = player.stamina === 0 ? 0.5 : player.stamina < 30 ? 0.8 : 1
        const moodMeritBonus = work.id === 'petition' ? mood.meritMultiplier : 1
        const ledgerBonus = player.ledgerManipulation ? LEDGER_MERIT_MULTIPLIER : 1
        const meritPerSecond = work.meritPerSec * statBonus * brushBonus * deskBonus * staminaPenalty * moodMeritBonus * ledgerBonus
        const salaryPerSecond = work.salaryPerSec * deskBonus
        const robeEnhancementLevel = Math.max(0, player.equipment.robe - 1)
        const complaintReputationPerHour = COMPLAINT_REPUTATION_PER_HOUR *
          (1 + robeEnhancementLevel * ROBE_COMPLAINT_REPUTATION_BONUS_PER_LEVEL)
        const growthStat = STAT_LABELS[work.statScaling]

        return (
          <button
            key={work.id}
            onClick={() => onSetWork(work.id)}
            className={`w-full text-left rounded-lg p-4 border transition-all ${
              isActive
                ? 'bg-amber-900 border-amber-500 shadow-lg shadow-amber-900/50'
                : 'bg-stone-800 border-stone-700 hover:border-stone-500'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="text-xl">{work.emoji}</span>
                <span className="text-hanji font-bold text-sm">{work.name}</span>
              </div>
              {isActive && (
                <span className="text-amber-400 text-xs animate-pulse">진행 중</span>
              )}
            </div>
            <p className="text-stone-400 text-xs mb-2">{work.description}</p>
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs">
              <span className="text-amber-300">⚔ +{meritPerSecond.toFixed(1)}/초</span>
              <span className="text-green-400">💰 +{salaryPerSecond.toFixed(1)}/초</span>
              {work.id === 'complaint' && (
                <span className="text-blue-400">👥 +{complaintReputationPerHour.toFixed(2)}/시간</span>
              )}
              <span className="text-purple-400">멘탈 -{(work.mentalCost * mood.mentalCostMultiplier).toFixed(1)}/분</span>
              <span className="text-red-400">체력 -{work.staminaCost.toFixed(1)}/분</span>
              <span className="text-stone-300">{growthStat.emoji} {growthStat.label}</span>
            </div>
          </button>
        )
      })}

      <div className="mt-4 pt-4 border-t border-stone-700 space-y-2">
        {player.stamina < 30 && (
          <div className={`text-xs px-3 py-2 rounded-lg flex items-center justify-between gap-3 ${
            player.stamina === 0
              ? 'bg-red-950 text-red-400 border border-red-800'
              : 'bg-orange-950 text-orange-400 border border-orange-800'
          }`}>
            <span>
              {player.stamina === 0
                ? '⚠️ 체력 고갈 — 공적 생산 -50%'
                : '⚠️ 체력 부족 — 공적 생산 -20%'}
            </span>
            <button
              onClick={onRecoverStamina}
              disabled={!canRecoverStamina}
              className="shrink-0 bg-red-800 hover:bg-red-700 disabled:bg-stone-700 disabled:text-stone-500 disabled:cursor-not-allowed text-hanji rounded px-2 py-1 transition-colors"
            >
              {player.salary < 50 ? '녹봉 부족' : '잠깐 휴식'}
            </button>
          </div>
        )}

        <button
          onClick={onRecover}
          disabled={player.mental >= 100 || player.salary < 50}
          className="w-full bg-purple-900 hover:bg-purple-800 disabled:opacity-40 disabled:cursor-not-allowed text-hanji py-3 rounded-lg border border-purple-700 text-sm transition-colors flex items-center justify-center gap-2"
        >
          <span>🍵 탕약 복용</span>
          <span className="text-xs opacity-75">멘탈 +30 / 💰 50냥</span>
        </button>

        <button
          onClick={onRecoverStamina}
          disabled={!canRecoverStamina}
          className="w-full bg-red-900 hover:bg-red-800 disabled:opacity-40 disabled:cursor-not-allowed text-hanji py-3 rounded-lg border border-red-700 text-sm transition-colors flex items-center justify-center gap-2"
        >
          <span>🛏️ 잠깐 휴식</span>
          <span className="text-xs opacity-75">체력 +30 / 💰 50냥</span>
        </button>
      </div>
    </div>
  )
}
