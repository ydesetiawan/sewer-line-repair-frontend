# US States Search Component Documentation

## Overview
A production-ready, fully-featured search component for US states with real-time autocomplete, error handling, and accessibility features.

## Component Location
- **Component**: `app/components/features/SearchState.vue`
- **Composable**: `app/composables/useStatesSearch.ts`
- **Types**: `app/types/index.ts`

## Features

### ✅ Core Functionality
- **Real-time search** as user types
- **Debouncing** (400ms default) to reduce API calls
- **Request cancellation** for pending searches
- **Minimum characters** validation (1 character default)
- **Results dropdown** with smooth transitions
- **Keyboard navigation** (Arrow keys, Enter, Escape)
- **Click outside** to close dropdown
- **Loading states** with spinner and skeleton loaders
- **Error handling** with retry option
- **Empty state** messaging

### ✅ Display Features
- State name prominently displayed
- State code in badge (e.g., "CA", "TX")
- Companies count (e.g., "152 companies")
- Total results count from API
- Country name (if not filtered by country)

### ✅ UI/UX Features
- **Responsive design** (mobile-friendly)
- **Smooth animations** on all interactions
- **Clear visual hierarchy**
- **Accessible** (ARIA labels, keyboard support)
- **Clear button** (X icon) when input has text
- **Autofocus** option on mount
- **Custom scrollbar** styling

## API Integration

### Endpoint
```
GET http://localhost:3000/api/v1/states?state={searchTerm}
```

### Query Parameters
- `state` (string): Search term for filtering states
- `country` (string, optional): Filter by country slug

### Response Format
```json
{
  "data": [
    {
      "id": "string",
      "type": "state",
      "attributes": {
        "name": "string",
        "code": "string",
        "slug": "string",
        "companies_count": number,
        "country": {
          "id": number,
          "name": "string",
          "code": "string",
          "slug": "string"
        }
      }
    }
  ],
  "meta": {
    "pagination": {
      "current_page": number,
      "prev_page": number | null,
      "next_page": number | null,
      "total_items": number,
      "total_pages": number
    }
  }
}
```

## Component Props

```typescript
interface Props {
  placeholder?: string      // Default: "Search states..."
  autofocus?: boolean      // Default: false
  country?: string | null  // Default: null (filter by country)
  minChars?: number        // Default: 1 (min chars to trigger search)
  debounceMs?: number      // Default: 400 (debounce delay in ms)
  showResults?: boolean    // Default: true (show dropdown results)
}
```

## Component Events

```typescript
interface Events {
  select: (state: StateResource) => void  // Emitted when state is selected
}
```

## Usage Examples

### Basic Usage
```vue
<template>
  <FeaturesSearchState />
</template>
```

### With Props
```vue
<template>
  <FeaturesSearchState
    placeholder="Find your state..."
    :autofocus="true"
    :min-chars="2"
    :debounce-ms="300"
  />
</template>
```

### With Country Filter
```vue
<template>
  <FeaturesSearchState
    :country="countrySlug"
    placeholder="Search states in United States..."
  />
</template>
```

### With Event Handling
```vue
<script setup lang="ts">
const handleStateSelect = (state: StateResource) => {
  console.log('Selected state:', state.attributes.name)
  // Custom logic here
}
</script>

<template>
  <FeaturesSearchState @select="handleStateSelect" />
</template>
```

### Custom Styling
```vue
<template>
  <div class="max-w-xl mx-auto">
    <FeaturesSearchState 
      placeholder="Type to search..."
      class="custom-search"
    />
  </div>
</template>
```

## Composable API

### `useStatesSearch(options)`

