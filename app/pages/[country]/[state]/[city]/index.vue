<script setup lang="ts">


definePageMeta({
  layout: 'default',
})

const route = useRoute()
const countrySlug = route.params.country as string
const stateSlug = route.params.state as string
const citySlug = route.params.city as string

// Format names from slugs
const country = formatSlugToTitle(countrySlug)
const state = formatSlugToTitle(stateSlug)
const city = formatSlugToTitle(citySlug)

useSeoMeta({
  title: `Sewer Repair Contractors in ${state} - Find Local Experts`,
  description: `Find licensed and trusted plumbing and sewer repair companies in ${state}. Browse verified professionals across in ${city}.`,
})

// Breadcrumb items
const breadcrumbItems = computed(() => [
  { label: 'Home', to: '/' },
  { label: country, to: `/${countrySlug}` },
  { label: state, to: `/${countrySlug}/${stateSlug}` },
  { label: city }
])
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <!-- Breadcrumb Navigation -->
    <BaseBreadcrumb :items="breadcrumbItems" />

    <!-- State with Companies Component -->
    <PageCompanyList
        :state-slug="stateSlug"
        :country-slug="countrySlug"
        :state-name="state"
        :city-slug="citySlug"
    />
  </div>
</template>

