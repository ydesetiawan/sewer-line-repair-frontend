<script setup lang="ts">

import {Loader2, MapPin, Search} from "lucide-vue-next";
</script>

<template>
  <div class="w-full relative">
    <div class="flex gap-2">
      <div class="relative flex-1">
        <UiInput
            v-model="searchInput"
            placeholder="Search by state"
            class="bg-card border-border pl-10 pr-10 text-foreground"
            @input="handleSearch(searchInput)"
            @keydown="handleKeyDown"
        />
        <Search
            class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground"
        />
      </div>
    </div>
  </div>
</template>