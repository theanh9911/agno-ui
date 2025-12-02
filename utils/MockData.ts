import { DocumentStatusEnums } from '@/types/Knowledge'
import {
  AgentDetails,
  Interface,
  OSAgent,
  OSTeam,
  OSWorkflow
} from '@/types/os'
import { Trace, TracesResponse } from '@/types/traces'

export const metrics = {
  metrics: [
    {
      id: '03c5c124-63ac-4912-8ced-9197c93ec9b2',
      agent_runs_count: 6,
      agent_sessions_count: 6,
      team_runs_count: 13,
      team_sessions_count: 13,
      workflow_runs_count: 10,
      workflow_sessions_count: 10,
      users_count: 1,
      token_metrics: {
        input_tokens: 19021,
        output_tokens: 5209,
        total_tokens: 24230
      },
      model_metrics: [
        {
          model_id: 'gpt-4.1',
          model_provider: 'OpenAI',
          count: 7
        },
        {
          model_id: 'gpt-4o',
          model_provider: 'OpenAI',
          count: 15
        },
        {
          model_id: 'gpt-4.5',
          model_provider: 'OpenAI',
          count: 23
        }
      ],
      date: new Date('2025-07-13T00:00:00'),
      created_at: '1752365615',
      updated_at: '1752376268',
      completed: true
    },
    {
      id: '03c5c124-63ac-4912-8ced-9197c93ec9b2',
      agent_runs_count: 6,
      agent_sessions_count: 6,
      team_runs_count: 13,
      team_sessions_count: 13,
      workflow_runs_count: 5,
      workflow_sessions_count: 5,
      users_count: 1,
      token_metrics: {
        input_tokens: 19021,
        output_tokens: 5209,
        total_tokens: 24230
      },
      model_metrics: [
        {
          model_id: 'gpt-4.1',
          model_provider: 'OpenAI',
          count: 6
        },
        {
          model_id: 'gpt-4o',
          model_provider: 'OpenAI',
          count: 13
        },
        {
          model_id: 'gpt-4.5',
          model_provider: 'OpenAI',
          count: 23
        }
      ],
      date: new Date('2025-07-14T00:00:00'),
      created_at: '1752454533',
      updated_at: '1752464155',
      completed: true
    },
    {
      id: '39af614f-951d-4aa2-81ff-05a1be6fe067',
      agent_runs_count: 6,
      agent_sessions_count: 6,
      team_runs_count: 20,
      team_sessions_count: 17,
      workflow_runs_count: 10,
      workflow_sessions_count: 10,
      users_count: 1,
      token_metrics: {
        input_tokens: 15973,
        output_tokens: 5065,
        total_tokens: 21038
      },
      model_metrics: [
        {
          model_id: 'gpt-4.1',
          model_provider: 'OpenAI',
          count: 6
        },
        {
          model_id: 'gpt-4o',
          model_provider: 'OpenAI',
          count: 20
        },
        {
          model_id: 'claude-sonnet-3.7',
          model_provider: 'Anthropic',
          count: 20
        }
      ],
      date: new Date('2025-07-15T00:00:00'),
      created_at: '1752540837',
      updated_at: '1752547231',
      completed: true
    },
    {
      id: '22fb7a85-6723-4fff-8003-a4023237df08',
      agent_runs_count: 15,
      agent_sessions_count: 15,
      team_runs_count: 17,
      team_sessions_count: 13,
      workflow_runs_count: 20,
      workflow_sessions_count: 20,
      users_count: 3,
      token_metrics: {
        input_tokens: 6915,
        output_tokens: 5999,
        total_tokens: 12914
      },
      model_metrics: [
        {
          model_id: 'gpt-4.1',
          model_provider: 'OpenAI',
          count: 15
        },
        {
          model_id: 'gpt-4o',
          model_provider: 'OpenAI',
          count: 17
        },
        {
          model_id: 'gpt-4o-mini',
          model_provider: 'OpenAI',
          count: 10
        }
      ],
      date: new Date('2025-07-16T00:00:00'),
      created_at: '1752627067',
      updated_at: '1752630281',
      completed: true
    },
    {
      id: 'cc00aa6c-b210-483d-885d-cd1af2ff2c80',
      agent_runs_count: 5,
      agent_sessions_count: 5,
      team_runs_count: 13,
      team_sessions_count: 20,
      workflow_runs_count: 10,
      workflow_sessions_count: 10,
      users_count: 2,
      token_metrics: {
        input_tokens: 16210,
        output_tokens: 3753,
        total_tokens: 19963
      },
      model_metrics: [
        {
          model_id: 'gpt-4.1',
          model_provider: 'OpenAI',
          count: 5
        },
        {
          model_id: 'gpt-4o',
          model_provider: 'OpenAI',
          count: 13
        },
        {
          model_id: 'gpt-4o-mini',
          model_provider: 'OpenAI',
          count: 10
        }
      ],
      date: new Date('2025-07-17T00:00:00'),
      created_at: '1752712523',
      updated_at: '1752720082',
      completed: true
    },
    {
      id: '8038b5b3-2176-4c08-8f67-50d0fe030e51',
      agent_runs_count: 10,
      agent_sessions_count: 10,
      team_runs_count: 13,
      team_sessions_count: 14,
      workflow_runs_count: 54,
      workflow_sessions_count: 6,
      users_count: 2,
      token_metrics: {
        input_tokens: 18970,
        output_tokens: 4640,
        total_tokens: 23610
      },
      model_metrics: [
        {
          model_id: 'gpt-4.1',
          model_provider: 'OpenAI',
          count: 10
        },
        {
          model_id: 'gpt-4o',
          model_provider: 'OpenAI',
          count: 13
        }
      ],
      date: new Date('2025-07-18T00:00:00'),
      created_at: '1752799996',
      updated_at: '1752806030',
      completed: true
    },
    {
      id: '2f02185e-5754-4521-a5cc-739f0116ab3f',
      agent_runs_count: 5,
      agent_sessions_count: 5,
      team_runs_count: 16,
      team_sessions_count: 14,
      workflow_runs_count: 3,
      workflow_sessions_count: 1,
      users_count: 2,
      token_metrics: {
        input_tokens: 11359,
        output_tokens: 5257,
        total_tokens: 16616
      },
      model_metrics: [
        {
          model_id: 'gpt-4.1',
          model_provider: 'OpenAI',
          count: 5
        },
        {
          model_id: 'gpt-4o',
          model_provider: 'OpenAI',
          count: 16
        }
      ],
      date: new Date('2025-07-19T00:00:00'),
      created_at: '1752883374',
      updated_at: '1752883765',
      completed: true
    },
    {
      id: '3a77a06e-ea67-416d-a718-481e79d5543b',
      agent_runs_count: 10,
      agent_sessions_count: 10,
      team_runs_count: 12,
      team_sessions_count: 18,
      workflow_runs_count: 3,
      workflow_sessions_count: 3,
      users_count: 3,
      token_metrics: {
        input_tokens: 14098,
        output_tokens: 5955,
        total_tokens: 20053
      },
      model_metrics: [
        {
          model_id: 'gpt-4.1',
          model_provider: 'OpenAI',
          count: 10
        },
        {
          model_id: 'gpt-4o',
          model_provider: 'OpenAI',
          count: 12
        }
      ],
      date: new Date('2025-07-20T00:00:00'),
      created_at: '1752972501',
      updated_at: '1752980549',
      completed: true
    },
    {
      id: '37938d37-34d4-428d-a9e3-696f6a306fa2',
      agent_runs_count: 5,
      agent_sessions_count: 5,
      team_runs_count: 14,
      team_sessions_count: 13,
      workflow_runs_count: 7,
      workflow_sessions_count: 27,
      users_count: 3,
      token_metrics: {
        input_tokens: 14523,
        output_tokens: 5567,
        total_tokens: 20090
      },
      model_metrics: [
        {
          model_id: 'gpt-4.1',
          model_provider: 'OpenAI',
          count: 5
        },
        {
          model_id: 'gpt-4o',
          model_provider: 'OpenAI',
          count: 14
        },

        {
          model_id: 'gpt-4o-mini',
          model_provider: 'OpenAI',
          count: 50
        }
      ],
      date: new Date('2025-07-21T00:00:00'),
      created_at: '1753057146',
      updated_at: '1753066188',
      completed: true
    },
    {
      id: 'd68e33fe-0637-4016-8fad-84c5bb6be39f',
      agent_runs_count: 14,
      agent_sessions_count: 14,
      team_runs_count: 10,
      team_sessions_count: 18,
      workflow_runs_count: 2,
      workflow_sessions_count: 8,
      users_count: 1,
      token_metrics: {
        input_tokens: 14353,
        output_tokens: 4683,
        total_tokens: 19036
      },
      model_metrics: [
        {
          model_id: 'gpt-4.1',
          model_provider: 'OpenAI',
          count: 14
        },
        {
          model_id: 'gpt-4o',
          model_provider: 'OpenAI',
          count: 10
        }
      ],
      date: new Date('2025-07-22T00:00:00'),
      created_at: '1753144721',
      updated_at: '1753148712',
      completed: true
    },
    {
      id: '107079f1-2c4b-42fe-9831-d419f15c9189',
      agent_runs_count: 9,
      agent_sessions_count: 9,
      team_runs_count: 16,
      team_sessions_count: 16,
      workflow_runs_count: 0,
      workflow_sessions_count: 0,
      users_count: 3,
      token_metrics: {
        input_tokens: 5714,
        output_tokens: 2829,
        total_tokens: 8543
      },
      model_metrics: [
        {
          model_id: 'gpt-4.1',
          model_provider: 'OpenAI',
          count: 9
        },
        {
          model_id: 'gpt-4o',
          model_provider: 'OpenAI',
          count: 16
        },
        {
          model_id: 'claude-sonnet-4-20250514',
          model_provider: 'Anthropic',
          count: 10
        }
      ],
      date: new Date('2025-07-23T00:00:00'),
      created_at: '1753230943',
      updated_at: '1753233206',
      completed: true
    },
    {
      id: 'd63d9420-494c-4011-a9c7-1aa8affaca70',
      agent_runs_count: 12,
      agent_sessions_count: 12,
      team_runs_count: 20,
      team_sessions_count: 12,
      workflow_runs_count: 0,
      workflow_sessions_count: 0,
      users_count: 2,
      token_metrics: {
        input_tokens: 13237,
        output_tokens: 3840,
        total_tokens: 17077
      },
      model_metrics: [
        {
          model_id: 'gpt-4.1',
          model_provider: 'OpenAI',
          count: 12
        },
        {
          model_id: 'gpt-4o',
          model_provider: 'OpenAI',
          count: 20
        }
      ],
      date: new Date('2025-07-24T00:00:00'),
      created_at: '1753318301',
      updated_at: '1753321779',
      completed: true
    },
    {
      id: 'e97a7c8b-09b3-487c-98bd-7aefe34accde',
      agent_runs_count: 14,
      agent_sessions_count: 14,
      team_runs_count: 20,
      team_sessions_count: 11,
      workflow_runs_count: 0,
      workflow_sessions_count: 0,
      users_count: 2,
      token_metrics: {
        input_tokens: 16186,
        output_tokens: 5839,
        total_tokens: 22025
      },
      model_metrics: [
        {
          model_id: 'gpt-4.1',
          model_provider: 'OpenAI',
          count: 14
        },
        {
          model_id: 'gpt-4o',
          model_provider: 'OpenAI',
          count: 20
        },
        {
          model_id: 'claude-sonnet-4-20250514',
          model_provider: 'Anthropic',
          count: 10
        }
      ],
      date: new Date('2025-07-25T00:00:00'),
      created_at: '1753404549',
      updated_at: '1753417866',
      completed: true
    },
    {
      id: 'f25e30b0-5461-4e84-a5a8-7c7589f5c6d1',
      agent_runs_count: 11,
      agent_sessions_count: 11,
      team_runs_count: 17,
      team_sessions_count: 20,
      workflow_runs_count: 0,
      workflow_sessions_count: 0,
      users_count: 2,
      token_metrics: {
        input_tokens: 6593,
        output_tokens: 4965,
        total_tokens: 11558
      },
      model_metrics: [
        {
          model_id: 'gpt-4.1',
          model_provider: 'OpenAI',
          count: 11
        },
        {
          model_id: 'gpt-4o',
          model_provider: 'OpenAI',
          count: 17
        },
        {
          model_id: 'claude-sonnet-4-20250514',
          model_provider: 'Anthropic',
          count: 10
        }
      ],
      date: new Date('2025-07-26T00:00:00'),
      created_at: '1753488282',
      updated_at: '1753502166',
      completed: true
    },
    {
      id: 'd98db6c0-07c0-48b5-ba2c-1119aa849790',
      agent_runs_count: 14,
      agent_sessions_count: 14,
      team_runs_count: 19,
      team_sessions_count: 18,
      workflow_runs_count: 0,
      workflow_sessions_count: 0,
      users_count: 3,
      token_metrics: {
        input_tokens: 18209,
        output_tokens: 2200,
        total_tokens: 20409
      },
      model_metrics: [
        {
          model_id: 'gpt-4.1',
          model_provider: 'OpenAI',
          count: 14
        },
        {
          model_id: 'gpt-4o',
          model_provider: 'OpenAI',
          count: 19
        },
        {
          model_id: 'claude-sonnet-4-20250514',
          model_provider: 'Anthropic',
          count: 10
        }
      ],
      date: new Date('2025-07-27T00:00:00'),
      created_at: '1753575879',
      updated_at: '1753588346',
      completed: true
    },
    {
      id: '377db04b-6ad6-45e0-b8fd-3b1c74ac0fc1',
      agent_runs_count: 15,
      agent_sessions_count: 15,
      team_runs_count: 15,
      team_sessions_count: 14,
      workflow_runs_count: 0,
      workflow_sessions_count: 0,
      users_count: 1,
      token_metrics: {
        input_tokens: 16479,
        output_tokens: 5892,
        total_tokens: 22371
      },
      model_metrics: [
        {
          model_id: 'gpt-4.1',
          model_provider: 'OpenAI',
          count: 15
        },
        {
          model_id: 'gpt-4o',
          model_provider: 'OpenAI',
          count: 15
        },
        {
          model_id: 'claude-sonnet-3.7',
          model_provider: 'Anthropic',
          count: 40
        }
      ],
      date: new Date('2025-07-28T00:00:00'),
      created_at: '1753660806',
      updated_at: '1753665189',
      completed: true
    },
    {
      id: '7b48b891-63d0-4efb-8d68-fe84fbf3b5e5',
      agent_runs_count: 13,
      agent_sessions_count: 13,
      team_runs_count: 16,
      team_sessions_count: 14,
      workflow_runs_count: 0,
      workflow_sessions_count: 0,
      users_count: 3,
      token_metrics: {
        input_tokens: 10516,
        output_tokens: 2892,
        total_tokens: 13408
      },
      model_metrics: [
        {
          model_id: 'gpt-4.1',
          model_provider: 'OpenAI',
          count: 13
        },
        {
          model_id: 'gpt-4o',
          model_provider: 'OpenAI',
          count: 16
        },
        {
          model_id: 'claude-sonnet-3.7',
          model_provider: 'Anthropic',
          count: 35
        }
      ],
      date: new Date('2025-07-29T00:00:00'),
      created_at: '1753748700',
      updated_at: '1753752985',
      completed: true
    }
  ],
  updated_at: '2025-07-29T18:49:05Z'
}

