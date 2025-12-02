export const getRoleLabel = (role: string, parentTeamId?: string) => {
  switch (role) {
    case 'user':
      return parentTeamId ? 'Team Leader Message' : 'User Message'
    case 'assistant':
      return 'Model Response'
    case 'system':
      return 'System Context'
    case 'tool':
      return 'Tool Execution'
    case 'reasoning':
      return 'Reasoning'
    case 'metrics':
      return 'Metrics'
    default:
      return parentTeamId ? 'Team Leader Message' : 'User Message'
  }
}

export const getIconForRole = (role: string) => {
  switch (role) {
    case 'user':
      return 'user-face'
    case 'assistant':
      return 'avatar'
    case 'system':
      return 'system'
    case 'tool':
      return 'tool'
    case 'reasoning':
      return 'reasoning'
    default:
      return 'user-face'
  }
}
