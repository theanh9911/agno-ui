import { isValidElement } from 'react'

import { stringify } from 'flatted'

import { type Code } from './types'

export const formatCode = (code: object) => stringify(code, undefined, 2)

export const formatNestedObject = (code: unknown, indent = ''): string => {
  if (code === null) return 'null'

  if (typeof code !== 'object') {
    return JSON.stringify(code)
  }

  // Handle Array
  if (Array.isArray(code)) {
    const nextIndent = `${indent}  `
    if (code.length === 0) return '[]'

    const formattedItems = code.map((item) =>
      formatNestedObject(item, nextIndent)
    )

    return `[\n${nextIndent}${formattedItems.join(`,\n${nextIndent}`)}\n${indent}]`
  }

  // Handle objects
  const nextIndent = `${indent}  `
  const entries = Object.entries(code)

  if (entries.length === 0) return '{}'

  const formattedEntries = entries.map(([key, value]) => {
    const formattedValue = formatNestedObject(value, nextIndent)
    return `${nextIndent}"${key}": ${formattedValue}`
  })

  return `{\n${formattedEntries.join(',\n')}\n${indent}}`
}

const parseJSON = (code: Code) => {
  let JSONString: object | null = null

  if (typeof code === 'string') {
    try {
      JSONString = JSON.parse(code) as object
    } catch {
      JSONString = null
    }
  }

  return JSONString
}

const parseNumber = (code: Code) => {
  let number: number | null = null

  if (typeof code === 'string') {
    const parsedNumber = parseFloat(code)
    const isNumber =
      !Number.isNaN(parsedNumber) && parsedNumber.toString() === code
    number = isNumber ? parsedNumber : null
  }

  return number
}

const parseReactNode = (code: Code) => {
  let children: string | null = null

  // @ts-expect-error - code.props can be unknown

  if (isValidElement(code) && 'children' in code.props) {
    children = (code.props as unknown as { children: string }).children
  }

  return children
}

export const parseCode = (code: Code) =>
  parseJSON(code) ?? parseNumber(code) ?? parseReactNode(code) ?? code