export const knowledge = {
  data: [
    {
      id: 'f44bd99f-bde1-4c1a-9f30-9d65d8d8f471',
      name: 'http://localhost:7777',
      description: '',
      type: 'url',
      size: 0,
      linked_to: 'Agno Docs',
      metadata: {},
      status: DocumentStatusEnums.PROCESSING,
      status_message: '',
      created_at: '2025-07-29T12:50:08Z',
      updated_at: '2025-07-29T12:50:08Z'
    },
    {
      id: 'cf3748a6-3993-4598-903e-e769afacc2c7',
      name: 'Model Metrics',
      description: '',
      type: 'text/csv',
      size: 13233,
      linked_to: 'Agno Docs',
      metadata: {},
      status: DocumentStatusEnums.COMPLETED,
      status_message: '',
      created_at: '2025-07-29T05:50:54Z',
      updated_at: '2025-07-29T05:50:57Z'
    },
    {
      id: 'e797867c-a2ee-489c-a0a0-49c914a70984',
      name: 'Model Metrics',
      description: '',
      type: 'text/csv',
      size: 13233,
      linked_to: 'Agno Docs',
      metadata: {},
      status: DocumentStatusEnums.COMPLETED,
      status_message: '',
      created_at: '2025-07-29T05:50:54Z',
      updated_at: '2025-07-29T05:50:57Z'
    },
    {
      id: '09503457-351c-445a-914b-e58b0f665265',
      name: 'Token Metrics',
      description: '',
      type: 'text/csv',
      size: 13233,
      linked_to: 'Agno Docs',
      metadata: {},
      status: DocumentStatusEnums.COMPLETED,
      status_message: '',
      created_at: '2025-07-29T05:50:54Z',
      updated_at: '2025-07-29T05:50:54Z'
    },
    {
      id: '2476069e-c55a-4226-91ca-a1d1d46de916',
      name: 'Token Metrics',
      description: '',
      type: 'text/csv',
      size: 13232,
      linked_to: 'Agno Docs',
      metadata: {},
      status: DocumentStatusEnums.COMPLETED,
      status_message: '',
      created_at: '2025-07-29T05:50:54Z',
      updated_at: '2025-07-29T05:50:54Z'
    },
    {
      id: '5b56c95a-a0c1-4b34-a2b7-d84ff3fd8f9d',
      name: 'Model Metrics',
      description: '',
      type: 'url',
      size: 0,
      linked_to: 'Agno Docs',
      metadata: {},
      status: DocumentStatusEnums.COMPLETED,
      status_message: '',
      created_at: '2025-07-29T05:50:54Z',
      updated_at: '2025-07-29T05:50:54Z'
    },
    {
      id: '3a21107e-1f82-4af5-aa35-b31459f3d75f',
      name: 'Model Metrics',
      description: '',
      type: 'url',
      size: 0,
      linked_to: 'Agno Docs',
      metadata: {},
      status: DocumentStatusEnums.COMPLETED,
      status_message: '',
      created_at: '2025-07-29T05:50:54Z',
      updated_at: '2025-07-29T05:50:54Z'
    },
    {
      id: 'f44bd99f-bde1-4c1a-9f30-9d65d8d8f471',
      name: 'Model Metrics',
      description: '',
      type: 'text/csv',
      size: 0,
      linked_to: 'Agno Docs',
      metadata: {},
      status: DocumentStatusEnums.PROCESSING,
      status_message: '',
      created_at: '2025-07-29T12:50:08Z',
      updated_at: '2025-07-29T12:50:08Z'
    },
    {
      id: 'cf3748a6-3993-4598-903e-e769afacc2c7',
      name: 'Model Metrics',
      description: '',
      type: 'text/csv',
      size: 13233,
      linked_to: 'Agno Docs',
      metadata: {
        key: 'value',
        key2: 'value2',
        key3: 'value3'
      },
      status: DocumentStatusEnums.COMPLETED,
      status_message: '',
      created_at: '2025-07-29T05:50:54Z',
      updated_at: '2025-07-29T05:50:57Z'
    },
    {
      id: 'e797867c-a2ee-489c-a0a0-49c914a70984',
      name: 'Token Metrics',
      description: '',
      type: 'text/csv',
      size: 13233,
      linked_to: 'Agno Docs',
      metadata: {
        key: 'value',
        key2: 'value2',
        key3: 'value3'
      },
      status: DocumentStatusEnums.COMPLETED,
      status_message: '',
      created_at: '2025-07-29T05:50:54Z',
      updated_at: '2025-07-29T05:50:57Z'
    },
    {
      id: '09503457-351c-445a-914b-e58b0f665265',
      name: 'Token Metrics',
      description: '',
      type: 'text/csv',
      size: 13233,
      linked_to: 'Agno Docs',
      metadata: {
        key: 'value',
        key2: 'value2',
        key3: 'value3'
      },
      status: DocumentStatusEnums.COMPLETED,
      status_message: '',
      created_at: '2025-07-29T05:50:54Z',
      updated_at: '2025-07-29T05:50:54Z'
    },
    {
      id: '2476069e-c55a-4226-91ca-a1d1d46de916',
      name: 'Token Metrics',
      description: '',
      type: 'text/csv',
      size: 13232,
      linked_to: 'Agno Docs',
      metadata: {},
      status: DocumentStatusEnums.COMPLETED,
      status_message: '',
      created_at: '2025-07-29T05:50:54Z',
      updated_at: '2025-07-29T05:50:54Z'
    },
    {
      id: '5b56c95a-a0c1-4b34-a2b7-d84ff3fd8f9d',
      name: 'https://docs.agno.com/models/introduction',
      description: '',
      type: 'url',
      size: 0,
      linked_to: 'Agno Docs',
      metadata: {},
      status: DocumentStatusEnums.COMPLETED,
      status_message: '',
      created_at: '2025-07-29T05:50:54Z',
      updated_at: '2025-07-29T05:50:54Z'
    },
    {
      id: '3a21107e-1f82-4af5-aa35-b3ww145sadsa9f3d75f',
      name: 'https://docs.agno.com/models/introduction',
      description: '',
      type: 'url',
      size: 0,
      linked_to: 'Agno Docs',
      metadata: {},
      status: DocumentStatusEnums.COMPLETED,
      status_message: '',
      created_at: '2025-07-29T05:50:54Z',
      updated_at: '2025-07-29T05:50:54Z'
    },
    {
      id: '5b56c95a-a0c1-4b34-a2b7-d84fsadasf3fd8f9d',
      name: 'https://docs.agno.com/models/introduction',
      description: '',
      type: 'url',
      size: 0,
      linked_to: 'Agno Docs',
      metadata: {},
      status: DocumentStatusEnums.COMPLETED,
      status_message: '',
      created_at: '2025-07-29T05:50:54Z',
      updated_at: '2025-07-29T05:50:54Z'
    },
    {
      id: '3a21107e-1f82-4af5-aa35-b31459f3d75f',
      name: 'https://docs.agno.com/models/introduction',
      description: '',
      type: 'url',
      size: 0,
      linked_to: 'Agno Docs',
      metadata: {},
      status: DocumentStatusEnums.COMPLETED,
      status_message: '',
      created_at: '2025-07-29T05:50:54Z',
      updated_at: '2025-07-29T05:50:54Z'
    },
    {
      id: '5b56c95a-a0c1-4b34-a2b7-d84ff3fd8f9d',
      name: 'https://docs.agno.com/models/introduction',
      description: '',
      type: 'url',
      size: 0,
      linked_to: 'Agno Docs',
      metadata: {},
      status: DocumentStatusEnums.COMPLETED,
      status_message: '',
      created_at: '2025-07-29T05:50:54Z',
      updated_at: '2025-07-29T05:50:54Z'
    },
    {
      id: '3a21107e-1f82-4af5-aa35-bsad459f3d75f',
      name: 'https://docs.agno.com/models/introduction',
      description: '',
      type: 'url',
      size: 0,
      linked_to: 'Agno Docs',
      metadata: {},
      status: DocumentStatusEnums.COMPLETED,
      status_message: '',
      created_at: '2025-07-29T05:50:54Z',
      updated_at: '2025-07-29T05:50:54Z'
    },
    {
      id: '5b56c95a-a0c1-4b34-a2b7-dsadff3fd8f9d',
      name: 'https://docs.agno.com/models/introduction',
      description: '',
      type: 'url',
      size: 0,
      linked_to: 'Agno Docs',
      metadata: {},
      status: DocumentStatusEnums.COMPLETED,
      status_message: '',
      created_at: '2025-07-29T05:50:54Z',
      updated_at: '2025-07-29T05:50:54Z'
    },
    {
      id: '3a21107e-1f82-4af5-aa35-basd459f3d75f',
      name: 'https://docs.agno.com/models/introduction',
      description: '',
      type: 'url',
      size: 0,
      linked_to: 'Agno Docs',
      metadata: {},
      status: DocumentStatusEnums.COMPLETED,
      status_message: '',
      created_at: '2025-07-29T05:50:54Z',
      updated_at: '2025-07-29T05:50:54Z'
    },
    {
      id: '5b56c95a-a0c1-4b34-a2b7-as4ff3fd8f9d',
      name: 'https://docs.agno.com/models/introduction',
      description: '',
      type: 'url',
      size: 0,
      linked_to: 'Agno Docs',
      metadata: {},
      status: DocumentStatusEnums.COMPLETED,
      status_message: '',
      created_at: '2025-07-29T05:50:54Z',
      updated_at: '2025-07-29T05:50:54Z'
    },
    {
      id: '3a21107e-1f82-4afss5-aa35-b31459f3d75f',
      name: 'https://docs.agno.com/models/introduction',
      description: '',
      type: 'url',
      size: 0,
      linked_to: 'Agno Docs',
      metadata: {},
      status: DocumentStatusEnums.COMPLETED,
      status_message: '',
      created_at: '2025-07-29T05:50:54Z',
      updated_at: '2025-07-29T05:50:54Z'
    },
    {
      id: '5b56c95a-a0c1dasd-4b34-a2b7-d84ff3fd8f9d',
      name: 'https://docs.agno.com/models/introduction',
      description: '',
      type: 'url',
      size: 0,
      linked_to: 'Agno Docs',
      metadata: {},
      status: DocumentStatusEnums.COMPLETED,
      status_message: '',
      created_at: '2025-07-29T05:50:54Z',
      updated_at: '2025-07-29T05:50:54Z'
    },
    {
      id: '3a2110dasd7e-1f82-4af5-aa35-b31459f3d75f',
      name: 'https://docs.agno.com/models/introduction',
      description: '',
      type: 'url',
      size: 0,
      linked_to: 'Agno Docs',
      metadata: {},
      status: DocumentStatusEnums.COMPLETED,
      status_message: '',
      created_at: '2025-07-29T05:50:54Z',
      updated_at: '2025-07-29T05:50:54Z'
    }
  ],
  meta: {
    page: 1,
    limit: 20,
    total_pages: 2,
    total_count: 24
  }
}

export const memory = {
  data: [
    {
      memory_id: '2f898fe8-902d-4a10-a8aa-f56227c5f405',
      memory:
        'User prefers receiving notifications via email rather than SMS, especially for project updates and team communications',
      topics: ['preferences', 'notifications', 'email', 'communication'],
      agent_id: 'agent-001',
      team_id: null,
      workflow_id: null,
      user_id: 'user-001',
      updated_at: '2025-01-15T14:16:21Z'
    },
    {
      memory_id: 'c85746b9-0784-4603-a384-0a24f5aaab4b',
      memory:
        'Completed machine learning certification from Stanford Online. Expertise in Python, TensorFlow, and deep learning algorithms',
      topics: [
        'education',
        'machine learning',
        'python',
        'certification',
        'skills'
      ],
      agent_id: null,
      team_id: 'team-ml',
      workflow_id: null,
      user_id: 'user-001',
      updated_at: '2025-01-14T10:30:15Z'
    },
    {
      memory_id: 'f466297d-6591-4d8d-9ac6-1fef2e54d3e5',
      memory:
        'Weekly team standup meetings are scheduled every Monday at 9 AM PST. Key topics include sprint progress and blockers',
      topics: ['meetings', 'standup', 'schedule', 'team', 'sprint'],
      agent_id: null,
      team_id: 'team-frontend',
      workflow_id: 'workflow-standup',
      user_id: 'user-001',
      updated_at: '2025-01-13T16:45:32Z'
    },
    {
      memory_id: 'a1b2c3d4-5e6f-7890-abcd-ef1234567890',
      memory:
        'Currently working on the new authentication system using OAuth 2.0 and JWT tokens. Priority deadline is end of January',
      topics: ['project', 'authentication', 'oauth', 'jwt', 'deadline'],
      agent_id: 'agent-002',
      team_id: 'team-backend',
      workflow_id: 'workflow-auth',
      user_id: 'user-001',
      updated_at: '2025-01-12T09:20:45Z'
    },
    {
      memory_id: '9876543a-bcde-f012-3456-789abcdef012',
      memory:
        'Lives in San Francisco, CA. Timezone is Pacific Standard Time (PST). Prefers meetings between 10 AM - 4 PM local time',
      topics: ['location', 'timezone', 'preferences', 'meetings', 'schedule'],
      agent_id: 'agent-scheduler',
      team_id: null,
      workflow_id: null,
      user_id: 'user-001',
      updated_at: '2025-01-11T13:15:22Z'
    },
    {
      memory_id: '1a2b3c4d-5e6f-7890-1234-56789abcdef0',
      memory:
        'Emergency contact is Sarah Johnson (spouse) at +1-555-0123. Also has backup contact: David Chen (brother) at +1-555-0456',
      topics: ['emergency', 'contact', 'family', 'phone'],
      agent_id: null,
      team_id: null,
      workflow_id: null,
      user_id: 'user-001',
      updated_at: '2025-01-10T11:30:18Z'
    },
    {
      memory_id: 'abc12345-def6-7890-abcd-ef1234567890',
      memory:
        'Allergic to shellfish and nuts. Dietary preference is vegetarian. Enjoys Mediterranean and Asian cuisine',
      topics: ['health', 'allergies', 'diet', 'vegetarian', 'food'],
      agent_id: 'agent-health',
      team_id: null,
      workflow_id: null,
      user_id: 'user-001',
      updated_at: '2025-01-09T15:42:33Z'
    },
    {
      memory_id: 'fedcba98-7654-3210-fedc-ba9876543210',
      memory:
        'Goal for 2025: Lead a cross-functional team project and mentor 2 junior developers. Also planning to speak at 3 tech conferences',
      topics: [
        'goals',
        '2025',
        'leadership',
        'mentoring',
        'conferences',
        'career'
      ],
      agent_id: 'agent-career',
      team_id: null,
      workflow_id: 'workflow-goals',
      user_id: 'user-001',
      updated_at: '2025-01-08T08:25:17Z'
    },
    {
      memory_id: '11111111-2222-3333-4444-555555555555',
      memory:
        'Prefers dark mode for all applications. Uses VS Code with Dracula theme. Keyboard shortcuts enthusiast',
      topics: [
        'preferences',
        'dark mode',
        'vscode',
        'theme',
        'keyboard shortcuts'
      ],
      agent_id: null,
      team_id: null,
      workflow_id: null,
      user_id: 'user-001',
      updated_at: '2025-01-07T17:18:44Z'
    },
    {
      memory_id: '22222222-3333-4444-5555-666666666666',
      memory:
        'Recently migrated the user database from MySQL to PostgreSQL. Improved query performance by 40% and reduced downtime',
      topics: ['database', 'migration', 'postgresql', 'mysql', 'performance'],
      agent_id: 'agent-003',
      team_id: 'team-backend',
      workflow_id: 'workflow-migration',
      user_id: 'user-001',
      updated_at: '2025-01-06T12:55:09Z'
    },
    {
      memory_id: '33333333-4444-5555-6666-777777777777',
      memory:
        'Coffee enthusiast - drinks 3 cups per day, prefers light roast Ethiopian beans. Local favorite is Blue Bottle Coffee',
      topics: [
        'coffee',
        'preferences',
        'ethiopian',
        'light roast',
        'blue bottle'
      ],
      agent_id: null,
      team_id: null,
      workflow_id: null,
      user_id: 'user-001',
      updated_at: '2025-01-05T14:22:51Z'
    },
    {
      memory_id: '44444444-5555-6666-7777-888888888888',
      memory:
        'Fluent in English and Spanish. Learning Japanese through Duolingo. Plans to take JLPT N3 exam in December 2025',
      topics: [],
      agent_id: 'agent-language',
      team_id: null,
      workflow_id: 'workflow-learning',
      user_id: 'user-001',
      updated_at: '2025-01-04T10:33:26Z'
    },
    {
      memory_id: '55555555-6666-7777-8888-999999999999',
      memory:
        'Enjoys hiking and photography during weekends. Favorite trails are in Marin Headlands and Point Reyes',
      topics: [],
      agent_id: null,
      team_id: null,
      workflow_id: null,
      user_id: 'user-001',
      updated_at: '2025-01-03T16:47:12Z'
    },
    {
      memory_id: '66666666-7777-8888-9999-aaaaaaaaaaaa',
      memory:
        'Birthday is March 15th. Prefers small gatherings over large parties. Favorite cake flavor is chocolate with raspberry filling',
      topics: [],
      agent_id: null,
      team_id: null,
      workflow_id: null,
      user_id: 'user-001',
      updated_at: '2025-01-02T09:11:38Z'
    },
    {
      memory_id: '77777777-8888-9999-aaaa-bbbbbbbbbbbb',
      memory:
        'Drives a Tesla Model 3. Commutes to office 3 days per week. Prefers remote work on Tuesdays and Thursdays',
      topics: [],
      agent_id: 'agent-scheduler',
      team_id: null,
      workflow_id: 'workflow-schedule',
      user_id: 'user-001',
      updated_at: '2025-01-01T18:29:55Z'
    }
  ],
  meta: {
    page: 1,
    limit: 10,
    total_pages: 2,
    total_count: 20
  }
}

