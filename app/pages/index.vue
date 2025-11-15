<script setup lang="ts">
definePageMeta({
  layout: 'default',
})

useSeoMeta({
  title: 'Sewer Repair Pro - Find Local Sewer Line Repair Experts',
  description:
    'Connect with licensed and trusted sewer line repair contractors in your area. Professional service directory.',
})
</script>

<template>
  <div>
    <FeaturesHeroSection />
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
      <FeaturesSearchLocation />
    </div>
    <FeaturesStateCategories />
    <FeaturesDirectoryFeatures />
    <FeaturesFeaturesSection />
    <FeaturesCTASection />
  </div>
</template>

