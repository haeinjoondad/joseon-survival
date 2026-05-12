interface Props {
  merit: number
  salary: number
  workedSeconds: number
  stoppedByMental: boolean
  onDismiss: () => void
}

function formatDuration(seconds: number) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  if (hours > 0) return `${hours}시간 ${minutes}분`
  return `${Math.max(1, minutes)}분`
}

export function OfflineRewardModal({ merit, salary, workedSeconds, stoppedByMental, onDismiss }: Props) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6">
      <div className="bg-stone-900 border border-amber-700 rounded-xl p-6 w-full max-w-sm text-center shadow-2xl">
        <div className="text-4xl mb-3">📨</div>
        <h3 className="text-amber-400 font-bold text-lg mb-1">부재중 업무 보고</h3>
        <p className="text-stone-400 text-xs mb-5">
          {stoppedByMental
            ? '멘탈이 한계에 가까워져 업무가 중단되었습니다.'
            : '자리를 비우신 동안 관청이 돌아갔습니다.'}
        </p>

        <div className="bg-stone-800 rounded-lg p-4 space-y-2 mb-5">
          <div className="flex justify-between">
            <span className="text-stone-400 text-sm">⏳ 업무 시간</span>
            <span className="text-hanji font-bold">{formatDuration(workedSeconds)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-400 text-sm">⚔ 획득 공적</span>
            <span className="text-amber-400 font-bold">+{merit.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-400 text-sm">💰 획득 녹봉</span>
            <span className="text-green-400 font-bold">+{salary.toLocaleString()}</span>
          </div>
        </div>

        {stoppedByMental && (
          <div className="bg-purple-950/60 border border-purple-800 rounded-lg px-3 py-2 mb-4 text-purple-200 text-xs leading-relaxed">
            멘탈 10에서 업무를 멈췄습니다. 탕약을 복용하면 다시 안정적으로 일할 수 있습니다.
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
