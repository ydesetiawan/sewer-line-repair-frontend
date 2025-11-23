<script setup lang="ts">


definePageMeta({
  layout: 'default',
})

const route = useRoute()
const countrySlug = route.params.country as string || 'united-states'
const stateSlug = route.params.state as string || 'texas'

// Format names from slugs
const state = formatSlugToTitle(stateSlug)

useSeoMeta({
  title: `Sewer Repair Contractors in Directory - Find Local Experts`,
  description: `Find licensed and trusted plumbing and sewer repair companies with browse by directory.`,
})

</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <!-- State with Companies Component -->
    <PageCompanyList
        :state-slug="stateSlug"
        :country-slug="countrySlug"
        :state-name="state"
    />
  </div>
</template>

