import { useState } from 'react'

interface Props {
  disabled?: boolean
  error?: string | null
  isConfigured: boolean
  onSignIn: (email: string, password: string) => Promise<void>
  onSignUp: (email: string, password: string) => Promise<void>
}

export function AuthPanel({ disabled, error, isConfigured, onSignIn, onSignUp }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn')
  const [submitting, setSubmitting] = useState(false)

  async function submit() {
    if (!email || !password || submitting || disabled || !isConfigured) return
    setSubmitting(true)
    try {
      if (mode === 'signIn') {
        await onSignIn(email, password)
      } else {
        await onSignUp(email, password)
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-stone-900/70 rounded-lg p-4 border border-stone-700 mt-4 text-left">
      <div className="flex rounded bg-stone-800 p-1 mb-3">
        <button
          onClick={() => setMode('signIn')}
          className={`flex-1 py-1.5 rounded text-xs ${mode === 'signIn' ? 'bg-amber-700 text-hanji' : 'text-stone-400'}`}
        >
          로그인
        </button>
        <button
          onClick={() => setMode('signUp')}
          className={`flex-1 py-1.5 rounded text-xs ${mode === 'signUp' ? 'bg-amber-700 text-hanji' : 'text-stone-400'}`}
        >
          계정 만들기
        </button>
      </div>

      <input
        className="w-full bg-stone-950 border border-stone-700 rounded px-3 py-2 text-hanji text-sm focus:outline-none focus:border-amber-500 mb-2"
        placeholder="이메일"
        type="email"
        value={email}
        disabled={!isConfigured}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        className="w-full bg-stone-950 border border-stone-700 rounded px-3 py-2 text-hanji text-sm focus:outline-none focus:border-amber-500 mb-3"
        placeholder="비밀번호"
        type="password"
        value={password}
        disabled={!isConfigured}
        onChange={e => setPassword(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && submit()}
      />

      {!isConfigured && (
        <p className="text-red-300 text-xs leading-relaxed mb-3">
          Supabase 환경변수가 없어 계정 저장을 사용할 수 없습니다.
        </p>
      )}
      {error && <p className="text-red-300 text-xs leading-relaxed mb-3">{error}</p>}

      <button
        onClick={submit}
        disabled={!email || !password || submitting || disabled || !isConfigured}
        className="w-full bg-stone-700 hover:bg-stone-600 disabled:opacity-40 disabled:cursor-not-allowed text-hanji py-2 rounded text-sm transition-colors"
      >
        {submitting ? '처리 중...' : mode === 'signIn' ? '계정으로 이어하기' : '계정 생성'}
      </button>
    </div>
  )
}
