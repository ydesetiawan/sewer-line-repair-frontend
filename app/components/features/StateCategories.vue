<script setup lang="ts">
import { MapPin, Loader2, AlertCircle, RefreshCw } from 'lucide-vue-next'
import { useStates } from '@/composables/useStatesApi'

// Fetch states from API with pagination
const { states, pagination, loading, error, fetchStates, refresh, hasNextPage, hasPrevPage } = useStates({
  page: 1,
  perPage: 8, // Show 8 states initially
  autoFetch: true,
})

// Load more states
const loadMore = async () => {
  if (hasNextPage.value && pagination.value) {
    await fetchStates(pagination.value.next_page!)
  }
}

// Go to previous page
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
  <section id="states" class="py-16 bg-background">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold mb-4">Browse by State</h2>
        <p class="text-lg text-muted-foreground">
          Find sewer repair contractors in your state
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="loading && !states.length" class="flex justify-center items-center py-12">
        <div class="text-center space-y-4">
          <Loader2 class="w-12 h-12 text-accent animate-spin mx-auto" />
          <p class="text-muted-foreground">Loading states...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <div class="max-w-md mx-auto space-y-4">
          <AlertCircle class="w-16 h-16 text-destructive mx-auto" />
          <h3 class="text-xl font-semibold">Failed to load states</h3>
          <p class="text-muted-foreground">{{ error.message }}</p>
          <UiButton @click="refresh" variant="outline" class="gap-2">
            <RefreshCw class="w-4 h-4" />
            Try Again
          </UiButton>
        </div>
      </div>

      <!-- States Grid -->
      <div v-else-if="states.length > 0" class="space-y-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <NuxtLink
            v-for="state in states"
            :key="state.id"
            :to="getStateRoute(state)"
            class="group p-4 border border-border rounded-lg hover:border-accent hover:bg-card/50 transition-all"
          >
            <div class="flex items-center gap-3">
              <MapPin class="w-5 h-5 text-accent" />
              <div class="flex-1 min-w-0">
                <span class="font-medium group-hover:text-accent transition-colors block truncate">
                  {{ state.attributes.name }}
                </span>
                <span class="text-xs text-muted-foreground">
                  {{ state.attributes.code }}
                </span>
              </div>
            </div>
          </NuxtLink>
        </div>

        <!-- Pagination Info -->
<!--        <div v-if="pagination" class="flex justify-center items-center gap-4 text-sm text-muted-foreground">-->
<!--          <span>-->
<!--            Page {{ pagination.current_page }} of {{ pagination.total_pages }}-->
<!--            ({{ pagination.total_items }} states total)-->
<!--          </span>-->
<!--        </div>-->

        <!-- Pagination Controls -->
<!--        <div class="flex justify-center items-center gap-4">-->
<!--          <UiButton-->
<!--            v-if="hasPrevPage"-->
<!--            @click="loadPrevious"-->
<!--            variant="outline"-->
<!--            :disabled="loading"-->
<!--            class="gap-2"-->
<!--          >-->
<!--            <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />-->
<!--            <span v-else>← Previous</span>-->
<!--          </UiButton>-->

<!--          <UiButton-->
<!--            v-if="hasNextPage"-->
<!--            @click="loadMore"-->
<!--            variant="outline"-->
<!--            :disabled="loading"-->
<!--            class="gap-2"-->
<!--          >-->
<!--            <template v-if="loading">-->
<!--              <Loader2 class="w-4 h-4 animate-spin" />-->
<!--              Loading...-->
<!--            </template>-->
<!--            <span v-else>Next →</span>-->
<!--          </UiButton>-->
<!--        </div>-->

        <!-- View All Link -->
        <div class="text-center mt-8">
          <NuxtLink to="/browse-all-states">
            <UiButton variant="outline" size="lg">
              View All States
            </UiButton>
          </NuxtLink>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <p class="text-muted-foreground">No states available</p>
      </div>
    </div>
  </section>
</template>

