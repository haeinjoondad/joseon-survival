import { useState } from 'react'

interface Props {
  onStart: (name: string) => void
}

export function StartScreen({ onStart }: Props) {
  const [name, setName] = useState('')

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
            임용장을 받다
          </button>
        </div>

        <p className="text-stone-600 text-xs mt-6">
          조선시대 관료제를 현대 직장인 감성으로 재해석한<br />풍자 방치 생존 게임
        </p>
      </div>
    </div>
  )
}
