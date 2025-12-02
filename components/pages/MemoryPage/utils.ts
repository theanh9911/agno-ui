// Extracts the user ID from the URL
// Example: /memory/123 -> 123
// Example: /memory/123?sort_by=updated_at_desc -> 123
export const extractUserIdFromUrl = () => {
  const pathname = window.location.pathname
  const memoryPathRegex = /^\/memory\/([^/?]+)/
  const match = pathname.match(memoryPathRegex)
  return match?.[1]
}
