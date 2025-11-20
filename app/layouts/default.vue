<script setup lang="ts">
</script>

<template>
  <div class="min-h-screen bg-background flex flex-col">
    <BaseLayoutHeader />
    <main class="flex-1">
      <slot />
    </main>
    <BaseLayoutFooter />
  </div>
</template>

