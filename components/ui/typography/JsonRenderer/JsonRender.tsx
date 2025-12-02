import React, { type FC } from 'react'

import { type JsonRenderProps } from './type'

import Paragraph from '../Paragraph'

const JsonRender: FC<JsonRenderProps> = ({ content }) => {
  if (!content) {
    return <Paragraph size="body">No content to display</Paragraph>
  }

  try {
    const processContent = (input: unknown) => {
      if (typeof input === 'string') {
        if (input.includes('\\n') || input.includes('\\"')) {
          const unescaped = input.replace(/\\n/g, '\n').replace(/\\"/g, '"')
          try {
            return JSON.parse(unescaped) as unknown
          } catch {
            return unescaped
          }
        }

        try {
          return JSON.parse(input) as unknown
        } catch {
          return input
        }
      }

      return input
    }

    const processedContent = processContent(content)
    const jsonData = JSON.stringify(processedContent, null, 2)

    return (
      <pre className="whitespace-pre-wrap break-words rounded-md bg-secondary/50 p-4 font-mono text-xs text-primary">
        {jsonData}
      </pre>
    )
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return (
      <Paragraph size="body" className="text-red-500">
        Invalid JSON content
      </Paragraph>
    )
  }
}

export default JsonRender
