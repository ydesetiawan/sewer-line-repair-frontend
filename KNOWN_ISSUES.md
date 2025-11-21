# Known Issues
## ⚠️ [city].vue Page Needs Update
**File:** `app/pages/[country]/[state]/[city].vue`
**Issue:** This file still imports from the deleted `useCompaniesApi.ts` composable:
```typescript
import { useCompanies } from '@/composables/useCompaniesApi'
```
**Impact:** 
- The page will fail to compile
- Cannot navigate to city-specific pages (e.g., `/united-states/california/los-angeles`)
**Recommendation:**
Create a similar component-based solution like `PageCityWithCompanies.vue` or restore a minimal composable if the logic is truly reusable between multiple pages.
**Priority:** HIGH - Blocks city page functionality
---
## Related Files
- ✅ `app/pages/[country]/[state].vue` - Already refactored
- ❌ `app/pages/[country]/[state]/[city].vue` - Needs refactoring
- ✅ `app/components/Page/StateWithCompany.vue` - New component created
