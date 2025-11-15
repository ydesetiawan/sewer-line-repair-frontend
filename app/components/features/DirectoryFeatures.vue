<script setup lang="ts">
const features = [
  {
    icon: "🔍",
    title: "Easy Search",
    description: "Find contractors by location, rating, and services offered",
  },
  {
    icon: "⭐",
    title: "Verified Reviews",
    description: "Real feedback from actual customers on their work quality",
  },
  {
    icon: "📞",
    title: "Direct Contact",
    description: "Connect directly with contractors for quotes and consultations",
  },
  {
    icon: "✓",
    title: "Licensed & Insured",
    description: "All contractors are verified licensed and properly insured",
  },
]
</script>

<template>
  <section id="features" class="py-20 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-16 space-y-4">
        <h2 class="text-4xl font-bold">Why Choose Our Directory?</h2>
        <p class="text-muted-foreground text-lg max-w-2xl mx-auto">
          We connect you with the best local sewer repair professionals
        </p>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="(feature, idx) in features"
          :key="idx"
          class="p-6 rounded-xl border border-border/50 bg-card/50 hover:bg-card transition-all hover:border-accent/50 group"
        >
          <div class="text-4xl mb-4 group-hover:scale-110 transition-transform">
            {{ feature.icon }}
          </div>
          <h3 class="font-semibold text-lg mb-2">{{ feature.title }}</h3>
          <p class="text-sm text-muted-foreground">{{ feature.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

