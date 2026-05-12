import type { TutorialStep } from '../store/useTutorial'
import type { TabType } from '../types/game'

interface Props {
  step: TutorialStep
  currentTab: TabType
  onSkip: () => void
}

const STEPS: Record<Exclude<TutorialStep, 'done'>, {
  emoji: string
  title: string
  desc: string
  targetTab?: TabType
}> = {
  work: {
    emoji: '👇',
    title: '첫 업무를 시작하십시오',
    desc: '아래 업무 탭에서 상소문 작성을 선택하면 공적이 자동으로 쌓입니다.',
    targetTab: 'work',
  },
  accumulate: {
    emoji: '⏳',
    title: '공적이 쌓이고 있습니다',
    desc: '자리를 비워도 업무는 계속됩니다. 녹봉이 30냥 이상 모이면 능력치를 강화할 수 있습니다.',
    targetTab: 'work',
  },
  stats: {
    emoji: '⬆️',
    title: '성장 탭에서 능력치를 강화하십시오',
    desc: '녹봉을 소비해 필력·눈치·정치력을 올리면 공적 획득량과 승진 확률이 높아집니다.',
    targetTab: 'stats',
  },
  promotion: {
    emoji: '🏆',
    title: '승진 심사에 도전하십시오',
    desc: '승진 탭에서 조건을 확인하고 다음 품계에 도전하십시오. 공적이 많을수록 성공률이 올라갑니다.',
    targetTab: 'promotion',
  },
}

export function TutorialBanner({ step, currentTab, onSkip }: Props) {
  if (step === 'done') return null

  const info = STEPS[step]
  const isTargetTab = !info.targetTab || currentTab === info.targetTab
  const isAccumulate = step === 'accumulate'

  // accumulate 단계는 따로 강조할 탭이 없으니 항상 보여줌
  if (!isTargetTab && !isAccumulate) return null

  return (
    <div className="mx-4 mt-3 bg-amber-950 border border-amber-700 rounded-lg p-3 relative">
      {/* 말풍선 꼭짓점 (위를 가리킴) */}
      <div className="absolute -top-2 left-6 w-3 h-3 bg-amber-950 border-l border-t border-amber-700 rotate-45" />

      <div className="flex items-start gap-2">
        <span className="text-xl mt-0.5">{info.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="text-amber-400 text-xs font-bold mb-0.5">{info.title}</div>
          <p className="text-amber-200/70 text-xs leading-relaxed">{info.desc}</p>
        </div>
        <button
          onClick={onSkip}
          className="text-amber-700 hover:text-amber-500 text-xs shrink-0 mt-0.5"
        >
          건너뛰기
        </button>
      </div>
    </div>
  )
}
