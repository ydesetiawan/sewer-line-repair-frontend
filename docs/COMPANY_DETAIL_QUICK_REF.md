# Company Detail Page - Quick Reference

## 🚀 Quick Start

### URL Format
```
/{country}/{state}/{city}/{company-slug-{id}}
```

### Example URL
```
/united-states/california/mountainwood-135/quality-septic-works-1288
```

## 📁 Files Structure

```
app/
├── types/
│   └── company-detail.ts           # TypeScript interfaces
├── components/
│   └── Page/
│       └── CompanyDetail.vue       # Main component with API integration
└── pages/
    └── [country]/
        └── [state]/
            └── [city]/
                └── [company]/
                    └── index.vue   # Page that uses CompanyDetail
```

## 🔌 API Integration

### Endpoint
```typescript
GET /api/v1/companies/{id}
```

### Component Usage
```vue
<PageCompanyDetail :company-slug="companySlug" />
```

### API Call (inside component)
```typescript
const { $publicApi } = useNuxtApp()

const response = await ($publicApi as any)(`/api/v1/companies/${companyId}`)
company.value = response.data
```

## 📊 Key Features

### ✅ Implemented
- [x] Loading states with spinner
- [x] Error handling with retry
- [x] Company information display
- [x] Trust & safety badges
- [x] Contact information (clickable)
- [x] Working hours with open/closed status
- [x] Service categories
- [x] Star rating display
- [x] Reviews section
- [x] Responsive design
- [x] SEO optimization
- [x] Breadcrumb navigation

### 🎨 UI Components

| Section | Description |
|---------|-------------|
| Header | Name, specialty, rating, service level |
| Trust Badges | Verification indicators |
| About | Company description |
| Contact | Phone, email, website, address |
| Hours | Weekly schedule with status |
| Services | Service categories grid |
| Reviews | Customer reviews (when available) |

## 🎯 Service Levels

| Level | Badge Color |
|-------|-------------|
| Basic | Gray |
| Standard | Blue |
| Premium | Purple |
| Elite | Amber |

## 🛡️ Trust Badges

| Badge | Icon | Color |
|-------|------|-------|
| Verified Professional | CheckCircle | Green |
| Licensed | Award | Blue |
| Insured | Shield | Blue |
| Background Checked | Shield | Green |
| Certified Partner | Award | Purple |
| Service Guarantee | Shield | Amber |

## 💡 Component Props

```typescript
interface Props {
  companySlug: string  // Required: Company slug from URL
}
```

## 🔧 Key Functions

### Extract ID from Slug
```typescript
// Input: "quality-septic-works-1288"
// Output: "1288"
const extractIdFromSlug = (slug: string): string => {
  const parts = slug.split('-')
  const lastPart = parts[parts.length - 1]
  
  if (lastPart && /^\d+$/.test(lastPart)) {
    return lastPart
  }
  
  return slug
}
```

### Check if Currently Open
```typescript
const isCurrentlyOpen = computed(() => {
  const now = new Date()
  const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' })
  const currentHours = company.value.attributes.working_hours[currentDay]
  
  return currentHours !== 'Closed'
})
```

## 📱 Responsive Grid

```
Mobile (< md):    1 column
Tablet (md):      2 columns
Desktop (lg):     3 columns
```

## 🔍 SEO Meta Tags

```typescript
useSeoMeta({
  title: `${company} - Sewer Repair Contractor in ${city}, ${state}`,
  description: `Contact ${company} for professional plumbing...`,
  ogTitle: `${company} - Sewer Repair Services in ${city}`,
  ogDescription: `Professional sewer repair...`
})
```

## ⚠️ Error States

1. **Loading**: Spinner with "Loading company details..."
2. **Error**: Alert icon with retry button
3. **404**: Company not found message
4. **Empty Reviews**: "No reviews yet" message

## 🎨 Styling

- Uses Tailwind CSS classes
- Follows project design system
- Consistent spacing and colors
- Hover effects on interactive elements
- Smooth transitions

## 🧪 Testing URLs

```
# Good cases
/united-states/california/mountainwood-135/quality-septic-works-1288
/united-states/texas/austin-2/plumbing-pros-456

# Edge cases
/united-states/california/city-1/company-without-id
/united-states/invalid-state/city/company
```

## 📦 Dependencies

```typescript
// Icons
import { Loader2, AlertCircle, RefreshCw, Phone, Mail, 
         Globe, MapPin, Clock, Star, Shield, Award, 
         CheckCircle } from 'lucide-vue-next'

// Types
import type { ICompanyDetail } from '@/types/company-detail'

// Composables (auto-imported)
- ref, computed, onMounted
- useNuxtApp, useRoute, useSeoMeta
- formatSlugToTitle
```

## 🚨 Common Issues

### Issue: Company not loading
**Solution**: Check if company slug format is correct (should end with -ID)

### Issue: TypeScript errors
**Solution**: Ensure all types are imported from `@/types/company-detail`

### Issue: API not working
**Solution**: Verify `$publicApi` plugin is configured correctly

### Issue: Icons not showing
**Solution**: Check `lucide-vue-next` is installed

## 📝 Quick Commands

```bash
# Navigate to component
cd app/components/Page

# Navigate to types
cd app/types

# Navigate to page
cd app/pages/[country]/[state]/[city]/[company]

# Check for errors
npm run type-check

# Run dev server
npm run dev
```

## 🔗 Related Documentation

- [Full Documentation](./COMPANY_DETAIL_PAGE.md)
- [API Integration Guide](./API_INTEGRATION.md)
- [Component Guidelines](../.github/copilot-instructions.md)

## 💼 Business Logic

- **Working Hours**: Displays weekly schedule with current status
- **Service Level**: Visual badge indicating company tier
- **Trust Badges**: Shows verification and certification status
- **Reviews**: Customer feedback with star ratings
- **Contact Methods**: Click-to-call, email, website links

## 🎓 Best Practices

1. ✅ Use TypeScript for type safety
2. ✅ Handle loading and error states
3. ✅ Provide user feedback
4. ✅ Make contact info clickable
5. ✅ Use semantic HTML
6. ✅ Follow project conventions
7. ✅ Optimize for mobile
8. ✅ Include SEO meta tags
9. ✅ Add proper comments
10. ✅ Test edge cases

