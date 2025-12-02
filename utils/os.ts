import { AgentDetails, TeamDetails } from '@/types/os'
import { WorkflowDetails } from '@/types/workflow'

export const isLocalEndpoint = (url: string): boolean => {
  try {
    const { hostname } = new URL(url)

    if (['localhost', '127.0.0.1', '::1', '0.0.0.0'].includes(hostname)) {
      return true
    }

    if (
      hostname.startsWith('192.168.') ||
      hostname.startsWith('10.') ||
      /^172\.(1[6-9]|2[0-9]|3[01])\./.test(hostname)
    ) {
      return true
    }

    if (hostname.endsWith('.local')) {
      return true
    }

    return false
  } catch {
    return false
  }
}

export const isTeam = (
  member: AgentDetails | TeamDetails | WorkflowDetails
): member is TeamDetails => {
  return member && ('mode' in member || 'members' in member)
}
export const isWorkflow = (
  member: AgentDetails | TeamDetails | WorkflowDetails
): member is WorkflowDetails => {
  return member && 'steps' in member
}
