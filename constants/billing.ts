/**
 * Billing and plan-related constants
 */

export const PLAN_NAMES = {
  FREE: 'Free',
  STARTER: 'Starter',
  CUSTOM: 'Custom'
} as const

export const BILLING_MESSAGES = {
  WELCOME_TO_STARTER: `Welcome to ${PLAN_NAMES.STARTER}!`,
  UNLOCK_STARTER: `Unlock ${PLAN_NAMES.STARTER} to invite members and connect remote AgentOS`,
  UPGRADE_TO_STARTER: `UPGRADE TO ${PLAN_NAMES.STARTER}`
} as const

export const PLAN_FEATURES = {
  STARTER: {
    FREE_MEMBER_INVITES: 3,
    DESCRIPTION:
      'Your subscription is active. You now have access to unlimited sessions, live monitoring, team collaboration, and priority support. Start using these powerful features immediately to accelerate your development workflow.'
  }
} as const
