<script setup lang="ts">
import { MapPin, Loader2, AlertCircle, RefreshCw, ChevronDown, Search, X } from 'lucide-vue-next'
import type { ICompany } from '@/types/company'
import type { ICity } from '@/types/city'

interface Props {
  stateSlug: string
  countrySlug: string
  stateName: string
  citySlug?: string | null
  cityName?: string | null
}

const props = defineProps<Props>()

// Reactive state
const companies = ref<ICompany[]>([])
const cities = ref<ICity[]>([])
const pagination = ref<IMetaPagination | null>(null)
const loading = ref(false)
const loadingMore = ref(false)
const error = ref<Error | null>(null)
const currentPage = ref(1)
const searchQuery = ref('')
const isSearching = ref(false)

const { $publicApi } = useNuxtApp()

/**
 * Fetch companies and cities data from API
 * @param page - Page number to fetch
 * @param append - Whether to append results or replace
 */
const fetchData = async (page = 1, append = false) => {
  if (append) {
    loadingMore.value = true
  } else {
    loading.value = true
  }
  error.value = null

  try {
    const response = await ($publicApi as any)(
      `/api/v1/states/${props.stateSlug}/companies`,
      {
        params: {
          page: page,
          per_page: 20,
          city: props.citySlug || null,
          company_name: searchQuery.value || null,
        },
      }
    ) as ISlrApiResponse<ICompany[]> & {
      meta?: {
        cities?: {
          data: ICity[]
        }
        pagination?: IMetaPagination
      }
    }

    if (append) {
      // Append new companies to existing list
      companies.value = [...companies.value, ...(response.data || [])]
    } else {
      // Replace companies list
      companies.value = response.data || []
      cities.value = response.meta?.cities?.data || []
    }

    pagination.value = response.meta?.pagination || null
    currentPage.value = page
  } catch (err) {
    error.value = err instanceof Error ? err : new Error('Failed to fetch data')
    if (!append) {
      companies.value = []
      cities.value = []
      pagination.value = null
    }
    console.error('Error fetching state data:', err)
  } finally {
    loading.value = false
    loadingMore.value = false
    isSearching.value = false
  }
}

/**
 * Handle search input with debouncing
 */
let searchTimeout: ReturnType<typeof setTimeout> | null = null
const handleSearch = () => {
  isSearching.value = true

  // Clear existing timeout
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }

  // Debounce search by 500ms
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    fetchData(1, false)
  }, 500)
}

/**
 * Clear search and reset results
 */
const clearSearch = () => {
  searchQuery.value = ''
  currentPage.value = 1
  fetchData(1, false)
}

/**
 * Load more companies (next page)
 */
const loadMore = async () => {
  if (!hasMorePages.value || loadingMore.value) return
  await fetchData(currentPage.value + 1, true)
}

/**
 * Get state name from first city or format from slug
 */
const displayLocationName = computed(() => {
  if (props.cityName) {
    return props.cityName
  }
  return props.stateName
})

/**
 * Sort cities by companies count (descending)
 */
const sortedCities = computed(() => {
  return [...cities.value].sort((a, b) =>
    b.attributes.companies_count - a.attributes.companies_count
  )
})

/**
 * Total companies count from pagination
 */
const totalCompanies = computed(() => pagination.value?.total_items || 0)

/**
 * Check if there are more pages to load
 */
const hasMorePages = computed(() => {
  if (!pagination.value) return false
  return pagination.value.next_page !== null
})

/**
 * Currently loaded companies count
 */
const loadedCount = computed(() => companies.value.length)

/**
 * Remaining companies count
 */
const remainingCount = computed(() => {
  return Math.max(0, totalCompanies.value - loadedCount.value)
})

// Fetch data on mount
onMounted(() => {
  fetchData()
})
</script>

