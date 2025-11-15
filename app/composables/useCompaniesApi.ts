import type { CompaniesApiResponse, CompanyResource, CityResource, PaginationMeta } from '@/types'

export interface UseCompaniesOptions {
  stateSlug: string
  citySlug?: string | null
  page?: number
  perPage?: number
  autoFetch?: boolean
}

export interface UseCompaniesReturn {
  companies: Ref<CompanyResource[]>
  cities: Ref<CityResource[]>
  pagination: Ref<PaginationMeta | null>
  loading: Ref<boolean>
  error: Ref<Error | null>
  fetchCompanies: (page?: number, perPage?: number) => Promise<void>
  refresh: () => Promise<void>
  hasNextPage: ComputedRef<boolean>
  hasPrevPage: ComputedRef<boolean>
}

/**
 * Composable for fetching companies in a state with pagination
 */
export const useCompanies = (options: UseCompaniesOptions): UseCompaniesReturn => {
  const {
    stateSlug,
    citySlug = null,
    page: initialPage = 1,
    perPage: initialPerPage = 20,
    autoFetch = true,
  } = options

  const companies = ref<CompanyResource[]>([])
  const cities = ref<CityResource[]>([])
  const pagination = ref<PaginationMeta | null>(null)
  const loading = ref(false)
  const error = ref<Error | null>(null)
  const currentPage = ref(initialPage)
  const currentPerPage = ref(initialPerPage)

  const config = useRuntimeConfig()
  const apiBaseUrl = (config.public.apiBaseUrl as string) || 'http://localhost:3000'

  /**
   * Fetch companies from API
   */
  const fetchCompanies = async (page?: number, perPage?: number) => {
    if (page !== undefined) currentPage.value = page
    if (perPage !== undefined) currentPerPage.value = perPage

    loading.value = true
    error.value = null

    try {
      const params: Record<string, any> = {
        page: currentPage.value,
        per_page: currentPerPage.value,
      }

      // Add city filter if provided
      if (citySlug) {
        params.city = citySlug
      }

      const response = await $fetch<CompaniesApiResponse>(
        `/api/v1/states/${stateSlug}/companies`,
        {
          baseURL: String(apiBaseUrl),
          params,
        }
      )

      companies.value = response.data || []
      cities.value = response.meta?.cities?.data || []
      pagination.value = response.meta?.pagination || null
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Failed to fetch companies')
      companies.value = []
      cities.value = []
      pagination.value = null
      console.error('Error fetching companies:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * Refresh current page
   */
  const refresh = async () => {
    await fetchCompanies(currentPage.value, currentPerPage.value)
  }

  /**
   * Check if next page exists
   */
  const hasNextPage = computed(() => {
    return pagination.value?.next_page !== null
  })

  /**
   * Check if previous page exists
   */
  const hasPrevPage = computed(() => {
    return pagination.value?.prev_page !== null
  })

  // Auto-fetch on mount if enabled
  if (autoFetch) {
    onMounted(() => {
      fetchCompanies()
    })
  }

  return {
    companies,
    cities,
    pagination,
    loading,
    error,
    fetchCompanies,
    refresh,
    hasNextPage,
    hasPrevPage,
  }
}

