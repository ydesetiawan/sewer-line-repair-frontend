# States API Integration Documentation

## Overview
This document describes the REST API integration for fetching state data in the Sewer Repair Pro application.

## API Endpoint

**Base URL:** `http://localhost:3000` (configurable via environment variable)

**Endpoint:** `/api/v1/states`

**Method:** `GET`

## Request Parameters

| Parameter | Type   | Required | Default | Description              |
|-----------|--------|----------|---------|--------------------------|
| page      | number | No       | 1       | Current page number      |
| per_page  | number | No       | 20      | Items per page (limit)   |

### Example Request

```bash
GET http://localhost:3000/api/v1/states?page=1&per_page=8
```

## Response Format

The API follows JSON:API specification.

### Success Response (200 OK)

```json
{
  "data": [
    {
      "id": "1",
      "type": "state",
      "attributes": {
        "name": "California",
        "code": "CA",
        "slug": "california",
        "country": {
          "id": 1,
          "name": "United States",
          "code": "US",
          "slug": "united-states"
        }
      }
    }
  ],
  "meta": {
    "pagination": {
      "current_page": 1,
      "prev_page": null,
      "next_page": 2,
      "total_items": 50,
      "total_pages": 7
    }
  }
}
```

### Error Response (4xx, 5xx)

```json
{
  "errors": [
    {
      "status": "404",
      "title": "Not Found",
      "detail": "The requested resource was not found"
    }
  ]
}
```

## TypeScript Types

### State Resource

```typescript
interface Country {
  id: number
  name: string
  code: string
  slug: string
}

interface StateAttributes {
  name: string
  code: string
  slug: string
  country: Country
}

interface StateResource {
  id: string
  type: 'state'
  attributes: StateAttributes
}
```

### Pagination Meta

```typescript
interface PaginationMeta {
  current_page: number
  prev_page: number | null
  next_page: number | null
  total_items: number
  total_pages: number
}
```

### API Response

```typescript
interface ApiResponse<T> {
  data: T
  meta?: {
    pagination?: PaginationMeta
  }
}

type StatesApiResponse = ApiResponse<StateResource[]>
```

## Composable Usage

### `useStates` Composable

The `useStates` composable provides a reactive interface for fetching and managing state data.

#### Basic Usage

```vue
<script setup lang="ts">
import { useStates } from '@/composables/useStatesApi'

const { states, loading, error, fetchStates } = useStates({
  page: 1,
  perPage: 20,
  autoFetch: true, // Automatically fetch on mount
})
</script>
```

#### Options

```typescript
interface UseStatesOptions {
  page?: number        // Initial page number (default: 1)
  perPage?: number     // Items per page (default: 20)
  autoFetch?: boolean  // Auto-fetch on mount (default: true)
}
```

#### Return Values

```typescript
interface UseStatesReturn {
  states: Ref<StateResource[]>           // Array of state resources
  pagination: Ref<PaginationMeta | null> // Pagination metadata
  loading: Ref<boolean>                  // Loading state
  error: Ref<Error | null>               // Error state
  fetchStates: (page?: number, perPage?: number) => Promise<void>  // Fetch function
  refresh: () => Promise<void>           // Refresh current page
  hasNextPage: ComputedRef<boolean>      // Has next page
  hasPrevPage: ComputedRef<boolean>      // Has previous page
}
```

#### Advanced Example with Pagination

