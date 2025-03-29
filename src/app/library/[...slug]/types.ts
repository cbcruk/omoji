export type LibraryPageParams = {
  slug: [LibraryPageParamsGroup, LibraryPageParamsSubgroup]
}

export type LibraryPageParamsGroup = string
export type LibraryPageParamsSubgroup = string | undefined

export type LibraryPageProps = {
  params: Promise<LibraryPageParams>
}

export type LibraryGroupPageProps = {
  group: LibraryPageParamsGroup
}

export type LibrarySubgroupPageProps = {
  group: LibraryGroupPageProps['group']
  subgroup: Exclude<LibraryPageParamsSubgroup, undefined>
}
