<script setup lang="ts">
import {
  STATES,
  CONTRACTORS,
  getStateSlug,
  getCitySlug,
  getContractorsByCity,
} from '@/composables/useContractors'

definePageMeta({
  layout: 'default',
})

const route = useRoute()
const stateSlug = route.params.state as string
const citySlug = route.params.city as string

const state = STATES.find((s) => getStateSlug(s) === stateSlug)

if (!state) {
  throw createError({
    statusCode: 404,
    statusMessage: 'State not found',
  })
}

const allContractorsInState = CONTRACTORS.filter((c) => c.state === state)
const cityContractor = allContractorsInState.find((c) => getCitySlug(c.city) === citySlug)

if (!cityContractor) {
  throw createError({
    statusCode: 404,
    statusMessage: 'City not found',
  })
}

const city = cityContractor.city
const contractors = getContractorsByCity(state, city)

useSeoMeta({
  title: `Sewer Repair Contractors in ${city}, ${state} - Local Experts`,
  description: `Find the best sewer repair contractors in ${city}, ${state}. Read reviews and compare services from licensed professionals.`,
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <nav class="mb-8 text-sm text-muted-foreground">
      <ol class="flex items-center gap-2">
        <li><NuxtLink to="/" class="hover:text-foreground">Home</NuxtLink></li>
        <li>/</li>
        <li><NuxtLink to="/browse-all-states" class="hover:text-foreground">States</NuxtLink></li>
        <li>/</li>
        <li>
          <NuxtLink :to="`/sewer-line-repair/${stateSlug}`" class="hover:text-foreground">
            {{ state }}
          </NuxtLink>
        </li>
        <li>/</li>
        <li class="text-foreground font-medium">{{ city }}</li>
      </ol>
    </nav>

    <div class="mb-12">
      <h1 class="text-4xl md:text-5xl font-bold mb-4">
        Sewer Repair Contractors in {{ city }}, {{ state }}
      </h1>
      <p class="text-xl text-muted-foreground">
        {{ contractors.length }} verified contractor{{ contractors.length !== 1 ? 's' : '' }} in
        {{ city }}
      </p>
    </div>

    <div class="mb-8">
      <FeaturesSearchLocation />
    </div>

    <div class="grid gap-6">
      <FeaturesDirectoryCard
        v-for="contractor in contractors"
        :key="contractor.id"
        :contractor="contractor"
      />
    </div>
  </div>
</template>

