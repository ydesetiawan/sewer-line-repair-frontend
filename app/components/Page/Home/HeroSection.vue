<script setup lang="ts">
</script>

<template>
  <section
    class="relative min-h-[600px] flex items-center bg-gradient-to-br from-background via-background to-secondary/10 border-b border-border/50"
  >
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
    </div>

    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
      <div class="grid md:grid-cols-2 gap-12 items-center">
        <div class="space-y-6">
          <div class="space-y-4">
            <h1 class="text-5xl md:text-6xl font-bold tracking-tight leading-tight">
              Find Your <span class="text-accent">Trusted</span> Sewer Repair Expert
            </h1>
            <p class="text-xl text-muted-foreground leading-relaxed">
              Connect with licensed, vetted contractors in your area. Professional sewer line repair
              services you can depend on.
            </p>
          </div>

          <div class="flex gap-4 pt-4">
            <NuxtLink to="/directory">
              <BaseButton size="lg" class="bg-accent hover:bg-accent/90 text-accent-foreground text-white">
                Browse Directory
              </BaseButton>
            </NuxtLink>
            <a href="#features">
              <BaseButton
                variant="outline"
                size="lg"
                class="border-border hover:bg-secondary bg-transparent"
              >
                Learn More
              </BaseButton>
            </a>
          </div>

          <div class="pt-4 text-sm text-muted-foreground">
            <p>✓ Verified contractors ✓ Competitive pricing ✓ Fast response</p>
          </div>
        </div>

        <div class="hidden md:block">
          <div
            class="relative h-[400px] bg-gradient-to-br from-accent/20 to-primary/20 rounded-2xl border border-border/50 flex items-center justify-center"
          >
            <div class="text-center space-y-4">
              <div
                class="w-20 h-20 bg-accent/30 rounded-full mx-auto flex items-center justify-center"
              >
                <svg
                  class="w-10 h-10 text-accent"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m7.6-4.6a9 9 0 11-12.72 0m.72 4.72a2 2 0 100-4 2 2 0 000 4z"
                  />
                </svg>
              </div>
              <h3 class="text-lg font-semibold">Premium Contractors</h3>
              <p class="text-sm text-muted-foreground">Pre-screened and verified professionals</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

