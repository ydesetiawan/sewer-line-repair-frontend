<script setup lang="ts">
import { MapPin, Loader2, AlertCircle, RefreshCw, ChevronDown } from 'lucide-vue-next'
import type { ICompany } from '@/types/company'
import type { ICity } from '@/types/city'

interface Props {
  stateSlug: string
  countrySlug: string
  stateName: string
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
  }
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
const displayStateName = computed(() => {
  const firstCity = cities.value[0]
  if (firstCity) {
    return firstCity.attributes.state.name
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

    <!-- Empty State -->
    <div v-else-if="!cities.length" class="text-center py-20">
      <div class="max-w-md mx-auto space-y-4">
        <MapPin class="w-20 h-20 text-muted-foreground/50 mx-auto" />
        <div>
          <h2 class="text-2xl font-bold mb-2">No Cities Found</h2>
          <p class="text-muted-foreground">
            There are currently no cities available in {{ displayStateName }}. Please check back later.
          </p>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div v-else>
      <!-- Header -->
      <div class="mb-12">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">
          Sewer Repair Contractors in {{ displayStateName }}
        </h1>
        <p class="text-xl text-muted-foreground">
          Browse {{ totalCompanies }} verified contractor{{ totalCompanies !== 1 ? 's' : '' }}
          across {{ cities.length }} cit{{ cities.length !== 1 ? 'ies' : 'y' }}
        </p>
      </div>

      <!-- Cities Grid -->
      <div class="mb-12">
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

      <!-- Company Cards -->
      <div class="mb-12">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold">All Contractors in {{ displayStateName }}</h2>
          <p class="text-sm text-muted-foreground">
            Showing {{ loadedCount }} of {{ totalCompanies }} companies
          </p>
        </div>

        <div class="space-y-6">
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
            All {{ totalCompanies }} companies loaded
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

