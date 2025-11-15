<script setup lang="ts">
import { MapPin, Loader2, AlertCircle, RefreshCw } from 'lucide-vue-next'
import { useStates } from '@/composables/useStatesApi'

definePageMeta({
  layout: 'default',
})

useSeoMeta({
  title: 'Browse All States - Sewer Repair Pro',
  description: 'Find sewer repair contractors in all states across the United States.',
})

// Fetch all states from API with pagination
const { states, pagination, loading, error, fetchStates, refresh, hasNextPage, hasPrevPage } = useStates({
  page: 1,
  perPage: 50, // Show more states on the full browse page
  autoFetch: true,
})

// Load more states (next page)
const loadMore = async () => {
  if (hasNextPage.value && pagination.value) {
    await fetchStates(pagination.value.next_page!)
  }
}

// Load previous page
const loadPrevious = async () => {
  if (hasPrevPage.value && pagination.value) {
    await fetchStates(pagination.value.prev_page!)
  }
}

// Build route URL for state
const getStateRoute = (state: any) => {
  return `/sewer-line-repair/${state.attributes.slug}`
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-4xl font-bold mb-4">Browse All States</h1>
      <p class="text-xl text-muted-foreground">
        Select a state to find certified sewer repair contractors
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
      <!-- Pagination Info -->
      <div v-if="pagination" class="flex justify-between items-center">
        <p class="text-sm text-muted-foreground">
          Showing {{ states.length }} of {{ pagination.total_items }} states
        </p>
        <p class="text-sm text-muted-foreground">
          Page {{ pagination.current_page }} of {{ pagination.total_pages }}
        </p>
      </div>

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
                <MapPin class="w-5 h-5 text-accent" />
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="font-semibold text-lg truncate">{{ state.attributes.name }}</h3>
                <p class="text-sm text-muted-foreground">
                  {{ state.attributes.code }} • {{ state.attributes.country.name }}
                </p>
              </div>
            </div>
          </UiCard>
        </NuxtLink>
      </div>

      <!-- Pagination Controls -->
      <div v-if="pagination && (hasNextPage || hasPrevPage)" class="flex justify-center items-center gap-4 pt-4">
        <UiButton
          v-if="hasPrevPage"
          @click="loadPrevious"
          variant="outline"
          size="lg"
          :disabled="loading"
          class="gap-2"
        >
          <Loader2 v-if="loading" class="w-5 h-5 animate-spin" />
          <span v-else>← Previous</span>
        </UiButton>

        <div class="text-sm text-muted-foreground hidden sm:block">
          Page {{ pagination.current_page }} of {{ pagination.total_pages }}
        </div>

        <UiButton
          v-if="hasNextPage"
          @click="loadMore"
          variant="outline"
          size="lg"
          :disabled="loading"
          class="gap-2"
        >
          <template v-if="loading">
            <Loader2 class="w-5 h-5 animate-spin" />
            Loading...
          </template>
          <span v-else>Next →</span>
        </UiButton>
      </div>

      <!-- Loading indicator during pagination -->
      <div v-if="loading && states.length" class="flex justify-center py-4">
        <div class="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 class="w-4 h-4 animate-spin" />
          <span>Loading more states...</span>
        </div>
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

