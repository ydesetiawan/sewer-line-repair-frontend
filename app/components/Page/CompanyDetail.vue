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
 */
const fetchCompanyDetail = async () => {
  loading.value = true
  error.value = null

  try {
    const companyId = extractIdFromSlug(props.companySlug)
    const response = await ($publicApi as any)(`/api/v1/companies/${companyId}`)
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
 */
const extractIdFromSlug = (slug: string): string => {
  const parts = slug.split('-')
  const lastPart = parts[parts.length - 1]
  if (lastPart && /^\d+$/.test(lastPart)) {
    return lastPart
  }
  return slug
}

/**
 * Format average rating
 */
const formattedRating = computed(() => {
  if (!company.value) return '0.0'
  return parseFloat(company.value.attributes.average_rating).toFixed(1)
})

/**
 * Get service level badge color
 */
const serviceLevelClass = computed(() => {
  if (!company.value) return 'bg-gray-100 text-gray-800'

  const level = company.value.attributes.service_level
  const classes: Record<string, string> = {
    Basic: 'bg-gray-100 text-gray-800',
    Standard: 'bg-blue-100 text-blue-800',
    Premium: 'bg-purple-100 text-purple-800',
    Elite: 'bg-amber-100 text-amber-800'
  }

  return classes[level] || classes.Basic
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
 * Check if currently open
 */
const isCurrentlyOpen = computed(() => {
  if (!company.value?.attributes.working_hours) return false

  const now = new Date()
  const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' })
  const currentTime = now.getHours() * 60 + now.getMinutes()

  const todayHours = company.value.attributes.working_hours[currentDay as keyof typeof company.value.attributes.working_hours]

  if (!todayHours || todayHours.toLowerCase() === 'closed') return false

  try {
    const parts = todayHours.split(' - ')
    const start = parts[0]
    const end = parts[1]

    if (!start || !end) return false

    const startMatch = start.match(/(\d+):(\d+)/)
    const endMatch = end.match(/(\d+):(\d+)/)

    if (!startMatch || !endMatch) return false

    const startHourStr = startMatch[1]
    const startMinStr = startMatch[2]
    const endHourStr = endMatch[1]
    const endMinStr = endMatch[2]

    if (!startHourStr || !startMinStr || !endHourStr || !endMinStr) return false

    const startHour = Number(startHourStr)
    const startMin = Number(startMinStr)
    const endHour = Number(endHourStr)
    const endMin = Number(endMinStr)

    const startTime = (start.includes('PM') && startHour !== 12 ? startHour + 12 : startHour) * 60 + startMin
    const endTime = (end.includes('PM') && endHour !== 12 ? endHour + 12 : endHour) * 60 + endMin

    return currentTime >= startTime && currentTime <= endTime
  } catch {
    return false
  }
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
 * Format working hours for display
 */
const formattedWorkingHours = computed<IFormattedSchedule[]>(() => {
  if (!company.value?.attributes.working_hours) return []

  const now = new Date()
  const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' })

  const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const
  type DayOfWeek = typeof daysOrder[number]

  return daysOrder.map(day => {
    const hours = company.value!.attributes.working_hours[day as DayOfWeek] || 'Closed'
    return {
      day,
      hours,
      isClosed: hours.toLowerCase() === 'closed',
      isToday: day === currentDay
    }
  })
})

/**
 * Certifications list
 */
const certifications = computed(() => {
  if (!company.value) return []

  const attrs = company.value.attributes
  return [
    { label: 'Verified Professional', active: attrs.verified_professional, icon: CheckCircle },
    { label: 'Licensed', active: attrs.licensed, icon: Shield },
    { label: 'Fully Insured', active: attrs.insured, icon: Shield },
    { label: 'Background Checked', active: attrs.background_checked, icon: CheckCircle },
    { label: 'Certified Partner', active: attrs.certified_partner, icon: Award },
    { label: 'Service Guarantee', active: attrs.service_guarantee, icon: Shield }
  ].filter(cert => cert.active)
})

// Fetch data on mount
onMounted(() => {
  fetchCompanyDetail()
})
</script>

<template>
  <div class="min-h-screen">
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

    <!-- Company Detail Content -->
    <div v-else-if="company" class="space-y-6">
      <!-- Hero Header Section -->
      <BaseCard class="overflow-hidden">
        <div class="relative bg-gradient-to-br from-accent/10 via-accent/5 to-transparent p-8">
          <!-- Decorative Background -->
          <div class="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full -translate-y-32 translate-x-32 blur-3xl"></div>

          <div class="relative">
            <!-- Company Name & Status -->
            <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-3">
                  <h1 class="text-4xl font-bold">{{ company.attributes.name }}</h1>
                  <span
                    class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold"
                    :class="serviceLevelClass"
                  >
                    <Award class="w-3.5 h-3.5 mr-1" />
                    {{ company.attributes.service_level }}
                  </span>
                </div>

                <!-- Rating & Reviews -->
                <div class="flex items-center gap-4 mb-3">
                  <div class="flex items-center gap-2">
                    <div class="flex text-yellow-400">
                      <Star
                        v-for="(star, index) in starRating"
                        :key="index"
                        class="w-5 h-5"
                        :class="star.filled ? 'fill-yellow-400' : 'fill-gray-300 text-gray-300'"
                      />
                    </div>
                    <span class="font-bold text-lg">{{ formattedRating }}</span>
                  </div>
                  <span class="text-muted-foreground">
                    {{ company.attributes.total_reviews }} {{ company.attributes.total_reviews === 1 ? 'review' : 'reviews' }}
                  </span>
                </div>

                <!-- Location & Specialty -->
                <div class="space-y-2">
                  <div class="flex items-start gap-2 text-muted-foreground">
                    <MapPin class="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span class="text-sm">{{ company.attributes.full_address }}</span>
                  </div>
<!--                  <div class="inline-flex items-center gap-2 px-3 py-1 bg-white/50 rounded-full border border-gray-200">-->
<!--                    <div class="w-1.5 h-1.5 bg-accent rounded-full"></div>-->
<!--                    <span class="text-sm font-medium text-gray-700">{{ company.attributes.specialty }}</span>-->
<!--                  </div>-->
                </div>
              </div>

              <!-- Status Badge -->
              <div class="flex-shrink-0">
                <div
                  class="inline-flex items-center gap-2 px-4 py-2.5 rounded-full shadow-sm font-semibold text-sm"
                  :class="isCurrentlyOpen ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'"
                >
                  <div
                    class="w-2 h-2 rounded-full bg-white"
                    :class="isCurrentlyOpen ? 'animate-pulse' : 'opacity-70'"
                  ></div>
                  {{ isCurrentlyOpen ? 'Open Now' : 'Closed' }}
                </div>
              </div>
            </div>

            <!-- Certification Badges -->
            <div class="flex flex-wrap gap-2">
              <span
                v-for="cert in certifications"
                :key="cert.label"
                class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-white shadow-sm border border-gray-200"
              >
                <component :is="cert.icon" class="w-3.5 h-3.5 mr-1.5 text-green-600" />
                {{ cert.label }}
              </span>
            </div>
          </div>
        </div>
      </BaseCard>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column - Main Content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- About Section -->
          <BaseCard class="p-6">
            <h2 class="text-2xl font-bold mb-4 flex items-center gap-2">
              <MessageSquare class="w-6 h-6 text-accent" />
              About
            </h2>
            <p class="text-muted-foreground leading-relaxed">
              {{ company.attributes.description }}
            </p>
          </BaseCard>

          <!-- Services Section -->
          <BaseCard v-if="company.attributes.service_categories.length > 0" class="p-6">
            <h2 class="text-2xl font-bold mb-6 flex items-center gap-2">
              <Award class="w-6 h-6 text-accent" />
              Our Services
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                v-for="category in company.attributes.service_categories"
                :key="category.id"
                class="group p-4 border-2 border-gray-200 rounded-xl hover:border-accent hover:shadow-md transition-all duration-200"
              >
                <div class="flex items-start gap-3">
                  <div class="bg-accent/10 rounded-lg p-2 group-hover:bg-accent group-hover:shadow-lg transition-all">
                    <Award class="w-5 h-5 text-accent group-hover:text-white transition-colors" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <h3 class="font-bold mb-1 group-hover:text-accent transition-colors">
                      {{ category.name }}
                    </h3>
                    <p class="text-sm text-muted-foreground leading-snug">
                      {{ category.description }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </BaseCard>

          <!-- Business Hours -->
          <BaseCard class="p-6">
            <h2 class="text-2xl font-bold mb-6 flex items-center gap-2">
              <Clock class="w-6 h-6 text-accent" />
              Business Hours
            </h2>
            <div class="space-y-1">
              <div
                v-for="schedule in formattedWorkingHours"
                :key="schedule.day"
                class="flex justify-between items-center py-3 px-4 rounded-lg transition-colors"
                :class="schedule.isToday ? 'bg-accent/10 font-semibold' : 'hover:bg-gray-50'"
              >
                <span :class="schedule.isToday ? 'text-accent' : 'text-gray-900'">
                  {{ schedule.day }}
                  <span v-if="schedule.isToday" class="ml-2 text-xs px-2 py-0.5 bg-accent text-white rounded-full">
                    Today
                  </span>
                </span>
                <span
                  class="font-medium"
                  :class="schedule.isClosed ? 'text-red-600' : 'text-muted-foreground'"
                >
                  {{ schedule.hours }}
                </span>
              </div>
            </div>
          </BaseCard>

          <!-- Reviews Section -->
          <BaseCard class="p-6">
            <h2 class="text-2xl font-bold mb-6 flex items-center gap-2">
              <Star class="w-6 h-6 text-accent" />
              Customer Reviews
            </h2>

            <!-- No Reviews -->
            <div v-if="company.attributes.reviews.length === 0" class="text-center py-12">
              <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare class="w-8 h-8 text-gray-400" />
              </div>
              <p class="text-lg font-medium text-gray-900 mb-1">No reviews yet</p>
              <p class="text-sm text-muted-foreground">Be the first to share your experience</p>
            </div>

            <!-- Reviews List -->
            <div v-else class="space-y-4">
              <div
                v-for="review in company.attributes.reviews"
                :key="review.id"
                class="p-4 border rounded-lg hover:shadow-sm transition-shadow"
              >
                <div class="flex items-center gap-2 mb-2">
                  <div class="flex">
                    <Star
                      v-for="i in 5"
                      :key="i"
                      class="w-4 h-4"
                      :class="i <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 fill-gray-300'"
                    />
                  </div>
                  <span class="font-semibold text-sm">{{ review.author }}</span>
                  <span class="text-xs text-muted-foreground">
                    · {{ new Date(review.created_at).toLocaleDateString() }}
                  </span>
                </div>
                <p class="text-sm text-muted-foreground">{{ review.comment }}</p>
              </div>
            </div>
          </BaseCard>
        </div>

        <!-- Right Column - Contact Sidebar -->
        <div class="lg:col-span-1">
          <div class="sticky top-4 space-y-4">
            <!-- Quick Contact -->
            <BaseCard class="p-6">
              <h3 class="font-bold text-lg mb-4">Contact Us</h3>

              <!-- Phone -->
              <a
                :href="`tel:${company.attributes.phone}`"
                class="flex items-center gap-3 p-4 mb-3 bg-gradient-to-r from-accent to-accent/90 text-white rounded-xl hover:shadow-lg transition-all group"
              >
                <div class="bg-white/20 rounded-lg p-2.5 group-hover:bg-white/30 transition-colors">
                  <Phone class="w-5 h-5" />
                </div>
                <div class="flex-1">
                  <p class="text-xs opacity-90 mb-0.5">Call Now</p>
                  <p class="font-bold">{{ company.attributes.phone }}</p>
                </div>
              </a>

              <!-- Email -->
              <a
                :href="`mailto:${company.attributes.email}`"
                class="flex items-center gap-3 p-4 mb-3 border-2 border-gray-200 rounded-xl hover:border-accent hover:bg-accent/5 transition-all group"
              >
                <div class="bg-gray-100 rounded-lg p-2.5 group-hover:bg-accent/10 transition-colors">
                  <Mail class="w-5 h-5 text-gray-600 group-hover:text-accent transition-colors" />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-xs text-muted-foreground mb-0.5">Email</p>
                  <p class="font-semibold text-sm truncate">{{ company.attributes.email }}</p>
                </div>
              </a>

              <!-- Website -->
              <a
                v-if="company.attributes.website"
                :href="company.attributes.website"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-accent hover:bg-accent/5 transition-all group"
              >
                <div class="bg-gray-100 rounded-lg p-2.5 group-hover:bg-accent/10 transition-colors">
                  <Globe class="w-5 h-5 text-gray-600 group-hover:text-accent transition-colors" />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-xs text-muted-foreground mb-0.5">Website</p>
                  <p class="font-semibold text-sm truncate">{{ getWebsiteDomain(company.attributes.website) }}</p>
                </div>
              </a>

              <!-- CTA Button -->
              <BaseButton class="w-full mt-4" variant="default" size="lg">
                Request Service
              </BaseButton>
            </BaseCard>

            <!-- Service Guarantee -->
            <BaseCard v-if="company.attributes.service_guarantee" class="p-5 bg-green-50 border-2 border-green-200">
              <div class="flex items-start gap-3">
                <div class="bg-green-500 rounded-lg p-2">
                  <Shield class="w-5 h-5 text-white" />
                </div>
                <div class="flex-1">
                  <h4 class="font-bold text-green-900 mb-1">Service Guarantee</h4>
                  <p class="text-sm text-green-800 leading-snug">
                    Quality work backed by our satisfaction guarantee
                  </p>
                </div>
              </div>
            </BaseCard>

            <!-- Location Map Placeholder -->
            <BaseCard class="p-5">
              <h4 class="font-bold mb-3">Location</h4>
              <div class="bg-gray-100 rounded-lg h-48 flex items-center justify-center">
                <div class="text-center">
                  <MapPin class="w-10 h-10 text-gray-400 mx-auto mb-2" />
                  <p class="text-sm text-muted-foreground">Map integration coming soon</p>
                </div>
              </div>
            </BaseCard>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

