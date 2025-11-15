<script setup lang="ts">
import {
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  Star,
  Shield,
  Award,
  CheckCircle,
  ShieldCheck,
  BadgeCheck
} from 'lucide-vue-next'
import type { CompanyResource, ServiceLevel } from '@/types'

interface Props {
  company: CompanyResource
}

const props = defineProps<Props>()

// Service level badge colors
const serviceLevelStyles: Record<ServiceLevel, string> = {
  Basic: 'bg-gray-100 text-gray-800 border-gray-300',
  Standard: 'bg-blue-100 text-blue-800 border-blue-300',
  Premium: 'bg-purple-100 text-purple-800 border-purple-300',
  Elite: 'bg-amber-100 text-amber-800 border-amber-300',
}

// Show full description or truncated
const showFullDescription = ref(false)

const truncatedDescription = computed(() => {
  const desc = props.company.attributes.description
  if (desc.length <= 150) return desc
  return showFullDescription.value ? desc : desc.substring(0, 150) + '...'
})

const needsTruncation = computed(() => {
  return props.company.attributes.description.length > 150
})

// Format rating
const rating = computed(() => parseFloat(props.company.attributes.average_rating))

// Trust badges
const trustBadges = computed(() => {
  const attrs = props.company.attributes
  return [
    { show: attrs.verified_professional, label: 'Verified', icon: CheckCircle, color: 'text-green-600' },
    { show: attrs.licensed, label: 'Licensed', icon: Award, color: 'text-blue-600' },
    { show: attrs.insured, label: 'Insured', icon: Shield, color: 'text-purple-600' },
    { show: attrs.background_checked, label: 'Checked', icon: ShieldCheck, color: 'text-indigo-600' },
    { show: attrs.certified_partner, label: 'Partner', icon: Star, color: 'text-amber-600' },
    { show: attrs.service_guarantee, label: 'Guarantee', icon: BadgeCheck, color: 'text-emerald-600' },
  ].filter(badge => badge.show)
})
</script>

<template>
  <UiCard class="p-6 hover:shadow-lg transition-all duration-300 border-border">
    <!-- Company Header -->
    <div class="mb-4">
      <div class="flex items-start justify-between gap-4 mb-3">
        <NuxtLink
          :to="company.attributes.url_path"
          class="flex-1"
        >
          <h3 class="text-xl font-bold text-foreground hover:text-accent transition-colors line-clamp-2">
            {{ company.attributes.name }}
          </h3>
        </NuxtLink>

        <!-- Service Level Badge -->
        <span
          class="px-3 py-1 text-xs font-semibold rounded-full border whitespace-nowrap"
          :class="serviceLevelStyles[company.attributes.service_level]"
        >
          {{ company.attributes.service_level }}
        </span>
      </div>

      <!-- Rating & Reviews -->
      <div class="flex items-center gap-2 mb-3">
        <div class="flex items-center gap-1">
          <Star
            v-for="i in 5"
            :key="i"
            class="w-4 h-4"
            :class="i <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'"
          />
        </div>
        <span class="text-sm font-medium text-foreground">{{ rating.toFixed(1) }}</span>
        <span class="text-sm text-muted-foreground">
          ({{ company.attributes.total_reviews }} review{{ company.attributes.total_reviews !== 1 ? 's' : '' }})
        </span>
      </div>

      <!-- Specialty -->
      <div v-if="company.attributes.specialty" class="mb-3">
        <span class="inline-block px-2 py-1 text-xs font-medium bg-accent/10 text-accent rounded">
          {{ company.attributes.specialty }}
        </span>
      </div>
    </div>

    <!-- Description -->
    <p class="text-sm text-muted-foreground mb-4">
      {{ truncatedDescription }}
      <button
        v-if="needsTruncation"
        @click="showFullDescription = !showFullDescription"
        class="text-accent hover:text-accent/80 font-medium ml-1"
      >
        {{ showFullDescription ? 'Show less' : 'Read more' }}
      </button>
    </p>

    <!-- Trust Badges -->
    <div v-if="trustBadges.length > 0" class="flex flex-wrap gap-2 mb-4">
      <div
        v-for="badge in trustBadges"
        :key="badge.label"
        class="flex items-center gap-1 px-2 py-1 bg-muted/50 rounded text-xs"
        :title="badge.label"
      >
        <component :is="badge.icon" class="w-3 h-3" :class="badge.color" />
        <span class="text-muted-foreground">{{ badge.label }}</span>
      </div>
    </div>

    <!-- Contact Info -->
    <div class="space-y-2 border-t border-border pt-4">
      <!-- Address -->
      <div class="flex items-start gap-2 text-sm">
        <MapPin class="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
        <span class="text-muted-foreground">{{ company.attributes.full_address }}</span>
      </div>

      <!-- Phone -->
      <div class="flex items-center gap-2 text-sm">
        <Phone class="w-4 h-4 text-muted-foreground" />
        <a
          :href="`tel:${company.attributes.phone}`"
          class="text-accent hover:text-accent/80 font-medium"
        >
          {{ company.attributes.phone }}
        </a>
      </div>

      <!-- Email -->
      <div v-if="company.attributes.email" class="flex items-center gap-2 text-sm">
        <Mail class="w-4 h-4 text-muted-foreground" />
        <a
          :href="`mailto:${company.attributes.email}`"
          class="text-accent hover:text-accent/80 font-medium truncate"
        >
          {{ company.attributes.email }}
        </a>
      </div>

      <!-- Website -->
      <div v-if="company.attributes.website" class="flex items-center gap-2 text-sm">
        <ExternalLink class="w-4 h-4 text-muted-foreground" />
        <a
          :href="company.attributes.website"
          target="_blank"
          rel="noopener noreferrer"
          class="text-accent hover:text-accent/80 font-medium truncate"
        >
          Visit Website
        </a>
      </div>
    </div>

    <!-- View Details Button -->
    <div class="mt-4 pt-4 border-t border-border">
      <NuxtLink
        :to="company.attributes.url_path"
        class="block w-full"
      >
        <UiButton variant="outline" class="w-full">
          View Details
        </UiButton>
      </NuxtLink>
    </div>
  </UiCard>
</template>

