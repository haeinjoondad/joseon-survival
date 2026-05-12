import type { User } from '@supabase/supabase-js'

interface Props {
  user: User | null
  conflict: boolean
  cloudStatus: string | null
  onUseGuestSave: () => void
  onUseCloudSave: () => void
  onSignOut: () => void
}

export function AccountPanel({
  user,
  conflict,
  cloudStatus,
  onUseGuestSave,
  onUseCloudSave,
  onSignOut,
}: Props) {
  if (!user) return null

  return (
    <div className="bg-stone-900 border-b border-stone-700 px-4 py-2">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="text-stone-500 text-xs">계정 저장 중</div>
          <div className="text-stone-300 text-xs truncate">{user.email}</div>
        </div>
        <button
          onClick={onSignOut}
          className="text-stone-400 hover:text-stone-200 text-xs border border-stone-700 rounded px-2 py-1 shrink-0"
        >
          로그아웃
        </button>
      </div>

      {cloudStatus && <p className="text-amber-300 text-xs mt-2">{cloudStatus}</p>}

      {conflict && (
        <div className="mt-2 bg-amber-950/70 border border-amber-800 rounded-lg p-3">
          <p className="text-amber-200 text-xs leading-relaxed mb-2">
            이 계정에 기존 저장본이 있습니다. 현재 기기의 진행도와 계정 저장본 중 하나를 선택하십시오.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onUseGuestSave}
              className="bg-amber-700 hover:bg-amber-600 text-hanji rounded py-2 text-xs"
            >
              현재 진행도 저장
            </button>
            <button
              onClick={onUseCloudSave}
              className="bg-stone-700 hover:bg-stone-600 text-hanji rounded py-2 text-xs"
            >
              계정 저장본 불러오기
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
