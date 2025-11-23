<script setup lang="ts">
import { Search, Loader2, MapPin } from 'lucide-vue-next'
import type { ILocationAutocomplete } from '@/types/location-autocomplete'

// Composables
const { $publicApi } = useNuxtApp()
const router = useRouter()

// Configuration
const SEARCH_CONFIG = {
  LIMIT: 8,
  MIN_CHARS: 2,
  DEBOUNCE_MS: 300,
} as const

// State
const searchInput = ref('')
const locations = ref<ILocationAutocomplete[]>([])
const loading = ref(false)
const error = ref<Error | null>(null)

let debounceTimer: ReturnType<typeof setTimeout> | null = null

// Search locations with debounce
const searchLocations = async (query: string) => {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }

  // Clear results if query is too short
  if (query.length < SEARCH_CONFIG.MIN_CHARS) {
    clearResults()
    return
  }

  // Debounce the API call
  debounceTimer = setTimeout(async () => {
    loading.value = true
    error.value = null

    try {
      const response = await $publicApi<ISlrApiResponse<ILocationAutocomplete[]>>(
        '/api/v1/locations/autocomplete',
        {
          params: {
            q: query.trim(),
            limit: SEARCH_CONFIG.LIMIT,
          },
        },
      )

      locations.value = response.data
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Failed to fetch locations')
      locations.value = []
      console.error('Location autocomplete error:', err)
    } finally {
      loading.value = false
    }
  }, SEARCH_CONFIG.DEBOUNCE_MS)
}

// Clear all search results
const clearResults = () => {
  locations.value = []
  error.value = null
  loading.value = false

  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
}

// Convert string to URL slug
const toSlug = (text: string | undefined | null): string => {
  return text?.toLowerCase().replace(/\s+/g, '-') ?? ''
}

// Build URL path from location data
const buildLocationPath = (location: ILocationAutocomplete): string => {
  const { country, state, city } = location.attributes
  const countrySlug = toSlug(country)
  const stateSlug = toSlug(state)
  const citySlug = toSlug(city)

  if (city && state) {
    return `/${countrySlug}/${stateSlug}/${citySlug}`
  }

  if (state) {
    return `/${countrySlug}/${stateSlug}`
  }

  return `/${countrySlug}`
}

// Navigate to selected location
const navigateToLocation = (location?: ILocationAutocomplete) => {
  const targetLocation = location ?? locations.value[0]

  if (!targetLocation) {
    return
  }

  const path = buildLocationPath(targetLocation)
  router.push(path)

  // Clear results and input
  clearResults()
  searchInput.value = ''
}

// Handle input change
const handleInput = (value: string) => {
  searchInput.value = value
  searchLocations(value)
}

// Handle Enter key press
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    navigateToLocation()
  }
}

// Format primary location display text
const formatLocationPrimary = (location: ILocationAutocomplete): string => {
  const { country, city, state, address } = location.attributes

  if (address) {
    return `${address}, ${city}, ${state}`
  }

  if (city) {
    return `${city}, ${state}`
  }

  if (state) {
    return state
  }

  return country
}

// Format secondary location display text
const formatLocationSecondary = (location: ILocationAutocomplete): string => {
  const { country, state } = location.attributes

  return state ? `${state}, ${country}` : ''
}

// Cleanup on unmount
onUnmounted(() => {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
})
</script>

<template>
  <div class="relative w-full">
    <div class="flex gap-2">
      <!-- Search Input -->
      <div class="relative flex-1">
        <BaseInput
          v-model="searchInput"
          placeholder="Search by country, city, state, or address..."
          class="bg-card border-border pl-10 pr-10 text-foreground"
          @input="handleInput(searchInput)"
          @keydown="handleKeyDown"
        />

        <!-- Search Icon -->
        <Search
          class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
        />

        <!-- Loading Spinner -->
        <Loader2
          v-if="loading"
          class="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground"
        />

        <!-- Autocomplete Dropdown -->
        <div
          v-if="locations.length > 0 || loading || error"
          class="absolute left-0 right-0 top-full z-10 mt-1 overflow-hidden rounded-lg border border-border bg-card shadow-lg"
        >
          <!-- Loading State -->
          <div
            v-if="loading && locations.length === 0"
            class="px-4 py-3 text-center text-sm text-muted-foreground"
          >
            <Loader2 class="mr-2 inline-block h-4 w-4 animate-spin" />
            Searching...
          </div>

          <!-- Error State -->
          <div
            v-else-if="error"
            class="px-4 py-3 text-center text-sm text-destructive"
          >
            Failed to load suggestions. Please try again.
          </div>

          <!-- Results List -->
          <button
            v-for="location in locations"
            :key="location.id"
            type="button"
            class="w-full border-b border-border px-4 py-2.5 text-left text-foreground transition-colors last:border-b-0 hover:bg-primary hover:text-primary-foreground"
            @click="navigateToLocation(location)"
          >
            <div class="flex items-start gap-2">
              <MapPin class="mt-0.5 h-4 w-4 flex-shrink-0" />
              <div class="min-w-0 flex-1">
                <div class="truncate font-medium">
                  {{ formatLocationPrimary(location) }}
                </div>
                <div class="text-xs text-muted-foreground">
                  {{ formatLocationSecondary(location) }}
                </div>
              </div>
            </div>
          </button>

          <!-- No Results -->
          <div
            v-if="!loading && !error && locations.length === 0 && searchInput.length >= SEARCH_CONFIG.MIN_CHARS"
            class="px-4 py-3 text-center text-sm text-muted-foreground"
          >
            No locations found for "{{ searchInput }}"
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

