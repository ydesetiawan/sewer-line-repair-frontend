<script setup lang="ts">
import { MapPin, Loader2, AlertCircle, RefreshCw, Search, X } from 'lucide-vue-next'
import type { IState } from '@/types/state'

const ALL_STATES = 'browse-all-states'

// Props
interface Props {
  country?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  country: null,
})

// State
const states = ref<IState[]>([])
const pagination = ref<IMetaPagination | null>(null)
const loading = ref(false)
const error = ref<Error | null>(null)
const searchQuery = ref('')

// Debounce timer
let debounceTimer: ReturnType<typeof setTimeout> | null = null

// Abort controller for request cancellation
let abortController: AbortController | null = null


// Computed
const hasResults = computed(() => states.value.length > 0)
const totalResults = computed(() => pagination.value?.total_items || 0)

// Fetch states from API
const fetchStates = async (query: string = '') => {
  // Cancel previous request if exists
  if (abortController) {
    abortController.abort()
  }

  // Create new abort controller
  abortController = new AbortController()

  loading.value = true
  error.value = null

  try {
    const { $publicApi } = useNuxtApp()
    const params: Record<string, any> = {}

    // Add state query parameter if provided
    if (query) {
      params.state = query
    }

    // Add country filter if provided
    if (props.country) {
      params.country = props.country === ALL_STATES ? null : props.country
    }

    const response = await ($publicApi as any)('/api/v1/states', {
      params,
      signal: abortController.signal,
    }) as ISlrApiResponse<IState[]>

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

// Debounced search
const debouncedSearch = (query: string) => {
  // Clear existing timer
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }

  // Set new timer
  debounceTimer = setTimeout(() => {
    fetchStates(query)
  }, 400)
}

// Handle search input
const handleSearch = (event: Event) => {
  const target = event.target as HTMLInputElement
  searchQuery.value = target.value
  debouncedSearch(target.value)
}

// Clear search
const handleClearSearch = () => {
  searchQuery.value = ''
  fetchStates('')
}

// Refresh
const refresh = () => {
  fetchStates(searchQuery.value)
}

// Build route URL for state
const getStateRoute = (state: IState) => {
  return `/${state.attributes.country.slug}/${state.attributes.slug}`
}

// Load states on mount
onMounted(() => {
  fetchStates()
})

// Cleanup on unmount
onUnmounted(() => {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
  if (abortController) {
    abortController.abort()
  }
})
</script>

<template>
  <div class="space-y-6">
    <!-- Search Input -->
    <div class="relative">
      <BaseInput
        :model-value="searchQuery"
        type="text"
        placeholder="Search states by name..."
        class="bg-card border-border pl-10 pr-10 text-foreground"
        aria-label="Search states"
        @input="handleSearch"
      />
      <Search
        class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
      />
      <div class="absolute right-3 top-1/2 transform -translate-y-1/2">
        <Loader2
          v-if="loading"
          class="w-4 h-4 text-muted-foreground animate-spin"
        />
        <button
          v-else-if="searchQuery"
          type="button"
          class="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Clear search"
          @click="handleClearSearch"
        >
          <X class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Search Results Info -->
    <div v-if="searchQuery && !loading">
      <p class="text-sm text-muted-foreground">
        <template v-if="hasResults">
          Found <span class="text-accent font-bold">{{ totalResults }}</span> state{{ totalResults !== 1 ? 's' : '' }}
          matching "<span class="font-medium">{{ searchQuery }}</span>"
        </template>
        <template v-else>
          No states found matching "<span class="font-medium">{{ searchQuery }}</span>"
        </template>
      </p>
    </div>

    <!-- All States Count (when no search) -->
    <div v-else-if="!searchQuery && !loading && hasResults">
      <p class="text-sm text-muted-foreground">
        Showing <span class="text-accent font-bold">{{ totalResults }}</span> state{{ totalResults !== 1 ? 's' : '' }}
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="loading && !states.length" class="flex justify-center items-center py-20">
      <div class="text-center space-y-4">
        <Loader2 class="w-16 h-16 text-accent animate-spin mx-auto" />
        <p class="text-lg text-muted-foreground">Loading states...</p>
      </div>
    </div>

    <!-- 404 Not Found State -->
    <div v-else-if="error && 'statusCode' in error && (error as any).statusCode === 404" class="text-center py-20">
      <div class="max-w-md mx-auto space-y-6">
        <MapPin class="w-20 h-20 text-muted-foreground/50 mx-auto" />
        <div>
          <h2 class="text-2xl font-bold mb-2">No States Found</h2>
          <p class="text-muted-foreground">
            No states were found for the selected country. Please try a different search.
          </p>
        </div>
      </div>
    </div>

    <!-- Other Error State -->
    <div v-else-if="error" class="text-center py-20">
      <div class="max-w-md mx-auto space-y-6">
        <AlertCircle class="w-20 h-20 text-destructive mx-auto" />
        <div>
          <h2 class="text-2xl font-bold mb-2">Failed to load states</h2>
          <p class="text-muted-foreground">{{ error.message }}</p>
        </div>
        <BaseButton @click="refresh" variant="outline" size="lg" class="gap-2">
          <RefreshCw class="w-5 h-5" />
          Try Again
        </BaseButton>
      </div>
    </div>

    <!-- States Grid -->
    <div v-else-if="states.length > 0">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <NuxtLink
          v-for="state in states"
          :key="state.id"
          :to="getStateRoute(state)"
        >
          <BaseCard
            class="p-6 bg-card hover:bg-card/80 border-border/50 cursor-pointer transition-all hover:shadow-lg hover:border-accent/50"
          >
            <div class="flex items-center gap-3">
              <div class="p-2 bg-accent/10 rounded-lg">
                <MapPin class="w-5 h-5 text-accent" />
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="font-medium group-hover:text-accent transition-colors block truncate">
                  {{ state.attributes.name }}
                  <span class="text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded-full font-mono">
                    {{ state.attributes.country.name }}
                  </span>
                </h3>
                <p class="text-sm text-muted-foreground">
                  <span class="text-accent">{{ state.attributes.companies_count }}</span> contractors available
                </p>
              </div>
            </div>
          </BaseCard>
        </NuxtLink>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-20">
      <div class="max-w-md mx-auto space-y-4">
        <MapPin class="w-20 h-20 text-muted-foreground/50 mx-auto" />
        <div>
          <h2 class="text-2xl font-bold mb-2">No States Available</h2>
          <p class="text-muted-foreground">
            There are currently no states in the directory. Please check back later.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

