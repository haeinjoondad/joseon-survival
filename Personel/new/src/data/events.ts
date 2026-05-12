import type { GameEvent } from '../types/event'

export const EVENTS: GameEvent[] = [
  // 1
  {
    id: 'revise_petition',
    title: '상소문 14차 수정',
    description: '상관이 상소문을 읽더니 한마디 한다.\n"내용은 좋은데... 방향이 좀 다르네. 다시 써오게."',
    emoji: '📝',
    choices: [
      {
        text: '조용히 다시 쓴다',
        effect: { mental: -10, merit: 20, senseExp: 8 },
        resultMsg: '묵묵히 다시 썼다. 멘탈이 깎였지만 눈치가 늘었다.',
      },
      {
        text: '논리적으로 반박한다',
        check: { stat: 'politics', threshold: 3 },
        effect: { reputation: 10, merit: 10 },
        failEffect: { reputation: -10, mental: -15 },
        successMsg: '상관이 고개를 끄덕였다. 평판이 올랐다.',
        failMsg: '상관의 얼굴이 굳었다. 분위기가 싸늘해졌다.',
      },
      {
        text: '후배에게 넘긴다',
        effect: { mental: 5, merit: -5, senseExp: -5 },
        resultMsg: '체력은 아꼈다. 후배의 원망 어린 시선이 느껴진다.',
      },
    ],
  },

  // 2
  {
    id: 'dawn_summon',
    title: '새벽 왕명 호출',
    description: '새벽 3시. 승정원에서 연락이 왔다.\n"전하께서 지금 당장 보고를 원하십니다."',
    emoji: '🌙',
    choices: [
      {
        text: '즉시 입궐한다',
        effect: { stamina: -20, merit: 40, reputation: 8 },
        resultMsg: '전하께서 흡족해하셨다. 공적과 평판이 올랐다.',
      },
      {
        text: '병을 핑계로 한 시간을 늦춘다',
        check: { stat: 'sense', threshold: 3 },
        effect: { stamina: -5, merit: 15 },
        failEffect: { reputation: -20, mental: -10 },
        successMsg: '다행히 넘어갔다. 체력을 아꼈다.',
        failMsg: '전하께서 이미 알고 계셨다. 평판이 크게 떨어졌다.',
      },
    ],
  },

  // 3
  {
    id: 'blame_shift',
    title: '동료의 책임 전가',
    description: '동료 관리가 실수한 문서가 내 이름으로 제출됐다.\n동료는 모른 척하고 있다.',
    emoji: '😤',
    choices: [
      {
        text: '조용히 수습한다',
        effect: { mental: -15, reputation: 5 },
        resultMsg: '덮어두었다. 멘탈이 깎였지만 분위기는 유지됐다.',
      },
      {
        text: '공개적으로 밝힌다',
        check: { stat: 'politics', threshold: 4 },
        effect: { reputation: 20, merit: 10 },
        failEffect: { reputation: -15, mental: -10 },
        successMsg: '진실이 밝혀졌다. 평판이 올랐다.',
        failMsg: '오히려 내가 소인배로 보였다. 분위기가 냉랭해졌다.',
      },
      {
        text: '더 높은 사람에게 조용히 보고한다',
        check: { stat: 'sense', threshold: 5 },
        effect: { merit: 20, reputation: 10 },
        failEffect: { mental: -20, reputation: -10 },
        successMsg: '윗선에서 알아서 처리했다. 공적이 올랐다.',
        failMsg: '오히려 내가 고자질쟁이가 됐다.',
      },
    ],
  },

  // 4
  {
    id: 'inspection',
    title: '사헌부 감찰 방문',
    description: '사헌부 관리가 갑자기 장부를 확인하러 왔다.\n손에 땀이 흐른다.',
    emoji: '🔍',
    choices: [
      {
        text: '당당히 제출한다',
        check: { stat: 'writing', threshold: 3 },
        effect: { reputation: 20, mental: 5 },
        failEffect: { reputation: -10, mental: -10 },
        successMsg: '완벽한 문서였다. 사헌부가 물러갔다.',
        failMsg: '문서에 실수가 있었다. 경고를 받았다.',
      },
      {
        text: '시간을 끌며 수정한다',
        check: { stat: 'sense', threshold: 4 },
        effect: { mental: -5, reputation: 5 },
        failEffect: { reputation: -20, mental: -15 },
        successMsg: '간신히 넘겼다.',
        failMsg: '수상하다는 눈초리를 받았다. 평판이 떨어졌다.',
      },
      {
        text: '녹봉을 써서 해결한다',
        effect: { salary: -80, reputation: 10, mental: 10 },
        resultMsg: '위기는 넘겼다. 녹봉이 80냥 줄었다.',
      },
    ],
  },

  // 5
  {
    id: 'burnout',
    title: '과로로 인한 번아웃',
    description: '며칠째 야근 끝에 붓을 든 손이 떨린다.\n눈앞이 흐려진다.',
    emoji: '😵',
    condition: { maxMental: 30 },
    choices: [
      {
        text: '하루 쉰다',
        effect: { mental: 30, stamina: 20, merit: -30 },
        resultMsg: '쉬고 났더니 살 것 같다. 그 사이 업무가 쌓였다.',
      },
      {
        text: '보약을 먹고 버틴다',
        effect: { salary: -60, stamina: 30, mental: 15 },
        resultMsg: '보약 60냥어치를 먹었다. 그래도 버틸 만하다.',
      },
    ],
  },

  // 6
  {
    id: 'complaint_flood',
    title: '민원 폭주',
    description: '흉년 소식이 전해지자 백성들의 민원이 폭주했다.\n문 앞에 줄이 끝없이 이어진다.',
    emoji: '📋',
    choices: [
      {
        text: '성실히 모두 처리한다',
        effect: { merit: 50, reputation: 20, stamina: -25, mental: -15 },
        resultMsg: '백성들이 고마워했다. 공적과 평판이 크게 올랐다.',
      },
      {
        text: '중요한 것만 추려서 처리한다',
        check: { stat: 'sense', threshold: 3 },
        effect: { merit: 25, reputation: 5, stamina: -10 },
        failEffect: { reputation: -15, mental: -10 },
        successMsg: '효율적으로 처리했다.',
        failMsg: '걸러낸 민원이 상관 귀에 들어갔다.',
      },
      {
        text: '후임에게 떠넘긴다',
        effect: { mental: 10, stamina: 10, reputation: -15 },
        resultMsg: '체력은 아꼈다. 평판이 나빠졌다.',
      },
    ],
  },

  // 7
  {
    id: 'vague_order',
    title: '상관의 애매한 지시',
    description: '"알아서 잘 해오게."\n도대체 뭘 어떻게 하라는 건지 알 수가 없다.',
    emoji: '🤔',
    choices: [
      {
        text: '최대한 범위를 넓게 해석해서 가져간다',
        check: { stat: 'sense', threshold: 3 },
        effect: { merit: 30, reputation: 10 },
        failEffect: { merit: -10, mental: -15 },
        successMsg: '마침 원하던 것이었다. 칭찬을 받았다.',
        failMsg: '"이게 아닌데." 다시 하게 됐다.',
      },
      {
        text: '다시 가서 구체적으로 여쭤본다',
        effect: { mental: -5, merit: 20 },
        resultMsg: '상관이 귀찮아했지만 정확히 해왔다.',
      },
      {
        text: '대충 그럴싸하게 만들어서 낸다',
        check: { stat: 'writing', threshold: 4 },
        effect: { merit: 20, reputation: 5 },
        failEffect: { mental: -20, reputation: -10 },
        successMsg: '어떻게 됐다. 통과됐다.',
        failMsg: '"이게 뭔가." 불호령이 떨어졌다.',
      },
    ],
  },

  // 8
  {
    id: 'meeting_all_day',
    title: '회의만 하다 하루 종료',
    description: '아침부터 시작된 의정부 회의가 해가 지도록 끝나지 않는다.\n아무것도 결정된 게 없다.',
    emoji: '🏛️',
    choices: [
      {
        text: '끝까지 자리를 지킨다',
        effect: { mental: -20, politicsExp: 20, reputation: 5 },
        resultMsg: '성실하다는 평을 받았다. 멘탈이 많이 깎였다.',
      },
      {
        text: '슬쩍 자리를 피한다',
        check: { stat: 'sense', threshold: 4 },
        effect: { mental: 10, stamina: 10 },
        failEffect: { reputation: -15, mental: -5 },
        successMsg: '아무도 눈치채지 못했다.',
        failMsg: '상관과 눈이 마주쳤다.',
      },
      {
        text: '결론을 내자고 먼저 제안한다',
        check: { stat: 'politics', threshold: 5 },
        effect: { merit: 30, reputation: 15, politicsExp: 15 },
        failEffect: { reputation: -10, mental: -10 },
        successMsg: '회의가 끝났다. 주도력 있다는 평을 받았다.',
        failMsg: '분위기가 싸해졌다. 괜히 나섰다.',
      },
    ],
  },

  // 9
  {
    id: 'policy_change',
    title: '갑작스러운 정책 변경',
    description: '"어제까지 하던 방식은 이제 안 된다네."\n지금까지 한 상소문을 모두 다시 써야 할 판이다.',
    emoji: '📣',
    choices: [
      {
        text: '군소리 없이 다시 쓴다',
        effect: { mental: -15, merit: 25, writingExp: 10 },
        resultMsg: '다시 썼다. 필력이 늘었다.',
      },
      {
        text: '이전 방식이 맞다고 상소를 올린다',
        check: { stat: 'writing', threshold: 5 },
        effect: { merit: 40, reputation: 15 },
        failEffect: { reputation: -20, mental: -15 },
        successMsg: '전하께서 귀 기울이셨다. 공적이 크게 올랐다.',
        failMsg: '건방지다는 소리를 들었다.',
      },
    ],
  },

  // 10
  {
    id: 'title_only',
    title: '보고서 제목만 다시 쓰기',
    description: '"내용은 괜찮은데 제목이 마음에 안 드네. 제목만 바꿔오게."\n제목만.',
    emoji: '✏️',
    choices: [
      {
        text: '제목 열 개를 써서 골라달라고 한다',
        effect: { merit: 15, reputation: 5, senseExp: 10 },
        resultMsg: '상관이 흡족해했다. 눈치가 늘었다.',
      },
      {
        text: '제목 하나 바꾸고 끝낸다',
        effect: { mental: 5, merit: 10 },
        resultMsg: '간단히 끝냈다. 상관이 더 물어보지 않았다.',
      },
    ],
  },

  // 11
  {
    id: 'faction_dinner',
    title: '파벌 회식 참석 여부',
    description: '실리파 선배가 회식에 나오라고 한다.\n참석하면 줄을 서는 셈이다.',
    emoji: '🍶',
    choices: [
      {
        text: '참석한다',
        effect: { salary: -30, mental: 10, politicsExp: 15, reputation: 5 },
        resultMsg: '녹봉 30냥을 썼다. 인맥이 생겼다.',
      },
      {
        text: '정중히 거절한다',
        effect: { mental: 5, reputation: -5 },
        resultMsg: '선배의 눈빛이 차가워졌다.',
      },
      {
        text: '참석했다가 일찍 나온다',
        check: { stat: 'sense', threshold: 3 },
        effect: { salary: -10, politicsExp: 8, reputation: 3 },
        failEffect: { reputation: -10, mental: -5 },
        successMsg: '적당히 얼굴만 비쳤다.',
        failMsg: '왜 일찍 가냐는 소리를 들었다.',
      },
    ],
  },

  // 12
  {
    id: 'junior_mistake',
    title: '후배의 실수 수습',
    description: '후배가 큰 실수를 저질렀다.\n이대로면 후배가 파직될 수도 있다.',
    emoji: '😰',
    choices: [
      {
        text: '내가 대신 수습한다',
        effect: { mental: -10, stamina: -10, reputation: 10 },
        resultMsg: '후배가 깊이 감사해했다. 평판이 올랐다.',
      },
      {
        text: '후배 스스로 해결하게 둔다',
        effect: { mental: 5 },
        resultMsg: '후배가 어떻게 넘겼다. 독립심이 생겼겠지.',
      },
      {
        text: '윗선에 조용히 알린다',
        check: { stat: 'politics', threshold: 4 },
        effect: { merit: 15, reputation: 5 },
        failEffect: { reputation: -15 },
        successMsg: '윗선에서 조용히 처리했다. 내 공적이 됐다.',
        failMsg: '고자질쟁이 취급을 받았다.',
      },
    ],
  },

  // 13
  {
    id: 'royal_slip',
    title: '왕 앞에서 말실수',
    description: '보고 중 긴장한 나머지 실언을 하고 말았다.\n전하의 표정이 굳어졌다.',
    emoji: '😱',
    choices: [
      {
        text: '즉시 엎드려 사죄한다',
        effect: { mental: -20, reputation: -5, merit: 10 },
        resultMsg: '전하께서 넘어가주셨다. 가슴이 쿵쿵거린다.',
      },
      {
        text: '말을 이어 자연스럽게 수습한다',
        check: { stat: 'sense', threshold: 5 },
        effect: { merit: 20, reputation: 5 },
        failEffect: { reputation: -25, mental: -20 },
        successMsg: '전하께서 미소를 지으셨다. 위기를 기회로 만들었다.',
        failMsg: '더 깊은 수렁에 빠졌다. 식은땀이 흐른다.',
      },
    ],
  },

  // 14
  {
    id: 'fake_competence',
    title: '유능한 척하다 들킴',
    description: '모르는 분야인데 "알겠습니다"라고 해버렸다.\n결과를 내야 하는 날이 다가온다.',
    emoji: '😅',
    choices: [
      {
        text: '밤새워 공부해서 만들어낸다',
        effect: { stamina: -25, mental: -15, merit: 30, writingExp: 15 },
        resultMsg: '어찌어찌 해냈다. 필력이 늘었다.',
      },
      {
        text: '솔직하게 도움을 요청한다',
        check: { stat: 'sense', threshold: 3 },
        effect: { mental: -5, merit: 15 },
        failEffect: { reputation: -15, mental: -15 },
        successMsg: '도움을 받아 넘겼다. 눈치가 늘었다.',
        failMsg: '왜 일찍 말하지 않았냐는 꾸중을 들었다.',
      },
    ],
  },

  // 15
  {
    id: 'sudden_trip',
    title: '갑작스러운 지방 출장',
    description: '"자네가 지방에 다녀와야겠네. 내일 출발하게."\n준비할 시간이 없다.',
    emoji: '🏕️',
    choices: [
      {
        text: '바로 떠난다',
        effect: { stamina: -20, merit: 45, reputation: 10 },
        resultMsg: '고생했지만 공적이 크게 쌓였다.',
      },
      {
        text: '사정을 설명하고 미룬다',
        check: { stat: 'politics', threshold: 3 },
        effect: { mental: 10, stamina: 10, merit: 10 },
        failEffect: { reputation: -20 },
        successMsg: '일정을 조정했다. 체력을 아꼈다.',
        failMsg: '눈치가 없다는 소리를 들었다.',
      },
    ],
  },

  // 16
  {
    id: 'salary_cut_rumor',
    title: '녹봉 삭감 소문',
    description: '"이번 달 녹봉이 깎인다는 소문이 있네."\n확인이 안 된 이야기지만 불안하다.',
    emoji: '💸',
    choices: [
      {
        text: '상관에게 직접 여쭤본다',
        check: { stat: 'sense', threshold: 4 },
        effect: { reputation: 5, mental: 10 },
        failEffect: { reputation: -10, mental: -10 },
        successMsg: '소문이 아니었다는 것을 미리 알았다.',
        failMsg: '괜히 불안해 보인다는 눈초리를 받았다.',
      },
      {
        text: '무시하고 일한다',
        effect: { merit: 20, mental: -5 },
        resultMsg: '일단 일했다. 소문은 소문이었다.',
      },
      {
        text: '미리 절약해서 녹봉을 아낀다',
        effect: { salary: 30, mental: -5 },
        resultMsg: '지출을 줄여 녹봉 30냥을 절약했다.',
      },
    ],
  },

  // 17
  {
    id: 'promotion_list_miss',
    title: '승진 명단에서 누락',
    description: '이번 인사에서 내 이름이 빠졌다.\n분명히 공적이 충분했는데.',
    emoji: '😔',
    condition: { minRank: 2 },
    choices: [
      {
        text: '참고 다음 기회를 노린다',
        effect: { mental: -15, senseExp: 10 },
        resultMsg: '억울하지만 참았다. 눈치가 늘었다.',
      },
      {
        text: '상관에게 항의한다',
        check: { stat: 'politics', threshold: 5 },
        effect: { merit: 20, reputation: 10 },
        failEffect: { reputation: -20, mental: -20 },
        successMsg: '다음 인사에 반영하겠다는 답을 받았다.',
        failMsg: '찍혔다는 소문이 돌기 시작했다.',
      },
    ],
  },

  // 18
  {
    id: 'praised_more_work',
    title: '칭찬받았는데 일이 늘었다',
    description: '"자네 일을 참 잘 하더군. 그래서 말인데..."\n표정이 심상치 않다.',
    emoji: '🙃',
    choices: [
      {
        text: '감사히 받아들인다',
        effect: { merit: 35, stamina: -20, mental: -10, reputation: 10 },
        resultMsg: '칭찬인지 벌인지 모르겠다. 공적은 쌓였다.',
      },
      {
        text: '"현재 업무도 과중합니다"라고 말한다',
        check: { stat: 'politics', threshold: 4 },
        effect: { mental: 10, stamina: 10 },
        failEffect: { reputation: -15, mental: -5 },
        successMsg: '업무 조정을 받아냈다.',
        failMsg: '불성실하다는 눈초리를 받았다.',
      },
    ],
  },

  // 19
  {
    id: 'honest_poor',
    title: '청렴하게 살았더니 가난함',
    description: '동료들이 뒷돈을 받는다는 소문이 있다.\n나는 청렴하게 살았는데 녹봉이 늘 부족하다.',
    emoji: '😇',
    choices: [
      {
        text: '청렴함을 유지한다',
        effect: { reputation: 15, mental: -5 },
        resultMsg: '가난하지만 당당하다. 평판이 올랐다.',
      },
      {
        text: '조금만 눈을 감기로 한다',
        effect: { salary: 100, reputation: -15, mental: -5 },
        resultMsg: '녹봉이 100냥 생겼다. 찜찜하다.',
      },
    ],
  },

  // 20
  {
    id: 'bribe_temptation',
    title: '뇌물 유혹',
    description: '상인이 은밀히 접근했다.\n"나리, 이것은 그냥 드리는 성의입니다."',
    emoji: '💰',
    choices: [
      {
        text: '단호히 거절한다',
        effect: { reputation: 20, mental: 5 },
        resultMsg: '깨끗하게 거절했다. 평판이 크게 올랐다.',
      },
      {
        text: '받되 공적으로 쓸 것이라 합리화한다',
        effect: { salary: 150, reputation: -20, mental: -10 },
        resultMsg: '녹봉이 150냥 생겼다. 감찰 리스크가 높아진 느낌이다.',
      },
      {
        text: '일단 보류하고 상황을 본다',
        check: { stat: 'sense', threshold: 4 },
        effect: { reputation: 5 },
        failEffect: { reputation: -10, mental: -10 },
        successMsg: '상인이 스스로 물러났다.',
        failMsg: '어중간한 태도가 오해를 샀다.',
      },
    ],
  },
]
