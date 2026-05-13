import { useState } from 'react'
import type { Player } from '../types/game'
import { RANKS, MAX_RANK_INDEX } from '../data/ranks'
import { KING_MOODS } from '../data/balance'

interface Props {
  player: Player
  onAttempt: () => 'success' | 'fail' | 'max' | 'not_ready'
}

export function PromotionPanel({ player, onAttempt }: Props) {
  const [result, setResult] = useState<'success' | 'fail' | 'max' | 'not_ready' | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  const currentRank = RANKS[player.rankIndex]
  const isMax = player.rankIndex >= MAX_RANK_INDEX
  const nextRank = isMax ? null : RANKS[player.rankIndex + 1]

  const meritOk = !nextRank || player.merit >= nextRank.meritRequired
  const repOk = !nextRank || player.reputation >= nextRank.reputationRequired

  const basePct = 40
  const meritBonus = nextRank
    ? Math.min(30, ((player.merit - nextRank.meritRequired) / nextRank.meritRequired) * 20)
    : 0
  const repBonus = nextRank
    ? Math.min(20, (player.reputation - nextRank.reputationRequired) * 0.5)
    : 0
  const politicsBonus = Math.min(10, (player.stats.politics - 1) * 2)
  const moodBonus = KING_MOODS[player.kingMood].promotionBonus
  const isTutorialPromotion = player.rankIndex === 0
  const successRate = isTutorialPromotion
    ? 100
    : Math.max(0, Math.min(99, basePct + meritBonus + repBonus + politicsBonus + moodBonus))
  const reputationCost = nextRank ? Math.floor(nextRank.reputationRequired * 0.5) : 0
  const canAttempt = Boolean(nextRank && meritOk && repOk && !isAnimating)

  function handleAttempt() {
    if (!canAttempt) return
    setIsAnimating(true)
    setResult(null)
    setTimeout(() => {
      const r = onAttempt()
      setResult(r)
      setIsAnimating(false)
    }, 1200)
  }

  const resultMsg = {
    success: { text: '🎉 승진하셨습니다! 더 높은 자리엔 더 많은 업무가 기다립니다.', color: 'text-amber-400' },
    fail:    { text: '😔 이번엔 안 되었습니다. 조금 더 공적을 쌓으십시오.', color: 'text-red-400' },
    max:     { text: '👑 이미 최고 품계에 오르셨습니다.', color: 'text-purple-400' },
    not_ready: { text: '📋 아직 조건이 부족합니다. 공적과 평판을 높이십시오.', color: 'text-stone-400' },
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4">
      <h2 className="text-hanji text-sm font-bold text-center mb-4">── 승진 심사 ──</h2>

      {/* 현재 관직 */}
      <div className="bg-stone-800 rounded-lg p-4 border border-stone-700 mb-4 text-center">
        <div className="text-stone-400 text-xs mb-1">현재 관직</div>
        <div className="text-amber-400 text-xl font-bold">{currentRank.name} {currentRank.title}</div>
        <div className="text-stone-500 text-xs mt-1">{player.name} 관리</div>
      </div>

      {nextRank && (
        <>
          {/* 다음 관직 */}
          <div className="bg-stone-800 rounded-lg p-4 border border-amber-800 mb-4">
            <div className="text-stone-400 text-xs mb-2">승진 목표</div>
            <div className="text-hanji font-bold text-center text-lg mb-3">
              {nextRank.name} {nextRank.title}
            </div>

            {/* 조건 */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-stone-400">⚔ 공적</span>
                <span className={`text-xs font-bold ${meritOk ? 'text-green-400' : 'text-red-400'}`}>
                  {Math.floor(player.merit).toLocaleString()} / {nextRank.meritRequired.toLocaleString()}
                  {meritOk ? ' ✓' : ' ✗'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-stone-400">👥 평판</span>
                <span className={`text-xs font-bold ${repOk ? 'text-green-400' : 'text-red-400'}`}>
                  {Math.floor(player.reputation)} / {nextRank.reputationRequired}
                  {repOk ? ' ✓' : ' ✗'}
                </span>
              </div>
            </div>

            {/* 성공률 */}
            <div className="mt-3 pt-3 border-t border-stone-700">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-stone-400">예상 승진 성공률</span>
                <span className={`text-sm font-bold ${successRate >= 60 ? 'text-green-400' : successRate >= 40 ? 'text-amber-400' : 'text-red-400'}`}>
                  {meritOk && repOk ? `${Math.floor(successRate)}%` : '조건 미충족'}
                </span>
              </div>
              {meritOk && repOk && (
                <div className="bg-stone-700 rounded-full h-2">
                  <div
                    className="bg-amber-500 h-2 rounded-full transition-all"
                    style={{ width: `${successRate}%` }}
                  />
                </div>
              )}
              {meritOk && repOk && reputationCost > 0 && (
                <div className="text-blue-300 text-xs mt-2 flex justify-between gap-3">
                  <span>왕심 보정 {moodBonus >= 0 ? '+' : ''}{moodBonus}%</span>
                  <span>성공 시 평판 {reputationCost} 소모</span>
                </div>
              )}
            </div>
          </div>

          {/* 심사 버튼 */}
          <button
            onClick={handleAttempt}
            disabled={!canAttempt}
            className={`w-full text-hanji font-bold py-4 rounded-lg text-lg transition-colors border ${
              canAttempt
                ? 'bg-seal hover:bg-red-700 border-red-800'
                : 'bg-stone-700 text-stone-500 border-stone-600 cursor-not-allowed'
            }`}
          >
            {isAnimating ? (
              <span className="animate-pulse">심사 중...</span>
            ) : (
              '📋 승진 심사 도전'
            )}
          </button>
        </>
      )}

      {isMax && (
        <div className="text-center text-amber-400 font-bold text-lg py-8">
          👑 영의정에 오르셨습니다!<br />
          <span className="text-stone-400 text-sm font-normal mt-2 block">
            조선 최고의 자리... 그러나 업무는 더 많아졌습니다.
          </span>
        </div>
      )}

      {/* 결과 메시지 */}
      {result && (
        <div className={`mt-4 p-4 bg-stone-800 rounded-lg border border-stone-600 text-center ${resultMsg[result].color} text-sm font-bold`}>
          {resultMsg[result].text}
        </div>
      )}
    </div>
  )
}
