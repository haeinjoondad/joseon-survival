# Before After Photo Maker

> Before/After 비교 이미지를 빠르게 만드는 Android 앱

## 시작 전 필수 작업

### 1. Firebase 설정
1. [Firebase Console](https://console.firebase.google.com/) → 새 프로젝트 생성
2. Android 앱 추가 → 패키지명: `com.beforeafter.photomaker`
3. `google-services.json` 다운로드 → `app/` 폴더에 복사

### 2. AdMob 설정

> **주의:** 개발 및 테스트 중에는 반드시 Google 테스트 광고 ID를 사용하세요.
> 테스트 중 실제 광고를 노출하거나 클릭하면 무효 트래픽으로 간주되어
> AdMob 계정 제한 또는 수익 지급 제한이 발생할 수 있습니다.
> 실제 AdMob ID는 출시 직전 release 빌드에서만 교체하세요.

`app/src/main/AndroidManifest.xml`에서 AdMob App ID 교체:
```xml
<meta-data
    android:name="com.google.android.gms.ads.APPLICATION_ID"
    android:value="여기에_실제_ADMOB_APP_ID" />
```

`app/src/main/java/com/beforeafter/photomaker/util/AdManager.kt`에서 광고 단위 ID 교체:
```kotlin
const val BANNER = "여기에_실제_배너_AD_UNIT_ID"
const val INTERSTITIAL = "여기에_실제_전면광고_AD_UNIT_ID"
```

### 3. Android Studio에서 열기
1. Android Studio → Open → 이 폴더 선택
2. Gradle Sync 완료 대기
3. Run ▶

## 기술 스택

| 영역 | 기술 |
|------|------|
| 언어 | Kotlin |
| UI | Jetpack Compose |
| 사진 선택 | Android Photo Picker |
| 이미지 합성 | Bitmap + Canvas |
| 설정 저장 | Jetpack DataStore |
| 갤러리 저장 | MediaStore (`Pictures/BeforeAfterPhotoMaker`) |
| 광고 | AdMob (배너 + 저장 성공 후 전면광고) |
| 분석 | Firebase Analytics |
| 리뷰 유도 | Google Play In-App Review |

## 프로젝트 구조

```
app/src/main/java/com/beforeafter/photomaker/
├── MainActivity.kt              # 네비게이션 진입점
├── ui/
│   ├── home/HomeScreen.kt       # 홈 화면 (Before/After 2장 선택)
│   ├── editor/
│   │   ├── EditorScreen.kt      # 편집 화면
│   │   └── EditorViewModel.kt   # 상태 관리 (ratio, labels, watermark)
│   └── theme/Theme.kt
├── data/
│   ├── BeforeAfterSettings.kt   # 설정 데이터 모델
│   └── (SettingsRepository는 BeforeAfterSettings.kt 내부에 포함)
├── util/
│   ├── BitmapUtils.kt           # Before/After 2장 Canvas 합성 + OOM 방지
│   ├── MediaStoreUtils.kt       # 갤러리 저장
│   └── AdManager.kt             # 전면광고 관리 (저장 성공 후 노출)
└── analytics/AnalyticsHelper.kt # Firebase 이벤트 래퍼
```

> 광고 순서: 저장 성공 → "Saved to Photos" 토스트 → 전면광고
> 저장 실패 시 전면광고 절대 노출하지 않음

## 출시 체크리스트

- [ ] `google-services.json` 추가
- [ ] 실제 AdMob App ID + 광고 단위 ID로 교체
- [ ] 앱 아이콘 제작 (`ic_launcher`)
- [ ] 스토어 스크린샷 5장
- [ ] 개인정보처리방침 페이지 준비 및 URL 확보 (Firebase/AdMob 사용으로 필수)
- [ ] Play Console 등록

**개인정보처리방침에 반드시 포함할 내용:**
```
- 사진을 서버로 업로드하지 않음
- 모든 처리는 기기 내에서 이루어짐
- Google AdMob 광고 사용
- Firebase Analytics 사용 (앱 개선 목적)
```

## 기획안

[PLAN.md](PLAN.md) 참조
