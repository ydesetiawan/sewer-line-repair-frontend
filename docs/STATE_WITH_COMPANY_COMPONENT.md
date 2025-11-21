# Quick Reference - StateWithCompany Component

## File Location
```
app/components/Page/StateWithCompany.vue
```

## Usage
```vue
<PageStateWithCompany
  :state-slug="stateSlug"
  :country-slug="countrySlug"
  :state-name="stateName"
/>
```

## Props
| Prop | Type | Description | Example |
|------|------|-------------|---------|
| `stateSlug` | `string` | URL slug for state | `"california"` |
| `countrySlug` | `string` | URL slug for country | `"united-states"` |
| `stateName` | `string` | Display name for state | `"California"` |

## Features
- ✅ Fetches companies and cities from API
- ✅ Loading state with spinner
- ✅ Error state with retry button
- ✅ Empty state handling
- ✅ Sorts cities by company count
- ✅ Displays cities grid
- ✅ Displays company cards
- ✅ Responsive design

## API Endpoint
```
GET /api/v1/states/{stateSlug}/companies
Params: page=1, per_page=20
```

## Computed Properties
- `displayStateName` - Gets state name from API or props
- `sortedCities` - Cities sorted by company count (desc)
- `totalCompanies` - Total count from pagination

## Example Page Integration
```vue
<script setup lang="ts">
const route = useRoute()
const stateSlug = route.params.state as string
const countrySlug = route.params.country as string
const stateName = stateSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
</script>

<template>
  <div>
    <PageStateWithCompany
      :state-slug="stateSlug"
      :country-slug="countrySlug"
      :state-name="stateName"
    />
  </div>
</template>
```

## TypeScript Interfaces Used
- `ICompany` - Company data structure
- `ICity` - City data structure  
- `IMetaPagination` - Pagination metadata
- `ISlrApiResponse<T>` - API response wrapper

## Error Handling
```typescript
try {
  const response = await ($publicApi as any)(...)
  // Success handling
} catch (err) {
  error.value = err instanceof Error ? err : new Error('Failed to fetch data')
  console.error('Error fetching state data:', err)
}
```

## Styling
- Uses Tailwind CSS utility classes
- Responsive grid layout
- Hover effects on cards
- Loading animations
- Consistent with design system

## Notes
- Auto-imported in Nuxt 4 (no explicit import needed)
- Uses `$publicApi` plugin for API calls
- Fetches data on component mount
- All logic contained in component
- No external composables required