export const chatSession = {
  data: [
    {
      session_id: '9a7cdfb0-352f-4fc6-ba30-b780125b938d',
      session_name:
        'You are a member of a team of agents. Your goal is to complete the following task:\n\n<task>\nProvide any known distinctions or similarities between Claude code and Cursor from existing knowledge.\n</task>\n\n<expected_output>\nInformation on known distinctions or similarities between Claude code and Cursor based on existing knowledge.\n</expected_output>',
      created_at: '2025-08-04T04:35:17Z',
      updated_at: '2025-08-04T04:35:17Z'
    },
    {
      session_id: 'a8150e15-db50-4c0d-86c8-abd985e7a172',
      session_name: 'Tell me about yourself',
      created_at: '2025-08-04T04:31:48Z',
      updated_at: '2025-08-04T04:31:48Z'
    },
    {
      session_id: '9a7cdfb0-352f-4fc6-ba30-b780125b938d',
      session_name:
        'You are a member of a team of agents. Your goal is to complete the following task:\n\n<task>\nProvide any known distinctions or similarities between Claude code and Cursor from existing knowledge.\n</task>\n\n<expected_output>\nInformation on known distinctions or similarities between Claude code and Cursor based on existing knowledge.\n</expected_output>',
      created_at: '2025-08-04T04:35:17Z',
      updated_at: '2025-08-04T04:35:17Z'
    },
    {
      session_id: 'a8150e15-db50-4c0d-86c8-abd985e7a172',
      session_name: 'Tell me about yourself',
      created_at: '2025-08-04T04:31:48Z',
      updated_at: '2025-08-04T04:31:48Z'
    },
    {
      session_id: '9a7cdfb0-352f-4fc6-ba30-b780125b938d',
      session_name:
        'You are a member of a team of agents. Your goal is to complete the following task:\n\n<task>\nProvide any known distinctions or similarities between Claude code and Cursor from existing knowledge.\n</task>\n\n<expected_output>\nInformation on known distinctions or similarities between Claude code and Cursor based on existing knowledge.\n</expected_output>',
      created_at: '2025-08-04T04:35:17Z',
      updated_at: '2025-08-04T04:35:17Z'
    },
    {
      session_id: 'a8150e15-db50-4c0d-86c8-abd985e7a172',
      session_name: 'Tell me about yourself',
      created_at: '2025-08-04T04:31:48Z',
      updated_at: '2025-08-04T04:31:48Z'
    },
    {
      session_id: '9a7cdfb0-352f-4fc6-ba30-b780125b938d',
      session_name:
        'You are a member of a team of agents. Your goal is to complete the following task:\n\n<task>\nProvide any known distinctions or similarities between Claude code and Cursor from existing knowledge.\n</task>\n\n<expected_output>\nInformation on known distinctions or similarities between Claude code and Cursor based on existing knowledge.\n</expected_output>',
      created_at: '2025-08-04T04:35:17Z',
      updated_at: '2025-08-04T04:35:17Z'
    },
    {
      session_id: 'a8150e15-db50-4c0d-86c8-abd985e7a172',
      session_name: 'Tell me about yourself',
      created_at: '2025-08-04T04:31:48Z',
      updated_at: '2025-08-04T04:31:48Z'
    },
    {
      session_id: '9a7cdfb0-352f-4fc6-ba30-b780125b938d',
      session_name:
        'You are a member of a team of agents. Your goal is to complete the following task:\n\n<task>\nProvide any known distinctions or similarities between Claude code and Cursor from existing knowledge.\n</task>\n\n<expected_output>\nInformation on known distinctions or similarities between Claude code and Cursor based on existing knowledge.\n</expected_output>',
      created_at: '2025-08-04T04:35:17Z',
      updated_at: '2025-08-04T04:35:17Z'
    },
    {
      session_id: 'a8150e15-db50-4c0d-86c8-abd985e7a172',
      session_name: 'Tell me about yourself',
      created_at: '2025-08-04T04:31:48Z',
      updated_at: '2025-08-04T04:31:48Z'
    },
    {
      session_id: '9a7cdfb0-352f-4fc6-ba30-b780125b938d',
      session_name:
        'You are a member of a team of agents. Your goal is to complete the following task:\n\n<task>\nProvide any known distinctions or similarities between Claude code and Cursor from existing knowledge.\n</task>\n\n<expected_output>\nInformation on known distinctions or similarities between Claude code and Cursor based on existing knowledge.\n</expected_output>',
      created_at: '2025-08-04T04:35:17Z',
      updated_at: '2025-08-04T04:35:17Z'
    }
  ],
  meta: {
    page: 1,
    limit: 20,
    total_pages: 1,
    total_count: 2
  }
}
export const chatMessage = [
  {
    role: 'user',
    content: 'write insights on ai trends in 200 words',
    created_at: 1754414982
  },
  {
    role: 'agent',
    content:
      'Artificial Intelligence (AI) continues to be a transformative force in 2024, with several key trends defining the industry. Generative AI, popularized by tools like ChatGPT and DALL-E, is expanding beyond text and images to video, music, and even product design, enabling entirely new creative workflows. Multimodal AI models, which combine text, visual, and audio data, are becoming mainstream, allowing for richer, more intuitive user interactions.\n\nAI democratization is progressing rapidly, with more open-source models and accessible APIs lowering the barrier for developers and businesses. This is accelerating innovation and fostering a vibrant ecosystem of AI-powered applications. Edge AI, where computation happens on local devices rather than in the cloud, is gaining traction, improving privacy, latency, and enabling real-time analytics for applications in autonomous vehicles, drones, and IoT devices.\n\nResponsible and explainable AI is also a strong trend, as organizations prioritize transparency, fairness, and regulatory compliance. To address risks like deepfakes and bias, new tools for auditing and monitoring AI are being integrated into development pipelines. As AI adoption expands, upskilling the workforce and updating regulatory frameworks remain crucial challenges and opportunities for both industry and society.',
    tool_calls: [],
    streamingError: false,
    reasoning: [],
    is_reasoning_streaming: false,
    created_at: 1754414991,
    intermediateSteps: [
      {
        event: 'RunStarted',
        id: 'RunStarted_eeee9f55-61d2-4e4e-9072-361c38aa7087',
        data: {
          originalChunk: {
            created_at: 1754414982,
            event: 'RunStarted',
            agent_id: 'eeee9f55-61d2-4e4e-9072-361c38aa7087',
            agent_name: 'Finance Agent',
            run_id: 'd75998f6-fb72-44df-96c2-ae654e16d619',
            session_id: 'db50406a-6807-4726-8d74-d279d204b9b7',
            model: 'gpt-4.1',
            model_provider: 'OpenAI'
          }
        }
      },
      {
        event: 'RunResponseContent',
        id: 'RunResponseContent_eeee9f55-61d2-4e4e-9072-361c38aa7087',
        data: {
          originalChunk: {
            created_at: 1754414991,
            event: 'RunResponseContent',
            agent_id: 'eeee9f55-61d2-4e4e-9072-361c38aa7087',
            agent_name: 'Finance Agent',
            run_id: 'd75998f6-fb72-44df-96c2-ae654e16d619',
            session_id: 'db50406a-6807-4726-8d74-d279d204b9b7',
            content:
              'Artificial Intelligence (AI) continues to be a transformative force in 2024, with several key trends defining the industry. Generative AI, popularized by tools like ChatGPT and DALL-E, is expanding beyond text and images to video, music, and even product design, enabling entirely new creative workflows. Multimodal AI models, which combine text, visual, and audio data, are becoming mainstream, allowing for richer, more intuitive user interactions.\n\nAI democratization is progressing rapidly, with more open-source models and accessible APIs lowering the barrier for developers and businesses. This is accelerating innovation and fostering a vibrant ecosystem of AI-powered applications. Edge AI, where computation happens on local devices rather than in the cloud, is gaining traction, improving privacy, latency, and enabling real-time analytics for applications in autonomous vehicles, drones, and IoT devices.\n\nResponsible and explainable AI is also a strong trend, as organizations prioritize transparency, fairness, and regulatory compliance. To address risks like deepfakes and bias, new tools for auditing and monitoring AI are being integrated into development pipelines. As AI adoption expands, upskilling the workforce and updating regulatory frameworks remain crucial challenges and opportunities for both industry and society.',
            content_type: 'str',
            thinking: ''
          }
        }
      },
      {
        event: 'RunCompleted',
        id: 'RunCompleted_eeee9f55-61d2-4e4e-9072-361c38aa7087',
        data: {
          originalChunk: {
            created_at: 1754414991,
            event: 'RunCompleted',
            agent_id: 'eeee9f55-61d2-4e4e-9072-361c38aa7087',
            agent_name: 'Finance Agent',
            run_id: 'd75998f6-fb72-44df-96c2-ae654e16d619',
            session_id: 'db50406a-6807-4726-8d74-d279d204b9b7',
            content:
              'Artificial Intelligence (AI) continues to be a transformative force in 2024, with several key trends defining the industry. Generative AI, popularized by tools like ChatGPT and DALL-E, is expanding beyond text and images to video, music, and even product design, enabling entirely new creative workflows. Multimodal AI models, which combine text, visual, and audio data, are becoming mainstream, allowing for richer, more intuitive user interactions.\n\nAI democratization is progressing rapidly, with more open-source models and accessible APIs lowering the barrier for developers and businesses. This is accelerating innovation and fostering a vibrant ecosystem of AI-powered applications. Edge AI, where computation happens on local devices rather than in the cloud, is gaining traction, improving privacy, latency, and enabling real-time analytics for applications in autonomous vehicles, drones, and IoT devices.\n\nResponsible and explainable AI is also a strong trend, as organizations prioritize transparency, fairness, and regulatory compliance. To address risks like deepfakes and bias, new tools for auditing and monitoring AI are being integrated into development pipelines. As AI adoption expands, upskilling the workforce and updating regulatory frameworks remain crucial challenges and opportunities for both industry and society.',
            content_type: 'str'
          }
        }
      }
    ],
    disableHitlForm: true,
    extra_data: {}
  }
]

export const sessionsList = {
  data: [
    {
      session_id: 'a8550bf0-9bde-45c9-bc43-aa46c6f242a2',
      session_name: 'tesla vs nvidia stock',
      created_at: '2025-08-05T10:02:37Z',
      updated_at: '2025-08-05T10:02:37Z'
    },
    {
      session_id: '179282ed-4002-45d4-b301-1d03fdd90eb9',
      session_name: 'Grok vs Claude',
      created_at: '2025-08-05T10:02:04Z',
      updated_at: '2025-08-05T10:02:04Z'
    },
    {
      session_id: '3c5d7b3e-9fe5-4ad4-ae58-c409f1f2306f',
      session_name: 'Which tools do you have access to?',
      created_at: '2025-08-05T10:01:47Z',
      updated_at: '2025-08-05T10:01:47Z'
    },
    {
      session_id: '9509b356-3190-4bb8-9ab0-11daaa3a91c4',
      session_name: 'Tell me about yourself',
      created_at: '2025-08-04T19:48:12Z',
      updated_at: '2025-08-04T19:48:12Z'
    },
    {
      session_id: '3885fbdb-edec-4b70-be3b-41cdc5032583',
      session_name: "What's your special skill?",
      created_at: '2025-08-04T09:57:34Z',
      updated_at: '2025-08-04T09:57:34Z'
    },
    {
      session_id: '06976aed-b16f-460c-b0aa-12aaef473ca7',
      session_name: "What's your special skill?",
      created_at: '2025-08-04T09:44:40Z',
      updated_at: '2025-08-04T09:44:40Z'
    },
    {
      session_id: '1f294a40-c072-482f-91a1-b21a59bd9131',
      session_name: 'gpt 5 vs opus 4.1',
      created_at: '2025-08-04T09:44:29Z',
      updated_at: '2025-08-04T09:44:29Z'
    },
    {
      session_id: 'bae65871-ac05-45ff-9bad-6ebdb49b474c',
      session_name: 'gpt 5 vs opus 4.1',
      created_at: '2025-08-04T09:44:23Z',
      updated_at: '2025-08-04T09:44:23Z'
    },
    {
      session_id: '8688e562-5868-4214-8692-c64f61c0173c',
      session_name: 'Tell me about yourself',
      created_at: '2025-08-04T09:20:00Z',
      updated_at: '2025-08-04T09:20:00Z'
    },
    {
      session_id: 'dc60f179-fa56-459b-b2cd-0acb52ec9d5e',
      session_name: 'gpt 5 vs opus 4.1',
      created_at: '2025-08-04T08:01:38Z',
      updated_at: '2025-08-04T08:01:38Z'
    },
    {
      session_id: '1acee88d-6540-454d-b1da-a1f8c9375c03',
      session_name: 'history of gpt',
      created_at: '2025-08-04T06:54:47Z',
      updated_at: '2025-08-04T06:54:47Z'
    },
    {
      session_id: '1184b9bb-9a44-4f86-ba86-0c42d7b0cc5f',
      session_name: 'gpt 5 vs opus 4.1',
      created_at: '2025-08-04T06:51:41Z',
      updated_at: '2025-08-04T06:51:41Z'
    },
    {
      session_id: '1f08fceb-b7a0-4d9e-8860-783b14076ffe',
      session_name: 'gpt 5 vs opus 4.1',
      created_at: '2025-08-04T05:35:31Z',
      updated_at: '2025-08-04T05:35:31Z'
    },
    {
      session_id: '469936b3-9f09-4bb9-a163-b6da7b36f538',
      session_name: 'gpt 5 vs opus 4.1',
      created_at: '2025-08-04T05:32:06Z',
      updated_at: '2025-08-04T05:32:06Z'
    },
    {
      session_id: '2c83c53c-d493-4943-a0e6-a00dfb8fde2b',
      session_name: 'Tell me about yourself',
      created_at: '2025-08-04T04:31:18Z',
      updated_at: '2025-08-04T04:31:33Z'
    },
    {
      session_id: '33eef02f-836f-4ad7-aa1c-df047abb7bcc',
      session_name: 'Which tools do you have access to?',
      created_at: '2025-08-03T19:46:26Z',
      updated_at: '2025-08-03T19:47:22Z'
    },
    {
      session_id: 'f949c676-9ada-47bf-b161-b16009ba7b39',
      session_name: 'gpt 5 vs opus 4.1',
      created_at: '2025-08-03T19:44:56Z',
      updated_at: '2025-08-03T19:45:31Z'
    },
    {
      session_id: '8363d13f-d92c-4721-81ed-8ac229bbf6cd',
      session_name: 'gpt 5 vs opus 4.1',
      created_at: '2025-08-03T17:51:42Z',
      updated_at: '2025-08-03T17:51:42Z'
    },
    {
      session_id: '242f6cbd-868b-4ca5-9a8e-848d4b626bc7',
      session_name: 'gpt 5 vs opus 4.1',
      created_at: '2025-08-03T13:15:38Z',
      updated_at: '2025-08-03T13:15:38Z'
    },
    {
      session_id: '4f39bc2c-47ac-4100-8154-a6fa44a467d3',
      session_name: 'gpt 4o vs opus 3',
      created_at: '2025-08-01T13:31:45Z',
      updated_at: '2025-08-01T13:31:45Z'
    },
    {
      session_id: 'b103c8ac-10a6-4763-a4cf-9b63f317b0e3',
      session_name: 'Data visualization techniques',
      created_at: '2025-08-01T09:36:25Z',
      updated_at: '2025-08-01T09:36:25Z'
    },
    {
      session_id: 'db19c2e4-7d68-47e1-acbe-9ba0c92738c3',
      session_name: 'gpt 5 vs opus 4.1',
      created_at: '2025-08-01T09:36:16Z',
      updated_at: '2025-08-01T09:36:16Z'
    },
    {
      session_id: '581b09d0-83b8-4386-be8e-50ea0c1492ed',
      session_name: 'gpt 5 vs opus 4.1',
      created_at: '2025-08-01T09:31:25Z',
      updated_at: '2025-08-01T09:31:25Z'
    },
    {
      session_id: 'e4551a76-c890-4f4f-9388-7dcbce7c4ba1',
      session_name: 'Data visualization techniques',
      created_at: '2025-08-01T09:00:21Z',
      updated_at: '2025-08-01T09:00:21Z'
    },
    {
      session_id: 'd5f18dd6-d0e6-40c7-bedf-d92021a9cc52',
      session_name: "What's your special skill?",
      created_at: '2025-08-01T09:00:14Z',
      updated_at: '2025-08-01T09:00:14Z'
    },
    {
      session_id: 'f56e4b37-555a-4abd-8f5b-c163a42584bc',
      session_name: 'Data visualization techniques',
      created_at: '2025-08-01T09:00:08Z',
      updated_at: '2025-08-01T09:00:08Z'
    },
    {
      session_id: 'db69365a-2925-4dc5-8d8e-5f34bf4568ff',
      session_name: 'Which tools do you have access to?',
      created_at: '2025-08-01T08:57:57Z',
      updated_at: '2025-08-01T08:57:57Z'
    },
    {
      session_id: 'f8080e67-af9f-4ce5-9571-150cbd5f7cab',
      session_name: "What's your special skill?",
      created_at: '2025-08-01T08:57:51Z',
      updated_at: '2025-08-01T08:57:51Z'
    },
    {
      session_id: 'b9feab33-e825-42c3-8f5a-5b6ab89759ea',
      session_name: "What's your special skill?",
      created_at: '2025-08-01T08:57:35Z',
      updated_at: '2025-08-01T08:57:35Z'
    },
    {
      session_id: 'ecbddc16-acba-48dd-8f13-ce4ad399a59c',
      session_name: 'Tell me about yourself',
      created_at: '2025-08-01T08:57:29Z',
      updated_at: '2025-08-01T08:57:29Z'
    },
    {
      session_id: '8c296429-5116-4ad5-ac05-b5c8f03ce955',
      session_name: 'Which tools do you have access to?',
      created_at: '2025-08-01T08:57:23Z',
      updated_at: '2025-08-01T08:57:23Z'
    },
    {
      session_id: 'a117d0d6-7458-4f4f-9c36-34f5fa23d718',
      session_name: 'Grok vs Claude',
      created_at: '2025-08-01T08:57:16Z',
      updated_at: '2025-08-01T08:57:16Z'
    },
    {
      session_id: 'ae887e4f-20ad-4128-818a-f46b599902a5',
      session_name: 'Grok vs Claude',
      created_at: '2025-08-01T08:57:10Z',
      updated_at: '2025-08-01T08:57:10Z'
    },
    {
      session_id: 'dbefc781-d1f1-4d50-bb20-cde53e836866',
      session_name: 'Grok vs Claude',
      created_at: '2025-08-01T08:56:52Z',
      updated_at: '2025-08-01T08:56:52Z'
    },
    {
      session_id: 'f8d32eeb-349c-4e08-a0e4-2be950872258',
      session_name: 'Which tools do you have access to?',
      created_at: '2025-08-01T08:56:43Z',
      updated_at: '2025-08-01T08:56:43Z'
    },
    {
      session_id: 'b7ac668b-5d8c-4782-a25c-d4b3c1afd9f7',
      session_name: 'Grok vs Claude',
      created_at: '2025-08-01T08:56:35Z',
      updated_at: '2025-08-01T08:56:35Z'
    },
    {
      session_id: '8a33deb4-b40a-4a06-b302-c68a1b6c1ab3',
      session_name: 'Grok vs Claude',
      created_at: '2025-08-01T08:56:28Z',
      updated_at: '2025-08-01T08:56:28Z'
    },
    {
      session_id: '376a8057-2cb3-45e0-b1ec-7f1242deb690',
      session_name: 'Which tools do you have access to?',
      created_at: '2025-08-01T08:56:11Z',
      updated_at: '2025-08-01T08:56:11Z'
    },
    {
      session_id: 'ebaa92e2-2e12-4da2-a7a2-fd8dc3dda962',
      session_name: 'Grok vs Claude',
      created_at: '2025-08-01T08:56:00Z',
      updated_at: '2025-08-01T08:56:00Z'
    },
    {
      session_id: '398e3b01-468e-4d1a-bd2c-775165d02eb1',
      session_name: 'Grok vs Claude',
      created_at: '2025-08-01T08:55:54Z',
      updated_at: '2025-08-01T08:55:54Z'
    }
  ],
  meta: {
    page: 1,
    limit: 40,
    total_pages: 2,
    total_count: 46
  }
}

