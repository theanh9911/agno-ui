import { BUILD_ENV } from './config'

export const PRIVATE_ROUTES = {
  UserHome: '/',
  UserEntityConfig: '/config',
  UserSessions: '/sessions',
  UserMetrics: '/metrics',
  UserSessionsTeams: '/sessions/teams',
  UserSession: (ID: string) => `/sessions/${ID}`,
  UserKnowledge: '/knowledge',
  UserKnowledgeV2: '/v2knowledge',
  UserChat: '/chat',
  UserSettings: '/settings',
  UserOrganizationSettings: '/settings/organization',
  UserProfileSettings: '/settings/profile',
  UserBillingSettings: '/settings/billing',
  UserOSSettings: '/settings/os',
  UserEvaluation: '/evaluation',
  UserMemory: '/memory',
  UserMemoryV2: '/v2memory',
  UserTraces: '/traces',
  UserCancelPlan: '/cancel-plan'
}

export const BASE_URLS: Record<string, string> = {
  dev: 'http://localhost:3000',
  stg: 'https://app-stg.agno.com',
  production: 'https://app.agno.com'
}

export const BASE_URL = BASE_URLS[BUILD_ENV]

export const PUBLIC_ROUTES = {
  JoinTeam: '/join',
  TermsOfService: '/legal/tos',
  PrivacyPolicy: '/legal/privacy',
  CliAuth: '/cli-auth'
}

// Route group for authentication
export const AUTHENTICATION_ROUTES = {
  SignIn: '/signin',
  SignUp: '/signup',
  ForgotPassword: '/forget-password',
  ResetPassword: '/reset-password',
  VerifyEmail: '/verify-email'
}

export const ROUTES = {
  ...PRIVATE_ROUTES,
  ...PUBLIC_ROUTES,
  ...AUTHENTICATION_ROUTES,
  // Social and other links
  Discord: 'https://discord.gg/4MtYHHrgA8',
  GitHub: 'https://github.com/agno-agi/agno',
  Community: 'https://community.agno.com/'
}
