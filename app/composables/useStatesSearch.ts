import type { StatesApiResponse, StateResource, PaginationMeta } from '@/types'

export interface UseStatesSearchOptions {
  initialQuery?: string
  debounceMs?: number
  minChars?: number
  country?: string | null
}

export interface UseStatesSearchReturn {
  states: Ref<StateResource[]>
  pagination: Ref<PaginationMeta | null>
  loading: Ref<boolean>
  error: Ref<Error | null>
  searchQuery: Ref<string>
  search: (query: string) => Promise<void>
  clearSearch: () => void
  hasResults: ComputedRef<boolean>
  totalResults: ComputedRef<number>
}

/**
 * Composable for searching US states with debouncing and error handling
 * @param options Configuration options for the search
 */
export const useStatesSearch = (options: UseStatesSearchOptions = {}): UseStatesSearchReturn => {
  const {
    initialQuery = '',
    debounceMs = 400,
    minChars = 1,
    country = null
  } = options

  const states = ref<StateResource[]>([])
  const pagination = ref<PaginationMeta | null>(null)
  const loading = ref(false)
  const error = ref<Error | null>(null)
  const searchQuery = ref(initialQuery)

  const config = useRuntimeConfig()
  const apiBaseUrl = (config.public.apiBaseUrl as string) || 'http://localhost:3000'

  // AbortController for canceling previous requests
  let abortController: AbortController | null = null

  // Debounce timer
  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  /**
   * Perform the actual API search
   */
  const performSearch = async (query: string) => {
    // Cancel previous request if exists
    if (abortController) {
      abortController.abort()
    }

    // Create new abort controller for this request
    abortController = new AbortController()

    // If query is less than minimum characters, clear results
    if (query.length > 0 && query.length < minChars) {
      states.value = []
      pagination.value = null
      return
    }

    loading.value = true
    error.value = null

    try {
      const params: Record<string, any> = {}

      // Add state query parameter if provided
      if (query.length >= minChars) {
        params.state = query
      }

      // Add country filter if provided
      if (country) {
        params.country = country
      }

      const response = await $fetch<StatesApiResponse>('/api/v1/states', {
        baseURL: String(apiBaseUrl),
        params,
        signal: abortController.signal,
      })

      states.value = response.data || []
      pagination.value = response.meta?.pagination || null
    } catch (err: any) {
      // Ignore abort errors
      if (err.name === 'AbortError' || err.message?.includes('aborted')) {
        return
      }

      error.value = err instanceof Error ? err : new Error('Failed to search states')
      states.value = []
      pagination.value = null
      console.error('Error searching states:', err)
    } finally {
      loading.value = false
      abortController = null
    }
  }

  /**
   * Debounced search function
   */
  const debouncedSearch = (query: string) => {
    // Clear existing timer
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }

    // Set new timer
    debounceTimer = setTimeout(() => {
      performSearch(query)
    }, debounceMs)
  }

  /**
   * Public search function
   */
  const search = async (query: string) => {
    searchQuery.value = query
    debouncedSearch(query)
  }

  /**
   * Clear search and reset state
   */
  const clearSearch = () => {
    searchQuery.value = ''
    states.value = []
    pagination.value = null
    error.value = null

    // Clear debounce timer
    if (debounceTimer) {
      clearTimeout(debounceTimer)
      debounceTimer = null
    }

    // Cancel any pending requests
    if (abortController) {
      abortController.abort()
      abortController = null
    }
  }

  /**
   * Whether there are search results
   */
  const hasResults = computed(() => states.value.length > 0)

  /**
   * Total number of results from pagination
   */
  const totalResults = computed(() => pagination.value?.total_items || 0)


  return {
    states,
    pagination,
    loading,
    error,
    searchQuery,
    search,
    clearSearch,
    hasResults,
    totalResults,
  }
}

