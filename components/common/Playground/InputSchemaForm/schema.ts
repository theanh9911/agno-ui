import { z } from 'zod'
import { InputSchemaPropertyItem } from '@/types/workflow'

export interface InputSchema {
  description?: string
  properties?: Record<string, InputSchemaPropertyItem>
  required?: string[]
  title?: string
  type?: string | 'object'
}

/**
 * Dynamic Zod schema generator for input schemas
 * Generates validation schemas based on workflow input schema definitions
 */
export const createInputSchema = (
  inputSchema: InputSchema | null | undefined
) => {
  if (!inputSchema?.properties) {
    // Fallback schema with a required message field
    return z.object({
      message: z.string().min(1, 'Message is required')
    })
  }

  const schemaFields: Record<string, z.ZodType> = {}
  const requiredFields = inputSchema.required || []

  Object.entries(inputSchema.properties).forEach(([fieldName, field]) => {
    const isRequired = requiredFields.includes(fieldName)

    // Handle anyOf unions first
    if (
      Array.isArray(
        (field as unknown as { anyOf?: Array<{ type?: string }> })?.anyOf
      ) &&
      (field as unknown as { anyOf?: Array<{ type?: string }> }).anyOf!.length >
        0
    ) {
      const anyOfTypes = (
        field as unknown as { anyOf: Array<{ type?: string }> }
      ).anyOf
        .map((t) => t.type)
        .filter(Boolean) as string[]

      const hasString = anyOfTypes.includes('string')
      const hasNumber =
        anyOfTypes.includes('number') || anyOfTypes.includes('integer')
      const hasBoolean = anyOfTypes.includes('boolean')
      const hasArray = anyOfTypes.includes('array')
      const hasObject = anyOfTypes.includes('object')

      const variants: z.ZodTypeAny[] = []

      if (hasString) {
        variants.push(
          isRequired
            ? z.string().min(1, `${field.title || fieldName} is required`)
            : z.string()
        )
      }
      if (hasNumber) {
        variants.push(z.number())
      }
      if (hasBoolean) {
        variants.push(z.boolean())
      }
      if (hasArray) {
        variants.push(
          (isRequired
            ? z
                .array(z.string())
                .min(1, `${field.title || fieldName} is required`)
            : z.array(z.string())) as z.ZodTypeAny
        )
      }
      if (hasObject) {
        let strSchema = z.string()
        if (isRequired) {
          strSchema = strSchema.min(
            1,
            `${field.title || fieldName} is required`
          )
        }
        const objSchema = strSchema.refine(
          (val) => {
            if (!val || val.trim() === '') return !isRequired
            try {
              JSON.parse(val)
              return true
            } catch {
              return false
            }
          },
          `${field.title || fieldName} must be valid JSON`
        )
        variants.push(objSchema)
      }

      // Fallback if no recognizable types are present, treat as string
      if (variants.length === 0) {
        variants.push(
          isRequired
            ? z.string().min(1, `${field.title || fieldName} is required`)
            : z.string()
        )
      }

      const unionSchema =
        variants.length === 1
          ? variants[0]
          : z.union(variants as [z.ZodTypeAny, z.ZodTypeAny, ...z.ZodTypeAny[]])

      schemaFields[fieldName] = isRequired
        ? unionSchema
        : unionSchema.optional()
      return
    }

    switch (field.type) {
      case 'string':
        if (isRequired) {
          schemaFields[fieldName] = z
            .string()
            .min(1, `${field.title || fieldName} is required`)
        } else {
          schemaFields[fieldName] = z.string().optional()
        }
        break

      case 'number':
      case 'integer':
        if (isRequired) {
          schemaFields[fieldName] = z.number({
            required_error: `${field.title || fieldName} is required`
          })
        } else {
          schemaFields[fieldName] = z.number().optional()
        }
        break

      case 'boolean':
        if (isRequired) {
          schemaFields[fieldName] = z.boolean({
            required_error: `${field.title || fieldName} is required`
          })
        } else {
          schemaFields[fieldName] = z.boolean().optional()
        }
        break

      case 'array':
        if (isRequired) {
          schemaFields[fieldName] = z
            .array(z.string())
            .min(1, `${field.title || fieldName} is required`)
        } else {
          schemaFields[fieldName] = z.array(z.string()).optional()
        }
        break

      case 'object':
        // For objects, we'll store as JSON string and validate JSON format
        if (isRequired) {
          schemaFields[fieldName] = z
            .string()
            .min(1, `${field.title || fieldName} is required`)
            .refine(
              (val) => {
                try {
                  JSON.parse(val)
                  return true
                } catch {
                  return false
                }
              },
              `${field.title || fieldName} must be valid JSON`
            )
        } else {
          schemaFields[fieldName] = z
            .string()
            .optional()
            .refine(
              (val) => {
                if (!val || val.trim() === '') return true
                try {
                  JSON.parse(val)
                  return true
                } catch {
                  return false
                }
              },
              `${field.title || fieldName} must be valid JSON`
            )
        }
        break

      default:
        // For any other complex type, treat as JSON object
        if (isRequired) {
          schemaFields[fieldName] = z
            .string()
            .min(1, `${field.title || fieldName} is required`)
            .refine(
              (val) => {
                try {
                  JSON.parse(val)
                  return true
                } catch {
                  return false
                }
              },
              `${field.title || fieldName} must be valid JSON`
            )
        } else {
          schemaFields[fieldName] = z
            .string()
            .optional()
            .refine(
              (val) => {
                if (!val || val.trim() === '') return true
                try {
                  JSON.parse(val)
                  return true
                } catch {
                  return false
                }
              },
              `${field.title || fieldName} must be valid JSON`
            )
        }
    }
  })

  return z.object(schemaFields)
}

