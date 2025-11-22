<script setup lang="ts">
import { Loader2, AlertCircle, RefreshCw, Phone, Mail, Globe, MapPin, Clock, Star, Shield, Award, CheckCircle, MessageSquare } from 'lucide-vue-next'
import type { ICompanyDetail, IFormattedSchedule } from '@/types/company-detail'

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
 * Format average rating to 1 decimal place
 */
const formattedRating = computed(() => {
  if (!company.value) return '0.0'
  return parseFloat(company.value.attributes.average_rating).toFixed(1)
})

/**
 * Get service level badge color class
 */
const serviceLevelColorClass = computed(() => {
  if (!company.value) return 'bg-muted text-muted-foreground'

  const level = company.value.attributes.service_level
  const colors: Record<string, string> = {
    Basic: 'bg-muted text-muted-foreground',
    Standard: 'bg-accent/10 text-accent',
    Premium: 'bg-purple-100 text-purple-800',
    Elite: 'bg-amber-100 text-amber-800'
  }

  return colors[level] || colors.Basic
})

/**
 * Extract domain from website URL
 */
const getWebsiteDomain = (url: string): string => {
  try {
    const urlObj = new URL(url)
    return urlObj.hostname.replace('www.', '')
  } catch {
    return url
  }
}

/**
 * Company trust badges with color classes
 */
