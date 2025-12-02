export interface ManualStatusResponse {
  user_id: string
  is_manual: boolean
  has_session?: boolean
  session_id?: string
}

export interface ToggleManualModeResponse {
  success: boolean
  user_id: string
  is_manual: boolean
}

export interface ManualSessionItem {
  session_id: string
  user_id: string
  manual_mode: boolean
  metadata?: Record<string, unknown>
  created_at?: string
  updated_at?: string
}

export interface ManualSessionsResponse {
  data: ManualSessionItem[]
  total: number
  limit: number
  offset: number
}
