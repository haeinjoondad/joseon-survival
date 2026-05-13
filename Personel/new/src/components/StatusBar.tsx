import type { Player } from '../types/game'
import { RANKS } from '../data/ranks'
import { KING_MOODS } from '../data/balance'

interface Props {
  player: Player
}

function Bar({ value, max = 100, color }: { value: number; max?: number; color: string }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100))
  return (
    <div className="w-full bg-stone-800 rounded-full h-2">
      <div
        className={`h-2 rounded-full transition-all duration-500 ${color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

function MentalEmoji({ mental }: { mental: number }) {
  if (mental >= 70) return <span>😊</span>
  if (mental >= 40) return <span>😔</span>
  if (mental >= 15) return <span>😵</span>
  return <span>💀</span>
}

export function StatusBar({ player }: Props) {
  const rank = RANKS[player.rankIndex]
  const mood = KING_MOODS[player.kingMood]

  return (
    <div className="bg-stone-900 border-b border-stone-700 px-4 py-3">
      {/* 품계 및 이름 */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-amber-400 text-xs font-bold">{rank.name} {rank.title}</span>
          <span className="text-stone-400 text-xs ml-2">{player.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs ${mood.color}`}>왕심 {mood.emoji} {mood.label}</span>
          <MentalEmoji mental={player.mental} />
        </div>
      </div>

      {/* 자원 */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="text-center">
          <div className="text-amber-300 text-xs">⚔ 공적</div>
          <div className="text-hanji font-bold text-sm">{Math.floor(player.merit).toLocaleString()}</div>
        </div>
        <div className="text-center">
          <div className="text-green-400 text-xs">💰 녹봉</div>
          <div className="text-hanji font-bold text-sm">{Math.floor(player.salary).toLocaleString()}</div>
        </div>
        <div className="text-center">
          <div className="text-blue-400 text-xs">👥 평판</div>
          <div className="text-hanji font-bold text-sm">{Math.floor(player.reputation)}</div>
        </div>
      </div>

      {/* 멘탈/체력 바 */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="text-purple-400 text-xs w-8">멘탈</span>
          <Bar value={player.mental} color="bg-purple-500" />
          <span className="text-purple-400 text-xs w-8 text-right">{Math.floor(player.mental)}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-red-400 text-xs w-8">체력</span>
          <Bar value={player.stamina} color="bg-red-500" />
          <span className="text-red-400 text-xs w-8 text-right">{Math.floor(player.stamina)}</span>
        </div>
      </div>
    </div>
  )
}
