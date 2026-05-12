import type { Player } from '../types/game'
import { RANKS } from '../data/ranks'
import { WORKS } from '../data/works'

interface Props {
  player: Player
}

function getCharacterState(mental: number, stamina: number) {
  if (mental === 0 || stamina === 0) return 'burnout'
  if (mental < 20) return 'dead'
  if (mental < 40) return 'exhausted'
  if (mental < 65) return 'tired'
  return 'normal'
}

const CHARACTER_FRAMES: Record<string, { body: string; expression: string; statusText: string; bg: string }> = {
  normal: {
    body: '🧑‍💼',
    expression: '😊',
    statusText: '오늘도 열심히 일하는 중',
    bg: 'from-stone-800 to-stone-900',
  },
  tired: {
    body: '🧑‍💼',
    expression: '😔',
    statusText: '조금 피곤하지만 버티는 중...',
    bg: 'from-stone-800 to-stone-900',
  },
  exhausted: {
    body: '🧑‍💼',
    expression: '😵',
    statusText: '한계가 가까워오고 있다',
    bg: 'from-red-950 to-stone-900',
  },
  dead: {
    body: '🧑‍💼',
    expression: '💀',
    statusText: '영혼이 빠져나가는 느낌이다',
    bg: 'from-red-950 to-stone-950',
  },
  burnout: {
    body: '🧑‍💼',
    expression: '😶',
    statusText: '붓을 든 채 멍하니 앉아있다',
    bg: 'from-stone-950 to-stone-950',
  },
}

// 품계에 따라 관복 색상 변화
function getRobeColor(rankIndex: number) {
  if (rankIndex >= 13) return 'text-yellow-200'  // 정1품 의정
  if (rankIndex >= 10) return 'text-amber-300'   // 종2품~종1품
  if (rankIndex >= 8)  return 'text-purple-300'  // 당상관급
  if (rankIndex >= 6)  return 'text-blue-300'    // 6품 이상
  if (rankIndex >= 3)  return 'text-green-300'   // 중간
  return 'text-stone-300'                        // 하급
}

export function CharacterDisplay({ player }: Props) {
  const rank = RANKS[player.rankIndex]
  const work = WORKS.find(w => w.id === player.currentWork)!
  const state = getCharacterState(player.mental, player.stamina)
  const frame = CHARACTER_FRAMES[state]
  const robeColor = getRobeColor(player.rankIndex)

  return (
    <div className={`bg-gradient-to-b ${frame.bg} border-b border-stone-700 px-4 py-4 flex flex-col items-center`}>
      {/* 캐릭터 본체 */}
      <div className="relative mb-2">
        {/* 관복 배경 원 */}
        <div className={`w-24 h-24 rounded-full bg-stone-800 border-2 ${
          state === 'normal' ? 'border-amber-600' :
          state === 'tired'  ? 'border-stone-600' :
          'border-red-800'
        } flex items-center justify-center shadow-lg`}>
          <span className="text-5xl">{frame.body}</span>
        </div>

        {/* 표정 뱃지 (우하단) */}
        <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-stone-900 rounded-full border border-stone-700 flex items-center justify-center text-lg">
          {frame.expression}
        </div>

        {/* 품계 배지 (좌상단) */}
        <div className={`absolute -top-1 -left-1 bg-stone-900 border border-amber-700 rounded-full px-2 py-0.5 text-xs font-bold ${robeColor}`}>
          {rank.name}
        </div>
      </div>

      {/* 이름 + 직함 */}
      <div className="text-center mb-1">
        <span className="text-hanji font-bold text-base">{player.name}</span>
        <span className="text-amber-500 text-xs ml-2">{rank.title}</span>
      </div>

      {/* 현재 업무 상태 */}
      <div className="flex items-center gap-1.5 text-xs text-stone-400">
        <span>{work.emoji}</span>
        <span>{work.name} 중</span>
        <span className="text-amber-500 animate-pulse">●</span>
      </div>

      {/* 상태 코멘트 */}
      <p className="text-stone-500 text-xs mt-1.5 italic">"{frame.statusText}"</p>
    </div>
  )
}
