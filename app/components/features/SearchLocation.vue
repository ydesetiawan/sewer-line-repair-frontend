<script setup lang="ts">
import { ref } from 'vue'
import { Search } from 'lucide-vue-next'
import { CONTRACTORS, getStateSlug, getCitySlug } from '@/composables/useContractors'

const searchInput = ref('')
const suggestions = ref<string[]>([])
const router = useRouter()

const handleSearch = (value: string) => {
  searchInput.value = value

  if (value.length < 2) {
    suggestions.value = []
    return
  }

  const lowerValue = value.toLowerCase()
  const uniqueLocations = new Set<string>()

  CONTRACTORS.forEach((contractor) => {
    if (contractor.city.toLowerCase().includes(lowerValue)) {
      uniqueLocations.add(`${contractor.city}, ${contractor.state}`)
    }
    if (contractor.state.toLowerCase().includes(lowerValue)) {
      uniqueLocations.add(contractor.state)
    }
    if (contractor.address.toLowerCase().includes(lowerValue)) {
      uniqueLocations.add(`${contractor.city}, ${contractor.state}`)
    }
  })

  suggestions.value = Array.from(uniqueLocations).slice(0, 8)
}

const handleSearchSubmit = (location?: string) => {
  const searchLocation = location || searchInput.value
  const trimmed = searchLocation.trim().toLowerCase()

  const stateMatch = CONTRACTORS.find((c) => c.state.toLowerCase() === trimmed)
  if (stateMatch) {
    router.push(`/sewer-line-repair/${getStateSlug(stateMatch.state)}`)
    suggestions.value = []
    return
  }

  const cityMatch = CONTRACTORS.find(
    (c) => c.city.toLowerCase() === trimmed || `${c.city}, ${c.state}`.toLowerCase() === trimmed
  )
  if (cityMatch) {
    router.push(`/sewer-line-repair/${getStateSlug(cityMatch.state)}/${getCitySlug(cityMatch.city)}`)
    suggestions.value = []
    return
  }

  const partialMatch = CONTRACTORS.find((c) => c.city.toLowerCase().includes(trimmed))
  if (partialMatch) {
    router.push(
      `/sewer-line-repair/${getStateSlug(partialMatch.state)}/${getCitySlug(partialMatch.city)}`
    )
    suggestions.value = []
  }
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    handleSearchSubmit()
    suggestions.value = []
  }
}
</script>

<template>
  <div class="w-full relative">
    <div class="flex gap-2">
      <div class="relative flex-1">
        <UiInput
          v-model="searchInput"
          placeholder="Search by city, state, or address..."
          class="bg-card border-border pl-10 text-foreground"
          @input="handleSearch(searchInput)"
          @keydown="handleKeyDown"
        />
        <Search
          class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground"
        />

        <div
          v-if="suggestions.length > 0"
          class="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-10"
        >
          <button
            v-for="(suggestion, index) in suggestions"
            :key="index"
            class="w-full text-left px-4 py-2.5 text-foreground hover:bg-primary hover:text-primary-foreground transition-colors first:rounded-t-lg last:rounded-b-lg border-b border-border last:border-b-0"
            @click="handleSearchSubmit(suggestion)"
          >
            <div class="flex items-center gap-2">
              <Search class="w-4 h-4" />
              <span class="font-medium">{{ suggestion }}</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

