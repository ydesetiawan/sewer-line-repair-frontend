<script setup lang="ts">
import { MapPin } from 'lucide-vue-next'
import { STATES, getStateSlug } from '@/composables/useContractors'
</script>

<template>
  <section id="states" class="py-16 bg-background">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold mb-4">Browse by State</h2>
        <p class="text-lg text-muted-foreground">
          Find sewer repair contractors in your state
        </p>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <NuxtLink
          v-for="state in STATES"
          :key="state"
          :to="`/sewer-line-repair/${getStateSlug(state)}`"
          class="group p-4 border border-border rounded-lg hover:border-accent hover:bg-card/50 transition-all"
        >
          <div class="flex items-center gap-3">
            <MapPin class="w-5 h-5 text-accent" />
            <span class="font-medium group-hover:text-accent transition-colors">{{ state }}</span>
          </div>
        </NuxtLink>
      </div>

      <div class="text-center mt-8">
        <NuxtLink to="/browse-all-states">
          <UiButton variant="outline" size="lg">
            View All States
          </UiButton>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

