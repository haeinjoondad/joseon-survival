export interface EventEffect {
  merit?: number
  salary?: number
  mental?: number
  stamina?: number
  reputation?: number
  writingExp?: number
  senseExp?: number
  politicsExp?: number
}

export interface EventChoice {
  text: string
  // 스탯 판정이 필요한 경우
  check?: { stat: 'writing' | 'sense' | 'politics'; threshold: number }
  effect?: EventEffect       // 무조건 적용 or 판정 성공 시
  failEffect?: EventEffect   // 판정 실패 시
  successMsg?: string
  failMsg?: string
  resultMsg?: string         // 판정 없는 단순 결과 메시지
}

export interface GameEvent {
  id: string
  title: string
  description: string
  emoji: string
  // 발생 조건 (없으면 항상 발생 가능)
  condition?: {
    minRank?: number
    maxRank?: number
    minMental?: number
    maxMental?: number
  }
  choices: EventChoice[]
}
