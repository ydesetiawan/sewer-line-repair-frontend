<script setup lang="ts">
import { CONTRACTORS } from '@/composables/useContractors'

definePageMeta({
  layout: 'default',
})

useSeoMeta({
  title: 'Sewer Repair Directory - Find Local Contractors',
  description: 'Browse our complete directory of licensed sewer repair contractors nationwide.',
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="mb-8">
      <h1 class="text-4xl font-bold mb-4">Contractor Directory</h1>
      <p class="text-xl text-muted-foreground">
        Browse all available sewer repair contractors in your area
      </p>
    </div>

    <div class="mb-8">
      <FeaturesSearchLocation />
    </div>

    <div class="grid gap-6">
      <FeaturesDirectoryCard
        v-for="contractor in CONTRACTORS"
        :key="contractor.id"
        :contractor="contractor"
      />
    </div>
  </div>
</template>

