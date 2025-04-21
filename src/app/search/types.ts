export type SearchPageSearchParams = {
  q: string | undefined
}

export type SearchPageProps = {
  searchParams: Promise<SearchPageSearchParams>
}
