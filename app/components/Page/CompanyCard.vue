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
  BadgeCheck,
  ChevronRight
} from 'lucide-vue-next'
import type {ICompany, ServiceLevel} from "@/types/company";

interface Props {
  company: ICompany
}

const props = defineProps<Props>()

// Service level badge colors - Google-style minimalist
const serviceLevelStyles: Record<ServiceLevel, string> = {
  Basic: 'bg-gray-50 text-gray-700 border-gray-200',
  Standard: 'bg-blue-50 text-blue-700 border-blue-200',
  Premium: 'bg-purple-50 text-purple-700 border-purple-200',
  Elite: 'bg-amber-50 text-amber-700 border-amber-200',
}

// Format rating
const rating = computed(() => parseFloat(props.company.attributes.average_rating))

// Trust badges with more descriptive labels for SEO
const trustBadges = computed(() => {
  const attrs = props.company.attributes
  return [
    { show: attrs.verified_professional, label: 'Verified Professional', icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-50' },
    { show: attrs.licensed, label: 'Licensed & Certified', icon: Award, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { show: attrs.insured, label: 'Fully Insured', icon: Shield, color: 'text-purple-600', bgColor: 'bg-purple-50' },
    { show: attrs.background_checked, label: 'Background Checked', icon: ShieldCheck, color: 'text-indigo-600', bgColor: 'bg-indigo-50' },
    { show: attrs.certified_partner, label: 'Certified Partner', icon: Star, color: 'text-amber-600', bgColor: 'bg-amber-50' },
    { show: attrs.service_guarantee, label: 'Service Guarantee', icon: BadgeCheck, color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
  ].filter(badge => badge.show)
})

// Truncate description for preview
const truncatedDescription = computed(() => {
  const desc = props.company.attributes.description
  return desc.length > 160 ? desc.substring(0, 160) + '...' : desc
})
</script>

<template>
  <!-- Article tag for better SEO structure -->
  <article
    itemscope
    itemtype="https://schema.org/LocalBusiness"
    class="group bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 overflow-hidden"
  >
    <!-- Hidden structured data for SEO -->
    <meta itemprop="name" :content="company.attributes.name" />
    <meta itemprop="telephone" :content="company.attributes.phone" />
    <meta itemprop="email" :content="company.attributes.email" />
    <link itemprop="url" :href="company.attributes.website" />

    <NuxtLink
      :to="company.attributes.url_path"
      class="block p-5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg"
      :aria-label="`View details for ${company.attributes.name}`"
    >
      <!-- Header Section -->
      <header class="mb-3">
        <div class="flex items-start justify-between gap-3 mb-2">
          <!-- Company Name - H3 for SEO hierarchy -->
          <h3 class="text-lg font-medium text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-2 flex-1">
            {{ company.attributes.name }}
          </h3>

          <!-- Service Level Badge -->
          <span
            class="px-2.5 py-0.5 text-xs font-medium rounded border shrink-0"
            :class="serviceLevelStyles[company.attributes.service_level]"
            :aria-label="`Service level: ${company.attributes.service_level}`"
          >
            {{ company.attributes.service_level }}
          </span>
        </div>

        <!-- Rating & Reviews Section -->
        <div class="flex items-center gap-2 mb-2">
          <div class="flex items-center gap-0.5" role="img" :aria-label="`Rating: ${rating} out of 5 stars`">
            <Star
              v-for="i in 5"
              :key="i"
              class="w-4 h-4"
              :class="i <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300 fill-gray-300'"
              aria-hidden="true"
            />
          </div>
          <span class="text-sm font-medium text-gray-900">{{ rating.toFixed(1) }}</span>
          <span class="text-sm text-gray-600">
            (<span>{{ company.attributes.total_reviews }}</span>
            {{ company.attributes.total_reviews !== 1 ? 'reviews' : 'review' }})
          </span>
          <meta itemprop="bestRating" content="5" />
          <meta itemprop="worstRating" content="1" />
        </div>

        <!-- Address -->
        <div class="flex mb-4 items-start gap-2 text-sm text-gray-600">
          <MapPin class="w-4 h-4 flex-shrink-0 mt-0.5 text-gray-400" aria-hidden="true" />
          <span>{{ company.attributes.full_address }}</span>
        </div>

        <!-- Trust Badges - Horizontal on desktop -->
        <div v-if="trustBadges.length > 0" class="flex flex-wrap items-center gap-2 mb-3">
          <span
            v-for="badge in trustBadges"
            :key="badge.label"
            class="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border transition-colors"
            :class="`${badge.bgColor} ${badge.color} border-current/20`"
            :title="badge.label"
          >
            <component :is="badge.icon" class="w-3.5 h-3.5" aria-hidden="true" />
            <span class="hidden sm:inline">{{ badge.label }}</span>
          </span>
        </div>
      </header>

      <!-- Description Section -->
      <div class="mb-4">
        <p class="text-sm text-gray-600 leading-relaxed line-clamp-3">
          {{ truncatedDescription }}
        </p>
      </div>

      <!-- Contact Information Section -->
      <div class="flex flex-wrap space-x-4 pt-4 border-t border-gray-100">

        <!-- Phone -->
        <div class="flex items-center gap-2 text-sm">
          <Phone class="w-4 h-4 text-gray-400" aria-hidden="true" />
          <a
            :href="`tel:${company.attributes.phone}`"
            class="text-blue-600 hover:text-blue-700 font-medium hover:underline"
            @click.stop
          >
            {{ company.attributes.phone }}
          </a>
        </div>

        <!-- Email -->
        <div v-if="company.attributes.email" class="flex items-center gap-2 text-sm">
          <Mail class="w-4 h-4 text-gray-400" aria-hidden="true" />
          <a
            :href="`mailto:${company.attributes.email}`"
            class="text-blue-600 hover:text-blue-700 font-medium hover:underline truncate"
            @click.stop
          >
            {{ company.attributes.email }}
          </a>
        </div>

        <!-- Website -->
        <div v-if="company.attributes.website" class="flex items-center gap-2 text-sm">
          <ExternalLink class="w-4 h-4 text-gray-400" aria-hidden="true" />
          <a
            :href="company.attributes.website"
            target="_blank"
            rel="noopener noreferrer"
            class="text-blue-600 hover:text-blue-700 font-medium hover:underline truncate"
            @click.stop
          >
            Visit Website
          </a>
        </div>
      </div>
    </NuxtLink>
  </article>
</template>

