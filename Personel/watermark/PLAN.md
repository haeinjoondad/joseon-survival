# Before After Photo Maker — 기획안 v1.0

> 작성일: 2026-06-29
> 목표: 기존 Photo Watermark Maker 프로젝트를 피벗하여, 주말 3일 안에 Google Play 출시 가능한 Before/After 비교 이미지 앱 MVP 완성

---

## 0. 피벗 요약

기존 프로젝트의 핵심은 "사진 1장에 워터마크를 넣는 앱"이었다.
하지만 단독 워터마크 앱은 경쟁이 매우 심하고, 사용 목적이 좁다.
따라서 앱의 메인 가치를 다음과 같이 피벗한다.

### 기존
> 사진에 텍스트 워터마크를 추가한다.

### 변경
> Before/After 비교 이미지를 만들고, 필요하면 하단에 내 이름/샵명/인스타 ID를 넣는다.

즉, 워터마크는 메인 기능이 아니라 **브랜딩 옵션**이다.
이 앱의 핵심은 "사진 보호"가 아니라:
> 작업 결과, 변화, 성과를 한 장의 비교 이미지로 빠르게 보여주는 것

이다.

---

## 1. 앱 개요

| 항목 | 내용 |
|------|------|
| **앱 이름** | Before After Photo Maker |
| **패키지명** | com.beforeafter.photomaker |
| **타겟 OS** | Android 8.0 (API 26) 이상 |
| **타겟 마켓** | 전 세계 (영어 UI) |
| **수익 모델** | AdMob 배너 + 저장 성공 후 전면광고 |
| **스토어** | Google Play |
| **핵심 기능** | 사진 2장 선택 → 좌우 Before/After 이미지 생성 → 선택적 워터마크 → 저장 |
| **개발 원칙** | 무로그인, 무서버, 무AI, 온디바이스 처리 |

---

## 2. 핵심 가치 제안

> Create clean before-and-after comparison photos in seconds.

사용자는 앱을 열고 10초 안에 아래 결과물을 얻어야 한다.

- Before 사진과 After 사진을 좌우로 비교
- Before / After 라벨 자동 표시
- 1:1, 4:5, 9:16 비율 선택
- 하단에 샵 이름, 인스타 ID, 브랜드명 선택적으로 삽입
- 원본 사진은 절대 수정하지 않음
- 결과 이미지는 갤러리에 별도 저장

---

## 3. 타겟 사용자

### 1차 타겟
- 피트니스 유저 / PT 트레이너
- 피부관리샵 / 미용실 / 네일샵
- 청소업체 / 수리업체 / 인테리어 업체
- 중고거래 셀러
- 소규모 비즈니스 운영자

### 사용 사례
| 사용자 | 사용 예시 |
|------|------|
| 피트니스 유저 | 몸 변화 Before/After |
| 피부관리샵 | 시술 전후 비교 |
| 미용실 | 헤어스타일 변화 |
| 청소업체 | 청소 전후 |
| 수리업체 | 파손 전 / 복원 후 |
| 인테리어 업체 | 공사 전후 |
| 중고거래 셀러 | 수리 전후 또는 상태 비교 |
| 소상공인 | 작업 결과물에 인스타 ID 삽입 |

---

## 4. 기술 스택

기존 워터마크 프로젝트의 기술 스택을 최대한 재사용한다.

| 영역 | 선택 | 설명 |
|------|------|------|
| 언어 | Kotlin | 기존 프로젝트 유지 |
| UI | Jetpack Compose | 기존 화면 구조 재사용 |
| 사진 선택 | Android Photo Picker | 권한 최소화 |
| 이미지 합성 | Bitmap + Canvas | 외부 이미지 라이브러리 없이 처리 |
| 설정 저장 | Jetpack DataStore | 마지막 비율, 워터마크 텍스트 저장 |
| 결과 저장 | MediaStore API | 갤러리 저장 |
| 광고 | AdMob | 편집 화면 배너 + 저장 성공 후 전면광고 |
| 분석 | Firebase Analytics | 퍼널 추적 |
| 리뷰 유도 | Google Play In-App Review | 5번째 저장 이후, 광고와 겹치지 않을 때만 |

