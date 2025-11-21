<script setup lang="ts">
import { MapPin, Loader2, AlertCircle, RefreshCw } from 'lucide-vue-next'
import type { IState } from '@/types/state'

const { $publicApi } = useNuxtApp()

// Reactive state
const states = ref<IState[]>([])
const pagination = ref<IMetaPagination | null>(null)
const loading = ref(false)
const error = ref<Error | null>(null)

// Fetch states from API
const fetchStates = async (page: number = 1, perPage: number = 8) => {
  loading.value = true
  error.value = null

  try {
    const response = await $publicApi<ISlrApiResponse<IState[]>>('/api/v1/states', {
      params: {
        page,
        per_page: perPage,
      },
    })

    states.value = response.data
    pagination.value = response.meta?.pagination || null
  } catch (err) {
    error.value = err instanceof Error ? err : new Error('Failed to fetch states')
    console.error('Error fetching states:', err)
  } finally {
    loading.value = false
  }
}

// Refresh current page
const refresh = async () => {
  await fetchStates(pagination.value?.current_page || 1, 8)
}


// Build route URL for state
const getStateRoute = (state: IState) => {
  return `/${state.attributes.country.slug}/${state.attributes.slug}`
}

// Fetch states on mount
onMounted(() => {
  fetchStates(1, 8)
})
</script>

<template>
  <section id="states" class="py-16 bg-background">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold mb-4">Browse by State</h2>
        <p class="text-lg text-muted-foreground">
          Select your state to find certified sewer repair contractors in your area
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
          <BaseButton @click="refresh" variant="outline" class="gap-2">
            <RefreshCw class="w-4 h-4" />
            Try Again
          </BaseButton>
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
                  <span class="text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded-full font-mono">
                    {{ state.attributes.country.name }}
                  </span>
                </span>
                <span class="text-xs text-muted-foreground">
                  <span class="text-accent">{{ state.attributes.companies_count }}</span> contractors available
                </span>
              </div>
            </div>
          </NuxtLink>
        </div>

        <!-- View All Link -->
        <div class="text-center mt-8">
          <NuxtLink to="/browse-all-states">
            <BaseButton variant="outline" size="lg">
              View All States
            </BaseButton>
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

