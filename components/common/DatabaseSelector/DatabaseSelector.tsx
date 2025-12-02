import { useFetchOSConfig } from '@/hooks/os/useFetchOSConfig'
import { useDatabase } from '@/providers/DatabaseProvider/DatabaseProvider'
import { useLocation } from 'react-router-dom'
import { DomainType, DataBase } from '@/types/os'
import { ROUTES } from '@/routes'
import { useMemo } from 'react'
import DatabaseBreadcrumb from './DatabaseBreadcrumb'
import TableBreadcrumb from './TableBreadcrumb'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import Icon from '@/components/ui/icon'

const DOMAIN_TYPE: Record<string, DomainType> = {
  [ROUTES.UserMemory]: 'memory',
  [ROUTES.UserEvaluation]: 'evals',
  [ROUTES.UserSessions]: 'session',
  [ROUTES.UserMetrics]: 'metrics',
  [ROUTES.UserKnowledge]: 'knowledge',
  [ROUTES.UserMemoryV2]: 'memory',
  [ROUTES.UserKnowledgeV2]: 'knowledge',
  [ROUTES.UserTraces]: 'traces'
}

export default function DatabaseSelector() {
  const { data: osConfig } = useFetchOSConfig()
  const { selectedDatabase, setSelectedDatabase } = useDatabase()
  const { pathname } = useLocation()
  const basePath = `/${pathname.split('/')[1]}`

  const currentDomain = DOMAIN_TYPE[basePath]

  const currentDomainDbList = osConfig?.[currentDomain]?.dbs
  const currentDomainDb = selectedDatabase[currentDomain]

  const databaseOptions = useMemo(
    () =>
      currentDomainDbList?.map((db: DataBase) => ({
        value: db.db_id,
        label: db.domain_config?.display_name ?? db.db_id
      })),
    [currentDomainDbList]
  )

  const handleDatabaseSelect = (dbId: string) => {
    const selectedDb = currentDomainDbList?.find(
      (db: DataBase) => db.db_id === dbId
    )
    if (selectedDb) {
      setSelectedDatabase({
        ...selectedDatabase,
        [currentDomain]: {
          db: selectedDb,
          table: selectedDb.tables?.[0]
        }
      })
    }
  }

  const handleTableSelect = (tableName: string) => {
    if (currentDomainDb) {
      setSelectedDatabase({
        ...selectedDatabase,
        [currentDomain]: {
          ...currentDomainDb,
          table: tableName
        }
      })
    }
  }

  const availableTables = currentDomainDb?.db?.tables || []
  const tableOptions = useMemo(
    () =>
      availableTables.map((table) => ({
        value: table,
        label: table
      })),
    [availableTables]
  )

  const showTableSelector = availableTables.length > 0

  return (
    <Breadcrumb className="flex gap-1">
      <BreadcrumbList>
        <DatabaseBreadcrumb
          selectedValue={currentDomainDb?.db?.db_id ?? ''}
          selectedLabel={
            currentDomainDb?.db?.domain_config?.display_name ??
            currentDomainDb?.db?.db_id ??
            ''
          }
          options={databaseOptions ?? []}
          onSelect={handleDatabaseSelect}
        />

        {showTableSelector && (
          <div className="flex items-end gap-2">
            <BreadcrumbSeparator className="mb-1.5">
              <Icon type="slash" size="xs" className="text-primary" />
            </BreadcrumbSeparator>
            <TableBreadcrumb
              selectedValue={currentDomainDb?.table ?? ''}
              selectedLabel={currentDomainDb?.table ?? ''}
              options={tableOptions}
              onSelect={handleTableSelect}
            />
          </div>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
