import type { StatesApiResponse, StateResource, PaginationMeta } from '@/types'

export interface UseStatesOptions {
  page?: number
  perPage?: number
  autoFetch?: boolean
}

export interface UseStatesReturn {
  states: Ref<StateResource[]>
  pagination: Ref<PaginationMeta | null>
  loading: Ref<boolean>
  error: Ref<Error | null>
  fetchStates: (page?: number, perPage?: number) => Promise<void>
  refresh: () => Promise<void>
  hasNextPage: ComputedRef<boolean>
  hasPrevPage: ComputedRef<boolean>
}

export const useStates = (options: UseStatesOptions = {}): UseStatesReturn => {
  const {
    page: initialPage = 1,
    perPage: initialPerPage = 20,
    autoFetch = true,
  } = options

  const states = ref<StateResource[]>([])
  const pagination = ref<PaginationMeta | null>(null)
  const loading = ref(false)
  const error = ref<Error | null>(null)
  const currentPage = ref(initialPage)
  const currentPerPage = ref(initialPerPage)

  const config = useRuntimeConfig()
  const apiBaseUrl = (config.public.apiBaseUrl as string) || 'http://localhost:3000'

  const fetchStates = async (page?: number, perPage?: number) => {
    if (page !== undefined) currentPage.value = page
    if (perPage !== undefined) currentPerPage.value = perPage

    loading.value = true
    error.value = null

    try {
      const response = await $fetch<StatesApiResponse>('/api/v1/states', {
        baseURL: String(apiBaseUrl),
        params: {
          page: currentPage.value,
          per_page: currentPerPage.value,
        },
      })

      states.value = response.data
      pagination.value = response.meta?.pagination || null
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Failed to fetch states')
      console.error('Error fetching states:', err)
    } finally {
      loading.value = false
    }
  }

  const refresh = async () => {
    await fetchStates(currentPage.value, currentPerPage.value)
  }

  const hasNextPage = computed(() => {
    return pagination.value?.next_page !== null
  })

  const hasPrevPage = computed(() => {
    return pagination.value?.prev_page !== null
  })

  // Auto-fetch on mount if enabled (client-side only)
  if (autoFetch) {
    onMounted(() => {
      fetchStates()
    })
  }

  return {
    states,
    pagination,
    loading,
    error,
    fetchStates,
    refresh,
    hasNextPage,
    hasPrevPage,
  }
}

