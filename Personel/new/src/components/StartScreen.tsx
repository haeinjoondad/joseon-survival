import { useState } from 'react'
import type { ReactNode } from 'react'

interface Props {
  onStart: (name: string) => void
  authPanel?: ReactNode
}

const INTRO_STEPS = [
  '조선 조정에 첫 출근했습니다.',
  '당신은 오늘, 말단 관리로 임명되었습니다.\n해야 할 일은 많고, 녹봉은 적으며,\n왕의 기분은 예측할 수 없습니다.',
  '민원을 처리해 평판을 얻고,\n상소문을 올려 공적을 쌓고,\n때로는 위험한 선택으로 빠르게 출세할 수도 있습니다.',
  '하지만 조심하십시오.',
  '의심이 쌓이면 감찰이 오고,\n감찰에 걸리면 공적과 평판,\n심하면 품계까지 잃을 수 있습니다.',
  '조정은 능력만으로 살아남는 곳이 아닙니다.',
  '이제 출근하십시오.',
]

export function StartScreen({ onStart, authPanel }: Props) {
  const [name, setName] = useState('')
  const [introStep, setIntroStep] = useState(0)
  const [showIntro, setShowIntro] = useState(true)

  const isLastIntroStep = introStep === INTRO_STEPS.length - 1

  function advanceIntro() {
    if (isLastIntroStep) {
      setShowIntro(false)
      return
    }
    setIntroStep(step => Math.min(INTRO_STEPS.length - 1, step + 1))
  }

  if (showIntro) {
    return (
      <div className="min-h-screen bg-ink flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-sm text-center">
          <div className="text-6xl mb-5">📜</div>
          <div
            onClick={advanceIntro}
            className="bg-stone-900 border border-amber-800 rounded-lg px-5 py-8 min-h-64 flex flex-col justify-center cursor-pointer active:bg-stone-800 transition-colors"
          >
            <p className="text-hanji text-lg font-bold leading-relaxed whitespace-pre-line">
              {INTRO_STEPS[introStep]}
            </p>
          </div>

          <div className="flex items-center justify-center gap-1.5 mt-4">
            {INTRO_STEPS.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${i === introStep ? 'w-5 bg-amber-400' : 'w-1.5 bg-stone-700'}`}
              />
            ))}
          </div>

          <button
            onClick={advanceIntro}
            className="w-full bg-amber-700 hover:bg-amber-600 active:bg-amber-800 text-hanji font-bold py-3 rounded mt-6 transition-colors"
          >
            {isLastIntroStep ? '출근하기' : '계속'}
          </button>

          <button
            onClick={() => setShowIntro(false)}
            className="text-stone-500 hover:text-stone-300 text-xs mt-4"
          >
            건너뛰기
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ink flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm text-center">
        <div className="text-6xl mb-4">📜</div>
        <h1 className="text-hanji text-3xl font-bold mb-2 leading-tight">
          조선 관리 생존기
        </h1>
        <p className="text-amber-400 text-sm mb-1">종9품에서 영의정까지</p>
        <p className="text-stone-400 text-xs mb-10">살아남는 자가 승진한다</p>

        <div className="bg-stone-800 rounded-lg p-6 border border-stone-700">
          <p className="text-hanji text-sm mb-3">관리의 이름을 입력하시오</p>
          <input
            className="w-full bg-stone-900 border border-stone-600 rounded px-3 py-2 text-hanji text-center focus:outline-none focus:border-amber-500 mb-4"
            placeholder="예) 이몽룡, 홍길동..."
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && onStart(name)}
            maxLength={10}
          />
          <button
            onClick={() => onStart(name)}
            className="w-full bg-amber-700 hover:bg-amber-600 active:bg-amber-800 text-hanji font-bold py-3 rounded transition-colors"
          >
            게스트로 임용장을 받다
          </button>
        </div>

        {authPanel}

        <p className="text-stone-600 text-xs mt-6">
          조선시대 관료제를 현대 직장인 감성으로 재해석한<br />풍자 방치 생존 게임
        </p>
      </div>
    </div>
  )
}
