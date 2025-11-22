<script setup lang="ts">
import { MapPin } from 'lucide-vue-next'
import type { ICity } from '@/types/city'

interface Props {
  city: ICity
  countrySlug: string
  stateSlug: string
}

const props = defineProps<Props>()

/**
 * Generate city page URL
 */
const cityUrl = computed(() => {
  return `/${props.countrySlug}/${props.stateSlug}/${props.city.attributes.slug}`
})

/**
 * Pluralize contractor/contractors based on count
 */
const contractorLabel = computed(() => {
  const count = props.city.attributes.companies_count
  return count === 1 ? 'contractor' : 'contractors'
})
</script>

<template>
  <NuxtLink :to="cityUrl" class="group">
    <BaseCard class="relative h-full overflow-hidden bg-white border border-gray-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
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

        <!-- City Name -->
        <div class="mb-3">
          <h3 class="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 mb-2 line-clamp-1">
            {{ city.attributes.name }}
          </h3>

          <!-- Location Badge -->
          <div class="flex flex-wrap gap-1.5">
            <span class="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-gray-50 border border-gray-200 rounded-full text-gray-700 group-hover:bg-blue-50 group-hover:border-blue-200 group-hover:text-blue-700 transition-all duration-200">
              {{ city.attributes.state.name }}
            </span>
            <span class="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-gray-50 border border-gray-200 rounded-full text-gray-700 group-hover:bg-blue-50 group-hover:border-blue-200 group-hover:text-blue-700 transition-all duration-200">
              {{ city.attributes.country.code }}
            </span>
          </div>
        </div>

        <!-- Contractors Count -->
        <div class="flex items-center justify-between pt-3 mt-3 border-t border-gray-100">
          <span class="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
            {{ city.attributes.companies_count }}
          </span>
          <div class="text-right">
            <p class="text-xs font-medium text-gray-500 group-hover:text-gray-700 transition-colors capitalize">
              {{ contractorLabel }}
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
</template>

