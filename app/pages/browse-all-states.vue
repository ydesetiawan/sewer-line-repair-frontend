<script setup lang="ts">
import { getCountry } from '@/composables/useContractors'

definePageMeta({
  layout: 'default',
})

useSeoMeta({
  title: 'Browse All States - Sewer Repair Pro',
  description: 'Find sewer repair contractors in all states across the United States.',
})

// Get country from query params
const route = useRoute()
const countrySlug = computed(() => route.query.country as string | undefined)
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <!-- Breadcrumb -->
    <nav class="mb-8 text-sm text-muted-foreground">
      <ol class="flex items-center gap-2">
        <li><NuxtLink to="/" class="hover:text-foreground">Home</NuxtLink></li>
        <template v-if="countrySlug">
          <li>/</li>
          <li>
            <NuxtLink :to="`/browse-all-states?country=${countrySlug}`" class="hover:text-foreground">
              {{ getCountry(countrySlug) }}
            </NuxtLink>
          </li>
        </template>
      </ol>
    </nav>

    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-4xl font-bold mb-4">All States</h1>
      <p class="text-medium text-muted-foreground">
        Browse sewer line repair contractors across all available states. Select your state to view certified professionals in your area.
      </p>
    </div>

    <!-- Search States Component -->
    <PageSearchStates :country="countrySlug" />
  </div>
</template>

