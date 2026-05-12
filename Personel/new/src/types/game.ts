export type WorkType = 'petition' | 'complaint' | 'meeting'

export type TabType = 'main' | 'work' | 'stats' | 'promotion'

export interface Stats {
  writing: number   // 필력
  sense: number     // 눈치
  politics: number  // 정치력
}

export interface Equipment {
  brush: number   // 붓
  desk: number    // 책상
  robe: number    // 관복
}

export interface Player {
  name: string
  rankIndex: number       // 0~14 품계 인덱스
  merit: number           // 공적
  salary: number          // 녹봉
  mental: number          // 멘탈 (0~100)
  stamina: number         // 체력 (0~100)
  reputation: number      // 평판 (0~100)
  stats: Stats
  equipment: Equipment
  statExp: Stats          // 능력치 경험치
  currentWork: WorkType
  lastSaveTime: number    // timestamp for offline reward
}

export interface RankInfo {
  name: string            // 종9품, 정9품 등
  title: string           // 참봉, 훈도 등
  meritRequired: number   // 승진에 필요한 공적
  reputationRequired: number
}

export interface WorkInfo {
  id: WorkType
  name: string
  emoji: string
  description: string
  meritPerSec: number
  salaryPerSec: number
  mentalCost: number      // 시간당 멘탈 소모
  staminaCost: number
  statScaling: keyof Stats
}
