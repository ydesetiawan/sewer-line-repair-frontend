<script setup lang="ts">
import { Star, MapPin, Phone, Mail, Clock, BadgeCheck, Award } from 'lucide-vue-next'
import {
  CONTRACTORS,
  getStateSlug,
  getCitySlug,
  getProviderSlug,
} from '@/composables/useContractors'

definePageMeta({
  layout: 'default',
})

const route = useRoute()
const stateSlug = route.params.state as string
const citySlug = route.params.city as string
const providerSlug = route.params.provider as string

const contractor = CONTRACTORS.find((c) => getProviderSlug(c.name) === providerSlug)

if (!contractor) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Contractor not found',
  })
}

if (
  getStateSlug(contractor.state) !== stateSlug ||
  getCitySlug(contractor.city) !== citySlug
) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Contractor not found in this location',
  })
}

useSeoMeta({
  title: `${contractor.name} - Sewer Repair in ${contractor.city}, ${contractor.state}`,
  description: `${contractor.name} offers professional sewer repair services in ${contractor.city}, ${contractor.state}. Rating: ${contractor.rating}/5 from ${contractor.reviews} reviews.`,
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <nav class="mb-8 text-sm text-muted-foreground">
      <ol class="flex items-center gap-2 flex-wrap">
        <li><NuxtLink to="/" class="hover:text-foreground">Home</NuxtLink></li>
        <li>/</li>
        <li><NuxtLink to="/browse-all-states" class="hover:text-foreground">States</NuxtLink></li>
        <li>/</li>
        <li>
          <NuxtLink :to="`/sewer-line-repair/${stateSlug}`" class="hover:text-foreground">
            {{ contractor.state }}
          </NuxtLink>
        </li>
        <li>/</li>
        <li>
          <NuxtLink
            :to="`/sewer-line-repair/${stateSlug}/${citySlug}`"
            class="hover:text-foreground"
          >
            {{ contractor.city }}
          </NuxtLink>
        </li>
        <li>/</li>
        <li class="text-foreground font-medium">{{ contractor.name }}</li>
      </ol>
    </nav>

    <div class="grid lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 space-y-6">
        <UiCard class="p-8">
          <div class="space-y-4">
            <div class="flex items-start justify-between">
              <div>
                <h1 class="text-3xl md:text-4xl font-bold mb-2">{{ contractor.name }}</h1>
                <div class="flex items-center gap-2 text-muted-foreground">
                  <MapPin class="w-5 h-5" />
                  <span class="text-lg">{{ contractor.address }}</span>
                </div>
              </div>
              <span
                v-if="contractor.badge === 'Premium'"
                class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-accent/10 text-accent"
              >
                <BadgeCheck class="w-5 h-5" />
                Premium
              </span>
              <span
                v-else
                class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-secondary text-secondary-foreground"
              >
                <BadgeCheck class="w-5 h-5" />
                Verified
              </span>
            </div>

            <div class="flex items-center gap-6">
              <div class="flex items-center gap-2">
                <div class="flex">
                  <Star
                    v-for="i in 5"
                    :key="i"
                    :class="[
                      'w-5 h-5',
                      i <= Math.floor(contractor.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300',
                    ]"
                  />
                </div>
                <span class="text-xl font-bold">{{ contractor.rating }}</span>
                <span class="text-muted-foreground">({{ contractor.reviews }} reviews)</span>
              </div>
            </div>

            <div class="flex flex-wrap gap-4 pt-4">
              <div class="flex items-center gap-2">
                <span class="text-muted-foreground">Specialty:</span>
                <span class="font-semibold">{{ contractor.specialty }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-muted-foreground">Price Range:</span>
                <span class="font-semibold">{{ contractor.price }}</span>
              </div>
            </div>
          </div>
        </UiCard>

        <UiCard v-if="contractor.serviceHours" class="p-8">
          <h2 class="text-2xl font-bold mb-4 flex items-center gap-2">
            <Clock class="w-6 h-6" />
            Service Hours
          </h2>
          <div class="space-y-2">
            <div
              v-for="schedule in contractor.serviceHours"
              :key="schedule.day"
              class="flex justify-between py-2 border-b border-border last:border-0"
            >
              <span class="font-medium">{{ schedule.day }}</span>
              <span class="text-muted-foreground">{{ schedule.hours }}</span>
            </div>
          </div>
        </UiCard>

        <UiCard v-if="contractor.certifications" class="p-8">
          <h2 class="text-2xl font-bold mb-4 flex items-center gap-2">
            <Award class="w-6 h-6" />
            Certifications & Credentials
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div
              v-for="cert in contractor.certifications"
              :key="cert"
              class="flex items-center gap-2 p-3 bg-accent/5 rounded-lg border border-accent/20"
            >
              <BadgeCheck class="w-5 h-5 text-accent" />
              <span class="font-medium">{{ cert }}</span>
            </div>
          </div>
        </UiCard>

        <UiCard v-if="contractor.customerReviews" class="p-8">
          <h2 class="text-2xl font-bold mb-6">Customer Reviews</h2>
          <div class="space-y-6">
            <div
              v-for="review in contractor.customerReviews"
              :key="review.author"
              class="pb-6 border-b border-border last:border-0"
            >
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                  <div class="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                    <span class="font-semibold text-accent">{{ review.author[0] }}</span>
                  </div>
                  <span class="font-semibold">{{ review.author }}</span>
                </div>
                <div class="flex items-center gap-1">
                  <Star
                    v-for="i in review.rating"
                    :key="i"
                    class="w-4 h-4 fill-yellow-400 text-yellow-400"
                  />
                </div>
              </div>
              <p class="text-muted-foreground mb-2">{{ review.text }}</p>
              <span class="text-sm text-muted-foreground">{{ review.date }}</span>
            </div>
          </div>
        </UiCard>
      </div>

      <div class="space-y-6">
        <UiCard class="p-6 sticky top-20">
          <h3 class="text-xl font-bold mb-4">Contact Information</h3>
          <div class="space-y-4">
            <a
              :href="`tel:${contractor.phone}`"
              class="flex items-center gap-3 p-4 bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg transition-colors"
            >
              <Phone class="w-5 h-5" />
              <div>
                <div class="text-sm opacity-90">Call Now</div>
                <div class="font-semibold">{{ contractor.phone }}</div>
              </div>
            </a>

            <a
              v-if="contractor.email"
              :href="`mailto:${contractor.email}`"
              class="flex items-center gap-3 p-4 border border-border hover:bg-card/50 rounded-lg transition-colors"
            >
              <Mail class="w-5 h-5" />
              <div>
                <div class="text-sm text-muted-foreground">Email</div>
                <div class="font-medium">{{ contractor.email }}</div>
              </div>
            </a>

            <div class="flex items-start gap-3 p-4 border border-border rounded-lg">
              <MapPin class="w-5 h-5 mt-1 flex-shrink-0" />
              <div>
                <div class="text-sm text-muted-foreground mb-1">Address</div>
                <div class="font-medium">{{ contractor.address }}</div>
              </div>
            </div>
          </div>
        </UiCard>
      </div>
    </div>
  </div>
</template>