export const sessionsData = [
  {
    run_id: 'a91a9ab3-ddb7-4d00-9787-58c34f551ab1',
    agent_session_id: '1deea616-e00e-4e92-84ec-6666ff57b443',
    workspace_id: null,
    user_id: null,
    run_input: 'tesla vs nvidia stock comparison',
    content:
      'It appears my search returned unrelated payment data rather than stock information. Let me provide a concise, up-to-date comparison based on the general market knowledge as of June 2024:\n\n---\n\n## Tesla (TSLA) vs. Nvidia (NVDA) Stock Comparison\n\n### 1. **Company Overview**\n- **Tesla (TSLA)**: Primarily an electric vehicle and clean energy company, also involved in battery and solar technology.\n- **Nvidia (NVDA)**: Leading semiconductor company, dominating the AI hardware space with GPUs for data centers, gaming, and automotive.\n\n### 2. **Stock Performance (2023-2024)**\n**Tesla (TSLA)**\n- Volatile performance: Saw a strong rise in 2020–2021, but pulled back through 2022.\n- In 2023-2024, stock performance was choppy due to concerns about electric vehicle demand, price cuts, margins, and competition from Chinese EVs.\n- Market cap is large but has been overtaken by Nvidia in 2024.\n\n**Nvidia (NVDA)**\n- Astronomical growth in 2023-2024, gaining several hundred percent due to its dominant position in AI chips.\n- Became one of the top 3 most valuable companies globally in 2024, briefly surpassing $3 trillion market cap.\n- Demand for its AI and data center chips has driven historic revenue and net income growth.\n\n### 3. **Financials (Latest Reported)**\n- **Tesla:** Margins squeezed by price wars; revenue growth is slowing; still profitable, but profit is pressured.\n- **Nvidia:** Rapid revenue and profit growth; record quarterly results; robust margins thanks to AI chip demand.\n\n### 4. **Valuation**\n- **Tesla:** Still trades at a high price-to-earnings (P/E) compared to traditional automakers, but much lower than peak levels.\n- **Nvidia:** Trades at a premium valuation—a very high P/E—supported by explosive growth expectations in AI.\n\n### 5. **Outlook**\n- **Tesla:** Needs strong vehicle demand, new product launches (Cybertruck, next-gen models), and margin recovery to reignite growth.\n- **Nvidia:** Riding the AI boom; outlook is strong as long as demand for generative AI/AI infrastructure remains.\n\n### 6. **Risks**\n- **Tesla:** EV market saturation, competition, regulatory issues, economic slowdowns\n- **Nvidia:** Potential competition (AMD, Intel, custom chips), supply chain constraints, AI spending slowdown\n\n---\n\n## **At a Glance**\n\n|                           | TESLA (TSLA)       | NVIDIA (NVDA)       |\n|---------------------------|--------------------|---------------------|\n| Sector                    | EV, Clean Energy   | Semiconductors, AI  |\n| 2024 Stock Trend          | Flat/Down          | Soaring Up          |\n| Market Cap (Jun 2024)     | ~$550B–$600B       | >$3 Trillion        |\n| P/E Ratio                 | 40–60x             | 60–70x              |\n| Main Catalyst             | EV Demand, Margins | AI Chip Demand      |\n\n---\n\n### Summary\n- **Nvidia has vastly outperformed Tesla over the past 12–18 months, driven by AI frenzy.**\n- **Tesla remains a high-profile growth story but faces more operational and demand uncertainty.**\n- Both are high-risk/high-reward tech stocks, but Nvidia is the current market leader due to AI momentum.\n\nIf you want specific recent price charts, valuation data, or analyst recommendations, let me know!',
    run_response_format: 'text',
    reasoning_content: '',
    run_review: null,
    metrics: {
      input_tokens: 2460,
      output_tokens: 829,
      total_tokens: 3289,
      prompt_tokens: 2460,
      completion_tokens: 829,
      prompt_tokens_details: {
        audio_tokens: 0,
        cached_tokens: 0
      },
      completion_tokens_details: {
        accepted_prediction_tokens: 0,
        audio_tokens: 0,
        reasoning_tokens: 0,
        rejected_prediction_tokens: 0
      },
      time: 15.964457707945257,
      time_to_first_token: 1.7951393750263378
    },
    messages: [
      {
        content:
          '<additional_information>\n- Use markdown to format your answers.\n</additional_information>\n\nYou have the capability to retain memories from previous interactions with the user, but have not had any interactions with the user yet.',
        from_history: false,
        stop_after_tool_call: false,
        role: 'system',
        created_at: 1754401690
      },
      {
        content: 'tesla vs nvidia stock comparison',
        from_history: false,
        stop_after_tool_call: false,
        role: 'user',
        created_at: 1754401690
      },
      {
        from_history: false,
        stop_after_tool_call: false,
        role: 'assistant',
        tool_calls: [
          {
            id: 'call_XteXCcVEjXNJ2GK9cC3catWW',
            type: 'function',
            function: {
              name: 'search_knowledge_base',
              arguments:
                '{"query": "Tesla vs Nvidia stock performance comparison"}'
            }
          },
          {
            id: 'call_lebCjFmbRyDUxqRP66q3Is59',
            type: 'function',
            function: {
              name: 'search_knowledge_base',
              arguments:
                '{"query": "Tesla stock recent performance and outlook"}'
            }
          },
          {
            id: 'call_kgYJN02ctv87Q4XnWD2uLdEy',
            type: 'function',
            function: {
              name: 'search_knowledge_base',
              arguments:
                '{"query": "Nvidia stock recent performance and outlook"}'
            }
          }
        ],
        metrics: {
          input_tokens: 109,
          output_tokens: 80,
          total_tokens: 189,
          prompt_tokens: 109,
          completion_tokens: 80,
          prompt_tokens_details: {
            audio_tokens: 0,
            cached_tokens: 0
          },
          completion_tokens_details: {
            accepted_prediction_tokens: 0,
            audio_tokens: 0,
            reasoning_tokens: 0,
            rejected_prediction_tokens: 0
          },
          time: 1.9945856669801287,
          time_to_first_token: 1.7951393750263378
        },
        created_at: 1754401690
      },
      {
        content:
          '[\n  {\n    "content": " 2024 - Nov 12, 2024 (estimated) Method: Wire Payment Details Description Total Amount 164,465.20",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-10-28"\n  },\n  {\n    "content": " 2024 - Oct 11, 2024 (estimated) Method: Wire Payment Details Description Total Amount 163,598.60",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-09-27"\n  },\n  {\n    "content": " 2024 - Sep 10, 2024 (estimated) Method: Wire Payment Details Description Total Amount 164,113.20",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-08-29"\n  },\n  {\n    "content": " 2024 - Sep 10, 2024 (estimated) Method: Wire Payment Details Description Total Amount 164,113.20",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-08-26"\n  },\n  {\n    "content": " 2024 - Dec 12, 2024 (estimated) Method: Wire Payment Details Description Total Amount 164,880.00",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-11-27"\n  },\n  {\n    "content": " 2024 - Sep 11, 2024 (estimated) Method: Wire Payment Details Description Total Amount 164,062.40",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-08-27"\n  },\n  {\n    "content": " 2025 - Jan 13, 2025 (estimated) Method: Wire Payment Details Description Total Amount 166,820.40",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-12-27"\n  },\n  {\n    "content": "Phidata Inc 169 Madison Ave STE 2420 New York, NY 10016 650-430-0174 Paid to Ayush Jha XXXX8893",\n    "meta_data": {\n      "page": 1,\n      "chunk": 1,\n      "chunk_size": 95\n    },\n    "name": "Ayush Jha-payment-2024-08-26"\n  },\n  {\n    "content": "Phidata Inc 169 Madison Ave STE 2420 New York, NY 10016 650-430-0174 Paid to Ayush Jha XXXX8893",\n    "meta_data": {\n      "page": 1,\n      "chunk": 1,\n      "chunk_size": 95\n    },\n    "name": "Ayush Jha-payment-2024-08-27"\n  },\n  {\n    "content": "Phidata Inc 169 Madison Ave STE 2420 New York, NY 10016 650-430-0174 Paid to Ayush Jha XXXX8893",\n    "meta_data": {\n      "page": 1,\n      "chunk": 1,\n      "chunk_size": 95\n    },\n    "name": "Ayush Jha-payment-2024-09-27"\n  }\n]',
        from_history: false,
        stop_after_tool_call: false,
        role: 'tool',
        tool_call_id: 'call_XteXCcVEjXNJ2GK9cC3catWW',
        tool_name: 'search_knowledge_base',
        tool_args: {
          query: 'Tesla vs Nvidia stock performance comparison'
        },
        tool_call_error: false,
        metrics: {
          time: 1.4855540830176324
        },
        created_at: 1754401694
      },
      {
        content:
          '[\n  {\n    "content": " 2024 - Oct 11, 2024 (estimated) Method: Wire Payment Details Description Total Amount 163,598.60",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-09-27"\n  },\n  {\n    "content": " 2024 - Sep 10, 2024 (estimated) Method: Wire Payment Details Description Total Amount 164,113.20",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-08-26"\n  },\n  {\n    "content": " 2024 - Sep 10, 2024 (estimated) Method: Wire Payment Details Description Total Amount 164,113.20",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-08-29"\n  },\n  {\n    "content": " 2024 - Nov 12, 2024 (estimated) Method: Wire Payment Details Description Total Amount 164,465.20",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-10-28"\n  },\n  {\n    "content": " 2024 - Dec 12, 2024 (estimated) Method: Wire Payment Details Description Total Amount 164,880.00",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-11-27"\n  },\n  {\n    "content": " 2025 - Jan 13, 2025 (estimated) Method: Wire Payment Details Description Total Amount 166,820.40",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-12-27"\n  },\n  {\n    "content": " 2024 - Sep 11, 2024 (estimated) Method: Wire Payment Details Description Total Amount 164,062.40",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-08-27"\n  },\n  {\n    "content": " INR Total Payment 163,598.60 INR",\n    "meta_data": {\n      "page": 1,\n      "chunk": 4,\n      "chunk_size": 33\n    },\n    "name": "Ayush Jha-payment-2024-09-27"\n  },\n  {\n    "content": "Phidata Inc 169 Madison Ave STE 2420 New York, NY 10016 650-430-0174 Paid to Ayush Jha XXXX8893",\n    "meta_data": {\n      "page": 1,\n      "chunk": 1,\n      "chunk_size": 95\n    },\n    "name": "Ayush Jha-payment-2024-08-27"\n  },\n  {\n    "content": "Phidata Inc 169 Madison Ave STE 2420 New York, NY 10016 650-430-0174 Paid to Ayush Jha XXXX8893",\n    "meta_data": {\n      "page": 1,\n      "chunk": 1,\n      "chunk_size": 95\n    },\n    "name": "Ayush Jha-payment-2024-09-27"\n  }\n]',
        from_history: false,
        stop_after_tool_call: false,
        role: 'tool',
        tool_call_id: 'call_lebCjFmbRyDUxqRP66q3Is59',
        tool_name: 'search_knowledge_base',
        tool_args: {
          query: 'Tesla stock recent performance and outlook'
        },
        tool_call_error: false,
        metrics: {
          time: 1.9655977500369772
        },
        created_at: 1754401694
      },
      {
        content:
          '[\n  {\n    "content": " 2024 - Nov 12, 2024 (estimated) Method: Wire Payment Details Description Total Amount 164,465.20",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-10-28"\n  },\n  {\n    "content": " 2024 - Oct 11, 2024 (estimated) Method: Wire Payment Details Description Total Amount 163,598.60",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-09-27"\n  },\n  {\n    "content": " 2024 - Sep 10, 2024 (estimated) Method: Wire Payment Details Description Total Amount 164,113.20",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-08-26"\n  },\n  {\n    "content": " 2024 - Sep 10, 2024 (estimated) Method: Wire Payment Details Description Total Amount 164,113.20",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-08-29"\n  },\n  {\n    "content": " 2024 - Dec 12, 2024 (estimated) Method: Wire Payment Details Description Total Amount 164,880.00",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-11-27"\n  },\n  {\n    "content": " 2024 - Sep 11, 2024 (estimated) Method: Wire Payment Details Description Total Amount 164,062.40",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-08-27"\n  },\n  {\n    "content": " 2025 - Jan 13, 2025 (estimated) Method: Wire Payment Details Description Total Amount 166,820.40",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-12-27"\n  },\n  {\n    "content": " INR Total Payment 163,598.60 INR",\n    "meta_data": {\n      "page": 1,\n      "chunk": 4,\n      "chunk_size": 33\n    },\n    "name": "Ayush Jha-payment-2024-09-27"\n  },\n  {\n    "content": " INR Total Payment 164,113.20 INR",\n    "meta_data": {\n      "page": 1,\n      "chunk": 4,\n      "chunk_size": 33\n    },\n    "name": "Ayush Jha-payment-2024-08-29"\n  },\n  {\n    "content": " INR Total Payment 164,113.20 INR",\n    "meta_data": {\n      "page": 1,\n      "chunk": 4,\n      "chunk_size": 33\n    },\n    "name": "Ayush Jha-payment-2024-08-26"\n  }\n]',
        from_history: false,
        stop_after_tool_call: false,
        role: 'tool',
        tool_call_id: 'call_kgYJN02ctv87Q4XnWD2uLdEy',
        tool_name: 'search_knowledge_base',
        tool_args: {
          query: 'Nvidia stock recent performance and outlook'
        },
        tool_call_error: false,
        metrics: {
          time: 1.0518851249944419
        },
        created_at: 1754401694
      },
      {
        content:
          'It appears my search returned unrelated payment data rather than stock information. Let me provide a concise, up-to-date comparison based on the general market knowledge as of June 2024:\n\n---\n\n## Tesla (TSLA) vs. Nvidia (NVDA) Stock Comparison\n\n### 1. **Company Overview**\n- **Tesla (TSLA)**: Primarily an electric vehicle and clean energy company, also involved in battery and solar technology.\n- **Nvidia (NVDA)**: Leading semiconductor company, dominating the AI hardware space with GPUs for data centers, gaming, and automotive.\n\n### 2. **Stock Performance (2023-2024)**\n**Tesla (TSLA)**\n- Volatile performance: Saw a strong rise in 2020–2021, but pulled back through 2022.\n- In 2023-2024, stock performance was choppy due to concerns about electric vehicle demand, price cuts, margins, and competition from Chinese EVs.\n- Market cap is large but has been overtaken by Nvidia in 2024.\n\n**Nvidia (NVDA)**\n- Astronomical growth in 2023-2024, gaining several hundred percent due to its dominant position in AI chips.\n- Became one of the top 3 most valuable companies globally in 2024, briefly surpassing $3 trillion market cap.\n- Demand for its AI and data center chips has driven historic revenue and net income growth.\n\n### 3. **Financials (Latest Reported)**\n- **Tesla:** Margins squeezed by price wars; revenue growth is slowing; still profitable, but profit is pressured.\n- **Nvidia:** Rapid revenue and profit growth; record quarterly results; robust margins thanks to AI chip demand.\n\n### 4. **Valuation**\n- **Tesla:** Still trades at a high price-to-earnings (P/E) compared to traditional automakers, but much lower than peak levels.\n- **Nvidia:** Trades at a premium valuation—a very high P/E—supported by explosive growth expectations in AI.\n\n### 5. **Outlook**\n- **Tesla:** Needs strong vehicle demand, new product launches (Cybertruck, next-gen models), and margin recovery to reignite growth.\n- **Nvidia:** Riding the AI boom; outlook is strong as long as demand for generative AI/AI infrastructure remains.\n\n### 6. **Risks**\n- **Tesla:** EV market saturation, competition, regulatory issues, economic slowdowns\n- **Nvidia:** Potential competition (AMD, Intel, custom chips), supply chain constraints, AI spending slowdown\n\n---\n\n## **At a Glance**\n\n|                           | TESLA (TSLA)       | NVIDIA (NVDA)       |\n|---------------------------|--------------------|---------------------|\n| Sector                    | EV, Clean Energy   | Semiconductors, AI  |\n| 2024 Stock Trend          | Flat/Down          | Soaring Up          |\n| Market Cap (Jun 2024)     | ~$550B–$600B       | >$3 Trillion        |\n| P/E Ratio                 | 40–60x             | 60–70x              |\n| Main Catalyst             | EV Demand, Margins | AI Chip Demand      |\n\n---\n\n### Summary\n- **Nvidia has vastly outperformed Tesla over the past 12–18 months, driven by AI frenzy.**\n- **Tesla remains a high-profile growth story but faces more operational and demand uncertainty.**\n- Both are high-risk/high-reward tech stocks, but Nvidia is the current market leader due to AI momentum.\n\nIf you want specific recent price charts, valuation data, or analyst recommendations, let me know!',
        from_history: false,
        stop_after_tool_call: false,
        role: 'assistant',
        metrics: {
          input_tokens: 2351,
          output_tokens: 749,
          total_tokens: 3100,
          prompt_tokens: 2351,
          completion_tokens: 749,
          prompt_tokens_details: {
            audio_tokens: 0,
            cached_tokens: 0
          },
          completion_tokens_details: {
            accepted_prediction_tokens: 0,
            audio_tokens: 0,
            reasoning_tokens: 0,
            rejected_prediction_tokens: 0
          },
          time: 13.969872040965129,
          time_to_first_token: 0.953792207990773
        },
        created_at: 1754401694
      }
    ],
    tools: [
      {
        tool_call_id: 'call_XteXCcVEjXNJ2GK9cC3catWW',
        tool_name: 'search_knowledge_base',
        tool_args: {
          query: 'Tesla vs Nvidia stock performance comparison'
        },
        tool_call_error: false,
        result:
          '[\n  {\n    "content": " 2024 - Nov 12, 2024 (estimated) Method: Wire Payment Details Description Total Amount 164,465.20",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-10-28"\n  },\n  {\n    "content": " 2024 - Oct 11, 2024 (estimated) Method: Wire Payment Details Description Total Amount 163,598.60",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-09-27"\n  },\n  {\n    "content": " 2024 - Sep 10, 2024 (estimated) Method: Wire Payment Details Description Total Amount 164,113.20",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-08-29"\n  },\n  {\n    "content": " 2024 - Sep 10, 2024 (estimated) Method: Wire Payment Details Description Total Amount 164,113.20",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-08-26"\n  },\n  {\n    "content": " 2024 - Dec 12, 2024 (estimated) Method: Wire Payment Details Description Total Amount 164,880.00",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-11-27"\n  },\n  {\n    "content": " 2024 - Sep 11, 2024 (estimated) Method: Wire Payment Details Description Total Amount 164,062.40",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-08-27"\n  },\n  {\n    "content": " 2025 - Jan 13, 2025 (estimated) Method: Wire Payment Details Description Total Amount 166,820.40",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-12-27"\n  },\n  {\n    "content": "Phidata Inc 169 Madison Ave STE 2420 New York, NY 10016 650-430-0174 Paid to Ayush Jha XXXX8893",\n    "meta_data": {\n      "page": 1,\n      "chunk": 1,\n      "chunk_size": 95\n    },\n    "name": "Ayush Jha-payment-2024-08-26"\n  },\n  {\n    "content": "Phidata Inc 169 Madison Ave STE 2420 New York, NY 10016 650-430-0174 Paid to Ayush Jha XXXX8893",\n    "meta_data": {\n      "page": 1,\n      "chunk": 1,\n      "chunk_size": 95\n    },\n    "name": "Ayush Jha-payment-2024-08-27"\n  },\n  {\n    "content": "Phidata Inc 169 Madison Ave STE 2420 New York, NY 10016 650-430-0174 Paid to Ayush Jha XXXX8893",\n    "meta_data": {\n      "page": 1,\n      "chunk": 1,\n      "chunk_size": 95\n    },\n    "name": "Ayush Jha-payment-2024-09-27"\n  }\n]',
        metrics: {
          time: 1.4855540830176324
        },
        stop_after_tool_call: false,
        created_at: 1754383323,
        requires_confirmation: null,
        confirmed: null,
        confirmation_note: null,
        requires_user_input: null,
        user_input_schema: null,
        answered: null,
        external_execution_required: null
      },
      {
        tool_call_id: 'call_lebCjF33mbRyDUxqRP66q3Is59',
        tool_name: 'search_knowledge_base',
        tool_args: {
          query: 'Tesla stock recent performance and outlook'
        },
        tool_call_error: false,
        result:
          '[\n  {\n    "content": " 2024 - Oct 11, 2024 (estimated) Method: Wire Payment Details Description Total Amount 163,598.60",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-09-27"\n  },\n  {\n    "content": " 2024 - Sep 10, 2024 (estimated) Method: Wire Payment Details Description Total Amount 164,113.20",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-08-26"\n  },\n  {\n    "content": " 2024 - Sep 10, 2024 (estimated) Method: Wire Payment Details Description Total Amount 164,113.20",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-08-29"\n  },\n  {\n    "content": " 2024 - Nov 12, 2024 (estimated) Method: Wire Payment Details Description Total Amount 164,465.20",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-10-28"\n  },\n  {\n    "content": " 2024 - Dec 12, 2024 (estimated) Method: Wire Payment Details Description Total Amount 164,880.00",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-11-27"\n  },\n  {\n    "content": " 2025 - Jan 13, 2025 (estimated) Method: Wire Payment Details Description Total Amount 166,820.40",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-12-27"\n  },\n  {\n    "content": " 2024 - Sep 11, 2024 (estimated) Method: Wire Payment Details Description Total Amount 164,062.40",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-08-27"\n  },\n  {\n    "content": " INR Total Payment 163,598.60 INR",\n    "meta_data": {\n      "page": 1,\n      "chunk": 4,\n      "chunk_size": 33\n    },\n    "name": "Ayush Jha-payment-2024-09-27"\n  },\n  {\n    "content": "Phidata Inc 169 Madison Ave STE 2420 New York, NY 10016 650-430-0174 Paid to Ayush Jha XXXX8893",\n    "meta_data": {\n      "page": 1,\n      "chunk": 1,\n      "chunk_size": 95\n    },\n    "name": "Ayush Jha-payment-2024-08-27"\n  },\n  {\n    "content": "Phidata Inc 169 Madison Ave STE 2420 New York, NY 10016 650-430-0174 Paid to Ayush Jha XXXX8893",\n    "meta_data": {\n      "page": 1,\n      "chunk": 1,\n      "chunk_size": 95\n    },\n    "name": "Ayush Jha-payment-2024-09-27"\n  }\n]',
        metrics: {
          time: 1.9655977500369772
        },
        stop_after_tool_call: false,
        created_at: 1754383323,
        requires_confirmation: null,
        confirmed: null,
        confirmation_note: null,
        requires_user_input: null,
        user_input_schema: null,
        answered: null,
        external_execution_required: null
      },
      {
        tool_call_id: 'call_kgYJN02ctv87Q4XnWD2uLdEy',
        tool_name: 'duckduckgo_search',
        tool_args: {
          query: 'Nvidia stock recent performance and outlook'
        },
        tool_call_error: false,
        result:
          '[\n  {\n    "content": " 2024 - Nov 12, 2024 (estimated) Method: Wire Payment Details Description Total Amount 164,465.20",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-10-28"\n  },\n  {\n    "content": " 2024 - Oct 11, 2024 (estimated) Method: Wire Payment Details Description Total Amount 163,598.60",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-09-27"\n  },\n  {\n    "content": " 2024 - Sep 10, 2024 (estimated) Method: Wire Payment Details Description Total Amount 164,113.20",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-08-26"\n  },\n  {\n    "content": " 2024 - Sep 10, 2024 (estimated) Method: Wire Payment Details Description Total Amount 164,113.20",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-08-29"\n  },\n  {\n    "content": " 2024 - Dec 12, 2024 (estimated) Method: Wire Payment Details Description Total Amount 164,880.00",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-11-27"\n  },\n  {\n    "content": " 2024 - Sep 11, 2024 (estimated) Method: Wire Payment Details Description Total Amount 164,062.40",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-08-27"\n  },\n  {\n    "content": " 2025 - Jan 13, 2025 (estimated) Method: Wire Payment Details Description Total Amount 166,820.40",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-12-27"\n  },\n  {\n    "content": " INR Total Payment 163,598.60 INR",\n    "meta_data": {\n      "page": 1,\n      "chunk": 4,\n      "chunk_size": 33\n    },\n    "name": "Ayush Jha-payment-2024-09-27"\n  },\n  {\n    "content": " INR Total Payment 164,113.20 INR",\n    "meta_data": {\n      "page": 1,\n      "chunk": 4,\n      "chunk_size": 33\n    },\n    "name": "Ayush Jha-payment-2024-08-29"\n  },\n  {\n    "content": " INR Total Payment 164,113.20 INR",\n    "meta_data": {\n      "page": 1,\n      "chunk": 4,\n      "chunk_size": 33\n    },\n    "name": "Ayush Jha-payment-2024-08-26"\n  }\n]',
        metrics: {
          time: 1.0518851249944419
        },
        stop_after_tool_call: false,
        created_at: 1754383323,
        requires_confirmation: null,
        confirmed: null,
        confirmation_note: null,
        requires_user_input: null,
        user_input_schema: null,
        answered: null,
        external_execution_required: null
      },
      {
        tool_call_id: 'call_XteXCcVE3423jXN43J2GKC3catWW',
        tool_name: 'duckduckgo_search',
        tool_args: {
          query: 'Tesla vs Nvidia stock performance comparison'
        },
        tool_call_error: false,
        result:
          '[\n  {\n    "content": " 2024 - Nov 12, 2024 (estimated) Method: Wire Payment Details Description Total Amount 164,465.20",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-10-28"\n  },\n  {\n    "content": " 2024 - Oct 11, 2024 (estimated) Method: Wire Payment Details Description Total Amount 163,598.60",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-09-27"\n  },\n  {\n    "content": " 2024 - Sep 10, 2024 (estimated) Method: Wire Payment Details Description Total Amount 164,113.20",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-08-29"\n  },\n  {\n    "content": " 2024 - Sep 10, 2024 (estimated) Method: Wire Payment Details Description Total Amount 164,113.20",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-08-26"\n  },\n  {\n    "content": " 2024 - Dec 12, 2024 (estimated) Method: Wire Payment Details Description Total Amount 164,880.00",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-11-27"\n  },\n  {\n    "content": " 2024 - Sep 11, 2024 (estimated) Method: Wire Payment Details Description Total Amount 164,062.40",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-08-27"\n  },\n  {\n    "content": " 2025 - Jan 13, 2025 (estimated) Method: Wire Payment Details Description Total Amount 166,820.40",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-12-27"\n  },\n  {\n    "content": "Phidata Inc 169 Madison Ave STE 2420 New York, NY 10016 650-430-0174 Paid to Ayush Jha XXXX8893",\n    "meta_data": {\n      "page": 1,\n      "chunk": 1,\n      "chunk_size": 95\n    },\n    "name": "Ayush Jha-payment-2024-08-26"\n  },\n  {\n    "content": "Phidata Inc 169 Madison Ave STE 2420 New York, NY 10016 650-430-0174 Paid to Ayush Jha XXXX8893",\n    "meta_data": {\n      "page": 1,\n      "chunk": 1,\n      "chunk_size": 95\n    },\n    "name": "Ayush Jha-payment-2024-08-27"\n  },\n  {\n    "content": "Phidata Inc 169 Madison Ave STE 2420 New York, NY 10016 650-430-0174 Paid to Ayush Jha XXXX8893",\n    "meta_data": {\n      "page": 1,\n      "chunk": 1,\n      "chunk_size": 95\n    },\n    "name": "Ayush Jha-payment-2024-09-27"\n  }\n]',
        metrics: {
          time: 1.4855540830176324
        },
        stop_after_tool_call: false,
        created_at: 1754383323,
        requires_confirmation: null,
        confirmed: null,
        confirmation_note: null,
        requires_user_input: null,
        user_input_schema: null,
        answered: null,
        external_execution_required: null
      },
      {
        tool_call_id: 'call_lebCjFm23RyDUxqRP66q3Is59',
        tool_name: 'duckduckgo_news',
        tool_args: {
          query: 'Tesla stock recent performance and outlook'
        },
        tool_call_error: false,
        result:
          '[\n  {\n    "content": " 2024 - Oct 11, 2024 (estimated) Method: Wire Payment Details Description Total Amount 163,598.60",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-09-27"\n  },\n  {\n    "content": " 2024 - Sep 10, 2024 (estimated) Method: Wire Payment Details Description Total Amount 164,113.20",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-08-26"\n  },\n  {\n    "content": " 2024 - Sep 10, 2024 (estimated) Method: Wire Payment Details Description Total Amount 164,113.20",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-08-29"\n  },\n  {\n    "content": " 2024 - Nov 12, 2024 (estimated) Method: Wire Payment Details Description Total Amount 164,465.20",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-10-28"\n  },\n  {\n    "content": " 2024 - Dec 12, 2024 (estimated) Method: Wire Payment Details Description Total Amount 164,880.00",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-11-27"\n  },\n  {\n    "content": " 2025 - Jan 13, 2025 (estimated) Method: Wire Payment Details Description Total Amount 166,820.40",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-12-27"\n  },\n  {\n    "content": " 2024 - Sep 11, 2024 (estimated) Method: Wire Payment Details Description Total Amount 164,062.40",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-08-27"\n  },\n  {\n    "content": " INR Total Payment 163,598.60 INR",\n    "meta_data": {\n      "page": 1,\n      "chunk": 4,\n      "chunk_size": 33\n    },\n    "name": "Ayush Jha-payment-2024-09-27"\n  },\n  {\n    "content": "Phidata Inc 169 Madison Ave STE 2420 New York, NY 10016 650-430-0174 Paid to Ayush Jha XXXX8893",\n    "meta_data": {\n      "page": 1,\n      "chunk": 1,\n      "chunk_size": 95\n    },\n    "name": "Ayush Jha-payment-2024-08-27"\n  },\n  {\n    "content": "Phidata Inc 169 Madison Ave STE 2420 New York, NY 10016 650-430-0174 Paid to Ayush Jha XXXX8893",\n    "meta_data": {\n      "page": 1,\n      "chunk": 1,\n      "chunk_size": 95\n    },\n    "name": "Ayush Jha-payment-2024-09-27"\n  }\n]',
        metrics: {
          time: 1.9655977500369772
        },
        stop_after_tool_call: false,
        created_at: 1754383323,
        requires_confirmation: null,
        confirmed: null,
        confirmation_note: null,
        requires_user_input: null,
        user_input_schema: null,
        answered: null,
        external_execution_required: null
      },
      {
        tool_call_id: 'call_kgYJN0434324WD543uLdEy',
        tool_name: 'search_knowledge_base',
        tool_args: {
          query: 'Nvidia stock recent performance and outlook'
        },
        tool_call_error: false,
        result:
          '[\n  {\n    "content": " 2024 - Nov 12, 2024 (estimated) Method: Wire Payment Details Description Total Amount 164,465.20",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-10-28"\n  },\n  {\n    "content": " 2024 - Oct 11, 2024 (estimated) Method: Wire Payment Details Description Total Amount 163,598.60",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-09-27"\n  },\n  {\n    "content": " 2024 - Sep 10, 2024 (estimated) Method: Wire Payment Details Description Total Amount 164,113.20",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-08-26"\n  },\n  {\n    "content": " 2024 - Sep 10, 2024 (estimated) Method: Wire Payment Details Description Total Amount 164,113.20",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-08-29"\n  },\n  {\n    "content": " 2024 - Dec 12, 2024 (estimated) Method: Wire Payment Details Description Total Amount 164,880.00",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-11-27"\n  },\n  {\n    "content": " 2024 - Sep 11, 2024 (estimated) Method: Wire Payment Details Description Total Amount 164,062.40",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-08-27"\n  },\n  {\n    "content": " 2025 - Jan 13, 2025 (estimated) Method: Wire Payment Details Description Total Amount 166,820.40",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-12-27"\n  },\n  {\n    "content": " INR Total Payment 163,598.60 INR",\n    "meta_data": {\n      "page": 1,\n      "chunk": 4,\n      "chunk_size": 33\n    },\n    "name": "Ayush Jha-payment-2024-09-27"\n  },\n  {\n    "content": " INR Total Payment 164,113.20 INR",\n    "meta_data": {\n      "page": 1,\n      "chunk": 4,\n      "chunk_size": 33\n    },\n    "name": "Ayush Jha-payment-2024-08-29"\n  },\n  {\n    "content": " INR Total Payment 164,113.20 INR",\n    "meta_data": {\n      "page": 1,\n      "chunk": 4,\n      "chunk_size": 33\n    },\n    "name": "Ayush Jha-payment-2024-08-26"\n  }\n]',
        metrics: {
          time: 1.0518851249944419
        },
        stop_after_tool_call: false,
        created_at: 1754383323,
        requires_confirmation: null,
        confirmed: null,
        confirmation_note: null,
        requires_user_input: null,
        user_input_schema: null,
        answered: null,
        external_execution_required: null
      },
      {
        tool_call_id: 'call_XteXCcVE2342GK9cC3catWW',
        tool_name: 'search_knowledge_base',
        tool_args: {
          query: 'Tesla vs Nvidia stock performance comparison'
        },
        tool_call_error: false,
        result:
          '[\n  {\n    "content": " 2024 - Nov 12, 2024 (estimated) Method: Wire Payment Details Description Total Amount 164,465.20",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-10-28"\n  },\n  {\n    "content": " 2024 - Oct 11, 2024 (estimated) Method: Wire Payment Details Description Total Amount 163,598.60",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-09-27"\n  },\n  {\n    "content": " 2024 - Sep 10, 2024 (estimated) Method: Wire Payment Details Description Total Amount 164,113.20",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-08-29"\n  },\n  {\n    "content": " 2024 - Sep 10, 2024 (estimated) Method: Wire Payment Details Description Total Amount 164,113.20",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-08-26"\n  },\n  {\n    "content": " 2024 - Dec 12, 2024 (estimated) Method: Wire Payment Details Description Total Amount 164,880.00",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-11-27"\n  },\n  {\n    "content": " 2024 - Sep 11, 2024 (estimated) Method: Wire Payment Details Description Total Amount 164,062.40",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-08-27"\n  },\n  {\n    "content": " 2025 - Jan 13, 2025 (estimated) Method: Wire Payment Details Description Total Amount 166,820.40",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-12-27"\n  },\n  {\n    "content": "Phidata Inc 169 Madison Ave STE 2420 New York, NY 10016 650-430-0174 Paid to Ayush Jha XXXX8893",\n    "meta_data": {\n      "page": 1,\n      "chunk": 1,\n      "chunk_size": 95\n    },\n    "name": "Ayush Jha-payment-2024-08-26"\n  },\n  {\n    "content": "Phidata Inc 169 Madison Ave STE 2420 New York, NY 10016 650-430-0174 Paid to Ayush Jha XXXX8893",\n    "meta_data": {\n      "page": 1,\n      "chunk": 1,\n      "chunk_size": 95\n    },\n    "name": "Ayush Jha-payment-2024-08-27"\n  },\n  {\n    "content": "Phidata Inc 169 Madison Ave STE 2420 New York, NY 10016 650-430-0174 Paid to Ayush Jha XXXX8893",\n    "meta_data": {\n      "page": 1,\n      "chunk": 1,\n      "chunk_size": 95\n    },\n    "name": "Ayush Jha-payment-2024-09-27"\n  }\n]',
        metrics: {
          time: 1.4855540830176324
        },
        stop_after_tool_call: false,
        created_at: 1754383323,
        requires_confirmation: null,
        confirmed: null,
        confirmation_note: null,
        requires_user_input: null,
        user_input_schema: null,
        answered: null,
        external_execution_required: null
      },
      {
        tool_call_id: 'call_lebCjFmbRy34324RP66q3Is59',
        tool_name: 'search_knowledge_base',
        tool_args: {
          query: 'Tesla stock recent performance and outlook'
        },
        tool_call_error: false,
        result:
          '[\n  {\n    "content": " 2024 - Oct 11, 2024 (estimated) Method: Wire Payment Details Description Total Amount 163,598.60",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-09-27"\n  },\n  {\n    "content": " 2024 - Sep 10, 2024 (estimated) Method: Wire Payment Details Description Total Amount 164,113.20",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-08-26"\n  },\n  {\n    "content": " 2024 - Sep 10, 2024 (estimated) Method: Wire Payment Details Description Total Amount 164,113.20",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-08-29"\n  },\n  {\n    "content": " 2024 - Nov 12, 2024 (estimated) Method: Wire Payment Details Description Total Amount 164,465.20",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-10-28"\n  },\n  {\n    "content": " 2024 - Dec 12, 2024 (estimated) Method: Wire Payment Details Description Total Amount 164,880.00",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-11-27"\n  },\n  {\n    "content": " 2025 - Jan 13, 2025 (estimated) Method: Wire Payment Details Description Total Amount 166,820.40",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-12-27"\n  },\n  {\n    "content": " 2024 - Sep 11, 2024 (estimated) Method: Wire Payment Details Description Total Amount 164,062.40",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-08-27"\n  },\n  {\n    "content": " INR Total Payment 163,598.60 INR",\n    "meta_data": {\n      "page": 1,\n      "chunk": 4,\n      "chunk_size": 33\n    },\n    "name": "Ayush Jha-payment-2024-09-27"\n  },\n  {\n    "content": "Phidata Inc 169 Madison Ave STE 2420 New York, NY 10016 650-430-0174 Paid to Ayush Jha XXXX8893",\n    "meta_data": {\n      "page": 1,\n      "chunk": 1,\n      "chunk_size": 95\n    },\n    "name": "Ayush Jha-payment-2024-08-27"\n  },\n  {\n    "content": "Phidata Inc 169 Madison Ave STE 2420 New York, NY 10016 650-430-0174 Paid to Ayush Jha XXXX8893",\n    "meta_data": {\n      "page": 1,\n      "chunk": 1,\n      "chunk_size": 95\n    },\n    "name": "Ayush Jha-payment-2024-09-27"\n  }\n]',
        metrics: {
          time: 1.9655977500369772
        },
        stop_after_tool_call: false,
        created_at: 1754383323,
        requires_confirmation: null,
        confirmed: null,
        confirmation_note: null,
        requires_user_input: null,
        user_input_schema: null,
        answered: null,
        external_execution_required: null
      }
    ],
    events: [
      {
        created_at: 1754401690,
        event: 'RunStarted',
        agent_id: '92292764-62f3-4e4c-a3d9-9b2fc26f48ef',
        agent_name: 'Agno Agent',
        run_id: 'a91a9ab3-ddb7-4d00-9787-58c34f551ab1',
        session_id: '1deea616-e00e-4e92-84ec-6666ff57b443',
        model: 'gpt-4.1',
        model_provider: 'OpenAI'
      },
      {
        created_at: 1754401692,
        event: 'ToolCallStarted',
        agent_id: '92292764-62f3-4e4c-a3d9-9b2fc26f48ef',
        agent_name: 'Agno Agent',
        run_id: 'a91a9ab3-ddb7-4d00-9787-58c34f551ab1',
        session_id: '1deea616-e00e-4e92-84ec-6666ff57b443',
        tool: {
          tool_call_id: 'call_XteXCcVEjXNJ2GK9cC3catWW',
          tool_name: 'search_knowledge_base',
          tool_args: {
            query: 'Tesla vs Nvidia stock performance comparison'
          },
          tool_call_error: null,
          result: null,
          metrics: null,
          stop_after_tool_call: false,
          created_at: 1754383323,
          requires_confirmation: null,
          confirmed: null,
          confirmation_note: null,
          requires_user_input: null,
          user_input_schema: null,
          answered: null,
          external_execution_required: null
        }
      },
      {
        created_at: 1754401692,
        event: 'ToolCallStarted',
        agent_id: '92292764-62f3-4e4c-a3d9-9b2fc26f48ef',
        agent_name: 'Agno Agent',
        run_id: 'a91a9ab3-ddb7-4d00-9787-58c34f551ab1',
        session_id: '1deea616-e00e-4e92-84ec-6666ff57b443',
        tool: {
          tool_call_id: 'call_lebCjFmbRyDUxqRP66q3Is59',
          tool_name: 'search_knowledge_base',
          tool_args: {
            query: 'Tesla stock recent performance and outlook'
          },
          tool_call_error: null,
          result: null,
          metrics: null,
          stop_after_tool_call: false,
          created_at: 1754383323,
          requires_confirmation: null,
          confirmed: null,
          confirmation_note: null,
          requires_user_input: null,
          user_input_schema: null,
          answered: null,
          external_execution_required: null
        }
      },
      {
        created_at: 1754401692,
        event: 'ToolCallStarted',
        agent_id: '92292764-62f3-4e4c-a3d9-9b2fc26f48ef',
        agent_name: 'Agno Agent',
        run_id: 'a91a9ab3-ddb7-4d00-9787-58c34f551ab1',
        session_id: '1deea616-e00e-4e92-84ec-6666ff57b443',
        tool: {
          tool_call_id: 'call_kgYJN02ctv87Q4XnWD2uLdEy',
          tool_name: 'search_knowledge_base',
          tool_args: {
            query: 'Nvidia stock recent performance and outlook'
          },
          tool_call_error: null,
          result: null,
          metrics: null,
          stop_after_tool_call: false,
          created_at: 1754383323,
          requires_confirmation: null,
          confirmed: null,
          confirmation_note: null,
          requires_user_input: null,
          user_input_schema: null,
          answered: null,
          external_execution_required: null
        }
      },
      {
        created_at: 1754401694,
        event: 'ToolCallCompleted',
        agent_id: '92292764-62f3-4e4c-a3d9-9b2fc26f48ef',
        agent_name: 'Agno Agent',
        run_id: 'a91a9ab3-ddb7-4d00-9787-58c34f551ab1',
        session_id: '1deea616-e00e-4e92-84ec-6666ff57b443',
        content:
          'search_knowledge_base(query=Tesla vs Nvidia stock performance comparison) completed in 1.4856s.',
        tool: {
          tool_call_id: 'call_XteXCcVEjXNJ2GK9cC3catWW',
          tool_name: 'search_knowledge_base',
          tool_args: {
            query: 'Tesla vs Nvidia stock performance comparison'
          },
          tool_call_error: false,
          result:
            '[\n  {\n    "content": " 2024 - Nov 12, 2024 (estimated) Method: Wire Payment Details Description Total Amount 164,465.20",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-10-28"\n  },\n  {\n    "content": " 2024 - Oct 11, 2024 (estimated) Method: Wire Payment Details Description Total Amount 163,598.60",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-09-27"\n  },\n  {\n    "content": " 2024 - Sep 10, 2024 (estimated) Method: Wire Payment Details Description Total Amount 164,113.20",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-08-29"\n  },\n  {\n    "content": " 2024 - Sep 10, 2024 (estimated) Method: Wire Payment Details Description Total Amount 164,113.20",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-08-26"\n  },\n  {\n    "content": " 2024 - Dec 12, 2024 (estimated) Method: Wire Payment Details Description Total Amount 164,880.00",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-11-27"\n  },\n  {\n    "content": " 2024 - Sep 11, 2024 (estimated) Method: Wire Payment Details Description Total Amount 164,062.40",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-08-27"\n  },\n  {\n    "content": " 2025 - Jan 13, 2025 (estimated) Method: Wire Payment Details Description Total Amount 166,820.40",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-12-27"\n  },\n  {\n    "content": "Phidata Inc 169 Madison Ave STE 2420 New York, NY 10016 650-430-0174 Paid to Ayush Jha XXXX8893",\n    "meta_data": {\n      "page": 1,\n      "chunk": 1,\n      "chunk_size": 95\n    },\n    "name": "Ayush Jha-payment-2024-08-26"\n  },\n  {\n    "content": "Phidata Inc 169 Madison Ave STE 2420 New York, NY 10016 650-430-0174 Paid to Ayush Jha XXXX8893",\n    "meta_data": {\n      "page": 1,\n      "chunk": 1,\n      "chunk_size": 95\n    },\n    "name": "Ayush Jha-payment-2024-08-27"\n  },\n  {\n    "content": "Phidata Inc 169 Madison Ave STE 2420 New York, NY 10016 650-430-0174 Paid to Ayush Jha XXXX8893",\n    "meta_data": {\n      "page": 1,\n      "chunk": 1,\n      "chunk_size": 95\n    },\n    "name": "Ayush Jha-payment-2024-09-27"\n  }\n]',
          metrics: {
            time: 1.4855540830176324
          },
          stop_after_tool_call: false,
          created_at: 1754383323,
          requires_confirmation: null,
          confirmed: null,
          confirmation_note: null,
          requires_user_input: null,
          user_input_schema: null,
          answered: null,
          external_execution_required: null
        }
      },
      {
        created_at: 1754401694,
        event: 'ToolCallCompleted',
        agent_id: '92292764-62f3-4e4c-a3d9-9b2fc26f48ef',
        agent_name: 'Agno Agent',
        run_id: 'a91a9ab3-ddb7-4d00-9787-58c34f551ab1',
        session_id: '1deea616-e00e-4e92-84ec-6666ff57b443',
        content:
          'search_knowledge_base(query=Tesla stock recent performance and outlook) completed in 1.9656s.',
        tool: {
          tool_call_id: 'call_lebCjFmbRyDUxqRP66q3Is59',
          tool_name: 'search_knowledge_base',
          tool_args: {
            query: 'Tesla stock recent performance and outlook'
          },
          tool_call_error: false,
          result:
            '[\n  {\n    "content": " 2024 - Oct 11, 2024 (estimated) Method: Wire Payment Details Description Total Amount 163,598.60",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-09-27"\n  },\n  {\n    "content": " 2024 - Sep 10, 2024 (estimated) Method: Wire Payment Details Description Total Amount 164,113.20",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-08-26"\n  },\n  {\n    "content": " 2024 - Sep 10, 2024 (estimated) Method: Wire Payment Details Description Total Amount 164,113.20",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-08-29"\n  },\n  {\n    "content": " 2024 - Nov 12, 2024 (estimated) Method: Wire Payment Details Description Total Amount 164,465.20",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-10-28"\n  },\n  {\n    "content": " 2024 - Dec 12, 2024 (estimated) Method: Wire Payment Details Description Total Amount 164,880.00",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-11-27"\n  },\n  {\n    "content": " 2025 - Jan 13, 2025 (estimated) Method: Wire Payment Details Description Total Amount 166,820.40",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-12-27"\n  },\n  {\n    "content": " 2024 - Sep 11, 2024 (estimated) Method: Wire Payment Details Description Total Amount 164,062.40",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-08-27"\n  },\n  {\n    "content": " INR Total Payment 163,598.60 INR",\n    "meta_data": {\n      "page": 1,\n      "chunk": 4,\n      "chunk_size": 33\n    },\n    "name": "Ayush Jha-payment-2024-09-27"\n  },\n  {\n    "content": "Phidata Inc 169 Madison Ave STE 2420 New York, NY 10016 650-430-0174 Paid to Ayush Jha XXXX8893",\n    "meta_data": {\n      "page": 1,\n      "chunk": 1,\n      "chunk_size": 95\n    },\n    "name": "Ayush Jha-payment-2024-08-27"\n  },\n  {\n    "content": "Phidata Inc 169 Madison Ave STE 2420 New York, NY 10016 650-430-0174 Paid to Ayush Jha XXXX8893",\n    "meta_data": {\n      "page": 1,\n      "chunk": 1,\n      "chunk_size": 95\n    },\n    "name": "Ayush Jha-payment-2024-09-27"\n  }\n]',
          metrics: {
            time: 1.9655977500369772
          },
          stop_after_tool_call: false,
          created_at: 1754383323,
          requires_confirmation: null,
          confirmed: null,
          confirmation_note: null,
          requires_user_input: null,
          user_input_schema: null,
          answered: null,
          external_execution_required: null
        }
      },
      {
        created_at: 1754401694,
        event: 'ToolCallCompleted',
        agent_id: '92292764-62f3-4e4c-a3d9-9b2fc26f48ef',
        agent_name: 'Agno Agent',
        run_id: 'a91a9ab3-ddb7-4d00-9787-58c34f551ab1',
        session_id: '1deea616-e00e-4e92-84ec-6666ff57b443',
        content:
          'search_knowledge_base(query=Nvidia stock recent performance and outlook) completed in 1.0519s.',
        tool: {
          tool_call_id: 'call_kgYJN02ctv87Q4XnWD2uLdEy',
          tool_name: 'search_knowledge_base',
          tool_args: {
            query: 'Nvidia stock recent performance and outlook'
          },
          tool_call_error: false,
          result:
            '[\n  {\n    "content": " 2024 - Nov 12, 2024 (estimated) Method: Wire Payment Details Description Total Amount 164,465.20",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-10-28"\n  },\n  {\n    "content": " 2024 - Oct 11, 2024 (estimated) Method: Wire Payment Details Description Total Amount 163,598.60",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-09-27"\n  },\n  {\n    "content": " 2024 - Sep 10, 2024 (estimated) Method: Wire Payment Details Description Total Amount 164,113.20",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-08-26"\n  },\n  {\n    "content": " 2024 - Sep 10, 2024 (estimated) Method: Wire Payment Details Description Total Amount 164,113.20",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-08-29"\n  },\n  {\n    "content": " 2024 - Dec 12, 2024 (estimated) Method: Wire Payment Details Description Total Amount 164,880.00",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-11-27"\n  },\n  {\n    "content": " 2024 - Sep 11, 2024 (estimated) Method: Wire Payment Details Description Total Amount 164,062.40",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-08-27"\n  },\n  {\n    "content": " 2025 - Jan 13, 2025 (estimated) Method: Wire Payment Details Description Total Amount 166,820.40",\n    "meta_data": {\n      "page": 1,\n      "chunk": 3,\n      "chunk_size": 97\n    },\n    "name": "Ayush Jha-payment-2024-12-27"\n  },\n  {\n    "content": " INR Total Payment 163,598.60 INR",\n    "meta_data": {\n      "page": 1,\n      "chunk": 4,\n      "chunk_size": 33\n    },\n    "name": "Ayush Jha-payment-2024-09-27"\n  },\n  {\n    "content": " INR Total Payment 164,113.20 INR",\n    "meta_data": {\n      "page": 1,\n      "chunk": 4,\n      "chunk_size": 33\n    },\n    "name": "Ayush Jha-payment-2024-08-29"\n  },\n  {\n    "content": " INR Total Payment 164,113.20 INR",\n    "meta_data": {\n      "page": 1,\n      "chunk": 4,\n      "chunk_size": 33\n    },\n    "name": "Ayush Jha-payment-2024-08-26"\n  }\n]',
          metrics: {
            time: 1.0518851249944419
          },
          stop_after_tool_call: false,
          created_at: 1754383323,
          requires_confirmation: null,
          confirmed: null,
          confirmation_note: null,
          requires_user_input: null,
          user_input_schema: null,
          answered: null,
          external_execution_required: null
        }
      },
      {
        created_at: 1754401708,
        event: 'MemoryUpdateStarted',
        agent_id: '92292764-62f3-4e4c-a3d9-9b2fc26f48ef',
        agent_name: 'Agno Agent',
        run_id: 'a91a9ab3-ddb7-4d00-9787-58c34f551ab1',
        session_id: '1deea616-e00e-4e92-84ec-6666ff57b443'
      },
      {
        created_at: 1754401710,
        event: 'MemoryUpdateCompleted',
        agent_id: '92292764-62f3-4e4c-a3d9-9b2fc26f48ef',
        agent_name: 'Agno Agent',
        run_id: 'a91a9ab3-ddb7-4d00-9787-58c34f551ab1',
        session_id: '1deea616-e00e-4e92-84ec-6666ff57b443'
      },
      {
        created_at: 1754401710,
        event: 'RunCompleted',
        agent_id: '92292764-62f3-4e4c-a3d9-9b2fc26f48ef',
        agent_name: 'Agno Agent',
        run_id: 'a91a9ab3-ddb7-4d00-9787-58c34f551ab1',
        session_id: '1deea616-e00e-4e92-84ec-6666ff57b443',
        content:
          'It appears my search returned unrelated payment data rather than stock information. Let me provide a concise, up-to-date comparison based on the general market knowledge as of June 2024:\n\n---\n\n## Tesla (TSLA) vs. Nvidia (NVDA) Stock Comparison\n\n### 1. **Company Overview**\n- **Tesla (TSLA)**: Primarily an electric vehicle and clean energy company, also involved in battery and solar technology.\n- **Nvidia (NVDA)**: Leading semiconductor company, dominating the AI hardware space with GPUs for data centers, gaming, and automotive.\n\n### 2. **Stock Performance (2023-2024)**\n**Tesla (TSLA)**\n- Volatile performance: Saw a strong rise in 2020–2021, but pulled back through 2022.\n- In 2023-2024, stock performance was choppy due to concerns about electric vehicle demand, price cuts, margins, and competition from Chinese EVs.\n- Market cap is large but has been overtaken by Nvidia in 2024.\n\n**Nvidia (NVDA)**\n- Astronomical growth in 2023-2024, gaining several hundred percent due to its dominant position in AI chips.\n- Became one of the top 3 most valuable companies globally in 2024, briefly surpassing $3 trillion market cap.\n- Demand for its AI and data center chips has driven historic revenue and net income growth.\n\n### 3. **Financials (Latest Reported)**\n- **Tesla:** Margins squeezed by price wars; revenue growth is slowing; still profitable, but profit is pressured.\n- **Nvidia:** Rapid revenue and profit growth; record quarterly results; robust margins thanks to AI chip demand.\n\n### 4. **Valuation**\n- **Tesla:** Still trades at a high price-to-earnings (P/E) compared to traditional automakers, but much lower than peak levels.\n- **Nvidia:** Trades at a premium valuation—a very high P/E—supported by explosive growth expectations in AI.\n\n### 5. **Outlook**\n- **Tesla:** Needs strong vehicle demand, new product launches (Cybertruck, next-gen models), and margin recovery to reignite growth.\n- **Nvidia:** Riding the AI boom; outlook is strong as long as demand for generative AI/AI infrastructure remains.\n\n### 6. **Risks**\n- **Tesla:** EV market saturation, competition, regulatory issues, economic slowdowns\n- **Nvidia:** Potential competition (AMD, Intel, custom chips), supply chain constraints, AI spending slowdown\n\n---\n\n## **At a Glance**\n\n|                           | TESLA (TSLA)       | NVIDIA (NVDA)       |\n|---------------------------|--------------------|---------------------|\n| Sector                    | EV, Clean Energy   | Semiconductors, AI  |\n| 2024 Stock Trend          | Flat/Down          | Soaring Up          |\n| Market Cap (Jun 2024)     | ~$550B–$600B       | >$3 Trillion        |\n| P/E Ratio                 | 40–60x             | 60–70x              |\n| Main Catalyst             | EV Demand, Margins | AI Chip Demand      |\n\n---\n\n### Summary\n- **Nvidia has vastly outperformed Tesla over the past 12–18 months, driven by AI frenzy.**\n- **Tesla remains a high-profile growth story but faces more operational and demand uncertainty.**\n- Both are high-risk/high-reward tech stocks, but Nvidia is the current market leader due to AI momentum.\n\nIf you want specific recent price charts, valuation data, or analyst recommendations, let me know!',
        content_type: 'str',
        extra_data: {
          references: [
            {
              query: 'Nvidia stock recent performance and outlook',
              references: [
                {
                  content:
                    ' 2024 - Nov 12, 2024 (estimated) Method: Wire Payment Details Description Total Amount 164,465.20',
                  meta_data: {
                    page: 1,
                    chunk: 3,
                    chunk_size: 97
                  },
                  name: 'Ayush Jha-payment-2024-10-28'
                },
                {
                  content:
                    ' 2024 - Oct 11, 2024 (estimated) Method: Wire Payment Details Description Total Amount 163,598.60',
                  meta_data: {
                    page: 1,
                    chunk: 3,
                    chunk_size: 97
                  },
                  name: 'Ayush Jha-payment-2024-09-27'
                },
                {
                  content:
                    ' 2024 - Sep 10, 2024 (estimated) Method: Wire Payment Details Description Total Amount 164,113.20',
                  meta_data: {
                    page: 1,
                    chunk: 3,
                    chunk_size: 97
                  },
                  name: 'Ayush Jha-payment-2024-08-26'
                },
                {
                  content:
                    ' 2024 - Sep 10, 2024 (estimated) Method: Wire Payment Details Description Total Amount 164,113.20',
                  meta_data: {
                    page: 1,
                    chunk: 3,
                    chunk_size: 97
                  },
                  name: 'Ayush Jha-payment-2024-08-29'
                },
                {
                  content:
                    ' 2024 - Dec 12, 2024 (estimated) Method: Wire Payment Details Description Total Amount 164,880.00',
                  meta_data: {
                    page: 1,
                    chunk: 3,
                    chunk_size: 97
                  },
                  name: 'Ayush Jha-payment-2024-11-27'
                },
                {
                  content:
                    ' 2024 - Sep 11, 2024 (estimated) Method: Wire Payment Details Description Total Amount 164,062.40',
                  meta_data: {
                    page: 1,
                    chunk: 3,
                    chunk_size: 97
                  },
                  name: 'Ayush Jha-payment-2024-08-27'
                },
                {
                  content:
                    ' 2025 - Jan 13, 2025 (estimated) Method: Wire Payment Details Description Total Amount 166,820.40',
                  meta_data: {
                    page: 1,
                    chunk: 3,
                    chunk_size: 97
                  },
                  name: 'Ayush Jha-payment-2024-12-27'
                },
                {
                  content: ' INR Total Payment 163,598.60 INR',
                  meta_data: {
                    page: 1,
                    chunk: 4,
                    chunk_size: 33
                  },
                  name: 'Ayush Jha-payment-2024-09-27'
                },
                {
                  content: ' INR Total Payment 164,113.20 INR',
                  meta_data: {
                    page: 1,
                    chunk: 4,
                    chunk_size: 33
                  },
                  name: 'Ayush Jha-payment-2024-08-29'
                },
                {
                  content: ' INR Total Payment 164,113.20 INR',
                  meta_data: {
                    page: 1,
                    chunk: 4,
                    chunk_size: 33
                  },
                  name: 'Ayush Jha-payment-2024-08-26'
                }
              ],
              time: 1.0515
            },
            {
              query: 'Tesla vs Nvidia stock performance comparison',
              references: [
                {
                  content:
                    ' 2024 - Nov 12, 2024 (estimated) Method: Wire Payment Details Description Total Amount 164,465.20',
                  meta_data: {
                    page: 1,
                    chunk: 3,
                    chunk_size: 97
                  },
                  name: 'Ayush Jha-payment-2024-10-28'
                },
                {
                  content:
                    ' 2024 - Oct 11, 2024 (estimated) Method: Wire Payment Details Description Total Amount 163,598.60',
                  meta_data: {
                    page: 1,
                    chunk: 3,
                    chunk_size: 97
                  },
                  name: 'Ayush Jha-payment-2024-09-27'
                },
                {
                  content:
                    ' 2024 - Sep 10, 2024 (estimated) Method: Wire Payment Details Description Total Amount 164,113.20',
                  meta_data: {
                    page: 1,
                    chunk: 3,
                    chunk_size: 97
                  },
                  name: 'Ayush Jha-payment-2024-08-29'
                },
                {
                  content:
                    ' 2024 - Sep 10, 2024 (estimated) Method: Wire Payment Details Description Total Amount 164,113.20',
                  meta_data: {
                    page: 1,
                    chunk: 3,
                    chunk_size: 97
                  },
                  name: 'Ayush Jha-payment-2024-08-26'
                },
                {
                  content:
                    ' 2024 - Dec 12, 2024 (estimated) Method: Wire Payment Details Description Total Amount 164,880.00',
                  meta_data: {
                    page: 1,
                    chunk: 3,
                    chunk_size: 97
                  },
                  name: 'Ayush Jha-payment-2024-11-27'
                },
                {
                  content:
                    ' 2024 - Sep 11, 2024 (estimated) Method: Wire Payment Details Description Total Amount 164,062.40',
                  meta_data: {
                    page: 1,
                    chunk: 3,
                    chunk_size: 97
                  },
                  name: 'Ayush Jha-payment-2024-08-27'
                },
                {
                  content:
                    ' 2025 - Jan 13, 2025 (estimated) Method: Wire Payment Details Description Total Amount 166,820.40',
                  meta_data: {
                    page: 1,
                    chunk: 3,
                    chunk_size: 97
                  },
                  name: 'Ayush Jha-payment-2024-12-27'
                },
                {
                  content:
                    'Phidata Inc 169 Madison Ave STE 2420 New York, NY 10016 650-430-0174 Paid to Ayush Jha XXXX8893',
                  meta_data: {
                    page: 1,
                    chunk: 1,
                    chunk_size: 95
                  },
                  name: 'Ayush Jha-payment-2024-08-26'
                },
                {
                  content:
                    'Phidata Inc 169 Madison Ave STE 2420 New York, NY 10016 650-430-0174 Paid to Ayush Jha XXXX8893',
                  meta_data: {
                    page: 1,
                    chunk: 1,
                    chunk_size: 95
                  },
                  name: 'Ayush Jha-payment-2024-08-27'
                },
                {
                  content:
                    'Phidata Inc 169 Madison Ave STE 2420 New York, NY 10016 650-430-0174 Paid to Ayush Jha XXXX8893',
                  meta_data: {
                    page: 1,
                    chunk: 1,
                    chunk_size: 95
                  },
                  name: 'Ayush Jha-payment-2024-09-27'
                }
              ],
              time: 1.485
            },
            {
              query: 'Tesla stock recent performance and outlook',
              references: [
                {
                  content:
                    ' 2024 - Oct 11, 2024 (estimated) Method: Wire Payment Details Description Total Amount 163,598.60',
                  meta_data: {
                    page: 1,
                    chunk: 3,
                    chunk_size: 97
                  },
                  name: 'Ayush Jha-payment-2024-09-27'
                },
                {
                  content:
                    ' 2024 - Sep 10, 2024 (estimated) Method: Wire Payment Details Description Total Amount 164,113.20',
                  meta_data: {
                    page: 1,
                    chunk: 3,
                    chunk_size: 97
                  },
                  name: 'Ayush Jha-payment-2024-08-26'
                },
                {
                  content:
                    ' 2024 - Sep 10, 2024 (estimated) Method: Wire Payment Details Description Total Amount 164,113.20',
                  meta_data: {
                    page: 1,
                    chunk: 3,
                    chunk_size: 97
                  },
                  name: 'Ayush Jha-payment-2024-08-29'
                },
                {
                  content:
                    ' 2024 - Nov 12, 2024 (estimated) Method: Wire Payment Details Description Total Amount 164,465.20',
                  meta_data: {
                    page: 1,
                    chunk: 3,
                    chunk_size: 97
                  },
                  name: 'Ayush Jha-payment-2024-10-28'
                },
                {
                  content:
                    ' 2024 - Dec 12, 2024 (estimated) Method: Wire Payment Details Description Total Amount 164,880.00',
                  meta_data: {
                    page: 1,
                    chunk: 3,
                    chunk_size: 97
                  },
                  name: 'Ayush Jha-payment-2024-11-27'
                },
                {
                  content:
                    ' 2025 - Jan 13, 2025 (estimated) Method: Wire Payment Details Description Total Amount 166,820.40',
                  meta_data: {
                    page: 1,
                    chunk: 3,
                    chunk_size: 97
                  },
                  name: 'Ayush Jha-payment-2024-12-27'
                },
                {
                  content:
                    ' 2024 - Sep 11, 2024 (estimated) Method: Wire Payment Details Description Total Amount 164,062.40',
                  meta_data: {
                    page: 1,
                    chunk: 3,
                    chunk_size: 97
                  },
                  name: 'Ayush Jha-payment-2024-08-27'
                },
                {
                  content: ' INR Total Payment 163,598.60 INR',
                  meta_data: {
                    page: 1,
                    chunk: 4,
                    chunk_size: 33
                  },
                  name: 'Ayush Jha-payment-2024-09-27'
                },
                {
                  content:
                    'Phidata Inc 169 Madison Ave STE 2420 New York, NY 10016 650-430-0174 Paid to Ayush Jha XXXX8893',
                  meta_data: {
                    page: 1,
                    chunk: 1,
                    chunk_size: 95
                  },
                  name: 'Ayush Jha-payment-2024-08-27'
                },
                {
                  content:
                    'Phidata Inc 169 Madison Ave STE 2420 New York, NY 10016 650-430-0174 Paid to Ayush Jha XXXX8893',
                  meta_data: {
                    page: 1,
                    chunk: 1,
                    chunk_size: 95
                  },
                  name: 'Ayush Jha-payment-2024-09-27'
                }
              ],
              time: 1.9651
            }
          ]
        }
      }
    ],
    created_at: '2025-08-05T13:48:10Z'
  }
]
export const evalsData = {
  result: {
    avg_run_time: 1.434040115661143,
    min_run_time: 0.9390786669682711,
    max_run_time: 3.2541688330238685,
    std_dev_run_time: 0.7418778046295295,
    median_run_time: 1.0792531249462627,
    p95_run_time: 4.0099934785394,
    avg_memory_usage: 0.4381653467814128,
    min_memory_usage: 0.36115169525146484,
    max_memory_usage: 0.5191106796264648,
    std_dev_memory_usage: 0.055361250003560354,
    median_memory_usage: 0.4393434524536133,
    p95_memory_usage: 0.5290584564208984
  },
  runs: [
    {
      runtime: 1.0450070420047268,
      memory: 0.36115169525146484
    },
    {
      runtime: 1.375878165999893,
      memory: 0.3764028549194336
    },
    {
      runtime: 1.742519541992806,
      memory: 0.39556407928466797
    },
    {
      runtime: 3.2541688330238685,
      memory: 0.41430091857910156
    },
    {
      runtime: 1.5558134579914622,
      memory: 0.4393434524536133
    },
    {
      runtime: 0.9505261250305921,
      memory: 0.45966053009033203
    },
    {
      runtime: 1.0792531249462627,
      memory: 0.47873878479003906
    },
    {
      runtime: 0.9641160829924047,
      memory: 0.49921512603759766
    },
    {
      runtime: 0.9390786669682711,
      memory: 0.5191106796264648
    }
  ]
}
export const evalsList = [
  {
    id: 'b24acc8a-1867-4ca3-ae05-1d5478d74147',
    agent_id: 'eeee9f55-61d2-4e4e-9072-361c38aa7087',
    model_id: 'gpt-4.1',
    model_provider: 'OpenAI',
    team_id: null,
    workflow_id: null,
    name: 'test',
    evaluated_component_name: 'run_component',
    eval_type: 'performance',
    eval_data: {
      result: {
        avg_run_time: 1.434040115661143,
        min_run_time: 0.9390786669682711,
        max_run_time: 3.2541688330238685,
        std_dev_run_time: 0.7418778046295295,
        median_run_time: 1.0792531249462627,
        p95_run_time: 4.0099934785394,
        avg_memory_usage: 0.4381653467814128,
        min_memory_usage: 0.36115169525146484,
        max_memory_usage: 0.5191106796264648,
        std_dev_memory_usage: 0.055361250003560354,
        median_memory_usage: 0.4393434524536133,
        p95_memory_usage: 0.5290584564208984
      },
      runs: [
        {
          runtime: 1.0450070420047268,
          memory: 0.36115169525146484
        },
        {
          runtime: 1.375878165999893,
          memory: 0.3764028549194336
        },
        {
          runtime: 1.742519541992806,
          memory: 0.39556407928466797
        },
        {
          runtime: 3.2541688330238685,
          memory: 0.41430091857910156
        },
        {
          runtime: 1.5558134579914622,
          memory: 0.4393434524536133
        },
        {
          runtime: 0.9505261250305921,
          memory: 0.45966053009033203
        },
        {
          runtime: 1.0792531249462627,
          memory: 0.47873878479003906
        },
        {
          runtime: 0.9641160829924047,
          memory: 0.49921512603759766
        },
        {
          runtime: 0.9390786669682711,
          memory: 0.5191106796264648
        }
      ]
    },
    created_at: '2025-08-05T14:09:27Z',
    updated_at: '2025-08-05T14:09:27Z'
  },
  {
    id: '3e939fbe-5825-4d42-9f9f-4b251390a454',
    agent_id: '3017b021-4fcd-4a4a-87de-7260e324776a',
    model_id: 'gpt-4o',
    model_provider: 'OpenAI',
    team_id: null,
    workflow_id: null,
    name: 'test',
    evaluated_component_name: null,
    eval_type: 'reliability',
    eval_data: {
      eval_status: 'FAILED',
      failed_tool_calls: ['multiply'],
      passed_tool_calls: []
    },
    created_at: '2025-08-05T14:08:26Z',
    updated_at: '2025-08-05T14:08:26Z'
  },
  {
    id: '21ae0a18-bdb8-4fa1-8299-3dbe58d2b907',
    agent_id: '82268f3c-8a21-47da-97ac-b5f897757305',
    model_id: 'gpt-4.1',
    model_provider: 'OpenAI',
    team_id: null,
    workflow_id: null,
    name: 'ff',
    evaluated_component_name: 'Agno Agent',
    eval_type: 'accuracy',
    eval_data: {
      results: [
        {
          input: 'gfbfgn',
          output:
            'It looks like you entered "gfbfgn," which doesn\'t appear to be a recognizable word or phrase. Could you please clarify your request or let me know how I can assist you?',
          expected_output: 'fghfgh',
          score: 1,
          reason:
            "The agent_output does not match the expected_output at all. The expected output is the exact string 'fghfgh', but the agent_output instead asks for clarification and does not provide 'fghfgh'. This is completely incorrect and misses the expected content."
        }
      ],
      avg_score: 1,
      mean_score: 1,
      min_score: 1,
      max_score: 1,
      std_dev_score: 0
    },
    created_at: '2025-08-03T17:51:49Z',
    updated_at: '2025-08-03T17:51:49Z'
  },
  {
    id: '3e939fbe-5825-4d42-9f9f-4b251390a454',
    agent_id: '3017b021-4fcd-4a4a-87de-7260e324776a',
    model_id: 'gpt-4o',
    model_provider: 'OpenAI',
    team_id: null,
    workflow_id: null,
    name: 'test',
    evaluated_component_name: null,
    eval_type: 'reliability',
    eval_data: {
      eval_status: 'FAILED',
      failed_tool_calls: ['multiply'],
      passed_tool_calls: []
    },
    created_at: '2025-08-05T14:08:26Z',
    updated_at: '2025-08-05T14:08:26Z'
  },
  {
    id: '3e939fbe-5825-4d42-9f9f-4b251390a454',
    agent_id: '3017b021-4fcd-4a4a-87de-7260e324776a',
    model_id: 'gpt-4o',
    model_provider: 'OpenAI',
    team_id: null,
    workflow_id: null,
    name: 'Team Reliability Evaluation',
    evaluated_component_name: null,
    eval_type: 'reliability',
    eval_data: {
      eval_status: 'FAILED',
      failed_tool_calls: ['multiply'],
      passed_tool_calls: []
    },
    created_at: '2025-08-05T14:08:26Z',
    updated_at: '2025-08-05T14:08:26Z'
  },
  {
    id: '3e939fbe-5825-4d42-9f9f-4b251390a454',
    agent_id: '3017b021-4fcd-4a4a-87de-7260e324776a',
    model_id: 'gpt-4o',
    model_provider: 'OpenAI',
    team_id: null,
    workflow_id: null,
    name: 'Team Reliability Evaluation',
    evaluated_component_name: null,
    eval_type: 'reliability',
    eval_data: {
      eval_status: 'FAILED',
      failed_tool_calls: ['multiply'],
      passed_tool_calls: []
    },
    created_at: '2025-08-05T14:08:26Z',
    updated_at: '2025-08-05T14:08:26Z'
  },
  {
    id: '3e939fbe-5825-4d42-9f9f-4b251390a454',
    agent_id: '3017b021-4fcd-4a4a-87de-7260e324776a',
    model_id: 'gpt-4o',
    model_provider: 'OpenAI',
    team_id: null,
    workflow_id: null,
    name: 'Team Reliability Evaluation',
    evaluated_component_name: null,
    eval_type: 'reliability',
    eval_data: {
      eval_status: 'FAILED',
      failed_tool_calls: ['multiply'],
      passed_tool_calls: []
    },
    created_at: '2025-08-05T14:08:26Z',
    updated_at: '2025-08-05T14:08:26Z'
  },
  {
    id: '3e939fbe-5825-4d42-9f9f-4b251390a454',
    agent_id: '3017b021-4fcd-4a4a-87de-7260e324776a',
    model_id: 'gpt-4o',
    model_provider: 'OpenAI',
    team_id: null,
    workflow_id: null,
    name: 'Instantiation Evaluation',
    evaluated_component_name: null,
    eval_type: 'performance',
    eval_data: {
      eval_status: 'FAILED',
      failed_tool_calls: ['multiply'],
      passed_tool_calls: []
    },
    created_at: '2025-08-05T14:08:26Z',
    updated_at: '2025-08-05T14:08:26Z'
  },
  {
    id: '3e939fbe-5825-4d42-9f9f-4b251390a454',
    agent_id: '3017b021-4fcd-4a4a-87de-7260e324776a',
    model_id: 'claude-3-5-sonnet-20240620',
    model_provider: 'Anthropic',
    team_id: null,
    workflow_id: null,
    name: 'Team Reliability Evaluation',
    evaluated_component_name: null,
    eval_type: 'reliability',
    eval_data: {
      eval_status: 'FAILED',
      failed_tool_calls: ['multiply'],
      passed_tool_calls: []
    },
    created_at: '2025-08-05T14:08:26Z',
    updated_at: '2025-08-05T14:08:26Z'
  },
  {
    id: '3e939fbe-5825-4d42-9f9f-4b251390a454',
    agent_id: '3017b021-4fcd-4a4a-87de-7260e324776a',
    model_id: 'gpt-4o',
    model_provider: 'Anthropic',
    team_id: null,
    workflow_id: null,
    name: 'Team Reliability Evaluation',
    evaluated_component_name: null,
    eval_type: 'reliability',
    eval_data: {
      eval_status: 'FAILED',
      failed_tool_calls: ['multiply'],
      passed_tool_calls: []
    },
    created_at: '2025-08-05T14:08:26Z',
    updated_at: '2025-08-05T14:08:26Z'
  },
  {
    id: '3e939fbe-5825-4d42-9f9f-4b251390a454',
    agent_id: '3017b021-4fcd-4a4a-87de-7260e324776a',
    model_id: 'claude-3-5-sonnet-20240620',
    model_provider: 'Anthropic',
    team_id: null,
    workflow_id: null,
    name: 'Agent Reliability Evaluation',
    evaluated_component_name: null,
    eval_type: 'reliability',
    eval_data: {
      eval_status: 'FAILED',
      failed_tool_calls: ['multiply'],
      passed_tool_calls: []
    },
    created_at: '2025-08-05T14:08:26Z',
    updated_at: '2025-08-05T14:08:26Z'
  },
  {
    id: '3e939fbe-5825-4d42-9f9f-4b251390a454',
    agent_id: '3017b021-4fcd-4a4a-87de-7260e324776a',
    model_id: 'claude-3-5-sonnet-20240620',
    model_provider: 'Anthropic',
    team_id: null,
    workflow_id: null,
    name: 'Agent Reliability Evaluation',
    evaluated_component_name: null,
    eval_type: 'reliability',
    eval_data: {
      eval_status: 'FAILED',
      failed_tool_calls: ['multiply'],
      passed_tool_calls: []
    },
    created_at: '2025-08-05T14:08:26Z',
    updated_at: '2025-08-05T14:08:26Z'
  },
  {
    id: '3e939fbe-5825-4d42-9f9f-4b251390a454',
    agent_id: '3017b021-4fcd-4a4a-87de-7260e324776a',
    model_id: 'gemini-2.0-flash-001',
    model_provider: 'Google',
    team_id: null,
    workflow_id: null,
    name: 'Instantiation Evaluation',
    evaluated_component_name: null,
    eval_type: 'performance',
    eval_data: {
      eval_status: 'FAILED',
      failed_tool_calls: ['multiply'],
      passed_tool_calls: []
    },
    created_at: '2025-08-05T14:08:26Z',
    updated_at: '2025-08-05T14:08:26Z'
  },
  {
    id: '3e939fbe-5825-4d42-9f9f-4b251390a454',
    agent_id: '3017b021-4fcd-4a4a-87de-7260e324776a',
    model_id: 'claude-3-5-sonnet-20240620',
    model_provider: 'Anthropic',
    team_id: null,
    workflow_id: null,
    name: 'Instantiation Evaluation',
    evaluated_component_name: null,
    eval_type: 'performance',
    eval_data: {
      eval_status: 'FAILED',
      failed_tool_calls: ['multiply'],
      passed_tool_calls: []
    },
    created_at: '2025-08-05T14:08:26Z',
    updated_at: '2025-08-05T14:08:26Z'
  },
  {
    id: '3e939fbe-5825-4d42-9f9f-4b251390a454',
    agent_id: '3017b021-4fcd-4a4a-87de-7260e324776a',
    model_id: 'gemini-2.0-flash-001',
    model_provider: 'Google',
    team_id: null,
    workflow_id: null,
    name: 'Agent Reliability Evaluation',
    evaluated_component_name: null,
    eval_type: 'reliability',
    eval_data: {
      eval_status: 'FAILED',
      failed_tool_calls: ['multiply'],
      passed_tool_calls: []
    },
    created_at: '2025-08-05T14:08:26Z',
    updated_at: '2025-08-05T14:08:26Z'
  },
  {
    id: '3e939fbe-5825-4d42-9f9f-4b251390a454',
    agent_id: '3017b021-4fcd-4a4a-87de-7260e324776a',
    model_id: 'gpt-4o',
    model_provider: 'OpenAI',
    team_id: null,
    workflow_id: null,
    name: 'Agent Reliability Evaluation',
    evaluated_component_name: null,
    eval_type: 'reliability',
    eval_data: {
      eval_status: 'FAILED',
      failed_tool_calls: ['multiply'],
      passed_tool_calls: []
    },
    created_at: '2025-08-05T14:08:26Z',
    updated_at: '2025-08-05T14:08:26Z'
  },
  {
    id: '3e939fbe-5825-4d42-9f9f-4b251390a454',
    agent_id: '3017b021-4fcd-4a4a-87de-7260e324776a',
    model_id: 'claude-3-5-sonnet-20240620',
    model_provider: 'Anthropic',
    team_id: null,
    workflow_id: null,
    name: 'Agent Reliability Evaluation',
    evaluated_component_name: null,
    eval_type: 'reliability',
    eval_data: {
      eval_status: 'FAILED',
      failed_tool_calls: ['multiply'],
      passed_tool_calls: []
    },
    created_at: '2025-08-05T14:08:26Z',
    updated_at: '2025-08-05T14:08:26Z'
  }
]

