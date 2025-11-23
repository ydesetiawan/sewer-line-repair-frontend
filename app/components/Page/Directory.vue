<script setup lang="ts">
import { MapPin, Loader2, AlertCircle, RefreshCw, ChevronDown, Search, X, CheckCircle, Star, Phone, ShieldCheck, Filter, SlidersHorizontal } from 'lucide-vue-next'
import type { ICompany } from '@/types/company'
import type { ICity } from '@/types/city'

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

// Filter state
const showFilters = ref(false)
const filters = ref({
  city: '',
  state: '',
  country: '',
  service_category: '',
  verified_only: false,
  min_rating: '',
  sort: 'name'
})

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
    // Build params object with all filters
    const params: Record<string, any> = {
      page: page,
      per_page: 20,
      company_name: searchQuery.value || null,
      city: filters.value.city || null,
      state: filters.value.state || null,
      country: filters.value.country || null,
      service_category: filters.value.service_category || null,
      verified_only: filters.value.verified_only ? 'true' : null,
      min_rating: filters.value.min_rating || null,
      sort: filters.value.sort || 'name'
    }

    // Remove null values
    Object.keys(params).forEach(key => {
      if (params[key] === null) {
        delete params[key]
      }
    })

    const response = await ($publicApi as any)(
        `/api/v1/companies/search`,
        { params }
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
 * Apply filters and refresh results
 */
const applyFilters = () => {
  currentPage.value = 1
  showFilters.value = false
  fetchData(1, false)
}

/**
 * Clear all filters
 */
const clearFilters = () => {
  filters.value = {
    city: '',
    state: '',
    country: '',
    service_category: '',
    verified_only: false,
    min_rating: '',
    sort: 'name'
  }
  currentPage.value = 1
  fetchData(1, false)
}

/**
 * Clear all filters and search
 */
const clearAll = () => {
  searchQuery.value = ''
  clearFilters()
}

/**
 * Toggle filter panel
 */
const toggleFilters = () => {
  showFilters.value = !showFilters.value
}

/**
 * Count active filters
 */
const activeFiltersCount = computed(() => {
  let count = 0
  if (filters.value.city) count++
  if (filters.value.state) count++
  if (filters.value.country) count++
  if (filters.value.service_category) count++
  if (filters.value.verified_only) count++
  if (filters.value.min_rating) count++
  if (filters.value.sort !== 'name') count++
  return count
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
          <div class="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full translate-y-32 -translate-x-32 blur-3xl"></div>

          <div class="relative">
            <!-- Main Hero Content -->
            <div class="max-w-4xl mb-4">
              <div class="inline-flex items-center gap-2 px-4 py-2 bg-accent/20 rounded-full mb-6">
                <div class="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                <span class="text-sm font-medium">{{ totalCompanies }} Verified Contractors</span>
              </div>

              <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                Find Trusted Sewer Repair Contractors
              </h1>
              <p class="text-xl text-muted-foreground mb-8 max-w-2xl">
                Connect with verified, licensed professionals for all your sewer repair needs. Quality service guaranteed.
              </p>
            </div>

            <!-- Features Grid -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-2">
              <!-- Feature 1: Easy Search -->
              <div class="group relative bg-background/50 backdrop-blur-sm border border-border/50 rounded-lg p-3 hover:bg-background hover:border-accent/50 hover:shadow-md transition-all duration-300">
                <div class="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div class="relative flex items-start gap-2">
                  <div class="w-8 h-8 bg-blue-50 border border-blue-100 rounded-md flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Search class="w-4 h-4 text-blue-600" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <h3 class="font-semibold text-xs mb-0.5 truncate">Easy Search</h3>
                    <p class="text-[10px] leading-tight text-muted-foreground line-clamp-2">
                      Find contractors by location
                    </p>
                  </div>
                </div>
              </div>

              <!-- Feature 2: Verified Reviews -->
              <div class="group relative bg-background/50 backdrop-blur-sm border border-border/50 rounded-lg p-3 hover:bg-background hover:border-accent/50 hover:shadow-md transition-all duration-300">
                <div class="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div class="relative flex items-start gap-2">
                  <div class="w-8 h-8 bg-amber-50 border border-amber-100 rounded-md flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Star class="w-4 h-4 text-amber-600 fill-amber-600" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <h3 class="font-semibold text-xs mb-0.5 truncate">Verified Reviews</h3>
                    <p class="text-[10px] leading-tight text-muted-foreground line-clamp-2">
                      Real customer feedback
                    </p>
                  </div>
                </div>
              </div>

              <!-- Feature 3: Direct Contact -->
              <div class="group relative bg-background/50 backdrop-blur-sm border border-border/50 rounded-lg p-3 hover:bg-background hover:border-accent/50 hover:shadow-md transition-all duration-300">
                <div class="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div class="relative flex items-start gap-2">
                  <div class="w-8 h-8 bg-green-50 border border-green-100 rounded-md flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Phone class="w-4 h-4 text-green-600" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <h3 class="font-semibold text-xs mb-0.5 truncate">Direct Contact</h3>
                    <p class="text-[10px] leading-tight text-muted-foreground line-clamp-2">
                      Connect for quotes
                    </p>
                  </div>
                </div>
              </div>

              <!-- Feature 4: Licensed & Insured -->
              <div class="group relative bg-background/50 backdrop-blur-sm border border-border/50 rounded-lg p-3 hover:bg-background hover:border-accent/50 hover:shadow-md transition-all duration-300">
                <div class="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div class="relative flex items-start gap-2">
                  <div class="w-8 h-8 bg-emerald-50 border border-emerald-100 rounded-md flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <ShieldCheck class="w-4 h-4 text-emerald-600" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <h3 class="font-semibold text-xs mb-0.5 truncate">Licensed & Insured</h3>
                    <p class="text-[10px] leading-tight text-muted-foreground line-clamp-2">
                      Verified contractors
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </BaseCard>

      <!-- Search & Filters Combined Section -->
      <BaseCard class="p-6">
        <!-- Header with Search -->
        <div class="space-y-6">
          <!-- Title Section -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                <Search class="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 class="text-xl font-bold text-gray-900">Search & Filter Contractors</h2>
                <p class="text-xs text-muted-foreground">Find the perfect professional for your needs</p>
              </div>
            </div>

            <!-- Active Filters Badge -->
            <div v-if="activeFiltersCount > 0" class="flex items-center gap-2 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium">
              <Filter class="w-4 h-4" />
              {{ activeFiltersCount }} active
            </div>
          </div>

          <!-- Search Bar -->
          <div class="relative">
            <input
                id="company-search"
                v-model="searchQuery"
                @input="handleSearch"
                type="text"
                placeholder="Search by contractor name (e.g., 'ABC Plumbing', 'Elite Sewer')..."
                class="w-full pl-12 pr-12 h-12 text-sm bg-white border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 outline-none"
            />
            <div class="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <Search class="w-4 h-4 text-gray-400" />
            </div>
            <div class="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
              <Loader2 v-if="isSearching" class="w-4 h-4 text-blue-600 animate-spin" />
              <button
                  v-if="searchQuery"
                  @click="clearSearch"
                  type="button"
                  class="w-6 h-6 flex items-center justify-center rounded-md bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 transition-all duration-200"
                  aria-label="Clear search"
              >
                <X class="w-3 h-3" />
              </button>
            </div>
          </div>

          <!-- Search Query Display -->
          <div v-if="searchQuery" class="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <Search class="w-4 h-4 text-blue-600" />
            <p class="text-sm font-medium text-gray-900">
              Searching for: <span class="font-semibold text-blue-600">{{ searchQuery }}</span>
            </p>
          </div>

          <!-- Filters Toggle & Actions -->
          <div class="flex items-center justify-between pt-2 border-t">
            <BaseButton
                @click="toggleFilters"
                variant="ghost"
                size="sm"
                class="gap-2"
            >
              <SlidersHorizontal class="w-4 h-4" />
              {{ showFilters ? 'Hide' : 'Show' }} Advanced Filters
            </BaseButton>

            <div v-if="activeFiltersCount > 0 || searchQuery" class="flex items-center gap-2">
              <BaseButton
                  @click="clearAll"
                  variant="ghost"
                  size="sm"
                  class="gap-2 text-muted-foreground hover:text-destructive"
              >
                <X class="w-4 h-4" />
                Clear All
              </BaseButton>
            </div>
          </div>
        </div>

        <!-- Filter Panel (Collapsible) -->
        <div
            v-show="showFilters"
            class="pt-6 mt-6 border-t space-y-6 animate-in fade-in duration-200"
        >
          <!-- Filters Grid -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Left Column: Location & Service -->
            <div class="space-y-6">
              <!-- Location Filters -->
              <div class="space-y-3">
                <h3 class="font-semibold text-sm flex items-center gap-2 text-gray-900">
                  <div class="w-6 h-6 bg-blue-50 rounded-md flex items-center justify-center">
                    <MapPin class="w-3.5 h-3.5 text-blue-600" />
                  </div>
                  Location
                </h3>
                <div class="space-y-3 pl-8">
                  <!-- City -->
                  <div>
                    <label for="filter-city" class="block text-xs font-medium text-gray-700 mb-1.5">
                      City
                    </label>
                    <input
                        id="filter-city"
                        v-model="filters.city"
                        type="text"
                        placeholder="e.g., Austin, Houston..."
                        class="w-full px-3 py-2 text-sm bg-white border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg outline-none transition-all"
                    />
                  </div>

                  <!-- State -->
                  <div>
                    <label for="filter-state" class="block text-xs font-medium text-gray-700 mb-1.5">
                      State
                    </label>
                    <input
                        id="filter-state"
                        v-model="filters.state"
                        type="text"
                        placeholder="e.g., Texas, TX..."
                        class="w-full px-3 py-2 text-sm bg-white border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg outline-none transition-all"
                    />
                  </div>

                  <!-- Country -->
                  <div>
                    <label for="filter-country" class="block text-xs font-medium text-gray-700 mb-1.5">
                      Country
                    </label>
                    <input
                        id="filter-country"
                        v-model="filters.country"
                        type="text"
                        placeholder="e.g., United States, US..."
                        class="w-full px-3 py-2 text-sm bg-white border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <!-- Service Category -->
              <div class="space-y-3">
                <h3 class="font-semibold text-sm flex items-center gap-2 text-gray-900">
                  <div class="w-6 h-6 bg-purple-50 rounded-md flex items-center justify-center">
                    <Star class="w-3.5 h-3.5 text-purple-600" />
                  </div>
                  Service
                </h3>
                <div class="pl-8">
                  <label for="filter-service" class="block text-xs font-medium text-gray-700 mb-1.5">
                    Category
                  </label>
                  <select
                      id="filter-service"
                      v-model="filters.service_category"
                      class="w-full px-3 py-2 text-sm bg-white border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg outline-none transition-all"
                  >
                    <option value="">All Services</option>
                    <option value="sewer-line-repair">Sewer Line Repair</option>
                    <option value="drain-cleaning">Drain Cleaning</option>
                    <option value="pipe-replacement">Pipe Replacement</option>
                    <option value="septic-services">Septic Services</option>
                    <option value="emergency-services">Emergency Services</option>
                    <option value="water-line-repair">Water Line Repair</option>
                    <option value="camera-inspection">Camera Inspection</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Right Column: Quality & Sort -->
            <div class="space-y-6">
              <!-- Quality Filters -->
              <div class="space-y-3">
                <h3 class="font-semibold text-sm flex items-center gap-2 text-gray-900">
                  <div class="w-6 h-6 bg-amber-50 rounded-md flex items-center justify-center">
                    <Star class="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
                  </div>
                  Quality
                </h3>
                <div class="space-y-3 pl-8">
                  <!-- Rating -->
                  <div>
                    <label for="filter-rating" class="block text-xs font-medium text-gray-700 mb-1.5">
                      Minimum Rating
                    </label>
                    <select
                        id="filter-rating"
                        v-model="filters.min_rating"
                        class="w-full px-3 py-2 text-sm bg-white border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg outline-none transition-all"
                    >
                      <option value="">Any Rating</option>
                      <option value="4.5">4.5+ Stars</option>
                      <option value="4.0">4.0+ Stars</option>
                      <option value="3.5">3.5+ Stars</option>
                      <option value="3.0">3.0+ Stars</option>
                    </select>
                  </div>

                  <!-- Verified Only -->
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1.5">
                      Verification
                    </label>
                    <label class="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                          v-model="filters.verified_only"
                          type="checkbox"
                          class="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <div class="flex items-center gap-2">
                        <ShieldCheck class="w-4 h-4 text-emerald-600" />
                        <span class="text-sm font-medium">Verified Only</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <!-- Sorting -->
              <div class="space-y-3">
                <h3 class="font-semibold text-sm flex items-center gap-2 text-gray-900">
                  <div class="w-6 h-6 bg-gray-100 rounded-md flex items-center justify-center">
                    <SlidersHorizontal class="w-3.5 h-3.5 text-gray-600" />
                  </div>
                  Sort
                </h3>
                <div class="pl-8">
                  <label for="filter-sort" class="block text-xs font-medium text-gray-700 mb-1.5">
                    Order By
                  </label>
                  <select
                      id="filter-sort"
                      v-model="filters.sort"
                      class="w-full px-3 py-2 text-sm bg-white border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg outline-none transition-all"
                  >
                    <option value="name">Name (A-Z)</option>
                    <option value="-name">Name (Z-A)</option>
                    <option value="-rating">Rating (High to Low)</option>
                    <option value="rating">Rating (Low to High)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Filter Actions -->
          <div class="flex items-center justify-end gap-2 pt-4 border-t">
            <BaseButton
                @click="clearFilters"
                variant="ghost"
                size="sm"
                class="gap-2"
            >
              <X class="w-4 h-4" />
              Reset
            </BaseButton>
            <BaseButton
                @click="applyFilters"
                variant="default"
                size="sm"
                class="gap-2"
            >
              <Filter class="w-4 h-4" />
              Apply Filters
            </BaseButton>
          </div>
        </div>

        <!-- Active Filters Display (when collapsed) -->
        <div v-if="!showFilters && activeFiltersCount > 0" class="mt-4 flex flex-wrap gap-2">
          <div v-if="filters.city" class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-xs font-medium">
            <MapPin class="w-3 h-3" />
            City: {{ filters.city }}
            <button @click="filters.city = ''; applyFilters()" class="ml-1 hover:text-blue-900">
              <X class="w-3 h-3" />
            </button>
          </div>
          <div v-if="filters.state" class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-xs font-medium">
            <MapPin class="w-3 h-3" />
            State: {{ filters.state }}
            <button @click="filters.state = ''; applyFilters()" class="ml-1 hover:text-blue-900">
              <X class="w-3 h-3" />
            </button>
          </div>
          <div v-if="filters.country" class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-xs font-medium">
            <MapPin class="w-3 h-3" />
            Country: {{ filters.country }}
            <button @click="filters.country = ''; applyFilters()" class="ml-1 hover:text-blue-900">
              <X class="w-3 h-3" />
            </button>
          </div>
          <div v-if="filters.service_category" class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 border border-purple-200 text-purple-700 rounded-lg text-xs font-medium">
            Service: {{ filters.service_category }}
            <button @click="filters.service_category = ''; applyFilters()" class="ml-1 hover:text-purple-900">
              <X class="w-3 h-3" />
            </button>
          </div>
          <div v-if="filters.min_rating" class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg text-xs font-medium">
            <Star class="w-3 h-3 fill-amber-700" />
            Min {{ filters.min_rating }}+
            <button @click="filters.min_rating = ''; applyFilters()" class="ml-1 hover:text-amber-900">
              <X class="w-3 h-3" />
            </button>
          </div>
          <div v-if="filters.verified_only" class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-xs font-medium">
            <ShieldCheck class="w-3 h-3" />
            Verified Only
            <button @click="filters.verified_only = false; applyFilters()" class="ml-1 hover:text-emerald-900">
              <X class="w-3 h-3" />
            </button>
          </div>
          <div v-if="filters.sort !== 'name'" class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 border border-gray-200 text-gray-700 rounded-lg text-xs font-medium">
            Sort: {{ filters.sort }}
            <button @click="filters.sort = 'name'; applyFilters()" class="ml-1 hover:text-gray-900">
              <X class="w-3 h-3" />
            </button>
          </div>
        </div>
      </BaseCard>

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
                There are currently no contractors available. Please check back later.
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
                Showing {{ loadedCount }} of {{ totalCompanies }} contractors
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
                  We couldn't find any contractors matching "<span class="font-semibold text-foreground">{{ searchQuery }}</span>".
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

