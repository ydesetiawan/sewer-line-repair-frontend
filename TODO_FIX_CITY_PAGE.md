# TODO: Fix [city].vue Page

## ⚠️ Current Issue

**File**: `app/pages/[country]/[state]/[city].vue`

**Problem**: Still imports from deleted `useCompaniesApi.ts`:
```typescript
import { useCompanies } from '@/composables/useCompaniesApi' // ❌ DELETED
```

**Status**: 🔴 BROKEN - Will fail to compile

---

## 🔧 Recommended Solution

Apply the same refactoring pattern we used for `[state].vue`:

### Step 1: Create Component
Create: `app/components/Page/CityWithCompanies.vue`

**Props needed:**
```typescript
interface Props {
  stateSlug: string
  countrySlug: string
  citySlug: string
  currentPage: number
  perPage: number
}
```

**Features to implement:**
- Fetch companies with pagination
- Fetch cities sidebar data
- Loading/error/empty states
- Pagination controls
- City navigation

**API endpoint:**
```
GET /api/v1/states/{stateSlug}/companies?city={citySlug}&page=X&per_page=Y
```

### Step 2: Simplify [city].vue Page
```vue
<script setup lang="ts">
const route = useRoute()
const citySlug = route.params.city as string
const stateSlug = route.params.state as string
const countrySlug = route.params.country as string

const currentPage = computed(() => {
  const page = route.query.page
  return page ? parseInt(page as string) : 1
})

const perPage = computed(() => {
  const pp = route.query.per_page
  return pp ? parseInt(pp as string) : 20
})
</script>

<template>
  <div>
    <PageCityWithCompanies
      :city-slug="citySlug"
      :state-slug="stateSlug"
      :country-slug="countrySlug"
      :current-page="currentPage"
      :per-page="perPage"
    />
  </div>
</template>
```

### Step 3: Handle Pagination
The component should emit events or use router to handle pagination:
```typescript
const goToPage = (page: number) => {
  const router = useRouter()
  router.push({
    query: {
      ...route.query,
      page: page.toString()
    }
  })
}
```

---

## 📋 Implementation Checklist

### Component Creation
- [ ] Create `app/components/Page/CityWithCompanies.vue`
- [ ] Add props interface
- [ ] Add reactive state (companies, cities, pagination, loading, error)
- [ ] Add fetchData function using $publicApi
- [ ] Add computed properties (cityName, stateName, sortedCities, etc.)
- [ ] Add pagination helpers (goToPage, changePerPage, etc.)
- [ ] Add UI states (loading, error, empty, success)

### Template Implementation
- [ ] Loading state with skeleton/spinner
- [ ] Error state with retry button
- [ ] Empty state message
- [ ] Cities sidebar
- [ ] Companies grid/list
- [ ] Pagination controls (top and bottom)
- [ ] Breadcrumb navigation
- [ ] Per page selector

### Page Update
- [ ] Update `[city].vue` to use new component
- [ ] Remove composable import
- [ ] Add props bindings
- [ ] Keep SEO meta tags in page
- [ ] Test navigation

### Testing
- [ ] Test pagination
- [ ] Test city navigation
- [ ] Test loading states
- [ ] Test error states
- [ ] Test responsive design
- [ ] Test query params

---

## 🎯 Key Differences from StateWithCompany

1. **Pagination**: CityWithCompanies needs full pagination support
2. **City Filter**: Already on city page, but show cities sidebar
3. **Query Params**: Must sync with URL query parameters
4. **Per Page**: User can change items per page
5. **More Companies**: Will display actual companies list (not just overview)

---

## 📝 Code Structure

```vue
<script setup lang="ts">
// Props
interface Props {
  stateSlug: string
  countrySlug: string
  citySlug: string
  currentPage: number
  perPage: number
}
const props = defineProps<Props>()

// Reactive state
const companies = ref<ICompany[]>([])
const cities = ref<ICity[]>([])
const pagination = ref<IMetaPagination | null>(null)
const loading = ref(false)
const error = ref<Error | null>(null)

// API call
const { $publicApi } = useNuxtApp()
const fetchData = async () => {
  // Fetch with citySlug filter
}

// Computed
const currentCity = computed(() => {
  return cities.value.find(c => c.attributes.slug === props.citySlug)
})

const cityName = computed(() => currentCity.value?.attributes.name || '')

// Pagination helpers
const totalPages = computed(() => pagination.value?.total_pages || 1)
const showingFrom = computed(() => ...)
const showingTo = computed(() => ...)

// Watch for prop changes
watch([() => props.currentPage, () => props.perPage], () => {
  fetchData()
})

// Initial fetch
onMounted(() => {
  fetchData()
})
</script>

<template>
  <!-- Loading state -->
  <div v-if="loading">...</div>
  
  <!-- Error state -->
  <div v-else-if="error">...</div>
  
  <!-- Empty state -->
  <div v-else-if="!companies.length">...</div>
  
  <!-- Content -->
  <div v-else>
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <!-- Cities sidebar -->
      <aside>...</aside>
      
      <!-- Companies list -->
      <div class="lg:col-span-3">
        <!-- Pagination info -->
        <div>Showing X-Y of Z</div>
        
        <!-- Company cards -->
        <PageCompanyCard v-for="company in companies" />
        
        <!-- Pagination controls -->
        <div>Previous | 1 2 3 ... | Next</div>
      </div>
    </div>
  </div>
</template>
```

---

## ⚡ Quick Start

**Option 1**: Copy StateWithCompany.vue and modify
```bash
cp app/components/Page/StateWithCompany.vue app/components/Page/CityWithCompanies.vue
# Then modify for city-specific logic and pagination
```

**Option 2**: Create from scratch using pattern
Follow the structure from StateWithCompany but add pagination support

---

## 🔍 Testing After Implementation

1. Navigate to `/united-states/california/los-angeles`
2. Verify companies load for Los Angeles only
3. Test pagination (click Next, Previous, page numbers)
4. Change per page (10, 20, 50)
5. Click different cities in sidebar
6. Verify URL updates with query params
7. Test browser back/forward
8. Test loading states
9. Test error handling
10. Test responsive design

---

## 📚 Reference Files

- `app/components/Page/StateWithCompany.vue` - Similar pattern
- `REFACTORING_COMPANIES_API.md` - Refactoring guide
- `docs/STATE_WITH_COMPANY_COMPONENT.md` - Component reference
- `.github/copilot-instructions.md` - Coding standards

---

## 💡 Tips

1. **Reuse patterns** from StateWithCompany.vue
2. **Test incrementally** - Get basic version working first
3. **Handle edge cases** - Invalid city, pagination beyond bounds
4. **Keep it simple** - Don't over-engineer
5. **Follow conventions** - Use same coding style

---

## 🎯 Expected Outcome

After completing this refactoring:
- ✅ [city].vue compiles successfully
- ✅ City pages work properly
- ✅ Pagination works
- ✅ All functionality preserved
- ✅ Clean, maintainable code
- ✅ Follows same pattern as StateWithCompany

---

**Priority**: 🔴 HIGH - Blocks city page functionality

**Estimated Time**: 2-3 hours

**Difficulty**: Medium (similar to StateWithCompany but with pagination)

