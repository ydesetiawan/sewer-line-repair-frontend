<script setup lang="ts">
import { ref } from 'vue'
import { Search, Loader2, MapPin } from 'lucide-vue-next'
import { useLocationAutocomplete } from '@/composables/useLocationAutocomplete'
import { getStateSlug, getCitySlug } from '@/composables/useContractors'

const searchInput = ref('')
const router = useRouter()

// Use the location autocomplete composable
const { locations, loading, error, search, clearResults } = useLocationAutocomplete({
  limit: 8,
  minChars: 2,
  debounceMs: 300,
})

const handleSearch = (value: string) => {
  searchInput.value = value
  search(value)
}

const handleSearchSubmit = (location?: any) => {
  let targetLocation = location

  // If no location provided, find first match from suggestions
  if (!targetLocation && locations.value.length > 0) {
    targetLocation = locations.value[0]
  }

  if (!targetLocation) {
    return
  }

  const { country, state, city, address } = targetLocation.attributes

  // Build the route based on available data
  const stateSlug = getStateSlug(state)
  const citySlug = getCitySlug(city)

  // Navigate to the appropriate route
  if (city && state) {
    router.push(`/sewer-line-repair/${stateSlug}/${citySlug}`)
  } else if (state) {
    router.push(`/sewer-line-repair/${stateSlug}`)
  }

  // Clear results and input
  clearResults()
  searchInput.value = ''
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    handleSearchSubmit()
  }
}

// Format location display text
const formatLocation = (location: any) => {
  const { city, state, address } = location.attributes
  if (address) {
    return `${address}, ${city}, ${state}`
  }
  return `${city}, ${state}`
}
</script>

<template>
  <div class="w-full relative">
    <div class="flex gap-2">
      <div class="relative flex-1">
        <UiInput
          v-model="searchInput"
          placeholder="Search by city, state, or address..."
          class="bg-card border-border pl-10 pr-10 text-foreground"
          @input="handleSearch(searchInput)"
          @keydown="handleKeyDown"
        />
        <Search
          class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground"
        />

        <!-- Loading Spinner -->
        <Loader2
          v-if="loading"
          class="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground animate-spin"
        />

        <!-- Autocomplete Dropdown -->
        <div
          v-if="locations.length > 0 || loading || error"
          class="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-10 overflow-hidden"
        >
          <!-- Loading State -->
          <div
            v-if="loading && locations.length === 0"
            class="px-4 py-3 text-sm text-muted-foreground text-center"
          >
            <Loader2 class="w-4 h-4 animate-spin inline-block mr-2" />
            Searching...
          </div>

          <!-- Error State -->
          <div
            v-else-if="error"
            class="px-4 py-3 text-sm text-destructive text-center"
          >
            Failed to load suggestions. Please try again.
          </div>

          <!-- Results -->
          <button
            v-for="location in locations"
            :key="location.id"
            class="w-full text-left px-4 py-2.5 text-foreground hover:bg-primary hover:text-primary-foreground transition-colors border-b border-border last:border-b-0"
            @click="handleSearchSubmit(location)"
          >
            <div class="flex items-start gap-2">
              <MapPin class="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div class="flex-1 min-w-0">
                <div class="font-medium truncate">{{ formatLocation(location) }}</div>
                <div class="text-xs text-muted-foreground">
                  {{ location.attributes.state }}, {{ location.attributes.country }}
                </div>
              </div>
            </div>
          </button>

          <!-- No Results -->
          <div
            v-if="!loading && !error && locations.length === 0 && searchInput.length >= 2"
            class="px-4 py-3 text-sm text-muted-foreground text-center"
          >
            No locations found for "{{ searchInput }}"
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

