<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import { cn } from '@/utils/cn'

interface CardProps {
  class?: HTMLAttributes['class']
}

const props = defineProps<CardProps>()
</script>

<template>
  <div
    :class="cn('rounded-lg border bg-card text-card-foreground shadow-sm', props.class)"
  >
    <slot />
  </div>
</template>

