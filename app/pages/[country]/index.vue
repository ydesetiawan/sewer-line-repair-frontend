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

    <!-- Search States Component -->
    <PageStateList :countrySlug="countrySlug" />
  </div>
</template>