```vue
<script setup lang="ts">
import { useStates } from '@/composables/useStatesApi'

const { 
  states, 
  pagination, 
  loading, 
  error, 
  fetchStates, 
  refresh,
  hasNextPage,
  hasPrevPage 
} = useStates({
  page: 1,
  perPage: 8,
  autoFetch: true,
})

// Load next page
const loadMore = async () => {
  if (hasNextPage.value && pagination.value) {
    await fetchStates(pagination.value.next_page!)
  }
}

// Load previous page
const loadPrevious = async () => {
  if (hasPrevPage.value && pagination.value) {
    await fetchStates(pagination.value.prev_page!)
  }
}

// Refresh current page
const handleRefresh = async () => {
  await refresh()
}
</script>

<template>
  <div>
    <!-- Loading State -->
    <div v-if="loading && !states.length">
      <p>Loading states...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error">
      <p>Error: {{ error.message }}</p>
      <button @click="refresh">Try Again</button>
    </div>

    <!-- States List -->
    <div v-else-if="states.length > 0">
      <div v-for="state in states" :key="state.id">
        <NuxtLink :to="`/sewer-line-repair/${state.attributes.slug}`">
          {{ state.attributes.name }} ({{ state.attributes.code }})
        </NuxtLink>
      </div>

      <!-- Pagination -->
      <div v-if="pagination">
        <button 
          v-if="hasPrevPage" 
          @click="loadPrevious"
          :disabled="loading"
        >
          Previous
        </button>
        
        <span>
          Page {{ pagination.current_page }} of {{ pagination.total_pages }}
        </span>
        
        <button 
          v-if="hasNextPage" 
          @click="loadMore"
          :disabled="loading"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else>
      <p>No states available</p>
    </div>
  </div>
</template>
```

## Component Integration

### StateCategories Component

The `StateCategories` component uses the `useStates` composable to display a grid of states with pagination.

**Location:** `app/components/features/StateCategories.vue`

**Features:**
- Loading spinner while fetching
- Error handling with retry button
- Responsive grid layout (2 cols on mobile, 4 cols on desktop)
- Pagination controls
- Empty state message
- Link to browse all states page

## Environment Configuration

### Development

Create a `.env` file in the project root:

```bash
NUXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

### Production

Set environment variable in your deployment platform:

```bash
NUXT_PUBLIC_API_BASE_URL=https://api.yourproductionsite.com
```

## Error Handling

The composable handles errors gracefully:

1. **Network Errors:** Caught and stored in `error.ref`
2. **API Errors:** HTTP error responses are caught
3. **User Feedback:** Error state displayed with retry option

### Example Error Handling

```vue
<script setup lang="ts">
const { error, refresh } = useStates()

watchEffect(() => {
  if (error.value) {
    console.error('Failed to fetch states:', error.value)
    // Show toast notification
    // Or redirect to error page
  }
})
</script>
```

## Testing

### Manual Testing

1. Start your API server on `http://localhost:3000`
2. Ensure the `/api/v1/states` endpoint is available
3. Start the Nuxt dev server: `npm run dev --port 3001`
4. Navigate to the homepage and check the "Browse by State" section

### Test Cases

- ✅ Initial load displays states
- ✅ Loading spinner shows during fetch
- ✅ Error message displays on API failure
- ✅ Retry button refetches data
- ✅ Pagination controls work correctly
- ✅ Next/Previous buttons enable/disable appropriately
- ✅ State links route correctly

## Performance Considerations

1. **Pagination:** Limit results per page (default: 8 for homepage)
2. **Caching:** Consider adding client-side caching for fetched states
3. **Debouncing:** Not required for this implementation (no search input)
4. **SSR:** Auto-fetch disabled on server-side to prevent double requests

## Future Enhancements

- [ ] Add search/filter functionality
- [ ] Implement infinite scroll option
- [ ] Add client-side caching with TTL
- [ ] Add loading skeleton instead of spinner
- [ ] Implement optimistic UI updates
- [ ] Add analytics tracking for state views

## Troubleshooting

### States not loading

1. Check API server is running: `curl http://localhost:3000/api/v1/states`
2. Check browser console for network errors
3. Verify environment variable is set correctly
4. Check CORS settings on API server

### Pagination not working

1. Verify `pagination` meta is present in API response
2. Check `next_page` and `prev_page` values are correct
3. Ensure `fetchStates` function is called with correct parameters

### TypeScript errors

1. Run `npm run typecheck` to see all type errors
2. Ensure all types are imported from `@/types`
3. Verify API response matches expected types

## Support

For issues or questions, please refer to:
- Nuxt Documentation: https://nuxt.com
- Project Repository: [Your Repo URL]
- API Documentation: [Your API Docs URL]

