import {
  useNavigate,
  useLocation,
  useParams as useRouterParams,
  useSearchParams as useRouterSearchParams
} from 'react-router-dom'

export const useRouter = () => {
  const navigate = useNavigate()
  const location = useLocation()

  return {
    push: (path: string) => navigate(path),
    replace: (path: string) => navigate(path, { replace: true }),
    back: () => navigate(-1),
    forward: () => navigate(1),
    pathname: location.pathname,
    search: location.search,
    query: Object.fromEntries(new URLSearchParams(location.search)),
    asPath: location.pathname + location.search,
    route: location.pathname,
    events: {
      on: () => {},
      off: () => {}
    }
  }
}

export const usePathname = () => {
  const location = useLocation()
  return location.pathname
}

export const useParams = useRouterParams

export const useSearchParams = () => {
  const [searchParams] = useRouterSearchParams()

  return searchParams
}

export const notFound = () => {
  // In React Router, we can use Navigate component or navigate programmatically
  // For now, throw a proper error that can be caught by error boundaries
  throw new Response('Not Found', { status: 404, statusText: 'Not Found' })
}
