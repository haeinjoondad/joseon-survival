import type { Player } from '../types/game'
import { RANKS, MAX_RANK_INDEX } from '../data/ranks'
import { WORKS } from '../data/works'

interface Props {
  player: Player
  onOpenPromotion: () => void
}

function getMeritPerSecond(player: Player) {
  const work = WORKS.find(w => w.id === player.currentWork)!
  const statBonus = 1 + (player.stats[work.statScaling] - 1) * 0.1
  const brushBonus = 1 + (player.equipment.brush - 1) * 0.05
  const deskBonus = 1 + (player.equipment.desk - 1) * 0.03
  const staminaPenalty = player.stamina === 0 ? 0.5 : player.stamina < 30 ? 0.8 : 1

  return work.meritPerSec * statBonus * brushBonus * deskBonus * staminaPenalty
}

function formatDuration(seconds: number) {
  if (!Number.isFinite(seconds)) return '계산 불가'

  const safeSeconds = Math.max(0, seconds)
  const hours = Math.floor(safeSeconds / 3600)
  const minutes = Math.ceil((safeSeconds % 3600) / 60)

  if (hours >= 24) return `${Math.floor(hours / 24)}일 ${hours % 24}시간`
  if (hours > 0) return `${hours}시간 ${minutes}분`
  if (minutes > 0) return `${minutes}분`
  return '곧 가능'
}

function ProgressBar({ value, color }: { value: number; color: string }) {
  const pct = Math.max(0, Math.min(100, value))

  return (
    <div className="h-1.5 rounded-full bg-stone-800 overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-500 ${color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

export function PromotionGoalPanel({ player, onOpenPromotion }: Props) {
  if (player.rankIndex >= MAX_RANK_INDEX) {
    return (
      <div className="bg-stone-900 border-b border-stone-700 px-4 py-3">
        <div className="rounded-lg border border-amber-700 bg-amber-950/40 px-3 py-3 text-center">
          <div className="text-amber-300 text-xs font-bold">최종 목표 달성</div>
          <div className="text-hanji text-sm mt-1">정1품 영의정에 올랐습니다</div>
        </div>
      </div>
    )
  }

  const nextRank = RANKS[player.rankIndex + 1]
  const meritNeed = Math.max(0, nextRank.meritRequired - player.merit)
  const reputationNeed = Math.max(0, nextRank.reputationRequired - player.reputation)
  const meritPct = nextRank.meritRequired > 0
    ? (player.merit / nextRank.meritRequired) * 100
    : 100
  const reputationPct = nextRank.reputationRequired > 0
    ? (player.reputation / nextRank.reputationRequired) * 100
    : 100
  const meritPerSecond = getMeritPerSecond(player)
  const timeToMerit = meritNeed <= 0 ? 0 : meritNeed / meritPerSecond
  const ready = meritNeed === 0 && reputationNeed === 0

  return (
    <div className="bg-stone-900 border-b border-stone-700 px-4 py-3">
      <button
        onClick={onOpenPromotion}
        className={`w-full rounded-lg border px-3 py-3 text-left transition-colors ${
          ready
            ? 'bg-amber-950/70 border-amber-600 hover:bg-amber-900/70'
            : 'bg-stone-800 border-stone-700 hover:border-stone-600'
        }`}
      >
        <div className="flex items-center justify-between gap-3 mb-2">
          <div>
            <div className="text-stone-500 text-xs">다음 승진 목표</div>
            <div className="text-hanji text-sm font-bold">
              {nextRank.name} {nextRank.title}
            </div>
          </div>
          <div className={`text-xs font-bold shrink-0 ${ready ? 'text-amber-300' : 'text-stone-400'}`}>
            {ready ? '심사 가능' : formatDuration(timeToMerit)}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-stone-400">공적</span>
              <span className={meritNeed === 0 ? 'text-green-400' : 'text-amber-300'}>
                {meritNeed === 0 ? '충족' : `${Math.ceil(meritNeed).toLocaleString()} 부족`}
              </span>
            </div>
            <ProgressBar value={meritPct} color="bg-amber-500" />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-stone-400">평판</span>
              <span className={reputationNeed === 0 ? 'text-green-400' : 'text-blue-300'}>
                {reputationNeed === 0 ? '충족' : `${Math.ceil(reputationNeed)} 부족`}
              </span>
            </div>
            <ProgressBar value={reputationPct} color="bg-blue-500" />
          </div>
        </div>
      </button>
    </div>
  )
}
