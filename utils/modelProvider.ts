import { IconType } from '@/components/ui/icon'

const PROVIDER_ICON_MAP: Record<string, IconType> = {
  aws: 'aws',
  openai: 'open-ai',
  anthropic: 'anthropic',
  mistral: 'mistral',
  gemini: 'gemini',
  azure: 'azure',
  groq: 'groq',
  fireworks: 'fireworks',
  deepseek: 'deepseek',
  cohere: 'cohere',
  ollama: 'ollama',
  xai: 'xai',
  google: 'gemini',
  huggingface: 'hugging-face',
  perplexity: 'perplexity',
  nvidia: 'nvidia',
  openrouter: 'open-router',
  sambanova: 'sambanova',
  litellm: 'lite-llm',
  together: 'together',
  ibm: 'ibm',
  lmstudio: 'lmstudio'
}

const MODEL_ICON_MAP: Record<string, IconType> = {
  gpt: 'open-ai',
  claude: 'anthropic',
  gemini: 'gemini'
}

export const getProviderIcon = (item: string): IconType => {
  const normalizedItem = item?.toLowerCase()

  const allEntries = [
    ...Object.entries(PROVIDER_ICON_MAP),
    ...Object.entries(MODEL_ICON_MAP)
  ]

  // Return 'instructions' (CircleHelp icon) as fallback for unknown providers
  return (
    allEntries.find(([key]) => normalizedItem?.includes(key))?.[1] ??
    'instructions'
  )
}
