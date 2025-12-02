import { ROUTES } from '@/routes'

export const getComponentChatRoute = (id: string, type: string) => {
  return `${ROUTES.UserChat}?type=${type}&id=${id}`
}