// Home page mock data
export const agents: OSAgent[] = [
  {
    id: 'agent-researcher',
    name: 'Researcher',
    description: 'Finds and summarizes information'
  },
  {
    id: 'agent-writer',
    name: 'Writer',
    description: 'Drafts clear and concise content'
  },
  {
    id: 'agent-analyst',
    name: 'Analyst',
    description: 'Analyzes data and produces insights'
  }
]

export const teams: OSTeam[] = [
  {
    id: 'team-growth',
    name: 'Growth Team',
    description: 'Coordinates research and content for growth'
  },
  {
    id: 'team-support',
    name: 'Support Team',
    description: 'Handles customer support queries'
  },
  {
    id: 'team-qa',
    name: 'QA Team',
    description: 'Ensures quality across workflows and releases'
  }
]

export const workflows: OSWorkflow[] = [
  {
    id: 'wf-onboarding',
    name: 'User Onboarding',
    description: 'Guide new users through setup'
  },
  {
    id: 'wf-content',
    name: 'Content Pipeline',
    description: 'Draft → Review → Publish'
  },
  {
    id: 'wf-analytics',
    name: 'Analytics Reporting',
    description: 'Aggregate and report KPIs weekly'
  }
]

export const interfaces: Interface[] = [
  { type: 'slack', version: '1.0', route: '/slack' },
  { type: 'whatsapp', version: '1.0', route: '/whatsapp' },
  { type: 'chat', version: '1.0', route: '/chat' }
]