---

## 5. MVP 핵심 원칙

v0.1은 절대 복잡하게 만들지 않는다.

### 반드시 지킬 것
- 사진 2장만 선택
- 좌우 50:50 레이아웃만 지원
- Before / After 라벨 자동 표시
- 워터마크는 하단 중앙 고정
- 비율은 1:1, 4:5, 9:16만 지원
- 저장 성공 후에만 전면광고
- 저장 실패 시 광고 절대 노출 금지

### v0.1에서 절대 넣지 말 것
- 영상 / GIF 생성
- 슬라이더 애니메이션
- 워터마크 드래그 / 회전 / 로고
- 폰트 선택 / 컬러 피커
- 배치 처리 / 클라우드 저장
- 회원가입 / AI 기능

---

## 6. 화면 구성 (2개 화면)

### 6-1. 홈 화면

```
┌─────────────────────────────┐
│                             │
│   Before After Photo Maker  │
│   Create comparison photos  │
│   in seconds.               │
│                             │
│   ┌─────────────────────┐   │
│   │   Select Before     │   │
│   └─────────────────────┘   │
│                             │
│   ┌─────────────────────┐   │
│   │   Select After      │   │
│   └─────────────────────┘   │
│                             │
│   [      Continue      ]    │  ← 2장 선택 후 활성화
│                             │
└─────────────────────────────┘
```

> v0.1 홈 화면 광고 없음. Select Before/After → Continue까지 마찰 최소화.

### 6-2. 편집 화면

```
┌─────────────────────────────┐
│  ← Back                     │
├─────────────────────────────┤
│                             │
│   ┌──────────┬──────────┐   │
│   │ BEFORE   │  AFTER   │   │
│   │          │          │   │
│   │          │          │   │
│   │       @myshop        │   │
│   └──────────┴──────────┘   │
│                             │
│   Ratio                     │
│   [1:1]  [4:5]  [9:16]     │
│                             │
│   [x] Show Labels           │
│                             │
│   Watermark (optional)      │
│   [____________________]    │
│   [ ] Show watermark        │
│                             │
│   [ Save Photo ]            │
│                             │
│   ─────── Banner Ad ─────── │
└─────────────────────────────┘
```

---

## 7. 핵심 기능 명세

### 7-1. 사진 선택
- Before / After 각 1장, Android Photo Picker 사용
- 원본 수정 없음, 재선택 가능

### 7-2. 비교 이미지 생성 (Canvas)

렌더링 순서:
1. 출력 Bitmap 생성 (선택된 비율 기준)
2. beforeBitmap → 왼쪽 영역 centerCrop
3. afterBitmap → 오른쪽 영역 centerCrop
4. 중앙 구분선 (2px, 흰색)
5. showLabels == true → BEFORE / AFTER 라벨
6. showWatermark == true && text 있음 → 하단 중앙 워터마크

지원 비율:
| 비율 | 출력 크기 | 용도 |
|------|-----------|------|
| 1:1 | 1080×1080 | 일반 SNS |
| 4:5 | 1080×1350 | Instagram 피드 (기본값) |
| 9:16 | 1080×1920 | Story / Reels |

### 7-3. Before / After 라벨
- 기본 ON, 사용자 OFF 가능
- 텍스트 고정: `BEFORE` / `AFTER`
- 흰색 글자 + 검은색 반투명 배경
- 위치: 각 이미지 좌상단

### 7-4. 워터마크 (브랜딩 옵션)
- 기본 OFF
- 텍스트 입력 시 자동 ON
- 위치: 하단 중앙 고정
- 최대 40자
- 흰색 글자 + 검은색 반투명 배경

v0.1 미지원: 드래그, 크기 조절, 색상 변경, 이미지 로고

### 7-5. 저장
- 경로: `Pictures/BeforeAfterPhotoMaker/`
- 파일명: `before_after_yyyyMMdd_HHmmss.jpg`
- 원본 사진 수정 없음

