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

      <!-- Loading State - Clean Design -->
      <div v-if="loading && !states.length" class="flex justify-center items-center py-12">
        <div class="text-center space-y-4">
          <div class="relative inline-block">
            <div class="absolute inset-0 bg-blue-400 rounded-full blur-xl opacity-30 animate-pulse"></div>
            <Loader2 class="relative w-12 h-12 text-blue-600 animate-spin" />
          </div>
          <p class="text-base font-medium text-gray-900">Loading states...</p>
        </div>
      </div>

      <!-- Error State - Clean Design -->
      <div v-else-if="error" class="text-center py-12">
        <div class="max-w-md mx-auto space-y-4">
          <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle class="w-8 h-8 text-red-600" />
          </div>
          <h3 class="text-xl font-bold text-gray-900">Failed to load states</h3>
          <p class="text-gray-600">{{ error.message }}</p>
          <BaseButton @click="refresh" variant="outline" class="gap-2 border-2 border-blue-500 text-blue-600 hover:bg-blue-50">
            <RefreshCw class="w-4 h-4" />
            Try Again
          </BaseButton>
        </div>
      </div>

      <!-- States Grid - Beautiful & Clean Design -->
      <div v-else-if="states.length > 0" class="space-y-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <NuxtLink
            v-for="state in states"
            :key="state.id"
            :to="getStateRoute(state)"
            class="group"
          >
            <BaseCard
              class="relative h-full overflow-hidden bg-white border border-gray-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            >
              <!-- Subtle top accent line -->
              <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>

              <!-- Card Content -->
              <div class="relative p-5">
                <!-- Icon -->
                <div class="mb-3">
                  <div class="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 group-hover:bg-blue-500 group-hover:border-blue-500 group-hover:scale-110 transition-all duration-300">
                    <MapPin class="w-5 h-5 text-blue-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                </div>

                <!-- State Name -->
                <div class="mb-3">
                  <h3 class="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 mb-2 line-clamp-1">
                    {{ state.attributes.name }}
                  </h3>

                  <!-- Country Badge -->
                  <span class="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-gray-50 border border-gray-200 rounded-full text-gray-700 group-hover:bg-blue-50 group-hover:border-blue-200 group-hover:text-blue-700 transition-all duration-200">
                    {{ state.attributes.country.name }}
                  </span>
                </div>

                <!-- Contractors Count -->
                <div class="flex items-center justify-between pt-3 mt-3 border-t border-gray-100">
                  <span class="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                    {{ state.attributes.companies_count }}
                  </span>
                  <div class="text-right">
                    <p class="text-xs font-medium text-gray-500 group-hover:text-gray-700 transition-colors">
                      {{ state.attributes.companies_count === 1 ? 'Contractor' : 'Contractors' }}
                    </p>
                    <p class="text-xs text-gray-400">Available</p>
                  </div>
                </div>

                <!-- Hover Arrow Indicator -->
                <div class="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div class="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center shadow-lg group-hover:translate-x-1 transition-transform duration-300">
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </BaseCard>
          </NuxtLink>
        </div>

        <!-- View All Link -->
        <div class="text-center mt-8">
          <NuxtLink to="/browse-all-states">
            <BaseButton variant="outline" size="lg" class="border-2 border-blue-500 text-blue-600 hover:bg-blue-50">
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

