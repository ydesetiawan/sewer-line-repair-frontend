<script setup lang="ts">
</script>

<template>
  <div class="min-h-screen bg-background flex flex-col">
    <LayoutHeader />
    <main class="flex-1">
      <slot />
    </main>
    <LayoutFooter />
  </div>
</template>