---

## 8. 광고 정책

### 광고 배치
| 위치 | 형식 | 트리거 |
|------|------|--------|
| 편집 화면 하단 | Anchored Adaptive Banner | 편집 화면 진입 시 |
| 저장 성공 후 | Interstitial | MediaStore 저장 성공 직후 |

### 저장 → 광고 순서
```
Save Photo 클릭
  → save_clicked 이벤트
  → Bitmap 합성
  → MediaStore 저장
  → save_success 이벤트
  → "Saved to Photos" 토스트
  → Interstitial 노출 (로드된 경우)
  → 다음 Interstitial 미리 로드
```

### 광고 규칙
- 저장 실패 시 전면광고 절대 노출하지 않음
- 광고 로드 실패 시 사용자 흐름을 막지 않음
- 전면광고는 저장 성공 1회당 최대 1회
- 개발 중에는 반드시 테스트 광고 ID 사용
- 실제 ID는 출시 직전 release 빌드에서만 교체

---

## 9. Firebase Analytics 이벤트

| 이벤트명 | 발생 시점 | 목적 |
|----------|----------|------|
| `before_selected` | Before 사진 선택 완료 | 첫 사진 선택률 |
| `after_selected` | After 사진 선택 완료 | 두 번째 선택률 |
| `editor_opened` | 편집 화면 진입 | 편집 진입률 |
| `ratio_changed` | 비율 변경 | 선호 비율 분석 |
| `labels_toggled` | 라벨 ON/OFF | 기능 사용률 |
| `watermark_changed` | 워터마크 텍스트 입력 또는 토글 | 브랜딩 기능 사용률 |
| `save_clicked` | 저장 버튼 클릭 | 저장 시도율 |
| `save_success` | 저장 성공 | 완료율 |
| `save_failed` | 저장 실패 | 오류 추적 |
| `interstitial_shown` | 저장 성공 후 광고 노출 | 광고 노출률 |
| `interstitial_failed` | 광고 로드/표시 실패 | 광고 오류 추적 |
| `review_requested` | 인앱 리뷰 요청 시도 | 리뷰 타이밍 검증 |

### 핵심 퍼널
```
before_selected / app_open          → 첫 액션 전환율
after_selected / before_selected    → 2장 완성율
editor_opened / after_selected      → 편집 진입율
save_clicked / editor_opened        → 저장 시도율
save_success / save_clicked         → 저장 성공율
interstitial_shown / save_success   → 광고 노출율
```

---

## 10. DataStore 저장값

```kotlin
data class BeforeAfterSettings(
    val ratio: String = "4:5",
    val showLabels: Boolean = true,
    val watermarkText: String = "",
    val showWatermark: Boolean = false,
    val saveCount: Int = 0,
    val reviewRequested: Boolean = false
)
```

---

## 11. In-App Review

- 5번째 저장 성공 이후 1회만 요청
- 전면광고와 동시에 절대 노출하지 않음
- 광고가 실제로 노출된 저장 회차에는 리뷰 요청하지 않음
- 저장 성공 → 광고 미노출 확인 후 리뷰 요청

---

## 12. 프로젝트 구조

```
beforeafter/
├── PLAN.md
├── README.md
├── build.gradle.kts
├── settings.gradle.kts
├── gradle/
│   ├── libs.versions.toml
│   └── wrapper/
└── app/
    ├── build.gradle.kts
    ├── google-services.json          ← Firebase 설정, Git 제외
    ├── proguard-rules.pro
    └── src/main/
        ├── AndroidManifest.xml
        ├── java/com/beforeafter/photomaker/
        │   ├── MainActivity.kt
        │   ├── ui/
        │   │   ├── home/HomeScreen.kt
        │   │   ├── editor/
        │   │   │   ├── EditorScreen.kt
        │   │   │   └── EditorViewModel.kt
        │   │   └── theme/Theme.kt
        │   ├── data/
        │   │   └── BeforeAfterSettings.kt   ← 설정 모델 + SettingsRepository 포함
        │   ├── util/
        │   │   ├── BitmapUtils.kt
        │   │   ├── MediaStoreUtils.kt
        │   │   └── AdManager.kt
        │   └── analytics/
        │       └── AnalyticsHelper.kt
        └── res/
            └── values/
                ├── strings.xml
                └── themes.xml
```

