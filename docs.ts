/**
 * Centralized documentation links for the Agno application.
 * This file contains all external documentation URLs used throughout the app.
 *
 * When adding new documentation links:
 * 1. Add them to the appropriate category
 * 2. Use descriptive names that match the content/feature
 * 3. Update the DOC_LINKS type if adding new categories
 */

export const DOC_LINKS = {
  // Platform documentation
  platform: {
    home: 'https://docs.agno.com',
    agents: {
      introduction: 'https://docs.agno.com/basics/agents/overview',
      memory:
        'https://docs.agno.com/basics/sessions/session-summaries#enable-session-summaries'
    },
    teams: {
      introduction: 'https://docs.agno.com/basics/teams/overview',
      route: 'https://docs.agno.com/basics/teams/delegation'
    },
    workflows: {
      introduction: 'https://docs.agno.com/basics/workflows/overview'
    },
    memory: {
      introduction: 'https://docs.agno.com/basics/memory/overview'
    },
    knowledge: {
      introduction: 'https://docs.agno.com/basics/knowledge/overview'
    },
    evaluation: {
      introduction: 'https://docs.agno.com/basics/evals/overview'
    },
    monitoring: 'https://docs.agno.com/agent-os/features/session-tracking',
    registry: 'https://docs.agno.com/introduction',
    workspaces: 'https://docs.agno.com/agent-os/introduction',
    applications: 'https://docs.agno.com/agent-os/introduction',
    migration: 'https://docs.agno.com/how-to/v2-migration'
  },

  // AgentOS documentation
  agentOS: {
    introduction: 'https://docs.agno.com/agent-os/introduction',
    controlPlane: 'https://docs.agno.com/agent-os/control-plane',
    createFirstOS: 'https://docs.agno.com/agent-os/creating-your-first-os',
    connectOS: 'https://docs.agno.com/agent-os/connecting-your-os',
    security: 'https://docs.agno.com/agent-os/security',
    configuration: 'https://docs.agno.com/agent-os/configuration',
    mcp: 'https://docs.agno.com/agent-os/mcp',
    customFastAPI: 'https://docs.agno.com/agent-os/custom-fastapi',
    features: {
      chatInterface: 'https://docs.agno.com/agent-os/features/chat-interface',
      knowledgeManagement:
        'https://docs.agno.com/agent-os/features/knowledge-management',
      sessionTracking:
        'https://docs.agno.com/agent-os/features/session-tracking'
    },
    interfaces: {
      streamlit: 'https://docs.agno.com/agent-os/interfaces/streamlit',
      jupyter: 'https://docs.agno.com/agent-os/interfaces/jupyter'
    }
  },

  // API Reference documentation
  api: {
    agents: 'https://docs.agno.com/reference/agents/agent',
    teams: 'https://docs.agno.com/reference/teams/team',
    workflows: 'https://docs.agno.com/reference/workflows/workflow'
  },

  // External documentation
  external: {
    dockerInstallation: 'https://docs.docker.com/engine/install/'
  }
} as const

export type DocLinksType = typeof DOC_LINKS
export type PlatformDocsType = typeof DOC_LINKS.platform

export const DOCS_BASE_URL = 'https://docs.agno.com'
