import type { WorkInfo } from '../types/game'

export const WORKS: WorkInfo[] = [
  {
    id: 'petition',
    name: '상소문 작성',
    emoji: '📜',
    description: '붓을 들고 상소문을 작성한다. 필력이 높을수록 공적이 늘어난다.',
    meritPerSec: 2,
    salaryPerSec: 0.5,
    mentalCost: 1.5,
    staminaCost: 0.5,
    statScaling: 'writing',
  },
  {
    id: 'complaint',
    name: '민원 처리',
    emoji: '📋',
    description: '백성들의 민원을 처리한다. 평판이 오르지만 체력이 소모된다.',
    meritPerSec: 1.2,
    salaryPerSec: 0.8,
    mentalCost: 1,
    staminaCost: 2,
    statScaling: 'sense',
  },
  {
    id: 'meeting',
    name: '의정부 회의',
    emoji: '🏛️',
    description: '의정부 회의에 참석한다. 정치력이 늘고 인맥이 쌓인다.',
    meritPerSec: 1.5,
    salaryPerSec: 0.3,
    mentalCost: 2.5,
    staminaCost: 0.5,
    statScaling: 'politics',
  },
]
