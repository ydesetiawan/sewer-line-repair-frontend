<script setup lang="ts">
import { Loader2, AlertCircle, RefreshCw, Phone, Mail, Globe, MapPin, Clock, Star, Shield, Award, CheckCircle } from 'lucide-vue-next'
import type { ICompanyDetail } from '@/types/company-detail'

interface Props {
  companySlug: string
}

const props = defineProps<Props>()

// State
const company = ref<ICompanyDetail | null>(null)
const loading = ref(false)
const error = ref<Error | null>(null)

const { $publicApi } = useNuxtApp()

/**
 * Fetch company details from API
 * Uses company slug to get company ID from URL or lookup
 */
const fetchCompanyDetail = async () => {
  loading.value = true
  error.value = null

  try {
    // Extract company ID from slug or make API call to get company by slug
    // For now, assuming the slug contains ID at the end (e.g., "company-name-123")
    const companyId = extractIdFromSlug(props.companySlug)

    const response = await ($publicApi as any)(
      `/api/v1/companies/${companyId}`
    )

    company.value = response.data
  } catch (err) {
    error.value = err instanceof Error ? err : new Error('Failed to fetch company details')
    console.error('Error fetching company detail:', err)
  } finally {
    loading.value = false
  }
}

/**
 * Extract company ID from slug
 * Assumes format: "company-name-123" where 123 is the ID
 */
const extractIdFromSlug = (slug: string): string => {
  const parts = slug.split('-')
  const lastPart = parts[parts.length - 1]

  // Check if last part exists and is a number
  if (lastPart && /^\d+$/.test(lastPart)) {
    return lastPart
  }

  // If no ID found, return slug as is (API should handle)
  return slug
}

/**
 * Format working hours for display
 */
const formattedWorkingHours = computed(() => {
  if (!company.value?.attributes.working_hours) return []

  const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const hours = company.value.attributes.working_hours

  return daysOrder.map(day => ({
    day,
    hours: hours[day as keyof typeof hours] || 'Closed',
    isClosed: hours[day as keyof typeof hours] === 'Closed'
  }))
})

/**
 * Check if company is currently open
 */
const isCurrentlyOpen = computed(() => {
  if (!company.value?.attributes.working_hours) return false

  const now = new Date()
  const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' })
  const hours = company.value.attributes.working_hours
  const currentHours = hours[currentDay as keyof typeof hours]

  if (!currentHours || currentHours === 'Closed') return false

  // Simple check - can be enhanced with actual time parsing
  return true
})

/**
 * Format average rating to 1 decimal place
 */
const formattedRating = computed(() => {
  if (!company.value) return '0.0'
  return parseFloat(company.value.attributes.average_rating).toFixed(1)
})

/**
 * Get service level badge color
 */
const serviceLevelColor = computed(() => {
  if (!company.value) return 'bg-gray-100 text-gray-800'

  const level = company.value.attributes.service_level
  const colors = {
    Basic: 'bg-gray-100 text-gray-800',
    Standard: 'bg-blue-100 text-blue-800',
    Premium: 'bg-purple-100 text-purple-800',
    Elite: 'bg-amber-100 text-amber-800'
  }

  return colors[level] || colors.Basic
})

/**
 * Company trust badges based on attributes
 */
const trustBadges = computed(() => {
  if (!company.value) return []

  const attrs = company.value.attributes
  const badges = []

  if (attrs.verified_professional) {
    badges.push({ label: 'Verified Professional', icon: CheckCircle, color: 'text-green-600' })
  }
  if (attrs.licensed) {
    badges.push({ label: 'Licensed', icon: Award, color: 'text-blue-600' })
  }
  if (attrs.insured) {
    badges.push({ label: 'Insured', icon: Shield, color: 'text-blue-600' })
  }
  if (attrs.background_checked) {
    badges.push({ label: 'Background Checked', icon: Shield, color: 'text-green-600' })
  }
  if (attrs.certified_partner) {
    badges.push({ label: 'Certified Partner', icon: Award, color: 'text-purple-600' })
  }
  if (attrs.service_guarantee) {
    badges.push({ label: 'Service Guarantee', icon: Shield, color: 'text-amber-600' })
  }

  return badges
})

