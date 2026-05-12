import type { Player, WorkType } from '../types/game'
import { WORKS } from '../data/works'

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
        const bonus = (1 + (statVal - 1) * 0.1).toFixed(1)

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
            <div className="flex gap-3 text-xs">
              <span className="text-amber-300">⚔ +{(work.meritPerSec * parseFloat(bonus)).toFixed(1)}/초</span>
              <span className="text-green-400">💰 +{work.salaryPerSec.toFixed(1)}/초</span>
              <span className="text-purple-400">멘탈 -{(work.mentalCost / 60).toFixed(2)}/초</span>
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
