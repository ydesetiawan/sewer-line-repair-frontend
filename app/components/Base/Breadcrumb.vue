<script setup lang="ts">
interface BreadcrumbItem {
  label: string
  to?: string
}

interface Props {
  items: BreadcrumbItem[]
}

defineProps<Props>()
</script>

<template>
  <nav class="mb-8 text-sm text-muted-foreground">
    <ol class="flex items-center gap-2">
      <template v-for="(item, index) in items" :key="index">
        <li v-if="index > 0">/</li>
        <li>
          <NuxtLink
            v-if="item.to"
            :to="item.to"
            class="hover:text-foreground"
          >
            {{ item.label }}
          </NuxtLink>
          <span v-else class="text-foreground font-medium">
            {{ item.label }}
          </span>
        </li>
      </template>
    </ol>
  </nav>
</template>