export const agentConfig: AgentDetails = {
  id: '863d910c-895b-507e-ba82-d28d27f5be2d',
  name: 'Finance Agent',
  model: {
    name: 'OpenAIChat',
    model: 'gpt-4.1',
    provider: 'OpenAI'
  },
  tools: {
    tools: [
      {
        name: 'get_current_stock_price',
        description: 'Get the current stock price for a given symbol',
        parameters: {
          type: 'object',
          properties: {
            symbol: {
              type: 'string'
            }
          }
        },
        requires_confirmation: false,
        external_execution: false
      }
    ]
  },
  sessions: {
    session_table: 'agno_sessions',
    cache_session: false
  },
  memory: {
    app_name: 'Memory',
    enable_user_memories: true,
    memory_table: 'agno_memories',
    model: {
      name: 'OpenAIChat',
      model: 'gpt-4.1',
      provider: 'OpenAI'
    }
  },
  knowledge: {
    knowledge_table: 'agno_knowledge'
  },
  reasoning: {
    reasoning: true,
    reasoning_min_steps: 10,
    reasoning_max_steps: 20
  },
  system_message: {
    markdown: true
  }
}

export const componentSections = [
  { key: 'agents', title: 'Agents', data: agents },
  { key: 'teams', title: 'Teams', data: teams },
  { key: 'workflows', title: 'Workflows', data: workflows },
  { key: 'interfaces', title: 'Interfaces', data: interfaces }
]

