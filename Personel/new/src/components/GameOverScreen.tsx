import { RANKS } from '../data/ranks'

interface Props {
  name: string
  rankIndex: number
  totalMerit: number
  totalSalary: number
  onRestart: () => void
}

const ENDINGS = [
  { maxRank: 0,  title: '하루 만에 사직',   desc: '임용된 지 하루도 안 돼 사표를 던졌다.\n종9품의 벽은 높았다.' },
  { maxRank: 2,  title: '신입의 번아웃',    desc: '상소문 몇 장 쓰다 붓을 꺾었다.\n조선 관료제는 녹록지 않았다.' },
  { maxRank: 4,  title: '중도 하차',        desc: '어느 정도 자리를 잡았지만\n결국 버티지 못하고 낙향했다.' },
  { maxRank: 6,  title: '뜻을 굽히지 못하고', desc: '고집대로 살다 탈진했다.\n청렴했지만 가난했다.' },
  { maxRank: 8,  title: '판관의 퇴장',      desc: '꽤 높은 자리까지 올랐다.\n하지만 조선 조정은 끝내 버겁었다.' },
  { maxRank: 10, title: '중견 관리의 한숨', desc: '중앙 관청의 흐름을 알게 되었으나\n권력의 무게를 이기지 못했다.' },
  { maxRank: 12, title: '직제학의 붓',      desc: '학문과 문서로 조정을 이끌었으나\n끝내 정치의 파도에 쓸렸다.' },
  { maxRank: 14, title: '참판의 결단',      desc: '나라의 큰일에 손을 댈 자리까지 올랐다.\n그것만으로도 충분한 생이었다.' },
  { maxRank: 16, title: '좌찬성의 여한',    desc: '정승 반열에 올랐으나\n영의정의 자리는 끝내 비어있었다.' },
  { maxRank: 17, title: '영의정 등극',      desc: '종9품 참봉에서 영의정까지.\n조선 역사에 이름을 새겼다.' },
]

export function GameOverScreen({ name, rankIndex, totalMerit, totalSalary, onRestart }: Props) {
  const rank = RANKS[rankIndex]
  const ending = ENDINGS.find(e => rankIndex <= e.maxRank) ?? ENDINGS[ENDINGS.length - 1]

  return (
    <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm">

        {/* 사표 문서 느낌 */}
        <div className="bg-stone-900 border border-stone-600 rounded-xl p-6 mb-5 text-center">
          <div className="text-4xl mb-3">📄</div>
          <div className="text-red-500 font-bold text-sm mb-1 tracking-widest">사 직 서</div>
          <div className="border-t border-stone-700 my-3" />

          <h2 className="text-hanji text-xl font-bold mb-1">{ending.title}</h2>
          <p className="text-stone-400 text-sm leading-relaxed whitespace-pre-line mb-4">
            {ending.desc}
          </p>

          {/* 플레이 기록 */}
          <div className="bg-stone-800 rounded-lg p-4 space-y-2 text-left">
            <div className="flex justify-between">
              <span className="text-stone-500 text-xs">관리</span>
              <span className="text-hanji text-sm">{name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500 text-xs">최종 품계</span>
              <span className="text-amber-400 text-sm font-bold">{rank.name} {rank.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500 text-xs">누적 공적</span>
              <span className="text-hanji text-sm">{Math.floor(totalMerit).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500 text-xs">남은 녹봉</span>
              <span className="text-green-400 text-sm">{Math.floor(totalSalary).toLocaleString()} 냥</span>
            </div>
          </div>

          <div className="border-t border-stone-700 my-3" />
          <p className="text-stone-600 text-xs">멘탈 고갈로 인한 자진 사직</p>
        </div>

        <button
          onClick={onRestart}
          className="w-full bg-amber-700 hover:bg-amber-600 active:bg-amber-800 text-hanji font-bold py-4 rounded-lg transition-colors text-base"
        >
          다시 관직에 오르다
        </button>
        <p className="text-stone-600 text-xs text-center mt-3">
          다음 회차 업데이트 예정 — 유산 포인트 시스템
        </p>
      </div>
    </div>
  )
}
