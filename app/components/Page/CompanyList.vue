<script setup lang="ts">
import { MapPin, Loader2, AlertCircle, RefreshCw, ChevronDown, Search, X, CheckCircle } from 'lucide-vue-next'
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
  <div class="min-h-screen">
    <!-- Loading State -->
    <div v-if="loading" class="py-20">
      <div class="text-center space-y-4">
        <Loader2 class="w-16 h-16 text-accent animate-spin mx-auto" />
        <p class="text-lg text-muted-foreground">Loading contractors...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-20">
      <div class="max-w-md mx-auto space-y-6">
        <AlertCircle class="w-20 h-20 text-destructive mx-auto" />
        <div>
          <h2 class="text-2xl font-bold mb-2">Failed to load contractors</h2>
          <p class="text-muted-foreground">{{ error.message }}</p>
        </div>
        <BaseButton @click="fetchData" variant="default" class="gap-2">
          <RefreshCw class="w-5 h-5" />
          Try Again
        </BaseButton>
      </div>
    </div>

    <!-- Content -->
    <div v-else class="space-y-8">
      <!-- Hero Header Section -->
      <BaseCard class="overflow-hidden">
        <div class="relative bg-gradient-to-br from-accent/10 via-accent/5 to-transparent p-8 md:p-12">
          <!-- Decorative Background -->
          <div class="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full -translate-y-32 translate-x-32 blur-3xl"></div>

          <div class="relative">
            <div class="max-w-4xl">
              <h1 class="text-4xl md:text-5xl font-bold mb-4">
                Sewer Repair Contractors in {{ displayLocationName }}
              </h1>
              <p class="text-xl text-muted-foreground mb-6">
                Connect with trusted, verified professionals for all your sewer repair needs
              </p>

              <!-- Stats Bar -->
              <div class="flex flex-wrap gap-4">
                <div class="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur rounded-xl shadow-sm border border-gray-200">
                  <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span class="font-semibold">{{ totalCompanies }}</span>
                  <span class="text-muted-foreground">Verified Contractors</span>
                </div>
                <div v-if="cities.length > 0" class="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur rounded-xl shadow-sm border border-gray-200">
                  <MapPin class="w-4 h-4 text-accent" />
                  <span class="font-semibold">{{ cities.length }}</span>
                  <span class="text-muted-foreground">{{ cities.length === 1 ? 'City' : 'Cities' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </BaseCard>

      <!-- Search Section - Clean & Modern -->
      <BaseCard class="p-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-center">
            <Search class="w-5 h-5 text-blue-600" />
          </div>
          <h2 class="text-xl font-bold text-gray-900">Find Your Perfect Contractor</h2>
        </div>

        <div class="relative">
          <input
            id="company-search"
            v-model="searchQuery"
            @input="handleSearch"
            type="text"
            placeholder="Search by contractor name (e.g., 'ABC Plumbing', 'Elite Sewer')..."
            class="w-full pl-12 pr-12 h-14 text-base bg-white border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 outline-none"
          />
          <div class="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <div class="w-8 h-8 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-center">
              <Search class="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <div class="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
            <Loader2 v-if="isSearching" class="w-5 h-5 text-blue-600 animate-spin" />
            <button
              v-if="searchQuery"
              @click="clearSearch"
              type="button"
              class="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 transition-all duration-200"
              aria-label="Clear search"
            >
              <X class="w-4 h-4" />
            </button>
          </div>
        </div>

        <div v-if="searchQuery" class="flex items-center gap-3 mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center shadow-sm">
            <Search class="w-5 h-5 text-white" />
          </div>
          <p class="text-sm font-medium text-gray-900">
            Searching for "<span class="font-semibold text-blue-600">{{ searchQuery }}</span>"
          </p>
        </div>
      </BaseCard>

      <!-- Cities Grid Section -->
      <div v-if="cities.length > 0 && !searchQuery">
        <BaseCard class="p-6">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center shadow-sm">
              <MapPin class="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 class="text-2xl font-bold text-gray-900">Browse by City</h2>
              <p class="text-sm text-gray-600">Select a city to view contractors in that area</p>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <PageCityCard
              v-for="city in sortedCities"
              :key="city.id"
              :city="city"
              :country-slug="countrySlug"
              :state-slug="stateSlug"
            />
          </div>
        </BaseCard>
      </div>

      <!-- No Contractors Message -->
      <div v-if="!companies.length && !searchQuery && !loading" class="text-center">
        <BaseCard class="p-12">
          <div class="max-w-md mx-auto space-y-4">
            <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              <MapPin class="w-10 h-10 text-gray-400"/>
            </div>
            <div>
              <h2 class="text-2xl font-bold mb-2">No Contractors Found</h2>
              <p class="text-muted-foreground">
                There are currently no contractors available in {{ displayLocationName }}. Please check back later.
              </p>
            </div>
          </div>
        </BaseCard>
      </div>

      <!-- Company Cards Section -->
      <div v-if="companies.length > 0 || searchQuery">
        <BaseCard class="p-6">
          <!-- Section Header -->
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6">
            <div>
              <h2 class="text-2xl font-bold mb-1">
                {{ searchQuery ? 'Search Results' : 'Available Contractors' }}
              </h2>
              <p v-if="searchQuery && companies.length > 0" class="text-sm text-muted-foreground">
                Found <span class="font-semibold text-accent">{{ totalCompanies }}</span> result{{ totalCompanies !== 1 ? 's' : '' }} for "{{ searchQuery }}"
              </p>
              <p v-else class="text-sm text-muted-foreground">
                Showing {{ loadedCount }} of {{ totalCompanies }} contractors in {{ displayLocationName }}
              </p>
            </div>

            <!-- Results Counter -->
            <div class="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-lg">
              <div class="w-2 h-2 bg-accent rounded-full"></div>
              <span class="text-sm font-medium">
                {{ loadedCount }} / {{ totalCompanies }}
              </span>
            </div>
          </div>

          <!-- No Search Results -->
          <div v-if="!loading && companies.length === 0 && searchQuery" class="text-center py-16">
            <div class="max-w-md mx-auto space-y-6">
              <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                <Search class="w-10 h-10 text-gray-400" />
              </div>
              <div>
                <h3 class="text-2xl font-bold mb-2">No Results Found</h3>
                <p class="text-muted-foreground mb-6">
                  We couldn't find any contractors matching "<span class="font-semibold text-foreground">{{ searchQuery }}</span>" in {{ displayLocationName }}.
                </p>
                <BaseButton @click="clearSearch" variant="default" size="lg" class="gap-2">
                  <X class="w-4 h-4" />
                  Clear Search
                </BaseButton>
              </div>
            </div>
          </div>

          <!-- Company Cards Grid -->
          <div v-else class="space-y-4">
            <PageCompanyCard
              v-for="company in companies"
              :key="company.id"
              :company="company"
            />
          </div>

          <!-- Load More Section -->
          <div v-if="hasMorePages" class="mt-8 pt-8 border-t">
            <div class="text-center space-y-4">
              <p class="text-sm text-muted-foreground">
                <span class="font-semibold text-foreground">{{ remainingCount }}</span> more contractor{{ remainingCount !== 1 ? 's' : '' }} available
              </p>
              <BaseButton
                @click="loadMore"
                :disabled="loadingMore"
                variant="outline"
                size="lg"
                class="gap-2 min-w-[250px] group"
              >
                <Loader2 v-if="loadingMore" class="w-5 h-5 animate-spin" />
                <ChevronDown v-else class="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                {{ loadingMore ? 'Loading More...' : `Load More Contractors` }}
              </BaseButton>
            </div>
          </div>

          <!-- All Loaded Message -->
          <div v-else-if="companies.length > 0 && !searchQuery" class="mt-8 pt-8 border-t">
            <div class="text-center">
              <div class="inline-flex items-center gap-2 px-6 py-3 bg-green-50 border-2 border-green-200 rounded-xl">
                <CheckCircle class="w-5 h-5 text-green-600" />
                <span class="font-medium text-green-900">
                  All {{ totalCompanies }} contractors loaded
                </span>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>
  </div>
</template>

