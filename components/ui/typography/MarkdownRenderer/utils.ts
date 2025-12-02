export const formatUrl = (url: string): string => {
  try {
    const hostname = new URL(url)?.hostname
    const domain = hostname?.replace(/^www\./, '') // e.g., news.ycombinator.com or google.com

    const parts = domain?.split('.')
    let name = ''
    // Basic heuristic: if 3+ parts (e.g., sub.domain.com), take the second to last.
    // If 2 parts (e.g., domain.com), take the first.
    // If 1 part (e.g., localhost), take the first.
    if (parts?.length >= 3) {
      name = parts[parts?.length - 2] // e.g., 'ycombinator' from 'news.ycombinator.com'
    } else if (parts?.length > 0) {
      name = parts[0] // e.g., 'google' from 'google.com', 'localhost' from 'localhost'
    }

    if (name) {
      return name?.charAt(0)?.toUpperCase() + name?.slice(1)
    }
    return domain
  } catch {
    // If URL parsing fails, return a sanitized version of the input
    return url
      ?.replace(/^https?:\/\//, '')
      ?.replace(/^www\./, '')
      ?.split('/')[0]
  }
}

export const stripWWW = (url: string) => {
  try {
    const parsed = new URL(url)
    if (parsed.hostname.startsWith('www.')) {
      parsed.hostname = parsed.hostname.replace(/^www\./, '')
    }
    let result = parsed.toString()
    if (parsed.pathname === '/' && !parsed.search && !parsed.hash) {
      result = result.replace(/\/$/, '')
    }
    return result
  } catch {
    return url
  }
}
