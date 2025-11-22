# Company Detail Page Integration

## Overview
Complete implementation of company detail page with API integration following Nuxt 4 conventions and project standards.

## Files Created

### 1. Type Definitions (`app/types/company-detail.ts`)
- **IServiceCategory**: Service category structure
- **ICompanyReview**: Review data structure
- **IWorkingHours**: Weekly schedule interface
- **ICompanyDetailAttributes**: Complete company attributes
- **ICompanyDetail**: Main company data structure
- **ICompanyDetailResponse**: API response wrapper

### 2. Component (`app/components/Page/CompanyDetail.vue`)
Full-featured company detail component with:
- API integration using `$publicApi`
- Loading, error, and success states
- Company information display
- Trust badges and verification indicators
- Contact information with clickable links
- Working hours with "Open Now" status
- Service categories grid
- Customer reviews section
- Star rating display
- Responsive design

### 3. Page (`app/pages/[country]/[state]/[city]/[company]/index.vue`)
Dynamic route page that:
- Extracts company slug from URL
- Generates breadcrumb navigation
- Provides SEO meta tags
- Integrates CompanyDetail component

## API Integration

### Endpoint
```
GET http://localhost:3000/api/v1/companies/{id}
```

### Response Structure
```json
{
  "data": {
    "id": "1288",
    "type": "company",
    "attributes": {
      "name": "Quality Septic Works",
      "slug": "quality-septic-works",
      "phone": "310-827-1384",
      "email": "office@qualitysepticpro.com",
      "website": "https://www.qualitysepticworks.com",
      "street_address": "8955 Oak Ave",
      "zip_code": "60647",
      "latitude": "41.574538",
      "longitude": "-121.244497",
      "description": "Company description...",
      "average_rating": "0.0",
      "total_reviews": 0,
      "verified_professional": true,
      "licensed": false,
      "insured": true,
      "background_checked": true,
      "certified_partner": false,
      "service_guarantee": true,
      "service_level": "Elite",
      "specialty": "Commercial Plumbing",
      "working_hours": {
        "Monday": "8:00 AM - 5:00 PM",
        "Tuesday": "8:00 AM - 5:00 PM",
        "Wednesday": "8:00 AM - 5:00 PM",
        "Thursday": "8:00 AM - 5:00 PM",
        "Friday": "8:00 AM - 5:00 PM",
        "Saturday": "Closed",
        "Sunday": "Closed"
      },
      "url_path": "/united-states/california/mountainwood-135/quality-septic-works",
      "full_address": "8955 Oak Ave, Mountainwood, California, 60647",
      "service_categories": [
        {
          "id": 2,
          "name": "Drain Cleaning",
          "slug": "drain-cleaning",
          "description": "Expert drain cleaning and unclogging services"
        }
      ],
      "reviews": []
    }
  }
}
```

## Features Implemented

### 1. Type Safety
- Complete TypeScript interfaces for all API data
- Proper null/undefined handling
- Type-safe component props

### 2. UI Components
- **Header Section**: Company name, specialty, service level badge, rating
- **Trust Badges**: Visual indicators for verified professional, licensed, insured, etc.
- **About Section**: Company description
- **Contact Information**: Phone, email, website, address with icons and click-to-action
- **Working Hours**: Grid display with current open/closed status
- **Service Categories**: Card-based service offerings
- **Reviews**: Customer reviews with star ratings (when available)

### 3. User Experience
- Loading states with spinner
- Error states with retry functionality
- Empty states for no reviews
- Hover effects on interactive elements
- Responsive grid layouts
- Color-coded service level badges
- "Open Now" indicator

### 4. SEO Optimization
- Dynamic meta titles
- Descriptive meta descriptions
- Open Graph tags
- Breadcrumb navigation
- Semantic HTML structure

### 5. Accessibility
- Proper ARIA labels
- Clickable contact links
- Keyboard navigation support
- Color contrast compliance
- Screen reader friendly

## URL Structure
```
/{country}/{state}/{city}/{company-slug-{id}}
```

Example:
```
/united-states/california/mountainwood-135/quality-septic-works-1288
```

## Component Usage

### In Page
```vue
<PageCompanyDetail :company-slug="companySlug" />
```

### Props
- `companySlug` (string, required): The company slug from URL params

## ID Extraction Logic
The component extracts the company ID from the slug:
1. Splits slug by hyphen
2. Checks if last segment is numeric
3. Uses numeric ID for API call
4. Falls back to full slug if no ID found

Example:
- `quality-septic-works-1288` → ID: `1288`
- `company-name` → Uses full slug

## Service Level Colors
- **Basic**: Gray background
- **Standard**: Blue background
- **Premium**: Purple background
- **Elite**: Amber background

## Trust Badges
- ✓ Verified Professional (green)
- ✓ Licensed (blue)
- ✓ Insured (blue)
- ✓ Background Checked (green)
- ✓ Certified Partner (purple)
- ✓ Service Guarantee (amber)

## Responsive Breakpoints
- Mobile: Single column layout
- Tablet (md): 2 column grid for contact/hours
- Desktop (lg): 3 column grid for services

## Error Handling
1. Network errors: Display error message with retry button
2. 404 errors: Show company not found message
3. API errors: Generic error with retry option
4. Loading timeouts: Automatic retry mechanism

## Future Enhancements
1. Add review submission form
2. Implement map integration for address
3. Add photo gallery
4. Include business hours timezone
5. Add share functionality
6. Implement real-time availability checking
7. Add click-to-call analytics
8. Include distance calculator
9. Add favorite/bookmark feature
10. Implement comparison tool

## Testing Considerations
- Test with various company IDs
- Test error states (404, network errors)
- Test with companies having different service levels
- Test with companies having no reviews
- Test responsive layouts
- Test accessibility features
- Verify SEO meta tags
- Test breadcrumb navigation

## Dependencies
- `lucide-vue-next`: Icons
- `@/types/company-detail`: Type definitions
- `formatSlugToTitle`: Utility function (auto-imported)
- `$publicApi`: API client (Nuxt plugin)
- `BaseBreadcrumb`: Breadcrumb component
- `BaseButton`: Button component

## Related Files
- `app/utils/formatSlug.ts`: Slug formatting utilities
- `app/plugins/api.ts`: API client configuration
- `app/components/Base/Breadcrumb.vue`: Breadcrumb component
- `app/components/Base/Button.vue`: Button component

## Notes
- All component names use PascalCase for auto-import
- All types start with `I` prefix (project convention)
- API calls use `$publicApi` plugin for consistency
- Error messages are user-friendly and actionable
- Component follows Vue 3 Composition API with `<script setup>`
- Uses Tailwind CSS for styling
- Follows Nuxt 4 directory structure

