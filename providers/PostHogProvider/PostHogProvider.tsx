import posthog from 'posthog-js'
import { PostHogProvider as PostHogProviderBase } from 'posthog-js/react'
import { type ReactNode, useEffect } from 'react'

const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_API_HOST

const checkPosthogReachability = async (
  apiHost?: string,
  token?: string
): Promise<boolean> => {
  if (!apiHost || apiHost === 'undefined') return false
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 1500)
    const base = apiHost.replace(/\/$/, '')
    const url = token
      ? `${base}/decide/?v=3&token=${encodeURIComponent(token)}`
      : `${base}/decide/?v=3`
    const res = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      signal: controller.signal,
      credentials: 'omit'
    })
    clearTimeout(timeout)
    return res.ok
  } catch {
    // If blocked by an extension (ERR_BLOCKED_BY_CLIENT) or network error
    return false
  }
}

export const PostHogProvider = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    let cancelled = false

    const setup = async () => {
      if (!POSTHOG_KEY || !POSTHOG_HOST) {
        // Do not initialize PostHog when credentials are missing
        posthog.opt_out_capturing()
        return
      }

      // If PostHog is not reachable (e.g., blocked by extensions/network), do not initialize
      // This avoids spamming the console with errors
      const reachable = await checkPosthogReachability(
        POSTHOG_HOST as string,
        POSTHOG_KEY as string
      )
      if (cancelled) return
      if (!reachable) {
        posthog.opt_out_capturing()
        return
      }

      // Initialize PostHog with noisy features disabled to avoid console spam
      posthog.init(POSTHOG_KEY as string, {
        api_host: POSTHOG_HOST,
        defaults: '2025-05-24',
        autocapture: true,
        capture_pageview: true,
        capture_pageleave: true
      })
    }

    void setup()

    return () => {
      cancelled = true
    }
  }, [])

  return <PostHogProviderBase client={posthog}>{children}</PostHogProviderBase>
}
