import { RequestHeaders } from './types'

type Resolver<T> = () => Promise<T>

export interface CustomHeader {
  key: string
  value: string
}

export interface SDKConfig {
  SECURITY_KEY?: string | undefined
  HEADERS?: RequestHeaders | Resolver<RequestHeaders> | undefined
  CUSTOM_HEADERS?: CustomHeader[]
}

// Default SDK configuration
export const SDKConfig: SDKConfig = {
  SECURITY_KEY: undefined,
  HEADERS: undefined,
  CUSTOM_HEADERS: []
}

// Configure the SDK client with optional security key and custom headers
export const configureSDK = (
  securityKey?: string,
  customHeaders?: CustomHeader[]
) => {
  // Set up default headers function
  SDKConfig.HEADERS = async () => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    }

    // Add custom headers if provided
    if (customHeaders && customHeaders.length > 0) {
      customHeaders.forEach((header) => {
        if (header.key && header.value) {
          headers[header.key] = header.value
        }
      })
    }

    return headers
  }

  // Set security key
  SDKConfig.SECURITY_KEY = securityKey
  // Store custom headers for reference
  SDKConfig.CUSTOM_HEADERS = customHeaders || []
}