// Extended mock trace data
export const MOCK_TRACES: Trace[] = [
  {
    trace_id: '9c645fe9dc507efba986d9f6e369b827',
    name: 'Stock_Price_Agent.arun',
    status: 'OK',
    duration: '4.93s',
    start_time: 1761732168969071000,
    end_time: 1761732173897703000,
    total_spans: 4,
    error_count: 0,
    run_id: 'af2bbb00-71ed-452b-aef2-3dfad4930462',
    session_id: '2e5f6784-3c54-4449-acb5-cf18be6dcc86',
    user_id: 'kaustubh@agno.com',
    agent_id: 'stock_agent_1',
    created_at: 1761732175,
    input: 'Get current stock price for TSLA'
  },
  {
    trace_id: '7a234cd5ab123cdef789012345abcdef',
    name: 'Weather_Agent.forecast',
    status: 'OK',
    duration: '2.15s',
    start_time: 1761732100000000000,
    end_time: 1761732102150000000,
    total_spans: 3,
    error_count: 0,
    run_id: 'bb3ccc11-82fe-563c-bf03-4efbe5041573',
    session_id: '3f6g7895-4d65-5550-bcd6-dg29cf7ad997',
    user_id: 'sarah@agno.com',
    agent_id: 'weather_agent_1',
    created_at: 1761732103,
    input: 'What is the weather forecast for New York?'
  },
  {
    trace_id: 'ef789abc12def345678901234567cdef',
    name: 'Data_Analysis_Agent.arun',
    status: 'ERROR',
    duration: '6.78s',
    start_time: 1761732050000000000,
    end_time: 1761732056780000000,
    total_spans: 8,
    error_count: 2,
    run_id: 'cc4ddd22-93gf-674d-cg14-5fgcf6152684',
    session_id: '3f6g7895-4d65-5550-bcd6-dg29cf7ad997',
    user_id: 'sarah@agno.com',
    agent_id: 'data_agent_3',
    created_at: 1761732057,
    input: 'Analyze sales data for Q4 2024'
  },
  {
    trace_id: 'ab123def456789012345678901234567',
    name: 'Email_Assistant.arun',
    status: 'OK',
    duration: '1.82s',
    start_time: 1761732000000000000,
    end_time: 1761732001820000000,
    total_spans: 2,
    error_count: 0,
    run_id: 'dd5eee33-04hg-785e-dh25-6ghdf7263795',
    session_id: '2e5f6784-3c54-4449-acb5-cf18be6dcc86',
    user_id: 'kaustubh@agno.com',
    agent_id: 'email_agent_4',
    created_at: 1761732002,
    input: 'Draft a follow-up email to client'
  },
  {
    trace_id: 'cd456789abc012345678901234567890',
    name: 'Recommendation_Engine.arun',
    status: 'OK',
    duration: '3.45s',
    start_time: 1761731950000000000,
    end_time: 1761731953450000000,
    total_spans: 6,
    error_count: 0,
    run_id: 'ee6fff44-15ih-896f-ei36-7hieg8374806',
    session_id: '4g7h8906-5e76-6661-cde7-eh30dg8be008',
    user_id: 'john@agno.com',
    agent_id: 'recommendation_agent_5',
    created_at: 1761731954,
    input: 'Recommend products based on user history'
  },
  {
    trace_id: 'f1234567890abcdef1234567890abcdef',
    name: 'Error_Trace_Agent.arun',
    status: 'ERROR',
    duration: '1.82s',
    start_time: 1761732055000000000,
    end_time: 1761732056820000000,
    total_spans: 1,
    error_count: 1,
    run_id: 'ff7ggg55-16jh-907g-fj47-8hijh9485917',
    session_id: '3f6g7895-4d65-5550-bcd6-dg29cf7ad997',
    user_id: 'sarah@agno.com',
    agent_id: 'error_agent_6',
    created_at: 1761732056,
    input: 'Process invalid data format'
  },
  {
    trace_id: '1a2b3c4d5e6f7890abcdef1234567890',
    name: 'Chat_Agent.conversation',
    status: 'OK',
    duration: '0.85s',
    start_time: 1761731800000000000,
    end_time: 1761731800850000000,
    total_spans: 2,
    error_count: 0,
    run_id: 'aa1bbb66-27ki-018h-gk58-9ijkl0596028',
    session_id: '5h8i9017-6f87-7772-def8-fi41eh9cf119',
    user_id: 'alice@agno.com',
    agent_id: 'chat_agent_7',
    created_at: 1761731801,
    input: 'Hello, how can I help you today?'
  },
  {
    trace_id: '2b3c4d5e6f7890ab1234567890abcdef',
    name: 'Translation_Agent.translate',
    status: 'OK',
    duration: '2.34s',
    start_time: 1761731700000000000,
    end_time: 1761731702340000000,
    total_spans: 3,
    error_count: 0,
    run_id: 'bb2ccc77-38lj-129i-hl69-0jklm1607139',
    session_id: '6i9j0128-7g98-8883-efg9-gj52fi0dg220',
    user_id: 'bob@agno.com',
    agent_id: 'translation_agent_8',
    created_at: 1761731703,
    input: 'Translate this text to Spanish'
  },
  {
    trace_id: '3c4d5e6f7890ab12345678901234abcd',
    name: 'Image_Processing_Agent.analyze',
    status: 'ERROR',
    duration: '8.91s',
    start_time: 1761731600000000000,
    end_time: 1761731608910000000,
    total_spans: 12,
    error_count: 3,
    run_id: 'cc3ddd88-49mk-230j-im70-1klmn2718240',
    session_id: '7j0k1239-8h09-9994-fgh0-hk63gj1eh331',
    user_id: 'charlie@agno.com',
    agent_id: 'image_agent_9',
    created_at: 1761731609,
    input: 'Analyze image for object detection'
  },
  {
    trace_id: '4d5e6f7890ab123456789012345678ef',
    name: 'Search_Agent.query',
    status: 'OK',
    duration: '1.56s',
    start_time: 1761731500000000000,
    end_time: 1761731501560000000,
    total_spans: 4,
    error_count: 0,
    run_id: 'dd4eee99-50nl-341k-jn81-2lmno3829351',
    session_id: '8k1l2340-9i10-0005-ghi1-il74hk2fi442',
    user_id: 'diana@agno.com',
    agent_id: 'search_agent_10',
    created_at: 1761731502,
    input: 'Search for AI research papers'
  },
  {
    trace_id: '5e6f7890ab1234567890123456789012',
    name: 'Code_Review_Agent.analyze',
    status: 'OK',
    duration: '12.45s',
    start_time: 1761731400000000000,
    end_time: 1761731412450000000,
    total_spans: 15,
    error_count: 0,
    run_id: 'ee5fff00-61om-452l-ko92-3mnop4930462',
    session_id: '9l2m3451-0j21-1116-hij2-jm85il3gj553',
    user_id: 'eve@agno.com',
    agent_id: 'code_review_agent_11',
    created_at: 1761731413,
    input: 'Review pull request #1234'
  },
  {
    trace_id: '6f7890ab12345678901234567890abcd',
    name: 'Sentiment_Analysis_Agent.process',
    status: 'ERROR',
    duration: '3.67s',
    start_time: 1761731300000000000,
    end_time: 1761731303670000000,
    total_spans: 5,
    error_count: 1,
    run_id: 'ff6ggg11-72pn-563m-lp03-4nopq5041573',
    session_id: '0m3n4562-1k32-2227-ijk3-kn96jm4hk664',
    user_id: 'frank@agno.com',
    agent_id: 'sentiment_agent_12',
    created_at: 1761731304,
    input: 'Analyze customer reviews sentiment'
  },
  {
    trace_id: '7890ab123456789012345678901234de',
    name: 'PDF_Parser_Agent.extract',
    status: 'OK',
    duration: '5.23s',
    start_time: 1761731200000000000,
    end_time: 1761731205230000000,
    total_spans: 7,
    error_count: 0,
    run_id: 'gg7hhh22-83qo-674n-mq14-5opqr6152684',
    session_id: '1n4o5673-2l43-3338-jkl4-lo07kn5il775',
    user_id: 'grace@agno.com',
    agent_id: 'pdf_agent_13',
    created_at: 1761731206,
    input: 'Extract text from invoice.pdf'
  },
  {
    trace_id: '890ab1234567890123456789012345ef',
    name: 'Calendar_Agent.schedule',
    status: 'OK',
    duration: '0.92s',
    start_time: 1761731100000000000,
    end_time: 1761731100920000000,
    total_spans: 2,
    error_count: 0,
    run_id: 'hh8iii33-94rp-785o-nr25-6pqrs7263795',
    session_id: '2o5p6784-3m54-4449-klm5-mp18lo6jm886',
    user_id: 'henry@agno.com',
    agent_id: 'calendar_agent_14',
    created_at: 1761731101,
    input: 'Schedule meeting for tomorrow at 2pm'
  },
  {
    trace_id: '90ab123456789012345678901234567f',
    name: 'Database_Backup_Agent.backup',
    status: 'ERROR',
    duration: '15.78s',
    start_time: 1761731000000000000,
    end_time: 1761731015780000000,
    total_spans: 20,
    error_count: 2,
    run_id: 'ii9jjj44-05sq-896p-os36-7qrst8374806',
    session_id: '3p6q7895-4n65-5550-lmn6-nq29mp7kn997',
    user_id: 'iris@agno.com',
    agent_id: 'backup_agent_15',
    created_at: 1761731016,
    input: 'Backup production database'
  }
]

// Mock traces data for teaser page
export const MOCK_TRACES_RESPONSE: TracesResponse = {
  data: MOCK_TRACES,
  meta: {
    page: 1,
    limit: 10,
    total_pages: 3,
    total_count: 25
  }
}
