export enum FilterType {
  Agents = 'agent',
  Teams = 'team',
  Workflows = 'workflow'
}

export enum SortBy {
  LAST_UPDATED_ASC = 'last_updated_asc',
  LAST_UPDATED_DESC = 'last_updated_desc',
  UPDATED_AT_ASC = 'updated_at_asc',
  UPDATED_AT_DESC = 'updated_at_desc'
}

// Add enum for SortFilterType
export enum SortFilterType {
  LAST_UPDATED = 'sortOptionsLastUpdated',
  UPDATED_AT = 'sortOptionsUpdatedAt'
}

export interface QueryFilter {
  url: string
  db_id: string
  table?: string
  limit: number
  page: number
  sort_by?: string
  sort_order?: string
  user_id?: string
}

export enum TopbarBreadcrumbType {
  ORGANIZATION = 'ORGANIZATION',
  OS = 'OS'
}
