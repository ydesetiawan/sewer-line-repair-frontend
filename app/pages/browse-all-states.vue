<script setup lang="ts">
import { MapPin, Loader2, AlertCircle, RefreshCw, Search, X } from 'lucide-vue-next'
import { useStatesSearch } from '@/composables/useStatesSearch'
import { getCountry} from "@/composables/useContractors";

definePageMeta({
  layout: 'default',
})

useSeoMeta({
  title: 'Browse All States - Sewer Repair Pro',
  description: 'Find sewer repair contractors in all states across the United States.',
})

const route = useRoute()
const countrySlug = route.query.country as string

// Use search composable
const {
  states,
  pagination,
  loading,
  error,
  searchQuery,
  search,
  hasResults,
  totalResults,
} = useStatesSearch({
  initialQuery: '',
  debounceMs: 400,
  minChars: 0, // 0 to show all states when empty
  country: countrySlug,
})

// Load all states on mount (only once)
onMounted(() => {
  search('')
})


// Refresh function
const refresh = () => {
  search(searchQuery.value)
}

// Clear search
const handleClearSearch = () => {
  search('')
}

// Build route URL for state
const getStateRoute = (state: any) => {
  return `/${state.attributes.country.slug}/${state.attributes.slug}`
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <nav class="mb-8 text-sm text-muted-foreground">
      <ol class="flex items-center gap-2">
        <li><NuxtLink to="/" class="hover:text-foreground">Home</NuxtLink></li>
        <li v-if="countrySlug">/</li>
        <li v-if="countrySlug"><NuxtLink :to="`/browse-all-states?country=${countrySlug}`" class="hover:text-foreground">{{ getCountry(countrySlug) }}</NuxtLink></li>
      </ol>
    </nav>

    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-4xl font-bold mb-4">All States</h1>
      <p class="text-medium text-muted-foreground">
        Browse sewer line repair contractors across all available states. Select your state to view certified professionals in your area.
      </p>
    </div>

    <!-- Search Input -->
    <div class="mb-4">
      <div class="relative">
        <UiInput
          :model-value="searchQuery"
          type="text"
          placeholder="Search states by name..."
          class="bg-card border-border pl-10 pr-10 text-foreground"
          aria-label="Search states"
          @input="(e) => search((e.target as HTMLInputElement).value)"
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
    </div>

    <!-- Search Results Info -->
    <div v-if="searchQuery && !loading" class="mb-6">
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
    <div v-else-if="!searchQuery && !loading && hasResults" class="mb-6">
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

    <!-- Error State -->
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
        <UiButton @click="refresh" variant="outline" size="lg" class="gap-2">
          <RefreshCw class="w-5 h-5" />
          Try Again
        </UiButton>
      </div>
    </div>


    <!-- States Grid -->
    <div v-else-if="states.length > 0" class="space-y-8">
      <!-- States Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <NuxtLink
          v-for="state in states"
          :key="state.id"
          :to="getStateRoute(state)"
        >
          <UiCard
            class="p-6 bg-card hover:bg-card/80 border-border/50 cursor-pointer transition-all hover:shadow-lg hover:border-accent/50"
          >
            <div class="flex items-center gap-3">
              <div class="p-2 bg-accent/10 rounded-lg">
                <MapPin class="w-5 h-5 text-accent"/>
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
          </UiCard>
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

