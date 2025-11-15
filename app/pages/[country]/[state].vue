<script setup lang="ts">
import { MapPin } from 'lucide-vue-next'
import {
  STATES,
  CONTRACTORS,
  getSlug,
  getCitiesByState,
  getContractorsByState,
} from '@/composables/useContractors'

definePageMeta({
  layout: 'default',
})

const route = useRoute()
const stateSlug = route.params.state as string
const countrySlug = route.params.country as string

const state = STATES.find((s) => getSlug(s) === stateSlug)
const country = countrySlug.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) // "United States"

if (!state) {
  throw createError({
    statusCode: 404,
    statusMessage: 'State not found',
  })
}
if (!country) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Country not found',
  })
}

const cities = getCitiesByState(state)
const contractors = getContractorsByState(state)

useSeoMeta({
  title: `Sewer Repair Contractors in ${state} - Find Local Experts`,
  description: `Find licensed and trusted sewer repair contractors in ${state}. Compare reviews, pricing, and services.`,
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <nav class="mb-8 text-sm text-muted-foreground">
      <ol class="flex items-center gap-2">
        <li><NuxtLink to="/" class="hover:text-foreground">Home</NuxtLink></li>
        <li>/</li>
        <li><NuxtLink :to="`/browse-all-states?country=${countrySlug}`" class="hover:text-foreground">{{ country }}</NuxtLink></li>
        <li>/</li>
        <li class="text-foreground font-medium">{{ state }}</li>
      </ol>
    </nav>

    <div class="mb-12">
      <h1 class="text-4xl md:text-5xl font-bold mb-4">
        Sewer Repair Contractors in {{ state }}
      </h1>
      <p class="text-xl text-muted-foreground">
        Browse {{ contractors.length }} verified contractors in {{ state }}
      </p>
    </div>

    <div class="mb-12">
      <h2 class="text-2xl font-bold mb-6">Browse by City</h2>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <NuxtLink
          v-for="city in cities"
          :key="city"
          :to="`/${countrySlug}/${stateSlug}/${getSlug(city)}`"
          class="p-4 border border-border rounded-lg hover:border-accent hover:bg-card/50 transition-all"
        >
          <div class="flex items-center gap-2">
            <MapPin class="w-4 h-4 text-accent" />
            <span class="font-medium">{{ city }}</span>
          </div>
        </NuxtLink>
      </div>
    </div>

    <div>
      <h2 class="text-2xl font-bold mb-6">All Contractors in {{ state }}</h2>
      <div class="grid gap-6">
        <FeaturesDirectoryCard
          v-for="contractor in contractors"
          :key="contractor.id"
          :contractor="contractor"
        />
      </div>
    </div>
  </div>
</template>