/**
 * Generates default values for input schema fields
 */

export const generateFormDefaults = (
  inputSchema: InputSchema | null | undefined
): Record<string, unknown> => {
  const defaults: Record<string, unknown> = {}

  // Fallback defaults with empty message field
  if (!inputSchema?.properties) {
    return { message: '' }
  }

  if (inputSchema?.properties) {
    Object.entries(inputSchema.properties).forEach(([fieldName, field]) => {
      if (field.default !== undefined && field.default !== null) {
        defaults[fieldName] = field.default
      } else {
        // anyOf-aware defaults
        if (
          Array.isArray(
            (field as unknown as { anyOf?: Array<{ type?: string }> })?.anyOf
          ) &&
          (field as unknown as { anyOf?: Array<{ type?: string }> }).anyOf!
            .length > 0
        ) {
          const anyOfTypes = (
            field as unknown as { anyOf: Array<{ type?: string }> }
          ).anyOf
            .map((t) => t.type)
            .filter(Boolean) as string[]

          if (anyOfTypes.includes('string')) {
            defaults[fieldName] = ''
          } else if (
            anyOfTypes.includes('number') ||
            anyOfTypes.includes('integer')
          ) {
            defaults[fieldName] = 0
          } else if (anyOfTypes.includes('boolean')) {
            defaults[fieldName] = false
          } else if (anyOfTypes.includes('array')) {
            defaults[fieldName] = []
          } else if (anyOfTypes.includes('object')) {
            defaults[fieldName] = '{}'
          } else {
            defaults[fieldName] = ''
          }
          return
        }
        switch (field.type) {
          case 'string':
            defaults[fieldName] = ''
            break
          case 'number':
          case 'integer':
            defaults[fieldName] = 0
            break
          case 'boolean':
            defaults[fieldName] = false
            break
          case 'array':
            defaults[fieldName] = []
            break
          case 'object':
            defaults[fieldName] = '{}'
            break
          default:
            defaults[fieldName] = '{}'
        }
      }
    })
  }

  return defaults
}

/**
 * Type for workflow form data
 */
export type InputSchemaData = Record<
  string,
  string | number | boolean | string[]
>
