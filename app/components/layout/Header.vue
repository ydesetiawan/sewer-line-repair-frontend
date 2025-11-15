<script setup lang="ts">
</script>

<template>
  <header
    class="border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <NuxtLink to="/" class="flex items-center gap-2">
          <div class="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <span class="text-sm font-bold text-accent-foreground">SR</span>
          </div>
          <span class="font-bold text-lg hidden sm:inline">SewerRepair Pro</span>
        </NuxtLink>

        <nav class="flex items-center gap-6 md:gap-8">
          <NuxtLink
            to="/"
            class="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Home
          </NuxtLink>
          <NuxtLink
            to="/directory"
            class="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Directory
          </NuxtLink>
          <NuxtLink to="/directory">
            <UiButton
              variant="default"
              size="sm"
              class="bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              Find Contractors
            </UiButton>
          </NuxtLink>
        </nav>
      </div>
    </div>
  </header>
</template>

