import type { $Fetch } from 'ofetch'

declare module '#app' {
  interface NuxtApp {
    $api: $Fetch
    $publicApi: $Fetch
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $api: $Fetch
    $publicApi: $Fetch
  }
}

export {}

