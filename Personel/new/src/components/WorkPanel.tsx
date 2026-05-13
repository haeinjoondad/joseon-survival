import type { Player, WorkType } from '../types/game'
import { WORKS } from '../data/works'

const COMPLAINT_REPUTATION_PER_HOUR = 3
const ROBE_COMPLAINT_REPUTATION_BONUS_PER_LEVEL = 0.02
const STAT_LABELS = {
  writing: { emoji: '✍️', label: '필력' },
  sense: { emoji: '👁️', label: '눈치' },
  politics: { emoji: '🏛️', label: '정치력' },
}

interface Props {
  player: Player
  onSetWork: (work: WorkType) => void
  onRecover: () => void
  onRecoverStamina: () => void
}

export function WorkPanel({ player, onSetWork, onRecover, onRecoverStamina }: Props) {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
      <h2 className="text-hanji text-sm font-bold text-center mb-4">── 오늘의 업무 ──</h2>

      {WORKS.map(work => {
        const isActive = player.currentWork === work.id
        const statVal = player.stats[work.statScaling]
        const statBonus = 1 + (statVal - 1) * 0.1
        const brushBonus = 1 + (player.equipment.brush - 1) * 0.05
        const deskBonus = 1 + (player.equipment.desk - 1) * 0.03
        const staminaPenalty = player.stamina === 0 ? 0.5 : player.stamina < 30 ? 0.8 : 1
        const meritPerSecond = work.meritPerSec * statBonus * brushBonus * deskBonus * staminaPenalty
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
                <span className="text-amber-400 text-xs animate-pulse">● 진행 중</span>
              )}
            </div>
            <p className="text-stone-400 text-xs mb-2">{work.description}</p>
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs">
              <span className="text-amber-300">⚔ +{meritPerSecond.toFixed(1)}/초</span>
              <span className="text-green-400">💰 +{salaryPerSecond.toFixed(1)}/초</span>
              {work.id === 'complaint' && (
                <span className="text-blue-400">👥 +{complaintReputationPerHour.toFixed(2)}/시간</span>
              )}
              <span className="text-purple-400">🧠 -{work.mentalCost.toFixed(1)}/분</span>
              <span className="text-red-400">❤️ -{work.staminaCost.toFixed(1)}/분</span>
              <span className="text-stone-300">{growthStat.emoji} {growthStat.label}</span>
            </div>
          </button>
        )
      })}

      {/* 회복 버튼 영역 */}
      <div className="mt-4 pt-4 border-t border-stone-700 space-y-2">

        {/* 체력 경고 */}
        {player.stamina < 30 && (
          <div className={`text-xs text-center px-3 py-2 rounded-lg ${
            player.stamina === 0
              ? 'bg-red-950 text-red-400 border border-red-800'
              : 'bg-orange-950 text-orange-400 border border-orange-800'
          }`}>
            {player.stamina === 0
              ? '⚠️ 체력 고갈 — 공적 생산 -50%'
              : '⚠️ 체력 부족 — 공적 생산 -20%'}
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
          disabled={player.stamina >= 100 || player.salary < 50}
          className="w-full bg-red-900 hover:bg-red-800 disabled:opacity-40 disabled:cursor-not-allowed text-hanji py-3 rounded-lg border border-red-700 text-sm transition-colors flex items-center justify-center gap-2"
        >
          <span>🛏️ 잠깐 휴식</span>
          <span className="text-xs opacity-75">체력 +30 / 💰 50냥</span>
        </button>
      </div>
    </div>
  )
}
