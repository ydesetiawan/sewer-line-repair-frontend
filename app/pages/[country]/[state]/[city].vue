<script setup lang="ts">
import { MapPin, Loader2, AlertCircle, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { useCompanies } from '@/composables/useCompaniesApi'

definePageMeta({
  layout: 'default',
})

const route = useRoute()
const router = useRouter()

const countrySlug = (route.params.country as string) || ''
const stateSlug = (route.params.state as string) || ''
const citySlug = (route.params.city as string) || ''

// Get page from query params
const currentPage = computed(() => {
  const page = route.query.page
  return page ? parseInt(page as string) : 1
})

const perPage = computed(() => {
  const pp = route.query.per_page
  return pp ? parseInt(pp as string) : 20
})

// Fetch companies with pagination
const {
  companies,
  cities,
  pagination,
  loading,
  error,
  fetchCompanies,
  refresh,
  hasNextPage,
  hasPrevPage,
} = useCompanies({
  stateSlug,
  citySlug,
  page: currentPage.value,
  perPage: perPage.value,
  autoFetch: true,
})

// Find current city name from cities list
const currentCity = computed(() => {
  return cities.value.find(c => c.attributes.slug === citySlug)
})

const cityName = computed(() => currentCity.value?.attributes.name || citySlug)
const stateName = computed(() => currentCity.value?.attributes.state.name || stateSlug)
const stateCode = computed(() => currentCity.value?.attributes.state.code || '')

// Sorted cities by company count
const sortedCities = computed(() => {
  return [...cities.value].sort((a, b) =>
    b.attributes.companies_count - a.attributes.companies_count
  )
})

// Watch for route changes to refetch
watch([currentPage, perPage], ([newPage, newPerPage]) => {
  fetchCompanies(newPage, newPerPage)
  // Scroll to top smoothly
  window.scrollTo({ top: 0, behavior: 'smooth' })
})

// Pagination helpers
const totalPages = computed(() => pagination.value?.total_pages || 1)
const totalItems = computed(() => pagination.value?.total_items || 0)

const showingFrom = computed(() => {
  if (totalItems.value === 0) return 0
  return (currentPage.value - 1) * perPage.value + 1
})

const showingTo = computed(() => {
  return Math.min(currentPage.value * perPage.value, totalItems.value)
})

// Navigate to page
const goToPage = (page: number) => {
  if (page < 1 || page > totalPages.value) return
  router.push({
    query: {
      ...route.query,
      page: page.toString()
    }
  })
}

// Change per page
const changePerPage = (newPerPage: number) => {
  router.push({
    query: {
      per_page: newPerPage.toString(),
      page: '1' // Reset to page 1
    }
  })
}

// Navigate to city
const goToCity = (city: any) => {
  router.push(`/${countrySlug}/${stateSlug}/${city.attributes.slug}`)
}

// Page numbers to display
const pageNumbers = computed(() => {
  const pages: (number | string)[] = []
  const total = totalPages.value
  const current = currentPage.value

  if (total <= 7) {
    // Show all pages if 7 or less
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // Always show first page
    pages.push(1)

    if (current > 3) {
      pages.push('...')
    }

    // Show pages around current
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
      pages.push(i)
    }

    if (current < total - 2) {
      pages.push('...')
    }

    // Always show last page
    pages.push(total)
  }

  return pages
})

