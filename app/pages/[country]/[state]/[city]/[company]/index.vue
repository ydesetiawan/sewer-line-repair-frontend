<script setup lang="ts">
definePageMeta({
  layout: 'default',
})

const route = useRoute()
const countrySlug = route.params.country as string
const stateSlug = route.params.state as string
const citySlug = route.params.city as string
const companySlug = route.params.company as string

// Format names from slugs
const country = formatSlugToTitle(countrySlug)
const state = formatSlugToTitle(stateSlug)
const city = formatSlugToTitle(citySlug)
const company = formatSlugToTitle(companySlug)

// SEO Meta Tags
useSeoMeta({
  title: `${company} - Sewer Repair Contractor in ${city}, ${state}`,
  description: `Contact ${company} for professional plumbing and sewer repair services in ${city}, ${state}. Licensed, insured, and trusted by local residents.`,
  ogTitle: `${company} - Sewer Repair Services in ${city}`,
  ogDescription: `Professional sewer repair and plumbing services in ${city}, ${state}. Get quotes and reviews from ${company}.`,
})

// Breadcrumb items
const breadcrumbItems = computed(() => [
  { label: 'Home', to: '/' },
  { label: country, to: `/${countrySlug}` },
  { label: state, to: `/${countrySlug}/${stateSlug}` },
  { label: city, to: `/${countrySlug}/${stateSlug}/${citySlug}` },
  { label: company }
])
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Breadcrumb Navigation -->
    <div class="mb-6">
      <BaseBreadcrumb :items="breadcrumbItems" />
    </div>

    <!-- Company Detail Component -->
    <PageCompanyDetail :company-slug="companySlug" />
  </div>
</template>

