<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="bg-card border-t border-border/50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <div class="grid md:grid-cols-4 gap-8 mb-8">
        <div class="space-y-4">
          <h3 class="font-bold text-lg">SewerRepair Pro</h3>
          <p class="text-sm text-muted-foreground">
            Connecting you with trusted sewer repair professionals.
          </p>
        </div>
        <div class="space-y-4">
          <h4 class="font-semibold">Platform</h4>
          <ul class="space-y-2 text-sm">
            <li>
              <NuxtLink to="/" class="text-muted-foreground hover:text-accent transition-colors">
                Home
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/directory"
                class="text-muted-foreground hover:text-accent transition-colors"
              >
                Directory
              </NuxtLink>
            </li>
          </ul>
        </div>
        <div class="space-y-4">
          <h4 class="font-semibold">Legal</h4>
          <ul class="space-y-2 text-sm">
            <li>
              <a href="#" class="text-muted-foreground hover:text-accent transition-colors">
                Privacy
              </a>
            </li>
            <li>
              <a href="#" class="text-muted-foreground hover:text-accent transition-colors">
                Terms
              </a>
            </li>
          </ul>
        </div>
        <div class="space-y-4">
          <h4 class="font-semibold">Contact</h4>
          <ul class="space-y-2 text-sm">
            <li>
              <a
                href="mailto:info@sewerrepairpro.com"
                class="text-muted-foreground hover:text-accent transition-colors"
              >
                info@sewerrepairpro.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div class="border-t border-border/50 pt-8 text-center text-sm text-muted-foreground">
        <p>&copy; {{ currentYear }} SewerRepair Pro. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

