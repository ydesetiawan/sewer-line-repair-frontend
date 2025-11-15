<script setup lang="ts">
import { Star, MapPin, Phone } from 'lucide-vue-next'
import type { Contractor } from '@/types'
import { getStateSlug, getCitySlug, getProviderSlug } from '@/composables/useContractors'

interface Props {
  contractor: Contractor
}

const props = defineProps<Props>()

const contractorUrl = computed(() => {
  return `/sewer-line-repair/${getStateSlug(props.contractor.state)}/${getCitySlug(
    props.contractor.city
  )}/${getProviderSlug(props.contractor.name)}`
})
</script>

<template>
  <UiCard class="p-6 hover:shadow-lg transition-shadow">
    <div class="flex flex-col md:flex-row gap-6">
      <div class="flex-1 space-y-4">
        <div class="flex items-start justify-between">
          <div>
            <NuxtLink :to="contractorUrl" class="hover:text-accent transition-colors">
              <h3 class="text-xl font-bold mb-1">{{ contractor.name }}</h3>
            </NuxtLink>
            <div class="flex items-center gap-2 text-muted-foreground text-sm">
              <MapPin class="w-4 h-4" />
              <span>{{ contractor.city }}, {{ contractor.state }}</span>
            </div>
          </div>
          <span
            :class="[
              'text-xs px-3 py-1 rounded-full font-medium',
              contractor.badge === 'Premium'
                ? 'bg-accent/20 text-accent'
                : 'bg-secondary text-secondary-foreground',
            ]"
          >
            {{ contractor.badge }}
          </span>
        </div>

        <div class="flex items-center gap-4">
          <div class="flex items-center gap-1">
            <Star
              v-for="i in 5"
              :key="i"
              :class="[
                'w-4 h-4',
                i <= Math.floor(contractor.rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300',
              ]"
            />
            <span class="ml-2 font-semibold">{{ contractor.rating }}</span>
            <span class="text-muted-foreground text-sm">({{ contractor.reviews }} reviews)</span>
          </div>
        </div>

        <div class="flex flex-wrap gap-3 text-sm">
          <span class="px-3 py-1 bg-secondary rounded-full">{{ contractor.specialty }}</span>
          <span class="px-3 py-1 bg-secondary rounded-full">{{ contractor.price }}</span>
        </div>

        <p class="text-muted-foreground text-sm">{{ contractor.address }}</p>
      </div>

      <div class="flex flex-col gap-3 md:w-48">
        <a
          :href="`tel:${contractor.phone}`"
          class="flex items-center justify-center gap-2 px-4 py-2 bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg transition-colors"
        >
          <Phone class="w-4 h-4" />
          <span class="text-sm font-medium">Call Now</span>
        </a>
        <NuxtLink :to="contractorUrl">
          <UiButton variant="outline" class="w-full">View Details</UiButton>
        </NuxtLink>
      </div>
    </div>
  </UiCard>
</template>

