<script setup lang="ts">
import { MapPin, Loader2, AlertCircle, RefreshCw } from 'lucide-vue-next'
import { useCompanies } from '@/composables/useCompaniesApi'
import {
  getSlug
} from '@/composables/useContractors'

definePageMeta({
  layout: 'default',
})

const route = useRoute()
const stateSlug = route.params.state as string
const countrySlug = route.params.country as string

const state = STATES.find((s) => getSlug(s) === stateSlug)
const country = countrySlug.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) // "United States"

if (!state) {
  throw createError({
    statusCode: 404,
    statusMessage: 'State not found',
  })
}

if (!country) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Country not found',
  })
}

// Fetch companies to get cities list (we just need the meta data)
const {
  companies,
  cities,
  pagination,
  loading,
  error,
  refresh,
} = useCompanies({
  stateSlug,
  page: 1,
  perPage: 1, // We only need 1 to get the cities meta
  autoFetch: true,
})

// Get state name from first city (if available)
const stateName = computed(() => {
  const firstCity = cities.value[0]
  if (firstCity) {
    return firstCity.attributes.state.name
  }
  return stateSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
})


// Sort cities by companies count
const sortedCities = computed(() => {
  return [...cities.value].sort((a, b) =>
    b.attributes.companies_count - a.attributes.companies_count
  )
})

// Total companies count
const totalCompanies = computed(() => pagination.value?.total_items || 0)

useSeoMeta({
  title: `Sewer Repair Contractors in ${state} - Find Local Experts`,
  description: `Find licensed and trusted plumbing and sewer repair companies in ${stateName.value}. Browse ${totalCompanies.value} verified professionals across all cities.`,
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <nav class="mb-8 text-sm text-muted-foreground">
      <ol class="flex items-center gap-2">
        <li><NuxtLink to="/" class="hover:text-foreground">Home</NuxtLink></li>
        <li>/</li>
        <li><NuxtLink :to="`/browse-all-states?country=${countrySlug}`" class="hover:text-foreground">{{ country }}</NuxtLink></li>
        <li>/</li>
        <li class="text-foreground font-medium"> {{ state }} </li>
      </ol>
    </nav>

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
        <BaseButton @click="refresh" variant="outline" size="lg" class="gap-2">
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
            There are currently no cities available in {{ stateName }}. Please check back later.
          </p>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div v-else>
      <!-- Header -->
      <div class="mb-12">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">
          Sewer Repair Contractors in {{ stateName }}
        </h1>
        <p class="text-xl text-muted-foreground">
          Browse {{ totalCompanies }} verified contractor{{ totalCompanies !== 1 ? 's' : '' }} across {{ cities.length }} cit{{ cities.length !== 1 ? 'ies' : 'y' }}
        </p>
      </div>

      <!-- Cities Grid -->
      <div class="mb-12">
        <h2 class="text-2xl font-bold mb-6">Browse by City</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <NuxtLink
            v-for="city in sortedCities"
            :key="city.id"
            :to="`/${countrySlug}/${stateSlug}/${city.attributes.slug}`"
            class="group"
          >
            <BaseCard class="p-3 hover:shadow-lg hover:border-accent/50 transition-all cursor-pointer h-full">
              <div class="flex items-start gap-2">
                <div class="p-2 bg-accent/10 rounded-lg group-hover:bg-accent/20 transition-colors">
                  <MapPin class="w-2 h-2 text-accent" />
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="text-xs group-hover:text-accent transition-colors truncate">
                    <span class="font-bold pr-1">{{ city.attributes.name }}</span>
                    <span class="text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded-full font-mono">
                      {{ city.attributes.state.name }}
                    </span>

                    <span class="text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded-full font-mono">
                      {{ city.attributes.country.code }}
                    </span>
                  </h3>
                  <p class="text-xs text-muted-foreground mt-1">
                    <span class="text-accent font-medium">{{ city.attributes.companies_count }}</span>
                    {{ city.attributes.companies_count === 1 ? 'contrator' : 'contrators' }}
                  </p>
                </div>
              </div>
            </BaseCard>
          </NuxtLink>
        </div>
      </div>
      </div>
      <!-- Company Cards -->
      <div class="mb-12 mp-8">
        <h2 class="text-2xl font-bold mb-6">All Contractors in California {{ state }}</h2>
        <PageCompanyCard
            v-for="company in companies"
            :key="company.id"
            :company="company"
        />
    </div>
  </div>
</template>

