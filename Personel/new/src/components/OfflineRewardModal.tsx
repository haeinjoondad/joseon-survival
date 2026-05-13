import { useState } from 'react'
import type { WorkType } from '../types/game'

interface Props {
  merit: number
  salary: number
  reputation: number
  workId: WorkType
  workedSeconds: number
  stoppedAfterSeconds: number | null
  stoppedByMental: boolean
  canRecoverMental: boolean
  onRecoverMental: () => void
  onDismiss: () => void
}

const WORK_NARRATIVES: Record<WorkType, (duration: string) => string> = {
  petition: duration => `${duration} 동안 상소문을 작성했습니다. 필력이 날카로워진 것 같습니다.`,
  complaint: duration => `${duration} 동안 민원을 처리했습니다. 백성들이 당신의 노고를 칭송합니다.`,
  meeting: duration => `${duration} 동안 회의에 참석했습니다. 조정의 흐름이 손에 잡히는 듯합니다.`,
}

function formatDuration(seconds: number) {
  const totalMinutes = Math.max(1, Math.floor(seconds / 60))
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  if (hours <= 0) return `${totalMinutes}분`
  if (minutes <= 0) return `${hours}시간`
  return `${hours}시간 ${minutes}분`
}

export function OfflineRewardModal({
  merit,
  salary,
  reputation,
  workId,
  workedSeconds,
  stoppedAfterSeconds,
  stoppedByMental,
  canRecoverMental,
  onRecoverMental,
  onDismiss,
}: Props) {
  const [recovered, setRecovered] = useState(false)
  const hasReputationReward = reputation >= 0.01
  const durationText = formatDuration(workedSeconds)
  const stopDurationText = formatDuration(stoppedAfterSeconds ?? workedSeconds)
  const narrative = WORK_NARRATIVES[workId](durationText)

  function handleRecoverMental() {
    if (!canRecoverMental || recovered) return
    onRecoverMental()
    setRecovered(true)
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6">
      <div className="bg-stone-900 border border-amber-700 rounded-xl p-6 w-full max-w-sm text-center shadow-2xl">
        <div className="text-4xl mb-3">📨</div>
        <h3 className="text-amber-400 font-bold text-lg mb-1">부재중 업무 보고</h3>
        <p className="text-stone-300 text-sm leading-relaxed mb-2">{narrative}</p>
        <p className="text-stone-400 text-xs mb-5">
          {stoppedByMental
            ? '멘탈이 한계에 가까워져 업무가 중단되었습니다.'
            : '자리를 비운 동안 관청이 돌아갔습니다.'}
        </p>

        <div className="bg-stone-800 rounded-lg p-4 space-y-2 mb-5">
          <div className="flex justify-between">
            <span className="text-stone-400 text-sm">⏳ 업무 시간</span>
            <span className="text-hanji font-bold">{durationText}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-400 text-sm">⚔ 획득 공적</span>
            <span className="text-amber-400 font-bold">+{merit.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-400 text-sm">💰 획득 녹봉</span>
            <span className="text-green-400 font-bold">+{salary.toLocaleString()}</span>
          </div>
          {hasReputationReward && (
            <div className="flex justify-between">
              <span className="text-stone-400 text-sm">👥 획득 평판</span>
              <span className="text-blue-400 font-bold">+{reputation.toFixed(2)}</span>
            </div>
          )}
        </div>

        {stoppedByMental && (
          <div className="bg-purple-950/60 border border-purple-800 rounded-lg px-3 py-3 mb-4 text-purple-100 text-xs leading-relaxed">
            <p className="mb-3">
              ⚠️ 멘탈 부족으로 {stopDurationText} 후 업무가 중단되었습니다.
            </p>
            {recovered ? (
              <div className="text-green-300 font-bold">회복 완료</div>
            ) : (
              <button
                onClick={handleRecoverMental}
                disabled={!canRecoverMental}
                className="w-full bg-purple-700 hover:bg-purple-600 disabled:bg-stone-700 disabled:text-stone-500 text-hanji font-bold py-2 rounded transition-colors"
              >
                {canRecoverMental ? '지금 멘탈 회복하기' : '녹봉 부족'}
              </button>
            )}
          </div>
        )}

        <button
          onClick={onDismiss}
          className="w-full bg-amber-700 hover:bg-amber-600 text-hanji font-bold py-3 rounded-lg transition-colors"
        >
          수령하다
        </button>
        <p className="text-stone-600 text-xs mt-2">광고를 보면 2배 수령 (예정)</p>
      </div>
    </div>
  )
}
