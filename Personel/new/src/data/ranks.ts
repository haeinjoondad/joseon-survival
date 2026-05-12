import type { RankInfo } from '../types/game'

export const RANKS: RankInfo[] = [
  { name: '종9품', title: '참봉',   meritRequired: 0,     reputationRequired: 0  },
  { name: '정9품', title: '훈도',   meritRequired: 200,   reputationRequired: 10 },
  { name: '종8품', title: '봉사',   meritRequired: 500,   reputationRequired: 20 },
  { name: '정8품', title: '저작',   meritRequired: 1000,  reputationRequired: 30 },
  { name: '종7품', title: '박사',   meritRequired: 2000,  reputationRequired: 35 },
  { name: '정7품', title: '주서',   meritRequired: 3500,  reputationRequired: 40 },
  { name: '종6품', title: '주부',   meritRequired: 5500,  reputationRequired: 45 },
  { name: '정6품', title: '좌랑',   meritRequired: 8000,  reputationRequired: 50 },
  { name: '종5품', title: '판관',   meritRequired: 12000, reputationRequired: 55 },
  { name: '정5품', title: '정랑',   meritRequired: 18000, reputationRequired: 60 },
  { name: '종4품', title: '첨정',   meritRequired: 26000, reputationRequired: 65 },
  { name: '정4품', title: '사인',   meritRequired: 36000, reputationRequired: 70 },
  { name: '종3품', title: '직제학', meritRequired: 50000, reputationRequired: 75 },
  { name: '정3품', title: '참의',   meritRequired: 68000, reputationRequired: 80 },
  { name: '종2품', title: '참판',   meritRequired: 90000, reputationRequired: 85 },
  { name: '정2품', title: '판서',   meritRequired: 115000,reputationRequired: 90 },
  { name: '종1품', title: '좌찬성', meritRequired: 145000,reputationRequired: 95 },
  { name: '정1품', title: '영의정', meritRequired: 180000,reputationRequired: 100 },
]

export const MAX_RANK_INDEX = RANKS.length - 1
