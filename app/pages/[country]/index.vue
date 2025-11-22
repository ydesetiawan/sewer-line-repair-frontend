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

