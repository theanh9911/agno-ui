type NewRelicAttributes = Record<string, string | number | boolean>

declare global {
  interface Window {
    newrelic: {
      noticeError: (error: Error, customAttributes?: NewRelicAttributes) => void
      setCustomAttribute: (
        name: string,
        value: string | number | boolean
      ) => void
      addPageAction: (name: string, attributes?: NewRelicAttributes) => void
      setUserId: (userId: string) => void
      finished: (timestamp?: number) => void
      recordReplay: () => void
      pauseReplay: () => void
      start: () => void
      addToTrace: (name: string, attributes?: NewRelicAttributes) => void
      recordCustomEvent: (name: string, attributes?: NewRelicAttributes) => void
      setCurrentRouteName: (name: string) => void
    }
  }
}

const IS_DEVELOPMENT = import.meta.env.VITE_BUILD_ENV === 'development'
const IS_LOCAL_ERROR_LOGGING_ENABLED =
  import.meta.env.VITE_LOCAL_ERROR_LOGGING === 'true'

export const NewRelic = {
  noticeError: (error: Error, customAttributes?: NewRelicAttributes) => {
    if (IS_LOCAL_ERROR_LOGGING_ENABLED) {
      // eslint-disable-next-line no-console
      console.group('🔴 [New Relic - Dev Mode] Error Logged')
      // eslint-disable-next-line no-console
      console.error('Error:', error)
      // eslint-disable-next-line no-console
      console.table(customAttributes)
      // eslint-disable-next-line no-console
      console.groupEnd()

      return
    }

    if (IS_DEVELOPMENT) {
      return
    }

    if (typeof window !== 'undefined' && window.newrelic) {
      window.newrelic.noticeError(error, customAttributes)
    }
  },

  setCustomAttribute: (name: string, value: string | number | boolean) => {
    if (IS_LOCAL_ERROR_LOGGING_ENABLED) {
      // eslint-disable-next-line no-console
      console.log(`🔵 [New Relic - Dev Mode] Custom Attribute: ${name}=`, value)
      return
    }

    if (IS_DEVELOPMENT) {
      return
    }

    if (typeof window !== 'undefined' && window.newrelic) {
      window.newrelic.setCustomAttribute(name, value)
    }
  },

  addPageAction: (name: string, attributes?: NewRelicAttributes) => {
    if (IS_LOCAL_ERROR_LOGGING_ENABLED) {
      // eslint-disable-next-line no-console
      console.log(`🟢 [New Relic - Dev Mode] Page Action: ${name}`, attributes)
      return
    }

    if (IS_DEVELOPMENT) {
      return
    }

    if (typeof window !== 'undefined' && window.newrelic) {
      window.newrelic.addPageAction(name, attributes)
    }
  },

  setUserId: (userId: string) => {
    if (IS_LOCAL_ERROR_LOGGING_ENABLED) {
      // eslint-disable-next-line no-console
      console.log(`👤 [New Relic - Dev Mode] User ID:`, userId)
      return
    }

    if (IS_DEVELOPMENT) {
      return
    }

    if (typeof window !== 'undefined' && window.newrelic) {
      window.newrelic.setUserId(userId)
    }
  },

  recordCustomEvent: (name: string, attributes?: NewRelicAttributes) => {
    if (IS_LOCAL_ERROR_LOGGING_ENABLED) {
      // eslint-disable-next-line no-console
      console.log(`📊 [New Relic - Dev Mode] Custom Event: ${name}`, attributes)
      return
    }

    if (IS_DEVELOPMENT) {
      return
    }

    if (typeof window !== 'undefined' && window.newrelic) {
      window.newrelic.recordCustomEvent(name, attributes)
    }
  },

  setCurrentRouteName: (routeName: string) => {
    if (IS_LOCAL_ERROR_LOGGING_ENABLED) {
      // eslint-disable-next-line no-console
      console.log(`🗺️ [New Relic - Dev Mode] Route Name:`, routeName)
      return
    }

    if (IS_DEVELOPMENT) {
      return
    }

    if (typeof window !== 'undefined' && window.newrelic) {
      window.newrelic.setCurrentRouteName(routeName)
    }
  },

  addToTrace: (name: string, attributes?: NewRelicAttributes) => {
    if (IS_LOCAL_ERROR_LOGGING_ENABLED) {
      // eslint-disable-next-line no-console
      console.log(`🔍 [New Relic - Dev Mode] Add to Trace: ${name}`, attributes)
      return
    }

    if (IS_DEVELOPMENT) {
      return
    }

    if (typeof window !== 'undefined' && window.newrelic) {
      window.newrelic.addToTrace(name, attributes)
    }
  },

  isEnabled: () => {
    return typeof window !== 'undefined' && !!window.newrelic
  }
}

export default NewRelic
