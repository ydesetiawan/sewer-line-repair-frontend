<script setup lang="ts">
import { MapPin } from 'lucide-vue-next'
import type { ICity } from '@/types/city'

interface Props {
  city: ICity
  countrySlug: string
  stateSlug: string
}

const props = defineProps<Props>()

/**
 * Generate city page URL
 */
const cityUrl = computed(() => {
  return `/${props.countrySlug}/${props.stateSlug}/${props.city.attributes.slug}`
})

/**
 * Pluralize contractor/contractors based on count
 */
const contractorLabel = computed(() => {
  const count = props.city.attributes.companies_count
  return count === 1 ? 'contractor' : 'contractors'
})
</script>

<template>
  <NuxtLink :to="cityUrl" class="group">
    <BaseCard class="p-3 hover:shadow-lg hover:border-accent/50 transition-all cursor-pointer h-full">
      <div class="flex items-start gap-2">
        <!-- Icon -->
        <div class="p-2 bg-accent/10 rounded-lg group-hover:bg-accent/20 transition-colors">
          <MapPin class="w-2 h-2 text-accent" />
        </div>

        <!-- Content -->
        <div class="flex-1 min-w-0">
          <!-- City Name and Badges -->
          <h3 class="text-xs group-hover:text-accent transition-colors truncate">
            <span class="font-bold pr-1">{{ city.attributes.name }}</span>
            <span class="text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded-full font-mono">
              {{ city.attributes.state.name }}
            </span>
            <span class="text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded-full font-mono">
              {{ city.attributes.country.code }}
            </span>
          </h3>

          <!-- Companies Count -->
          <p class="text-xs text-muted-foreground mt-1">
            <span class="text-accent font-medium">{{ city.attributes.companies_count }}</span>
            {{ contractorLabel }}
          </p>
        </div>
      </div>
    </BaseCard>
  </NuxtLink>
</template>

