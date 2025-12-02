import React, { ReactNode } from 'react'
import type { AccuracyData, AccuracyResultItem } from '@/types/evals'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import MarkdownRenderer from '@/components/ui/typography/MarkdownRenderer'
import { formatHeaderKey } from '../../util'
import { Separator } from '@/components/ui/separator'

interface DetailItemProps {
  label: string
  value: ReactNode
}

const DetailItem = ({ label, value }: DetailItemProps) => {
  if (!value) return null
  return (
    <div className="flex items-start gap-x-2">
      <span className="w-[80px] font-medium">
        {label}
        {label === 'Score' ? ':' : ''}
      </span>
      {typeof value === 'string' ? (
        <MarkdownRenderer classname="text-muted">{value}</MarkdownRenderer>
      ) : (
        <span className="text-muted">{value}</span>
      )}
    </div>
  )
}

/**
 * Creates an array of detail items for an accuracy result.
 * @param result - The accuracy result item.
 * @returns An array of detail items.
 */
const createResultDetails = (result: AccuracyResultItem) => [
  { label: 'Score', value: result.score },
  { label: 'Output', value: result.output },
  { label: 'Expected Output', value: result.expected_output },
  { label: 'Input', value: result.input },
  { label: 'Reason', value: result.reason }
]

/**
 * Renders the results section with collapsible items.
 * @param results - The array of accuracy result items.
 * @returns The ResultsSection component.
 */
const ResultsSection = ({ results }: { results: AccuracyResultItem[] }) => {
  if (!Array.isArray(results) || results?.length === 0) {
    return null
  }
  const firstResult = results[0]

  const firstResultDetails = createResultDetails(firstResult)

  return (
    <Accordion
      type="single"
      className="w-full"
      collapsible
      defaultValue="ResultsItem"
    >
      <div className="rounded-md border border-border bg-transparent p-4">
        <AccordionItem value={'ResultsItem'} className="border-none">
          <AccordionTrigger
            className="text-lg font-medium hover:no-underline"
            icon="eval-chevron-down"
            iconSize="size-6 rounded-sm p-1"
            iconPosition="right"
            backgroundColor="bg-secondary"
          >
            Results
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-y-4 pb-0">
            <div className="mt-4 flex shrink-0 grow-0 flex-col gap-y-4 text-sm">
              {firstResultDetails?.map((detail, index) => (
                <React.Fragment key={detail?.label}>
                  <DetailItem label={detail?.label} value={detail?.value} />
                  {index < firstResultDetails.length - 1 && <Separator />}
                </React.Fragment>
              ))}
            </div>
            {results.length > 1 && (
              <Accordion type="single" className="w-full" collapsible>
                <div className="rounded-md border border-border bg-secondary/50 p-4">
                  <AccordionItem
                    value={'additionalRunsItem'}
                    className="border-none"
                  >
                    <AccordionTrigger
                      className="text-sm font-normal text-muted hover:no-underline"
                      icon="eval-chevron-down"
                      iconPosition="right"
                    >
                      This evaluation ran{' '}
                      <span className="pl-1 text-primary">
                        {' '}
                        {results.length} times
                      </span>
                      . Click to see information about each individual run.
                    </AccordionTrigger>
                    <AccordionContent className="pb-0">
                      {results.slice(1).map((result, index) => {
                        const resultDetails = createResultDetails(result)
                        return (
                          <div
                            className="mt-8 flex flex-col gap-y-4 text-sm"
                            key={index}
                          >
                            <span className="text-sm font-medium">
                              Run {index + 2}
                            </span>
                            {resultDetails?.map((detail, detailIndex) => (
                              <React.Fragment key={detail.label}>
                                <DetailItem
                                  label={detail.label}
                                  value={detail.value}
                                />
                                {detailIndex < resultDetails.length - 1 && (
                                  <Separator />
                                )}
                              </React.Fragment>
                            ))}
                            <Separator />
                          </div>
                        )
                      })}
                    </AccordionContent>
                  </AccordionItem>
                </div>
              </Accordion>
            )}
          </AccordionContent>
        </AccordionItem>
      </div>
    </Accordion>
  )
}

/**
 * Renders the accuracy evaluation data in a table and a collapsible results section.
 * @param accuracy - The accuracy data.
 * @returns The AccuracyEval component.
 */
const AccuracyEval = ({ accuracy }: { accuracy: AccuracyData }) => {
  const dataKeys =
    typeof accuracy === 'object' &&
    accuracy !== null &&
    !Array.isArray(accuracy)
      ? Object.keys(accuracy).filter((key) => key !== 'results')
      : []

  return (
    <div className="flex flex-col gap-6">
      <Table containerClassName="rounded-md">
        <TableHeader className="bg-accent">
          <TableRow className="h-10">
            {Array.isArray(dataKeys) &&
              dataKeys?.map((key, index) => (
                <TableHead
                  className={`${
                    index === 0 ? '' : 'border-l border-border'
                  } text-right`}
                  key={key}
                >
                  {formatHeaderKey(key)}
                </TableHead>
              ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className="h-12">
            {Array.isArray(dataKeys) &&
              dataKeys?.map((key, index) => {
                const value = accuracy[key as keyof AccuracyData]
                const displayValue =
                  typeof value === 'number' ? value.toFixed(2) : 'N/A'
                return (
                  <TableCell
                    className={`${
                      index === 0 ? '' : 'border-l border-border'
                    } text-right`}
                    key={key}
                  >
                    {displayValue}
                  </TableCell>
                )
              })}
          </TableRow>
        </TableBody>
      </Table>

      <div>
        {accuracy?.results && <ResultsSection results={accuracy.results} />}
      </div>
    </div>
  )
}

export default AccuracyEval