---

## 13. 개발 일정

### Day 1 — 피벗 구조 완성
- [ ] 패키지명 / 앱 이름 변경
- [ ] HomeScreen: Before/After 2장 선택
- [ ] EditorScreen: 비교 이미지 미리보기 + 최소 옵션

### Day 2 — 이미지 생성 + 저장 + 광고
- [ ] BitmapUtils: 2장 좌우 합성 로직
- [ ] centerCrop draw 함수
- [ ] BEFORE / AFTER 라벨 렌더링
- [ ] 하단 워터마크 렌더링
- [ ] MediaStore 저장 경로 변경
- [ ] Firebase 이벤트 교체

### Day 3 — 완성 및 출시 준비
- [ ] OOM 방지 테스트
- [ ] 광고/리뷰 충돌 방지 확인
- [ ] 개인정보처리방침 작성
- [ ] 앱 아이콘 / 스크린샷 5장
- [ ] Play Console 등록

---

## 14. Google Play 스토어 메타데이터

**앱 제목 (30자 이하)**
```
Before After Photo Maker
```

**짧은 설명 (80자 이하)**
```
Create before-after comparison photos. Fast, simple, no signup.
```

**스크린샷 문구 (5장)**
1. Create before & after photos
2. Perfect for progress and work results
3. Add your shop name or Instagram ID
4. Choose square, portrait, or story size
5. Save fast. No signup needed.

---

## 15. 검증 KPI

### 출시 직후 (1~2주)
- [ ] `save_success` 30회 이상
- [ ] `save_success / editor_opened` 50% 이상
- [ ] 전면광고 로드율 확인 및 국가별 편차 기록
- [ ] 국가별 eCPM: 설치 상위 국가와 고eCPM 국가 분리 기록
- [ ] 크래시 0건

### 1개월 후
- [ ] 가장 많이 선택된 비율 확인
- [ ] 워터마크 사용률 확인
- [ ] organic install 발생 여부 확인
- [ ] v0.2 기능 1개 결정

---

## 16. v0.2 후보 기능 (데이터 보고 1개 선택)

| 후보 | 설명 |
|------|------|
| Diagonal Split | 대각선 Before/After 비교 |
| Text Customization | BEFORE/AFTER 라벨 텍스트 변경 |
| Logo Watermark | 이미지 로고 삽입 |
| Share Button | 저장 후 바로 공유 |
| Template 3종 | Fitness / Beauty / Business |
| Collage Border | 테두리 두께 / 배경색 선택 |

---

## 17. 개인정보처리방침 핵심 문구

```
This app does not upload your photos to any server.
Selected photos are processed entirely on your device.
Generated before-after images are saved only to your local storage.
This app uses Google AdMob for advertising.
This app uses Firebase Analytics to understand app usage and improve the app.
```

> `anonymous` 표현 사용 금지. Firebase/AdMob SDK는 기기 및 광고 관련 식별자를 사용할 수 있으므로 "완전 익명"이라고 단언하지 않는다.

---

## 18. 리스크 & 대응

| 리스크 | 대응 |
|--------|------|
| Before/After 앱도 경쟁 있음 | 피트니스, 뷰티, 청소, 수리, 셀러 등 사용 사례 중심 ASO |
| 기능이 늘어날 유혹 | v0.1 원칙 엄수, 좌우 비교 + 하단 워터마크만 |
| 저장 전 광고 정책 리스크 | 저장 성공 후 광고만 |
| OOM | 입력 이미지 2048px 다운샘플링 |
| 리뷰 팝업과 광고 충돌 | 광고 노출 회차에는 리뷰 요청 금지 |

---

*v0.2 예정: 데이터 보고 후보 중 1개 선택*
*v0.3 이후: 구독 결제, 배치 처리 검토*
