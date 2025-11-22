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
import type {ICompany, ServiceLevel} from "@/types/company";

interface Props {
  company: ICompany
}

const props = defineProps<Props>()

// Service level badge colors - matching CompanyDetail style
const serviceLevelStyles: Record<ServiceLevel, string> = {
  Basic: 'bg-gray-100 text-gray-800',
  Standard: 'bg-blue-100 text-blue-800',
  Premium: 'bg-purple-100 text-purple-800',
  Elite: 'bg-amber-100 text-amber-800',
}

// Format rating
const rating = computed(() => parseFloat(props.company.attributes.average_rating))

// Trust badges with more descriptive labels for SEO
const trustBadges = computed(() => {
  const attrs = props.company.attributes
  return [
    { show: attrs.verified_professional, label: 'Verified Professional', icon: CheckCircle },
    { show: attrs.licensed, label: 'Licensed & Certified', icon: Award },
    { show: attrs.insured, label: 'Fully Insured', icon: Shield },
    { show: attrs.background_checked, label: 'Background Checked', icon: ShieldCheck },
    { show: attrs.certified_partner, label: 'Certified Partner', icon: Star },
    { show: attrs.service_guarantee, label: 'Service Guarantee', icon: BadgeCheck },
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
            class="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full shrink-0"
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

        <!-- Trust Badges -->
        <div v-if="trustBadges.length > 0" class="flex flex-wrap items-center gap-2 mb-3">
          <span
            v-for="badge in trustBadges"
            :key="badge.label"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-white shadow-sm border border-gray-200"
            :title="badge.label"
          >
            <component :is="badge.icon" class="w-3.5 h-3.5 text-green-600" aria-hidden="true" />
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

      <!-- Contact Information Section - Compact & Modern -->
      <footer class="pt-3 mt-3 border-t border-gray-100">
        <div class="flex flex-wrap gap-2">
          <!-- Phone - Primary Action -->
          <a
            :href="`tel:${company.attributes.phone}`"
            class="group/contact inline-flex items-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-500 border border-blue-200 hover:border-blue-500 rounded-lg transition-all duration-200 hover:shadow-sm"
            @click.stop
            :aria-label="`Call ${company.attributes.name}`"
          >
            <Phone class="w-3.5 h-3.5 text-blue-600 group-hover/contact:text-white transition-colors" aria-hidden="true" />
            <span class="text-xs font-medium text-blue-700 group-hover/contact:text-white transition-colors">
              {{ company.attributes.phone }}
            </span>
          </a>

          <!-- Email - Secondary Action -->
          <a
            v-if="company.attributes.email"
            :href="`mailto:${company.attributes.email}`"
            class="group/contact inline-flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-blue-500 border border-gray-200 hover:border-blue-500 rounded-lg transition-all duration-200 hover:shadow-sm"
            @click.stop
            :aria-label="`Email ${company.attributes.name}`"
          >
            <Mail class="w-3.5 h-3.5 text-gray-600 group-hover/contact:text-white transition-colors" aria-hidden="true" />
            <span class="text-xs font-medium text-gray-700 group-hover/contact:text-white transition-colors truncate max-w-[150px]">
              {{ company.attributes.email }}
            </span>
          </a>

          <!-- Website - Tertiary Action -->
          <a
            v-if="company.attributes.website"
            :href="company.attributes.website"
            target="_blank"
            rel="noopener noreferrer"
            class="group/contact inline-flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-blue-500 border border-gray-200 hover:border-blue-500 rounded-lg transition-all duration-200 hover:shadow-sm"
            @click.stop
            :aria-label="`Visit ${company.attributes.name} website`"
          >
            <ExternalLink class="w-3.5 h-3.5 text-gray-600 group-hover/contact:text-white transition-colors" aria-hidden="true" />
            <span class="text-xs font-medium text-gray-700 group-hover/contact:text-white transition-colors">
              Visit Website
            </span>
          </a>
        </div>
      </footer>
    </NuxtLink>
  </article>
</template>

