<script setup lang="ts">

import type {IState} from "@/types/state";

definePageMeta({
  layout: 'default',
})

const route = useRoute()
const countrySlug = route.params.country as string
const stateSlug = route.params.state as string
const citySlug = route.params.city as string

// Format country name from slug
const country = countrySlug?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())

// Validate state
const state = stateSlug?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())

// Format state name for display
const city = citySlug?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

const stateRoute = `/${countrySlug}/${stateSlug}`

useSeoMeta({
  title: `Sewer Repair Contractors in ${state} - Find Local Experts`,
  description: `Find licensed and trusted plumbing and sewer repair companies in ${state}. Browse verified professionals across in ${city}.`,
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
          <NuxtLink :to="`/${countrySlug}`" class="hover:text-foreground">
            {{ country }}
          </NuxtLink>
        </li>
        <li>/</li>
        <li>
          <NuxtLink :to="stateRoute" class="hover:text-foreground">
            {{ state }}
          </NuxtLink>
        </li>
        <li>/</li>
        <li class="text-foreground font-medium">{{ city }}</li>
      </ol>
    </nav>

    <!-- State with Companies Component -->
    <PageCompanyList
        :state-slug="stateSlug"
        :country-slug="countrySlug"
        :state-name="state"
        :city-slug="citySlug"
    />
  </div>
</template>

