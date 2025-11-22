<template>
  <H1>City</H1>
</template>
<script setup lang="ts">
const route = useRoute()
const stateSlug = route.params.state as string
const countrySlug = route.params.country as string
const citySlug = route.params.city as string

if(citySlug) {
  console.log('berhasil')
  console.log(citySlug)
}
</script>