// SEO Meta
useSeoMeta({
  title: `Plumbing Companies in ${cityName.value}, ${stateName.value} - Local Experts`,
  description: `Find the best plumbing and sewer repair companies in ${cityName.value}, ${stateName.value}. Read reviews and compare services from licensed professionals.`,
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <!-- Breadcrumb -->
    <nav class="mb-8 text-sm text-muted-foreground">
      <ol class="flex items-center gap-2">
        <li><NuxtLink to="/" class="hover:text-foreground">Home</NuxtLink></li>
        <li>/</li>
        <li><NuxtLink to="/browse-all-states" class="hover:text-foreground">States</NuxtLink></li>
        <li>/</li>
        <li>
          <NuxtLink :to="`/${countrySlug}/${stateSlug}`" class="hover:text-foreground">
            {{ stateName }}
          </NuxtLink>
        </li>
        <li>/</li>
        <li class="text-foreground font-medium">{{ cityName }}</li>
      </ol>
    </nav>

    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-4xl md:text-5xl font-bold mb-4">
        Plumbing Companies in {{ cityName }}, {{ stateCode }}
      </h1>
      <p class="text-xl text-muted-foreground">
        {{ totalItems }} verified compan{{ totalItems !== 1 ? 'ies' : 'y' }} available
      </p>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <!-- Cities Sidebar -->
      <aside class="lg:col-span-1">
        <div class="sticky top-4">
          <UiCard class="p-4">
            <h2 class="text-lg font-bold mb-4">Browse by City</h2>
            <div class="space-y-1 max-h-[600px] overflow-y-auto">
              <button
                v-for="city in sortedCities"
                :key="city.id"
                @click="goToCity(city)"
                class="w-full text-left px-3 py-2 rounded-lg hover:bg-accent/10 transition-colors flex items-center justify-between"
                :class="city.attributes.slug === citySlug ? 'bg-accent/20 text-accent font-medium' : 'text-muted-foreground'"
              >
                <span class="truncate">{{ city.attributes.name }}</span>
                <span class="text-xs ml-2 flex-shrink-0">
                  ({{ city.attributes.companies_count }})
                </span>
              </button>
            </div>
          </UiCard>
        </div>
      </aside>

      <!-- Companies List -->
      <div class="lg:col-span-3">
        <!-- Loading State -->
        <div v-if="loading && !companies.length" class="space-y-6">
          <div v-for="i in 6" :key="i" class="animate-pulse">
            <div class="h-64 bg-muted rounded-lg"></div>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-20">
          <div class="max-w-md mx-auto space-y-6">
            <AlertCircle class="w-20 h-20 text-destructive mx-auto" />
            <div>
              <h2 class="text-2xl font-bold mb-2">Failed to load companies</h2>
              <p class="text-muted-foreground">{{ error.message }}</p>
            </div>
            <UiButton @click="refresh" variant="outline" size="lg" class="gap-2">
              <RefreshCw class="w-5 h-5" />
              Try Again
            </UiButton>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="!companies.length" class="text-center py-20">
          <div class="max-w-md mx-auto space-y-4">
            <MapPin class="w-20 h-20 text-muted-foreground/50 mx-auto" />
            <div>
              <h2 class="text-2xl font-bold mb-2">No Companies Found</h2>
              <p class="text-muted-foreground">
                There are currently no companies in {{ cityName }}, {{ stateName }}. Please check back later.
              </p>
            </div>
          </div>
        </div>

        <!-- Companies Grid -->
        <div v-else class="space-y-8">
          <!-- Top Pagination Info -->
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border">
            <p class="text-sm text-muted-foreground">
              Showing <span class="font-medium text-foreground">{{ showingFrom }}-{{ showingTo }}</span>
              of <span class="font-medium text-foreground">{{ totalItems }}</span> companies
            </p>

            <!-- Per Page Selector -->
            <div class="flex items-center gap-2 text-sm">
              <span class="text-muted-foreground">Show:</span>
              <select
                :value="perPage"
                @change="(e) => changePerPage(parseInt((e.target as HTMLSelectElement).value))"
                class="border border-border rounded px-2 py-1 bg-background text-foreground"
              >
                <option :value="10">10</option>
                <option :value="20">20</option>
                <option :value="50">50</option>
                <option :value="100">100</option>
              </select>
            </div>
          </div>

          <!-- Company Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <FeaturesCompanyCard
              v-for="company in companies"
              :key="company.id"
              :company="company"
            />
          </div>

          <!-- Bottom Pagination -->
          <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border">
            <!-- Page Info -->
            <p class="text-sm text-muted-foreground">
              Page {{ currentPage }} of {{ totalPages }}
            </p>

            <!-- Pagination Controls -->
            <div class="flex items-center gap-2">
              <!-- Previous Button -->
              <UiButton
                @click="goToPage(currentPage - 1)"
                :disabled="!hasPrevPage || loading"
                variant="outline"
                size="sm"
                class="gap-2"
              >
                <ChevronLeft class="w-4 h-4" />
                Previous
              </UiButton>

              <!-- Page Numbers -->
              <div class="hidden sm:flex items-center gap-1">
                <button
                  v-for="(page, index) in pageNumbers"
                  :key="index"
                  @click="typeof page === 'number' ? goToPage(page) : null"
                  :disabled="typeof page !== 'number' || page === currentPage || loading"
                  class="min-w-[40px] h-10 px-3 rounded-lg text-sm font-medium transition-colors"
                  :class="
                    typeof page === 'number'
                      ? page === currentPage
                        ? 'bg-accent text-accent-foreground'
                        : 'hover:bg-accent/10 text-foreground'
                      : 'cursor-default text-muted-foreground'
                  "
                >
                  {{ page }}
                </button>
              </div>

              <!-- Next Button -->
              <UiButton
                @click="goToPage(currentPage + 1)"
                :disabled="!hasNextPage || loading"
                variant="outline"
                size="sm"
                class="gap-2"
              >
                Next
                <ChevronRight class="w-4 h-4" />
              </UiButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