```typescript
interface UseStatesSearchOptions {
  initialQuery?: string      // Initial search query
  debounceMs?: number        // Debounce delay (default: 400ms)
  minChars?: number          // Min characters to search (default: 1)
  country?: string | null    // Filter by country (default: null)
}

interface UseStatesSearchReturn {
  states: Ref<StateResource[]>           // Search results
  pagination: Ref<PaginationMeta | null> // Pagination info
  loading: Ref<boolean>                  // Loading state
  error: Ref<Error | null>               // Error state
  searchQuery: Ref<string>               // Current search query
  search: (query: string) => Promise<void>  // Perform search
  clearSearch: () => void                // Clear search
  hasResults: ComputedRef<boolean>       // Whether has results
  totalResults: ComputedRef<number>      // Total results count
}
```

### Usage Example
```typescript
const {
  states,
  loading,
  error,
  searchQuery,
  search,
  clearSearch,
  hasResults,
  totalResults
} = useStatesSearch({
  debounceMs: 300,
  minChars: 2,
  country: 'united-states'
})

// Perform search
await search('california')

// Clear search
clearSearch()
```

## UI States

### 1. Initial State (Empty)
- Search input with placeholder
- No results dropdown

### 2. Searching State
- Loading spinner in input
- Loading skeleton in dropdown
- "Searching..." status text

### 3. Results State
- Results count: "Showing 1 of 50 results"
- List of states with icons
- Hover effects and transitions

### 4. No Results State
- MapPin icon
- "No states found matching '{query}'" message

### 5. Error State
- AlertCircle icon
- Error message
- "Try Again" button

## Keyboard Navigation

| Key | Action |
|-----|--------|
| `↓` (Down Arrow) | Move selection down |
| `↑` (Up Arrow) | Move selection up |
| `Enter` | Navigate to selected state |
| `Escape` | Close dropdown |

## Accessibility Features

- **ARIA labels** on search input
- **Keyboard navigation** support
- **Focus management** (autofocus option)
- **Screen reader** friendly error messages
- **Semantic HTML** structure

## Performance Optimizations

1. **Debouncing**: Reduces API calls by waiting for user to stop typing
2. **Request Cancellation**: Cancels previous requests when new search starts
3. **Lazy Loading**: Only fetches data when needed
4. **Efficient Rendering**: Uses Vue's virtual DOM efficiently
5. **Minimal Re-renders**: Computed properties for derived state

## Error Handling

The component handles various error scenarios:

1. **Network Errors**: Shows error message with retry button
2. **API Errors**: Displays error message from API
3. **Timeout Errors**: Handles request timeouts gracefully
4. **Abort Errors**: Silently ignores when requests are canceled

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Testing

### Manual Testing Checklist
- [ ] Search with valid state name (e.g., "california")
- [ ] Search with partial match (e.g., "cali")
- [ ] Search with no results (e.g., "xyz123")
- [ ] Clear search using X button
- [ ] Navigate with keyboard (arrow keys)
- [ ] Select state with Enter key
- [ ] Close dropdown with Escape
- [ ] Click outside to close dropdown
- [ ] Test on mobile devices
- [ ] Test with slow network
- [ ] Test error recovery (stop API server)

## Troubleshooting

### Issue: No results showing
**Solution**: Check API endpoint is running on `http://localhost:3000`

### Issue: Debouncing not working
**Solution**: Verify `debounceMs` prop is set correctly

### Issue: TypeScript errors
**Solution**: Ensure types are imported: `import type { StateResource } from '@/types'`

### Issue: Dropdown not closing
**Solution**: Check `onClickOutside` composable is working (Nuxt 4 auto-imports VueUse)

## Future Enhancements

- [ ] Add search history
- [ ] Add popular states quick links
- [ ] Add state flags/icons
- [ ] Add infinite scroll for results
- [ ] Add voice search support
- [ ] Add analytics tracking
- [ ] Add A/B testing support

## Related Components

- `app/components/features/StateCategories.vue` - Browse states by category
- `app/pages/browse-all-states.vue` - Full states browsing page
- `app/composables/useStatesApi.ts` - States API integration

## Credits

Built with:
- **Nuxt 4** - Vue framework
- **Tailwind CSS** - Styling
- **Lucide Vue** - Icons
- **TypeScript** - Type safety

