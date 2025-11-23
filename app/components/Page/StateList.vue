<script setup lang="ts">
import {MapPin, Loader2, AlertCircle, RefreshCw, Search, X} from 'lucide-vue-next'
import type {IState} from '@/types/state'

const ALL_STATES = 'browse-all-states'

// Props
interface Props {
  countrySlug?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  countrySlug: null,
})

// State
const states = ref<IState[]>([])
const pagination = ref<IMetaPagination | null>(null)
const loading = ref(false)
const error = ref<Error | null>(null)
const searchQuery = ref('')
const isSelectedCountry = computed(() => !!props.countrySlug && props.countrySlug !== ALL_STATES)
const country = formatSlugToTitle(props.countrySlug || '')

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
    const {$publicApi} = useNuxtApp()
    const params: Record<string, any> = {}

    // Add state query parameter if provided
    if (query) {
      params.state = query
    }

    // Add country filter if provided
    if (props.countrySlug) {
      params.country = props.countrySlug === ALL_STATES ? null : props.countrySlug
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

const totalCompanies = computed(() =>
    states.value.reduce((sum, state) => sum + (state.attributes.companies_count || 0), 0)
);

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
  <!-- Header - Clean & Modern -->
  <BaseCard class="overflow-hidden mb-8">
    <div class="relative bg-gradient-to-br from-accent/10 via-accent/5 to-transparent p-8 md:p-12">
      <!-- Decorative Background -->
      <div
          class="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full -translate-y-32 translate-x-32 blur-3xl"></div>

      <div class="relative">
        <div class="max-w-4xl">
          <h1 class="text-4xl md:text-5xl font-bold mb-4">
            All States <span v-if="isSelectedCountry">in {{ country }}</span>
          </h1>
          <p class="text-xl text-muted-foreground mb-6">
            Select your state to view certified professionals in your area. All contractors are verified and ready to
            help
            with your sewer repair needs.
          </p>

          <!-- Stats Bar -->
          <div class="flex flex-wrap gap-4">
            <div
                class="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur rounded-xl shadow-sm border border-gray-200">
              <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span class="font-semibold">{{ totalCompanies }}</span>
              <span class="text-muted-foreground">Verified Contractors</span>
            </div>
            <div v-if="states.length > 0"
                 class="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur rounded-xl shadow-sm border border-gray-200">
              <MapPin class="w-4 h-4 text-accent"/>
              <span class="font-semibold">{{ states.length }}</span>
              <span class="text-muted-foreground">{{ states.length === 1 ? 'State' : 'States' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </BaseCard>

  <!-- Search Section - Clean & Modern -->
  <BaseCard class="p-6 mb-8">
    <div class="flex items-center gap-3 mb-4">
      <div class="w-10 h-10 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-center">
        <Search class="w-5 h-5 text-blue-600"/>
      </div>
      <h2 class="text-xl font-bold text-gray-900">Find Your State</h2>
    </div>

    <div class="relative">
      <BaseInput
          :model-value="searchQuery"
          type="text"
          placeholder="Search states by name..."
          class="pl-12 pr-12 h-14 text-base bg-white border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
          aria-label="Search states"
          @input="handleSearch"
      />
      <div class="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <div class="w-8 h-8 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-center">
          <Search class="w-4 h-4 text-blue-600"/>
        </div>
      </div>
      <div class="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
        <Loader2 v-if="loading" class="w-5 h-5 text-blue-600 animate-spin"/>
        <button
            v-if="searchQuery"
            @click="handleClearSearch"
            type="button"
            class="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 transition-all duration-200"
            aria-label="Clear search"
        >
          <X class="w-4 h-4"/>
        </button>
      </div>
    </div>

    <div v-if="searchQuery" class="flex items-center gap-3 mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
      <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center shadow-sm">
        <Search class="w-5 h-5 text-white"/>
      </div>
      <p class="text-sm font-medium text-gray-900">
        Searching for "<span class="font-semibold text-blue-600">{{ searchQuery }}</span>"
      </p>
    </div>
  </BaseCard>

  <BaseCard class="p-6">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6">
      <div>
        <h2 class="text-2xl font-bold mb-1">
          {{ searchQuery ? 'Search Results' : 'Available States' }}
        </h2>
        <p v-if="searchQuery && states.length > 0" class="text-sm text-muted-foreground">
          Found <span class="font-semibold text-accent">{{ states.length }}</span> result{{ states.length !== 1 ? 's' : '' }} for "{{ searchQuery }}"
        </p>
        <p v-else class="text-sm text-muted-foreground">
          Showing {{ states.length }} states <span v-if="isSelectedCountry">in {{ country }}</span>
        </p>
      </div>
    </div>

    <!-- Loading State - Clean Design -->
    <div v-if="loading && !states.length" class="flex justify-center items-center py-20">
      <div class="text-center space-y-4">
        <div class="relative inline-block">
          <div class="absolute inset-0 bg-blue-400 rounded-full blur-xl opacity-30 animate-pulse"></div>
          <Loader2 class="relative w-16 h-16 text-blue-600 animate-spin"/>
        </div>
        <div>
          <p class="text-lg font-bold text-gray-900">Loading states...</p>
          <p class="text-sm text-gray-500 mt-1">Please wait a moment</p>
        </div>
      </div>
    </div>

    <!-- 404 Not Found State - Clean Design -->
    <div v-else-if="error && 'statusCode' in error && (error as any).statusCode === 404" class="text-center py-20">
      <div class="max-w-md mx-auto space-y-6">
        <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
          <MapPin class="w-10 h-10 text-gray-400"/>
        </div>
        <div>
          <h2 class="text-2xl font-bold mb-2 text-gray-900">No States Found</h2>
          <p class="text-gray-600">
            No states were found for the selected country. Please try a different search.
          </p>
        </div>
      </div>
    </div>

    <!-- Other Error State - Clean Design -->
    <div v-else-if="error" class="text-center py-20">
      <div class="max-w-md mx-auto space-y-6">
        <div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle class="w-10 h-10 text-red-600"/>
        </div>
        <div>
          <h2 class="text-2xl font-bold mb-2 text-gray-900">Failed to load states</h2>
          <p class="text-gray-600">{{ error.message }}</p>
        </div>
        <BaseButton @click="refresh" variant="outline" size="lg"
                    class="gap-2 border-2 border-blue-500 text-blue-600 hover:bg-blue-50">
          <RefreshCw class="w-5 h-5"/>
          Try Again
        </BaseButton>
      </div>
    </div>

    <!-- States Grid - Beautiful & Clean Design -->
    <div v-else-if="states.length > 0">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <NuxtLink
            v-for="state in states"
            :key="state.id"
            :to="getStateRoute(state)"
            class="group"
        >
          <BaseCard
              class="relative h-full overflow-hidden bg-white border border-gray-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
          >
            <!-- Subtle top accent line -->
            <div
                class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>

            <!-- Card Content -->
            <div class="relative p-6">
              <!-- Icon -->
              <div class="mb-4">
                <div
                    class="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 group-hover:bg-blue-500 group-hover:border-blue-500 group-hover:scale-110 transition-all duration-300">
                  <MapPin class="w-6 h-6 text-blue-600 group-hover:text-white transition-colors duration-300"/>
                </div>
              </div>

              <!-- State Name -->
              <div class="mb-4">
                <h3 class="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 mb-2 line-clamp-1">
                  {{ state.attributes.name }}
                </h3>

                <!-- Country Badge -->
                <span
                    class="inline-flex items-center px-3 py-1 text-xs font-medium bg-gray-50 border border-gray-200 rounded-full text-gray-700 group-hover:bg-blue-50 group-hover:border-blue-200 group-hover:text-blue-700 transition-all duration-200">
                  {{ state.attributes.country.name }}
                </span>
              </div>

              <!-- Contractors Count -->
              <div class="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
                <div class="flex items-center gap-2">
                  <span
                      class="text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                    {{ state.attributes.companies_count }}
                  </span>
                </div>
                <div class="text-right">
                  <p class="text-xs font-medium text-gray-500 group-hover:text-gray-700 transition-colors">
                    {{ state.attributes.companies_count === 1 ? 'Contractor' : 'Contractors' }}
                  </p>
                  <p class="text-xs text-gray-400">Available</p>
                </div>
              </div>

              <!-- Hover Arrow Indicator -->
              <div class="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div
                    class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center shadow-lg transform group-hover:translate-x-1 transition-transform duration-300">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </div>
              </div>
            </div>
          </BaseCard>
        </NuxtLink>
      </div>
    </div>

    <!-- Empty State - Clean Design -->
    <div v-else class="text-center py-20">
      <div class="max-w-md mx-auto space-y-6">
        <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
          <MapPin class="w-10 h-10 text-gray-400"/>
        </div>
        <div>
          <h2 class="text-2xl font-bold mb-2 text-gray-900">No States Available</h2>
          <p class="text-gray-600">
            There are currently no states in the directory. Please check back later.
          </p>
        </div>
      </div>
    </div>
  </BaseCard>
</template>

