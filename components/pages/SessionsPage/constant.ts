import { AgentSessionDataWithTeamAndWorkflow } from '@/types/Agent'
import { Metric } from './SessionsDetails/Session/Tabs/DetailsTab/types'
import { formatDate } from '@/utils/format'

export const getSessionDetailsTabData = (
  each_session: AgentSessionDataWithTeamAndWorkflow,
  isTeam?: boolean,
  isWorkflow?: boolean
): Metric[] => {
  const data = isTeam ? each_session?.team_data : each_session?.agent_data

  return [
    {
      title: isTeam ? 'Team' : isWorkflow ? 'Workflow' : 'Agent',
      value: isWorkflow
        ? (each_session.workflow_name ?? each_session?.workflow_id)
        : (data?.name ?? each_session.agent_id),
      icon: isTeam
        ? 'team-orange-bg'
        : isWorkflow
          ? 'workflow-with-orange-bg'
          : 'avatar'
    },
    ...(isTeam && each_session?.team_data?.mode
      ? [
          {
            title: 'Mode',
            value: each_session.team_data.mode
          }
        ]
      : []),
    ...(isWorkflow
      ? []
      : [
          {
            title: 'Model',
            value: data?.model?.name
          },
          {
            title: 'Model Id',
            value: data?.model?.id
          },
          {
            title: 'Model Provider',
            value: data?.model?.provider
          }
        ]),
    {
      title: 'Session Id',
      value: each_session.session_id,
      copyButton: true
    },
    {
      title: 'Created At',
      value: formatDate(each_session.created_at, 'natural-with-time'),
      date: true,
      icon: 'calendar'
    },
    {
      title: 'Last Updated',
      value: formatDate(
        each_session.updated_at ?? each_session.created_at,
        'natural-with-time'
      ),
      date: true,
      icon: 'calendar'
    }
  ]
}