<template>
  <div>
    <!-- Loading State -->
    <div v-if="loading" class="py-20">
      <div class="text-center space-y-4">
        <Loader2 class="w-16 h-16 text-accent animate-spin mx-auto" />
        <p class="text-lg text-muted-foreground">Loading cities...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-20">
      <div class="max-w-md mx-auto space-y-6">
        <AlertCircle class="w-20 h-20 text-destructive mx-auto" />
        <div>
          <h2 class="text-2xl font-bold mb-2">Failed to load state data</h2>
          <p class="text-muted-foreground">{{ error.message }}</p>
        </div>
        <BaseButton @click="fetchData" variant="outline" size="lg" class="gap-2">
          <RefreshCw class="w-5 h-5" />
          Try Again
        </BaseButton>
      </div>
    </div>

    <!-- Content -->
    <div>
      <!-- Header -->
      <div class="mb-12">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">
          Sewer Repair Contractors in {{ displayLocationName }}
        </h1>
        <p class="text-xl text-muted-foreground">
          <span v-if="!cities.length" class="text-xl text-muted-foreground">
            Browse {{ totalCompanies }} verified contractor{{ totalCompanies !== 1 ? 's' : '' }}
            then, will connecting you with trusted sewer repair professionals.
          </span>
          <span v-else class="text-xl text-muted-foreground">
            Connecting you with trusted sewer repair professionals.
          </span>
        </p>
      </div>

      <!-- Cities Grid -->
      <div class="mb-12" v-if="cities.length > 0">
        <h2 class="text-2xl font-bold mb-6">Browse by City</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <PageCityCard
              v-for="city in sortedCities"
              :key="city.id"
              :city="city"
              :country-slug="countrySlug"
              :state-slug="stateSlug"
          />
        </div>
      </div>

      <!-- Search Bar -->
      <div class="mb-8">
        <p v-if="cities.length > 0" class="text-xl text-muted-foreground">
          Browse {{ totalCompanies }} verified contractor{{ totalCompanies !== 1 ? 's' : '' }}
          <span v-if="cities.length > 0">across {{ cities.length }} cit{{ cities.length !== 1 ? 'ies' : 'y' }}</span>
        </p>
        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search class="w-5 h-5 text-muted-foreground" />
            </div>
            <input
              id="company-search"
              v-model="searchQuery"
              @input="handleSearch"
              type="text"
              placeholder="Search by contractor name..."
              class="w-full pl-10 pr-10 py-3 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
            />
            <div class="absolute inset-y-0 right-0 pr-3 flex items-center gap-2">
              <Loader2 v-if="isSearching" class="w-5 h-5 text-muted-foreground animate-spin" />
              <button
                v-if="searchQuery"
                @click="clearSearch"
                type="button"
                class="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Clear search"
              >
                <X class="w-5 h-5" />
              </button>
            </div>
          </div>
          <p v-if="searchQuery" class="mt-2 text-sm text-muted-foreground">
            Searching for "{{ searchQuery }}"...
          </p>
        </div>
      </div>

      <div v-if="!companies.length" class="text-center py-20">
        <div class="max-w-md mx-auto space-y-4">
          <MapPin class="w-20 h-20 text-muted-foreground/50 mx-auto"/>
          <div>
            <h2 class="text-2xl font-bold mb-2">No Contractors Found</h2>
            <p class="text-muted-foreground">
              There are currently no companies available in {{ displayLocationName }}. Please check back later.
            </p>
          </div>
        </div>
      </div>

      <!-- Company Cards -->
      <div class="mb-12">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-2xl font-bold">
              {{ searchQuery ? 'Search Results' : `All Contractors in ${displayLocationName}` }}
            </h2>
            <p v-if="searchQuery && companies.length > 0" class="text-sm text-muted-foreground mt-1">
              Found {{ totalCompanies }} result{{ totalCompanies !== 1 ? 's' : '' }} for "{{ searchQuery }}"
            </p>
          </div>
          <p class="text-sm text-muted-foreground">
            Showing {{ loadedCount }} of {{ totalCompanies }} contractors
          </p>
        </div>

        <!-- No Results Message -->
        <div v-if="!loading && companies.length === 0 && searchQuery" class="text-center py-12">
          <div class="max-w-md mx-auto space-y-4">
            <Search class="w-16 h-16 text-muted-foreground/50 mx-auto" />
            <div>
              <h3 class="text-xl font-semibold mb-2">No Results Found</h3>
              <p class="text-muted-foreground mb-4">
                We couldn't find any contractors matching "{{ searchQuery }}" in {{ displayLocationName }}.
              </p>
              <BaseButton @click="clearSearch" variant="outline" size="default" class="gap-2">
                <X class="w-4 h-4" />
                Clear Search
              </BaseButton>
            </div>
          </div>
        </div>

        <div v-else class="space-y-6">
          <PageCompanyCard
            v-for="company in companies"
            :key="company.id"
            :company="company"
          />
        </div>

        <!-- Load More Button -->
        <div v-if="hasMorePages" class="mt-8 text-center">
          <BaseButton
            @click="loadMore"
            :disabled="loadingMore"
            variant="outline"
            size="lg"
            class="gap-2 min-w-[200px]"
          >
            <Loader2 v-if="loadingMore" class="w-5 h-5 animate-spin" />
            <ChevronDown v-else class="w-5 h-5" />
            {{ loadingMore ? 'Loading...' : `Load More (${remainingCount} remaining)` }}
          </BaseButton>
        </div>

        <!-- All Loaded Message -->
        <div v-else-if="companies.length > 0" class="mt-8 text-center">
          <p class="text-sm text-muted-foreground">
            All {{ totalCompanies }} Contractors loaded
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

