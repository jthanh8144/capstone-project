import QueryString from 'qs'

export const getPageFromQuery = (
  page: string | QueryString.ParsedQs | string[] | QueryString.ParsedQs[],
): number | null => {
  return typeof page === 'string' && !isNaN(+page) && +page > 0 ? +page : null
}
