<script setup lang="ts">
import { MapPin } from 'lucide-vue-next'
import { STATES, getStateSlug } from '@/composables/useContractors'

definePageMeta({
  layout: 'default',
})

useSeoMeta({
  title: 'Browse All States - Sewer Repair Pro',
  description: 'Find sewer repair contractors in all states across the United States.',
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="mb-8">
      <h1 class="text-4xl font-bold mb-4">Browse All States</h1>
      <p class="text-xl text-muted-foreground">
        Select a state to find certified sewer repair contractors
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <NuxtLink
        v-for="state in STATES"
        :key="state"
        :to="`/sewer-line-repair/${getStateSlug(state)}`"
      >
        <UiCard
          class="p-6 bg-card hover:bg-card/80 border-border/50 cursor-pointer transition-all hover:shadow-lg hover:border-accent/50"
        >
          <div class="flex items-center gap-3">
            <div class="p-2 bg-accent/10 rounded-lg">
              <MapPin class="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 class="font-semibold text-lg">{{ state }}</h3>
              <p class="text-sm text-muted-foreground">View contractors</p>
            </div>
          </div>
        </UiCard>
      </NuxtLink>
    </div>
  </div>
</template>

