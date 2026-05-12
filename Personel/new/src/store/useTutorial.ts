import { useState, useEffect } from 'react'
import type { Player } from '../types/game'

const TUTORIAL_KEY = 'joseon_tutorial_step'

export type TutorialStep =
  | 'work'       // 업무 탭 - 상소문 클릭 유도
  | 'accumulate' // 공적 쌓이는 중 - 설명
  | 'stats'      // 성장 탭 - 강화 유도
  | 'promotion'  // 승진 탭 - 도전 유도
  | 'done'       // 완료

function loadStep(): TutorialStep {
  return (localStorage.getItem(TUTORIAL_KEY) as TutorialStep) ?? 'work'
}

function saveStep(step: TutorialStep) {
  localStorage.setItem(TUTORIAL_KEY, step)
}

export function useTutorial(player: Player | null) {
  const [step, setStep] = useState<TutorialStep>(loadStep)

  // 게임 상태에 따라 단계 자동 진행
  useEffect(() => {
    if (!player || step === 'done') return

    if (step === 'work' && player.merit > 0) {
      // 업무 시작됨 → 공적 쌓이는 중 단계로
      advance('accumulate')
    }

    if (step === 'accumulate' && player.merit >= 30) {
      // 공적 30 이상 → 성장 탭 유도
      advance('stats')
    }

    if (step === 'stats' && (
      player.stats.writing > 1 ||
      player.stats.sense > 1 ||
      player.stats.politics > 1 ||
      player.equipment.brush > 1 ||
      player.equipment.desk > 1 ||
      player.equipment.robe > 1
    )) {
      // 강화 1회 이상 → 승진 탭 유도
      advance('promotion')
    }
  }, [player?.merit, player?.stats, player?.equipment, step])

  function advance(next: TutorialStep) {
    setStep(next)
    saveStep(next)
  }

  function completeTutorial() {
    advance('done')
  }

  function resetTutorial() {
    advance('work')
  }

  return { step, advance, completeTutorial, resetTutorial }
}
