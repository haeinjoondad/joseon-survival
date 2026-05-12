# Supabase 설정

## 1. 환경변수

`.env.local`에 아래 값을 넣습니다.

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Vercel에도 같은 환경변수를 추가해야 배포 환경에서 로그인 기능이 켜집니다.

## 2. 데이터베이스

Supabase SQL Editor에서 `supabase/schema.sql` 내용을 실행합니다.

이 테이블은 유저별 게임 저장 데이터 1개를 보관합니다.

- `user_id`: Supabase Auth 사용자 ID
- `player`: 게임 저장 JSON
- `updated_at`: 마지막 저장 시각

Row Level Security 정책은 로그인한 사용자가 자기 저장 데이터만 읽고 쓸 수 있게 제한합니다.

## 3. 동작 방식

- 게스트 플레이는 기존처럼 브라우저 `localStorage`에 저장됩니다.
- 로그인하면 계정 저장본을 확인합니다.
- 계정 저장본이 없으면 현재 진행도를 계정에 저장합니다.
- 계정 저장본과 현재 기기 저장본이 다르면 사용자가 둘 중 하나를 선택합니다.
