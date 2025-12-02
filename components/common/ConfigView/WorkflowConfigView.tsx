import React, { useMemo } from 'react'
import { ConfigAccordion } from '@/components/common/ConfigView/ConfigAccordion'
import { processObjectProperties } from './utils'
import { WorkflowDetails } from '@/types/workflow'
import { WorkflowStepsSection } from './WorkflowStepsSection'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import CopyButton from '@/components/common/CopyButton'

type WorkflowConfigViewProps = {
  data: WorkflowDetails
}

const excludedKeys = new Set([
  'steps',
  'id',
  'name',
  'agents',
  'teams',
  'metadata',
  'input_schema'
])

const WorkflowConfigView = ({ data }: WorkflowConfigViewProps) => {
  // Process workflow details (excluding steps, metadata, and input_schema)

  const workflowDetails = useMemo(
    () => processObjectProperties(data, excludedKeys, data.id ?? 'workflow'),
    [data]
  )

  // Check if metadata exists and has properties
  const hasMetadata = useMemo(() => {
    if (!data.metadata) return false
    return Object.keys(data.metadata).length > 0
  }, [data.metadata])

  // Check if input schema exists
  const hasInputSchema = useMemo(() => {
    return !!data.input_schema
  }, [data.input_schema])

  return (
    <div className="flex flex-col gap-y-4">
      {/* Workflow steps wrapped in a dedicated section */}
      {data.steps && data.steps.length > 0 && (
        <ConfigAccordion
          name="Steps"
          type="list"
          configs={[]}
          icon="workflow-steps"
          metadata={{ count: data.steps.length }}
          nestedContent={<WorkflowStepsSection steps={data.steps} />}
          showAccordion={true}
        />
      )}

      {/* Workflow details */}
      {workflowDetails.map((config, index) => (
        <ConfigAccordion
          key={`workflow-detail-${data.id}-${index}`}
          {...config}
        />
      ))}

      {/* Input Schema section - only show if input schema exists */}
      {hasInputSchema && (
        <ConfigAccordion
          name="Input Schema"
          type="list"
          configs={[]}
          icon="braces"
          nestedContent={
            <div className="relative">
              <div className="absolute right-2 top-2 z-10">
                <CopyButton
                  content={JSON.stringify(data.input_schema, null, 2)}
                  className="text-white"
                />
              </div>
              <SyntaxHighlighter
                language="json"
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  padding: '0.75rem',
                  fontSize: '0.75rem',
                  lineHeight: '1.5',
                  borderRadius: '0.5rem'
                }}
                PreTag="div"
              >
                {JSON.stringify(data.input_schema, null, 2)}
              </SyntaxHighlighter>
            </div>
          }
          showAccordion={true}
        />
      )}

      {/* Metadata section - only show if metadata exists */}
      {hasMetadata && (
        <ConfigAccordion
          name="Metadata"
          type="list"
          configs={[]}
          nestedContent={
            <div className="relative">
              <div className="absolute right-2 top-2 z-10">
                <CopyButton
                  content={JSON.stringify(data.metadata, null, 2)}
                  className="text-white"
                />
              </div>
              <SyntaxHighlighter
                language="json"
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  padding: '0.75rem',
                  fontSize: '0.75rem',
                  lineHeight: '1.5',
                  borderRadius: '0.5rem'
                }}
                PreTag="div"
              >
                {JSON.stringify(data.metadata, null, 2)}
              </SyntaxHighlighter>
            </div>
          }
          showAccordion={true}
        />
      )}
    </div>
  )
}

export default WorkflowConfigView
