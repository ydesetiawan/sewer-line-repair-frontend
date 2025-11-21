# Quick Reference - CityCard Component

## Import & Usage

```vue
<template>
  <PageCityCard
    :city="cityData"
    country-slug="united-states"
    state-slug="california"
  />
</template>
```

**Note**: No import needed - auto-imported in Nuxt 4!

## Props

```typescript
{
  city: ICity,          // Required
  countrySlug: string,  // Required
  stateSlug: string     // Required
}
```

## Grid Layout (Recommended)

```vue
<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
  <PageCityCard
    v-for="city in cities"
    :key="city.id"
    :city="city"
    :country-slug="countrySlug"
    :state-slug="stateSlug"
  />
</div>
```

## Features

- ✅ Auto-generates URL: `/{country}/{state}/{city}`
- ✅ Smart pluralization: `1 contractor` vs `N contractors`
- ✅ Hover effects (shadow, border, icon, text)
- ✅ Responsive grid support
- ✅ Type-safe with TypeScript
- ✅ Keyboard accessible
- ✅ Mobile-friendly

## Visual

```
┌────────────────────────────┐
│ 📍 Los Angeles  CA  US     │
│    156 contractors         │
└────────────────────────────┘
```

## Files

- **Component**: `app/components/Page/CityCard.vue`
- **Documentation**: `docs/CITY_CARD_COMPONENT.md`
- **Used in**: `app/components/Page/StateWithCompany.vue`

## Related Components

- `PageCompanyCard` - Company card component
- `PageStateWithCompany` - Uses CityCard
- `BaseCard` - Base card wrapper

