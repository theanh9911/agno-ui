import React, { createContext, useContext, useEffect, useState } from 'react'
import { useFetchOSConfig } from '@/hooks/os/useFetchOSConfig'
import { DomainType, SelectedDatabase } from '@/types/os'

interface DatabaseContextType {
  selectedDatabase: Record<DomainType, SelectedDatabase | null>
  setSelectedDatabase: (
    databases: Record<DomainType, SelectedDatabase | null>
  ) => void
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(
  undefined
)

export const useDatabase = () => {
  const context = useContext(DatabaseContext)
  if (context === undefined) {
    throw new Error('useDatabase must be used within a DatabaseProvider')
  }
  return context
}

interface DatabaseProviderProps {
  children: React.ReactNode
}

export const DatabaseProvider: React.FC<DatabaseProviderProps> = ({
  children
}) => {
  const { data: osConfig, isFetched } = useFetchOSConfig()
  const [selectedDatabase, setSelectedDatabase] = useState<
    Record<DomainType, SelectedDatabase | null>
  >({
    memory: null,
    evals: null,
    session: null,
    metrics: null,
    knowledge: null,
    traces: null
  })

  useEffect(() => {
    if (!isFetched || !osConfig) return

    setSelectedDatabase({
      memory: {
        db: osConfig.memory?.dbs[0],
        table: osConfig.memory?.dbs[0]?.tables?.[0]
      },
      evals: {
        db: osConfig.evals?.dbs[0],
        table: osConfig.evals?.dbs[0]?.tables?.[0]
      },
      session: {
        db: osConfig.session?.dbs[0],
        table: osConfig.session?.dbs[0]?.tables?.[0]
      },
      metrics: {
        db: osConfig.metrics?.dbs[0],
        table: osConfig.metrics?.dbs[0]?.tables?.[0]
      },
      knowledge: {
        db: osConfig.knowledge?.dbs[0],
        table: osConfig.knowledge?.dbs[0]?.tables?.[0]
      },
      traces: {
        db: osConfig.traces?.dbs[0],
        table: osConfig.traces?.dbs[0]?.tables?.[0]
      }
    })
  }, [osConfig, isFetched])
  const value = {
    selectedDatabase,
    setSelectedDatabase
  }
  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  )
}

export default DatabaseProvider
