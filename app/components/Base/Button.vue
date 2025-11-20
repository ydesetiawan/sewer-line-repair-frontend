<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import { type ButtonVariantProps, buttonVariants } from './button-variants'
import { cn } from '@/utils/cn'

interface ButtonProps {
  variant?: ButtonVariantProps['variant']
  size?: ButtonVariantProps['size']
  as?: string
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: 'default',
  size: 'default',
  as: 'button',
})

const computedClass = computed(() =>
  cn(buttonVariants({ variant: props.variant, size: props.size }), props.class)
)
</script>

<template>
  <component :is="as" :class="computedClass">
    <slot />
  </component>
</template>