/**
 * Generate star rating display
 */
const starRating = computed(() => {
  if (!company.value) return []
  const rating = parseFloat(company.value.attributes.average_rating)
  const stars = []

  for (let i = 1; i <= 5; i++) {
    stars.push({
      filled: i <= Math.floor(rating),
      half: i === Math.ceil(rating) && rating % 1 !== 0
    })
  }

  return stars
})

// Fetch data on mount
onMounted(() => {
  fetchCompanyDetail()
})
</script>

<template>
  <div>
    <!-- Loading State -->
    <div v-if="loading" class="py-20">
      <div class="text-center space-y-4">
        <Loader2 class="w-16 h-16 text-accent animate-spin mx-auto" />
        <p class="text-lg text-muted-foreground">Loading company details...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-20">
      <div class="max-w-md mx-auto space-y-6">
        <AlertCircle class="w-20 h-20 text-destructive mx-auto" />
        <div>
          <h2 class="text-2xl font-bold mb-2">Failed to load company details</h2>
          <p class="text-muted-foreground">{{ error.message }}</p>
        </div>
        <BaseButton @click="fetchCompanyDetail" variant="outline" size="lg" class="gap-2">
          <RefreshCw class="w-5 h-5" />
          Try Again
        </BaseButton>
      </div>
    </div>

    <!-- Company Detail Content -->
    <div v-else-if="company" class="space-y-8">
      <!-- Header Section -->
      <div class="border-b pb-6">
        <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-4">
          <div class="flex-1">
            <h1 class="text-4xl font-bold mb-2">{{ company.attributes.name }}</h1>
            <p class="text-lg text-muted-foreground mb-4">{{ company.attributes.specialty }}</p>

            <!-- Service Level Badge -->
            <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold" :class="serviceLevelColor">
              <Award class="w-5 h-5" />
              {{ company.attributes.service_level }} Service
            </div>
          </div>

          <!-- Rating Box -->
          <div class="text-center lg:text-right bg-secondary p-6 rounded-lg">
            <div class="flex items-center gap-2 justify-center lg:justify-end mb-2">
              <div class="flex gap-1">
                <Star
                  v-for="(star, index) in starRating"
                  :key="index"
                  class="w-5 h-5"
                  :class="star.filled ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'"
                />
              </div>
              <span class="text-3xl font-bold">{{ formattedRating }}</span>
            </div>
            <p class="text-sm text-muted-foreground">
              {{ company.attributes.total_reviews }} {{ company.attributes.total_reviews === 1 ? 'review' : 'reviews' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Trust Badges Section -->
      <div v-if="trustBadges.length > 0">
        <h2 class="text-xl font-bold mb-4">Trust & Safety</h2>
        <div class="flex flex-wrap gap-3">
          <div
            v-for="badge in trustBadges"
            :key="badge.label"
            class="flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg border"
          >
            <component :is="badge.icon" class="w-4 h-4" :class="badge.color" />
            <span class="text-sm font-medium">{{ badge.label }}</span>
          </div>
        </div>
      </div>

      <!-- Description -->
      <div>
        <h2 class="text-2xl font-bold mb-4">About</h2>
        <p class="text-muted-foreground leading-relaxed text-lg">
          {{ company.attributes.description }}
        </p>
      </div>

      <!-- Contact Information -->
      <div>
        <h2 class="text-2xl font-bold mb-4">Contact Information</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Phone -->
          <a
            :href="`tel:${company.attributes.phone}`"
            class="flex items-center gap-3 p-4 border rounded-lg hover:bg-secondary transition-colors group"
          >
            <div class="p-2 bg-accent/10 rounded-lg group-hover:bg-accent/20 transition-colors">
              <Phone class="w-5 h-5 text-accent" />
            </div>
            <div>
              <p class="text-sm text-muted-foreground">Phone</p>
              <p class="font-semibold">{{ company.attributes.phone }}</p>
            </div>
          </a>

          <!-- Email -->
          <a
            :href="`mailto:${company.attributes.email}`"
            class="flex items-center gap-3 p-4 border rounded-lg hover:bg-secondary transition-colors group"
          >
            <div class="p-2 bg-accent/10 rounded-lg group-hover:bg-accent/20 transition-colors">
              <Mail class="w-5 h-5 text-accent" />
            </div>
            <div>
              <p class="text-sm text-muted-foreground">Email</p>
              <p class="font-semibold truncate">{{ company.attributes.email }}</p>
            </div>
          </a>

          <!-- Website -->
          <a
            v-if="company.attributes.website"
            :href="company.attributes.website"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-3 p-4 border rounded-lg hover:bg-secondary transition-colors group"
          >
            <div class="p-2 bg-accent/10 rounded-lg group-hover:bg-accent/20 transition-colors">
              <Globe class="w-5 h-5 text-accent" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm text-muted-foreground">Website</p>
              <p class="font-semibold truncate">{{ company.attributes.website }}</p>
            </div>
          </a>

          <!-- Address -->
          <div class="flex items-center gap-3 p-4 border rounded-lg">
            <div class="p-2 bg-accent/10 rounded-lg">
              <MapPin class="w-5 h-5 text-accent" />
            </div>
            <div>
              <p class="text-sm text-muted-foreground">Address</p>
              <p class="font-semibold">{{ company.attributes.full_address }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Working Hours -->
      <div>
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-2xl font-bold">Working Hours</h2>
          <div v-if="isCurrentlyOpen" class="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full">
            <Clock class="w-4 h-4" />
            <span class="text-sm font-semibold">Open Now</span>
          </div>
          <div v-else class="flex items-center gap-2 text-red-600 bg-red-50 px-3 py-1 rounded-full">
            <Clock class="w-4 h-4" />
            <span class="text-sm font-semibold">Closed</span>
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div
            v-for="schedule in formattedWorkingHours"
            :key="schedule.day"
            class="flex justify-between items-center p-3 border rounded-lg"
            :class="schedule.isClosed ? 'bg-gray-50' : ''"
          >
            <span class="font-medium">{{ schedule.day }}</span>
            <span class="text-muted-foreground" :class="schedule.isClosed ? 'text-red-600' : ''">
              {{ schedule.hours }}
            </span>
          </div>
        </div>
      </div>

      <!-- Service Categories -->
      <div v-if="company.attributes.service_categories.length > 0">
        <h2 class="text-2xl font-bold mb-4">Services Offered</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div
            v-for="category in company.attributes.service_categories"
            :key="category.id"
            class="p-5 border rounded-lg hover:bg-secondary transition-colors"
          >
            <h3 class="font-semibold text-lg mb-2">{{ category.name }}</h3>
            <p class="text-sm text-muted-foreground">{{ category.description }}</p>
          </div>
        </div>
      </div>

      <!-- Reviews Section -->
      <div v-if="company.attributes.reviews.length > 0">
        <h2 class="text-2xl font-bold mb-4">Customer Reviews</h2>
        <div class="space-y-4">
          <div
            v-for="review in company.attributes.reviews"
            :key="review.id"
            class="p-5 border rounded-lg"
          >
            <div class="flex items-center gap-2 mb-2">
              <div class="flex gap-1">
                <Star
                  v-for="i in 5"
                  :key="i"
                  class="w-4 h-4"
                  :class="i <= review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'"
                />
              </div>
              <span class="font-semibold">{{ review.author }}</span>
            </div>
            <p class="text-muted-foreground">{{ review.comment }}</p>
            <p class="text-xs text-muted-foreground mt-2">
              {{ new Date(review.created_at).toLocaleDateString() }}
            </p>
          </div>
        </div>
      </div>

      <!-- No Reviews Message -->
      <div v-else class="text-center py-8 bg-secondary rounded-lg">
        <p class="text-muted-foreground">No reviews yet. Be the first to review this company!</p>
      </div>
    </div>
  </div>
</template>

