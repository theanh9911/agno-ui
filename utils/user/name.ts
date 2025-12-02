export const getInitials = (name: string) => {
  const parts = name.split(' ')
  const allInitials = parts.map((part) => part.charAt(0).toUpperCase())

  const firstTwoInitials = allInitials.slice(0, 1)

  return firstTwoInitials.join('')
}

export const getFirstInitial = (name: string): string => {
  return name[0]?.toUpperCase()
}
