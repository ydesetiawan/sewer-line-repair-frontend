import type { LocationAutocompleteResponse, LocationResource } from '@/types'

export interface UseLocationAutocompleteOptions {
  limit?: number
  minChars?: number
  debounceMs?: number
}

export interface UseLocationAutocompleteReturn {
  locations: Ref<LocationResource[]>
  loading: Ref<boolean>
  error: Ref<Error | null>
  meta: Ref<{ query: string; count: number; limit: number } | null>
  search: (query: string) => Promise<void>
  clearResults: () => void
}

export const useLocationAutocomplete = (
  options: UseLocationAutocompleteOptions = {}
): UseLocationAutocompleteReturn => {
  const {
    limit = 10,
    minChars = 2,
    debounceMs = 300,
  } = options

  const locations = ref<LocationResource[]>([])
  const loading = ref(false)
  const error = ref<Error | null>(null)
  const meta = ref<{ query: string; count: number; limit: number } | null>(null)

  const config = useRuntimeConfig()
  const apiBaseUrl = config.public.apiBaseUrl as string

  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  const search = async (query: string) => {
    // Clear previous debounce timer
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }

    // Clear results if query is too short
    if (query.length < minChars) {
      locations.value = []
      meta.value = null
      error.value = null
      return
    }

    // Debounce the API call
    debounceTimer = setTimeout(async () => {
      loading.value = true
      error.value = null

      try {
        const response = await $fetch<LocationAutocompleteResponse>(
          '/api/v1/locations/autocomplete',
          {
            baseURL: String(apiBaseUrl),
            params: {
              q: query.trim(),
              limit: limit,
            },
          }
        )

        locations.value = response.data
        meta.value = response.meta
      } catch (err) {
        error.value = err instanceof Error ? err : new Error('Failed to fetch locations')
        locations.value = []
        meta.value = null
        console.error('Location autocomplete error:', err)
      } finally {
        loading.value = false
      }
    }, debounceMs)
  }

  const clearResults = () => {
    locations.value = []
    meta.value = null
    error.value = null
    loading.value = false
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }
  }

  // Cleanup on unmount
  onUnmounted(() => {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }
  })

  return {
    locations,
    loading,
    error,
    meta,
    search,
    clearResults,
  }
}

