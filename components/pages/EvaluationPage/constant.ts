import { FormFieldName } from './CreateEvalRunModal/type'

export const summaryMetrics = [
  {
    metric: 'Average',
    timeKey: 'avg_run_time',
    memoryKey: 'avg_memory_usage'
  },
  {
    metric: 'Minimum',
    timeKey: 'min_run_time',
    memoryKey: 'min_memory_usage'
  },
  {
    metric: 'Maximum',
    timeKey: 'max_run_time',
    memoryKey: 'max_memory_usage'
  },
  {
    metric: 'Standard deviation',
    timeKey: 'std_dev_run_time',
    memoryKey: 'std_dev_memory_usage'
  },
  {
    metric: 'Median',
    timeKey: 'median_run_time',
    memoryKey: 'median_memory_usage'
  },
  {
    metric: '95th percentile',
    timeKey: 'p95_run_time',
    memoryKey: 'p95_memory_usage'
  }
]

export const TOOLTIP_CONTENT: Record<string, string> = {
  '# of iterations': 'Number of times you want to run the evaluation',
  Input: 'The test input that will be provided for the evaluation',
  'Expected output': 'The desired output that the evaluation should produce',
  'Additional evaluation guidelines':
    'Extra guidelines to be used for the evaluation',
  'Additional evaluation context':
    'Extra context to be used for the evaluation',
  'Expected tool calls': 'List of specific tools to be used for the evaluation',
  '# of warmup runs':
    'Initial runs to warm up the evaluation and ensure consistent performance measurements'
}

export const EVAL_FORM_COMMON_FIELDS = [
  {
    name: FormFieldName.RUN_NAME,
    label: 'Run name',
    type: 'input',
    placeholder: 'E.g. eval 1',
    className: 'flex-1'
  },
  {
    name: FormFieldName.EVALUATION_MODEL,
    label: 'Evaluation model',
    type: 'select',
    placeholder: 'Select a model',
    className: 'flex-1'
  },
  {
    name: FormFieldName.INPUT,
    label: 'Input',
    type: 'textarea',
    placeholder: 'Enter input'
  }
] as const

export const EVAL_FORM_ITERATIONS_FIELD = {
  name: FormFieldName.ITERATIONS,
  label: '# of iterations',
  type: 'input',
  inputType: 'number',
  className: 'flex-1',
  min: '1'
} as const

export const EVAL_FORM_GUIDELINES_FIELD = {
  name: FormFieldName.GUIDELINES,
  label: 'Additional evaluation guidelines',
  type: 'textarea',
  placeholder: 'Add any additional guidelines',
  optional: true
} as const

export const EVAL_FORM_WARMUP_RUNS_FIELD = {
  name: FormFieldName.WARMUP_RUNS,
  label: '# of warmup runs',
  type: 'input',
  inputType: 'number',
  className: 'flex-1',
  min: '0'
} as const

export const EVAL_FORM_EXPECTED_TOOL_CALLS_FIELD = {
  name: FormFieldName.EXPECTED_TOOL_CALLS,
  label: 'Expected tool calls',
  type: 'tag-input',
  placeholder: 'Add in expected tool calls'
} as const

export const EVAL_FORM_EXPECTED_OUTPUT_FIELD = {
  name: FormFieldName.EXPECTED_OUTPUT,
  label: 'Expected output',
  type: 'textarea',
  placeholder: 'Enter expected output'
} as const
