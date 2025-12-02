import { ROUTES } from '@/routes'
import Link from '@/components/ui/Link'

const TermsOfService = () => {
  return (
    <Link
      href={ROUTES.TermsOfService}
      target="_blank"
      rel="noopener noreferrer"
      className="px-1 underline underline-offset-[3px]"
    >
      Terms of Service
    </Link>
  )
}
const PrivacyPolicy = () => {
  return (
    <Link
      href={ROUTES.PrivacyPolicy}
      target="_blank"
      rel="noopener noreferrer"
      className="pl-1 underline underline-offset-[3px]"
    >
      Privacy Policy
    </Link>
  )
}
export { TermsOfService, PrivacyPolicy }
