import type { GameEvent } from '../types/event'
import type { Player } from '../types/game'
import type { EventResult } from '../store/useGameStore'

interface EventProps {
  event: GameEvent
  player: Player
  onChoose: (index: number) => void
}

interface ResultProps {
  result: EventResult
  onDismiss: () => void
}

function StatBadge({ stat, value, threshold }: { stat: string; value: number; threshold: number }) {
  const labels: Record<string, string> = { writing: '필력', sense: '눈치', politics: '정치력' }
  const ok = value >= threshold
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border ${ok ? 'border-green-600 text-green-400 bg-green-950' : 'border-red-700 text-red-400 bg-red-950'}`}>
      {labels[stat]} {value}/{threshold} {ok ? '✓' : '✗'}
    </span>
  )
}

const EFFECT_LABELS: Record<string, string> = {
  merit: '공적',
  salary: '녹봉',
  mental: '멘탈',
  stamina: '체력',
  reputation: '평판',
  writingExp: '필력 경험치',
  senseExp: '눈치 경험치',
  politicsExp: '정치력 경험치',
}

const VISIBLE_EFFECT_KEYS = Object.keys(EFFECT_LABELS)

export function EventModal({ event, player, onChoose }: EventProps) {
  return (
    <div className="fixed inset-0 bg-black/75 flex items-end justify-center z-50 p-4 pb-6">
      <div className="bg-stone-900 border border-amber-700 rounded-xl w-full max-w-sm shadow-2xl">
        {/* 헤더 */}
        <div className="px-5 pt-5 pb-3 border-b border-stone-700">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{event.emoji}</span>
            <div>
              <div className="text-xs text-amber-500 font-bold mb-0.5">사건 발생</div>
              <h3 className="text-hanji font-bold text-base leading-tight">{event.title}</h3>
            </div>
          </div>
        </div>

        {/* 상황 설명 */}
        <div className="px-5 py-4">
          <p className="text-stone-300 text-sm leading-relaxed whitespace-pre-line">
            {event.description}
          </p>
        </div>

        {/* 선택지 */}
        <div className="px-5 pb-5 space-y-2">
          {event.choices.map((choice, i) => {
            const hasCheck = !!choice.check
            return (
              <button
                key={i}
                onClick={() => onChoose(i)}
                className="w-full text-left bg-stone-800 hover:bg-stone-700 active:bg-stone-600 border border-stone-600 hover:border-amber-700 rounded-lg p-3 transition-all"
              >
                <div className="text-hanji text-sm mb-1.5">{choice.text}</div>
                {hasCheck && choice.check && (
                  <StatBadge
                    stat={choice.check.stat}
                    value={player.stats[choice.check.stat]}
                    threshold={choice.check.threshold}
                  />
                )}
                {/* 예상 효과 힌트 */}
                {choice.effect && !hasCheck && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {Object.entries(choice.effect)
                      .filter(([k]) => VISIBLE_EFFECT_KEYS.includes(k))
                      .map(([k, v]) => {
                        const pos = (v as number) >= 0
                        return (
                          <span key={k} className={`text-xs ${pos ? 'text-green-400' : 'text-red-400'}`}>
                            {EFFECT_LABELS[k]} {pos ? '+' : ''}{v as number}
                          </span>
                        )
                      })}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export function EventResultModal({ result, onDismiss }: ResultProps) {
  const isSuccess = result.success === true
  const isFail = result.success === false

  const borderColor = isSuccess ? 'border-green-700' : isFail ? 'border-red-700' : 'border-stone-600'
  const headerColor = isSuccess ? 'text-green-400' : isFail ? 'text-red-400' : 'text-amber-400'
  const headerText = isSuccess ? '판정 성공' : isFail ? '판정 실패' : '결과'

  return (
    <div className="fixed inset-0 bg-black/75 flex items-end justify-center z-50 p-4 pb-6">
      <div className={`bg-stone-900 border ${borderColor} rounded-xl w-full max-w-sm shadow-2xl`}>
        <div className="px-5 pt-5 pb-3 border-b border-stone-700">
          <div className={`text-xs font-bold mb-1 ${headerColor}`}>{headerText}</div>
          <div className="text-hanji text-sm italic">"{result.choiceText}"</div>
        </div>

        <div className="px-5 py-4">
          <p className="text-stone-200 text-sm leading-relaxed">{result.message}</p>
        </div>

        {/* 효과 표시 */}
        {Object.keys(result.effects).length > 0 && (
          <div className="px-5 pb-4">
            <div className="bg-stone-800 rounded-lg p-3 flex flex-wrap gap-3">
              {Object.entries(result.effects).map(([label, val]) => {
                const pos = val >= 0
                return (
                  <div key={label} className="text-center">
                    <div className="text-stone-500 text-xs">{label}</div>
                    <div className={`font-bold text-sm ${pos ? 'text-green-400' : 'text-red-400'}`}>
                      {pos ? '+' : ''}{val}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <div className="px-5 pb-5">
          <button
            onClick={onDismiss}
            className="w-full bg-stone-700 hover:bg-stone-600 text-hanji py-3 rounded-lg text-sm transition-colors"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  )
}
