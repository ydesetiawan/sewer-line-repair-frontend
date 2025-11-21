<script setup lang="ts">

definePageMeta({
  layout: 'default',
})

const route = useRoute()
const stateSlug = route.params.state as string
const countrySlug = route.params.country as string

// Validate state
const state = stateSlug?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())

// Format country name from slug
const country = countrySlug?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())

// Format state name for display
const stateName = stateSlug?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

useSeoMeta({
  title: `Sewer Repair Contractors in ${state} - Find Local Experts`,
  description: `Find licensed and trusted plumbing and sewer repair companies in ${stateName}. Browse verified professionals across all cities.`,
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <!-- Breadcrumb Navigation -->
    <nav class="mb-8 text-sm text-muted-foreground">
      <ol class="flex items-center gap-2">
        <li><NuxtLink to="/" class="hover:text-foreground">Home</NuxtLink></li>
        <li>/</li>
        <li>
          <NuxtLink :to="`/browse-all-states?country=${countrySlug}`" class="hover:text-foreground">
            {{ country }}
          </NuxtLink>
        </li>
        <li>/</li>
        <li class="text-foreground font-medium">{{ state }}</li>
      </ol>
    </nav>

    <!-- State with Companies Component -->
    <PageStateWithCompany
      :state-slug="stateSlug"
      :country-slug="countrySlug"
      :state-name="stateName"
    />
  </div>
</template>

