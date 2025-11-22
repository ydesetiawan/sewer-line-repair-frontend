# formatSlugToTitle() - Quick Reference

## Usage

```typescript
// Auto-imported in Nuxt 4 - no import needed!
const title = formatSlugToTitle('united-states')
// Output: "United States"
```

## Function Signature

```typescript
formatSlugToTitle(slug: string | undefined | null): string
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `slug` | `string \| undefined \| null` | The slug string to format |

## Returns

| Type | Description |
|------|-------------|
| `string` | Formatted title with capitalized words |

## Examples

```typescript
// Basic usage
formatSlugToTitle('texas')           // "Texas"
formatSlugToTitle('new-york')        // "New York"
formatSlugToTitle('san-diego')       // "San Diego"

// Multiple words
formatSlugToTitle('united-states')   // "United States"
formatSlugToTitle('new-york-city')   // "New York City"

// With numbers
formatSlugToTitle('austin-2')        // "Austin 2"
formatSlugToTitle('san-diego-3')     // "San Diego 3"

// Edge cases
formatSlugToTitle(null)              // ""
formatSlugToTitle(undefined)         // ""
formatSlugToTitle('')                // ""
```

## Common Use Cases

### 1. Page Titles
```typescript
const route = useRoute()
const stateSlug = route.params.state as string
const stateName = formatSlugToTitle(stateSlug)

useSeoMeta({
  title: `Contractors in ${stateName}`
})
```

### 2. Breadcrumbs
```typescript
const breadcrumbItems = computed(() => [
  { label: 'Home', to: '/' },
  { label: formatSlugToTitle(countrySlug), to: `/${countrySlug}` },
  { label: formatSlugToTitle(stateSlug) }
])
```

### 3. Headings
```typescript
const cityName = formatSlugToTitle(citySlug)
// Use in template: <h1>Welcome to {{ cityName }}</h1>
```

## Location

📁 `/app/utils/formatSlug.ts`

## Auto-Import

✅ Automatically imported by Nuxt 4  
❌ No manual import needed  
🌐 Available globally in all `.vue` files and composables

## Related Utilities

Consider creating similar utilities for:
- `slugify()` - Convert text to slug (reverse operation)
- `formatPhoneNumber()` - Format phone numbers
- `formatDate()` - Format dates consistently

## Notes

- Pure function (no side effects)
- Null-safe (handles `undefined` and `null`)
- Performance: O(n) where n is slug length
- No external dependencies

## IDE Warnings

⚠️ IDE may show "Cannot find name 'formatSlugToTitle'" - this is expected!  
✅ Function works at runtime via Nuxt auto-import

To resolve IDE warnings:
1. Restart dev server
2. Restart IDE
3. Clear IDE cache

## Need Help?

📖 Full documentation: `/docs/FORMAT_SLUG_UTILITY.md`  
📝 Refactoring summary: `/REFACTORING_FORMAT_SLUG.md`