const trustBadges = computed(() => {
  if (!company.value) return []

  const attrs = company.value.attributes
  const badges = []

  if (attrs.verified_professional) {
    badges.push({
      label: 'Verified Professional',
      icon: CheckCircle,
      colorClass: 'bg-accent/10 text-accent'
    })
  }
  if (attrs.licensed) {
    badges.push({
      label: 'Licensed',
      icon: Shield,
      colorClass: 'bg-green-100 text-green-800'
    })
  }
  if (attrs.insured) {
    badges.push({
      label: 'Insured',
      icon: Shield,
      colorClass: 'bg-green-100 text-green-800'
    })
  }
  if (attrs.background_checked) {
    badges.push({
      label: 'Background Checked',
      icon: CheckCircle,
      colorClass: 'bg-orange-100 text-orange-800'
    })
  }
  if (attrs.certified_partner) {
    badges.push({
      label: 'Certified Partner',
      icon: Award,
      colorClass: 'bg-purple-100 text-purple-800'
    })
  }
  if (attrs.service_guarantee) {
    badges.push({
      label: 'Service Guarantee',
      icon: Shield,
      colorClass: 'bg-teal-100 text-teal-800'
    })
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

/**
 * Parse time string to minutes (e.g., "8:00 AM" => 480)
 */
const parseTimeToMinutes = (timeStr: string): number => {
  const [time, period] = timeStr.split(' ')
  const [hours, minutes] = time.split(':').map(Number)

  let totalHours = hours
  if (period === 'PM' && hours !== 12) {
    totalHours += 12
  } else if (period === 'AM' && hours === 12) {
    totalHours = 0
  }

  return totalHours * 60 + minutes
}

/**
 * Check if currently open based on working hours
 */
const isCurrentlyOpen = computed(() => {
  if (!company.value?.attributes.working_hours) return false

  const now = new Date()
  const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' })
  const currentTime = now.getHours() * 60 + now.getMinutes()

  const todayHours = company.value.attributes.working_hours[currentDay]

  if (!todayHours || todayHours.toLowerCase() === 'closed') {
    return false
  }

  // Parse hours like "8:00 AM - 5:00 PM"
  const [openTime, closeTime] = todayHours.split(' - ')
  const openMinutes = parseTimeToMinutes(openTime)
  const closeMinutes = parseTimeToMinutes(closeTime)

  return currentTime >= openMinutes && currentTime < closeMinutes
})

/**
 * Format working hours for display with today highlight
 */
const formattedWorkingHours = computed<IFormattedSchedule[]>(() => {
  if (!company.value?.attributes.working_hours) return []

  const now = new Date()
  const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' })

  const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  return daysOrder.map(day => {
    const hours = company.value!.attributes.working_hours[day] || 'Closed'
    return {
      day,
      hours,
      isClosed: hours.toLowerCase() === 'closed',
      isToday: day === currentDay
    }
  })
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
        <BaseButton @click="fetchCompanyDetail" variant="default" class="gap-2">
          <RefreshCw class="w-5 h-5" />
          Try Again
        </BaseButton>
      </div>
    </div>

    <!-- Company Detail Content - Two Column Layout -->
    <div v-else-if="company" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Left Column - Main Content -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Header Section -->
        <BaseCard class="p-6">
          <div class="mb-4">
            <h1 class="text-3xl font-bold mb-2">{{ company.attributes.name }}</h1>

            <!-- Rating -->
            <div class="flex items-center gap-3 mb-3">
              <div class="flex items-center">
                <div class="flex text-yellow-400">
                  <Star
                    v-for="(star, index) in starRating"
                    :key="index"
                    class="w-5 h-5"
                    :class="star.filled ? 'fill-yellow-400' : 'fill-muted text-muted'"
                  />
                </div>
                <span class="ml-2 font-semibold">{{ formattedRating }}</span>
              </div>
              <span class="text-sm text-muted-foreground">
                ({{ company.attributes.total_reviews }} {{ company.attributes.total_reviews === 1 ? 'review' : 'reviews' }})
              </span>
            </div>

            <!-- Address -->
            <div class="flex items-center text-muted-foreground mb-2">
              <MapPin class="w-4 h-4 mr-2" />
              <span>{{ company.attributes.full_address }}</span>
            </div>

            <!-- Service Area -->
            <p class="text-sm text-muted-foreground">
              <span class="font-medium">Serving:</span> {{ company.attributes.full_address }}
            </p>
          </div>

          <!-- Trust Badges -->
          <div class="flex flex-wrap gap-2 mb-4">
            <span
              v-for="badge in trustBadges"
              :key="badge.label"
              class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
              :class="badge.colorClass"
            >
              <component :is="badge.icon" class="w-3 h-3 mr-1" />
              {{ badge.label }}
            </span>
            <span
              class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
              :class="serviceLevelColorClass"
            >
              <Award class="w-3 h-3 mr-1" />
              {{ company.attributes.service_level }} Service
            </span>
          </div>

          <!-- Specialty -->
          <div class="border-t pt-4">
            <p class="text-sm text-muted-foreground">
              <span class="font-semibold">Specialty:</span>
              <span>{{ company.attributes.specialty }}</span>
            </p>
          </div>
        </BaseCard>

        <!-- About Section -->
        <BaseCard class="p-6">
          <h2 class="text-2xl font-bold mb-4">About Us</h2>
          <p class="text-muted-foreground leading-relaxed">
            {{ company.attributes.description }}
          </p>
        </BaseCard>

        <!-- Service Categories -->
        <BaseCard v-if="company.attributes.service_categories.length > 0" class="p-6">
          <h2 class="text-2xl font-bold mb-4">Our Services</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="category in company.attributes.service_categories"
              :key="category.id"
              class="border rounded-lg p-4 hover:border-accent hover:shadow-md transition-all cursor-pointer"
            >
              <div class="flex items-start">
                <div class="bg-accent/10 rounded-lg p-3 mr-4">
                  <Award class="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 class="font-semibold mb-1">{{ category.name }}</h3>
                  <p class="text-sm text-muted-foreground">{{ category.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </BaseCard>

        <!-- Working Hours -->
        <BaseCard class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-2xl font-bold">Business Hours</h2>
            <div v-if="isCurrentlyOpen" class="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full">
              <Clock class="w-4 h-4" />
              <span class="text-sm font-semibold">Open Now</span>
            </div>
            <div v-else class="flex items-center gap-2 text-destructive bg-destructive/10 px-3 py-1 rounded-full">
              <Clock class="w-4 h-4" />
              <span class="text-sm font-semibold">Closed</span>
            </div>
          </div>
          <div class="space-y-3">
            <div
              v-for="schedule in formattedWorkingHours"
              :key="schedule.day"
              class="flex justify-between items-center py-2 border-b last:border-b-0"
              :class="schedule.isToday ? 'bg-accent/5 -mx-2 px-2 rounded' : ''"
            >
              <span class="font-medium" :class="schedule.isToday ? 'text-accent' : ''">
                {{ schedule.day }}
                <span v-if="schedule.isToday" class="text-xs ml-1">(Today)</span>
              </span>
              <span
                class="text-muted-foreground"
                :class="schedule.isClosed ? 'text-destructive font-medium' : ''"
              >
                {{ schedule.hours }}
              </span>
            </div>
          </div>
        </BaseCard>

        <!-- Reviews Section -->
        <BaseCard class="p-6">
          <h2 class="text-2xl font-bold mb-4">Customer Reviews</h2>

          <!-- No Reviews -->
          <div v-if="company.attributes.reviews.length === 0" class="text-center py-12">
            <MessageSquare class="w-12 h-12 text-muted mx-auto mb-4" />
            <p class="text-muted-foreground text-lg mb-2">No reviews yet</p>
            <p class="text-muted-foreground text-sm">Be the first to review this business</p>
          </div>

          <!-- Reviews List -->
          <div v-else class="space-y-4">
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
                    :class="i <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted fill-muted'"
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
        </BaseCard>
      </div>

      <!-- Right Column - Contact Sidebar -->
      <div class="lg:col-span-1">
        <BaseCard class="p-6 sticky top-4 space-y-4">
          <h3 class="text-xl font-bold mb-4">Contact Information</h3>

          <!-- Phone -->
          <a
            :href="`tel:${company.attributes.phone}`"
            class="flex items-center p-4 bg-accent/10 rounded-lg hover:bg-accent/20 transition-colors"
          >
            <div class="bg-accent rounded-lg p-3 mr-4">
              <Phone class="w-5 h-5 text-white" />
            </div>
            <div>
              <p class="text-xs text-muted-foreground mb-1">Call Us</p>
              <p class="font-semibold text-accent">{{ company.attributes.phone }}</p>
            </div>
          </a>

          <!-- Email -->
          <a
            :href="`mailto:${company.attributes.email}`"
            class="flex items-center p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
          >
            <div class="bg-foreground rounded-lg p-3 mr-4">
              <Mail class="w-5 h-5 text-background" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-xs text-muted-foreground mb-1">Email Us</p>
              <p class="font-semibold text-sm break-all">{{ company.attributes.email }}</p>
            </div>
          </a>

          <!-- Website -->
          <a
            v-if="company.attributes.website"
            :href="company.attributes.website"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <div class="bg-green-600 rounded-lg p-3 mr-4">
              <Globe class="w-5 h-5 text-white" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-xs text-muted-foreground mb-1">Visit Website</p>
              <p class="font-semibold text-green-600 text-sm truncate">{{ getWebsiteDomain(company.attributes.website) }}</p>
            </div>
            <Award class="w-4 h-4 text-green-600 flex-shrink-0" />
          </a>

          <!-- CTA Button -->
          <BaseButton class="w-full" variant="default">
            <Clock class="w-5 h-5 mr-2" />
            Request Service
          </BaseButton>

          <!-- Service Guarantee -->
          <div v-if="company.attributes.service_guarantee" class="border-t pt-4 mt-4">
            <div class="bg-green-50 border border-green-200 rounded-lg p-4">
              <div class="flex items-start">
                <Shield class="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h4 class="font-semibold mb-1">Service Guarantee</h4>
                  <p class="text-sm text-muted-foreground">
                    All work backed by our satisfaction guarantee. Call us for emergency repairs any time.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Professional Certifications -->
          <div class="border-t pt-4 mt-4">
            <h4 class="font-semibold mb-3">Professional Certifications</h4>
            <div class="space-y-2 text-sm">
              <div class="flex items-center">
                <CheckCircle
                  :class="company.attributes.verified_professional ? 'text-green-500' : 'text-muted'"
                  class="w-4 h-4 mr-2 flex-shrink-0"
                />
                <span :class="company.attributes.verified_professional ? '' : 'text-muted-foreground'">
                  Verified Professional
                </span>
              </div>
              <div class="flex items-center">
                <CheckCircle
                  :class="company.attributes.insured ? 'text-green-500' : 'text-muted'"
                  class="w-4 h-4 mr-2 flex-shrink-0"
                />
                <span :class="company.attributes.insured ? '' : 'text-muted-foreground'">
                  Fully Insured
                </span>
              </div>
              <div class="flex items-center">
                <CheckCircle
                  :class="company.attributes.background_checked ? 'text-green-500' : 'text-muted'"
                  class="w-4 h-4 mr-2 flex-shrink-0"
                />
                <span :class="company.attributes.background_checked ? '' : 'text-muted-foreground'">
                  Background Checked
                </span>
              </div>
              <div class="flex items-center">
                <CheckCircle
                  :class="company.attributes.licensed ? 'text-green-500' : 'text-muted'"
                  class="w-4 h-4 mr-2 flex-shrink-0"
                />
                <span :class="company.attributes.licensed ? '' : 'text-muted-foreground'">
                  {{ company.attributes.licensed ? 'Licensed' : 'Not Licensed' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Location Map Placeholder -->
          <div class="border-t pt-4 mt-4">
            <h4 class="font-semibold mb-3">Location</h4>
            <div class="bg-muted rounded-lg h-48 flex items-center justify-center">
              <div class="text-center">
                <MapPin class="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                <p class="text-muted-foreground text-sm">Map integration coming soon</p>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>
  </div>
</template>

