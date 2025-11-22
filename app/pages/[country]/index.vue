<script setup lang="ts">

definePageMeta({
  layout: 'default',
})

useSeoMeta({
  title: 'Browse All States - Sewer Repair Pro',
  description: 'Find sewer repair contractors in all states across the United States.',
})

const route = useRoute()
const countrySlug = route.params.country as string

// Format country name from slug
const country = formatSlugToTitle(countrySlug)

// Breadcrumb items
const breadcrumbItems = computed(() => [
  { label: 'Home', to: '/' },
  { label: country, to: `/${countrySlug}` }
])
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <!-- Breadcrumb -->
    <BaseBreadcrumb :items="breadcrumbItems" />

    <!-- Header - Clean & Modern -->
    <div class="mb-8">
      <div class="flex items-center gap-4 mb-4">
        <div class="w-12 h-12 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center">
          <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
          </svg>
        </div>
        <div>
          <h1 class="text-4xl font-bold text-gray-900">All States</h1>
          <p class="text-base text-gray-600 mt-1">
            Browse sewer line repair contractors across all available states
          </p>
        </div>
      </div>
      <p class="text-base text-gray-600 max-w-3xl">
        Select your state to view certified professionals in your area. All contractors are verified and ready to help with your sewer repair needs.
      </p>
    </div>

    <!-- Search States Component -->
    <PageSearchStates :country="countrySlug" />
  </div>
</template>

