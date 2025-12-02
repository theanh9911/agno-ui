// Input: "\"{\\"investment_request\\":\\"dogs\\"}\"" → Output: {"investment_request":"dogs"}
const coerceToJsonText = (text: string): string => {
  if (text.startsWith('"') && text.endsWith('"')) {
    const unquoted = JSON.parse(text)
    if (typeof unquoted === 'string') return unquoted
  }
  return text
}

// Input: {"investment_request":"dogs"} → Output: "investment_request: dogs"
const formatValue = (v: unknown): string => {
  if (typeof v === 'string') return v
  if (typeof v === 'number' || typeof v === 'boolean') return String(v)
  if (Array.isArray(v)) return v.join(', ')
  try {
    return JSON.stringify(v)
  } catch {
    return String(v)
  }
}

export const formatSessionNameForDisplay = (sessionName: string): string => {
  const raw = (sessionName ?? '').toString().trim()
  if (!raw) return ''

  const text = coerceToJsonText(raw)
  if (!text) return ''

  const looksLikeJson =
    (text.startsWith('{') && text.endsWith('}')) ||
    (text.startsWith('[') && text.endsWith(']'))

  if (!looksLikeJson) return sessionName

  try {
    const parsed = JSON.parse(text)
    if (parsed && typeof parsed === 'object') {
      const entries = Object.entries(parsed as Record<string, unknown>)
      if (!entries.length) return sessionName

      return entries.map(([k, v]) => `${k}: ${formatValue(v)}`).join(', ')
    }
  } catch {
    return sessionName
  }
  return sessionName
}
