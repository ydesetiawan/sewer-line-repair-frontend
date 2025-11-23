# Company Search & Filters Documentation

## Overview
The Directory component features a unified search and filter system within a single card interface, providing comprehensive filtering capabilities that match all backend API parameters for searching companies.

## UI/UX Design

### Single Card Layout
All search and filtering functionality is combined into **one cohesive card** for better user experience:

- **Primary Search Bar**: Prominently displayed at the top with real-time search
- **Collapsible Filter Panel**: Advanced filters hidden by default, expandable on demand
- **Active Filter Display**: Quick-view tags showing active filters when panel is collapsed
- **Smart Actions**: Clear controls for managing search and filters

### Visual Hierarchy
1. **Title Section** - Search & Filter Contractors heading with icon
2. **Search Bar** - Large, prominent search input with clear button
3. **Filter Toggle** - Collapsible section for advanced filters
4. **Active Filters** - Visual tags showing current filter selections
5. **Quick Actions** - Clear All and Apply Filters buttons

## Filter Parameters

### 1. **Location Filters**
- **City** (`city`): Filter by city name (case-insensitive)
  - Example: "Austin", "Houston", "Dallas"
- **State** (`state`): Filter by state name or code (case-insensitive)
  - Example: "Texas", "TX"
- **Country** (`country`): Filter by country name or code (case-insensitive)
  - Example: "United States", "US"

### 2. **Service & Quality Filters**
- **Service Category** (`service_category`): Filter by specific service type
  - Options:
    - Sewer Line Repair
    - Drain Cleaning
    - Pipe Replacement
    - Septic Services
    - Emergency Services
    - Water Line Repair
    - Camera Inspection
- **Minimum Rating** (`min_rating`): Filter by minimum rating threshold
  - Options: 4.5+, 4.0+, 3.5+, 3.0+
- **Verified Only** (`verified_only`): Show only verified professionals
  - Boolean: true/false

### 3. **Sorting Options** (`sort`)
- **Name (A-Z)**: `name`
- **Name (Z-A)**: `-name`
- **Rating (High to Low)**: `-rating`
- **Rating (Low to High)**: `rating`

### 4. **Search**
- **Company Name** (`company_name`): Search by contractor name
  - Supports partial matching (case-insensitive)

## UI Features

### Unified Card Interface
**All search and filter functionality in one card:**
- Clean, organized single-card layout
- Search bar always visible at top
- Filters expand/collapse below search
- Integrated actions and controls

### Search Bar Features
- **Large Input Field**: Prominent 12px height search bar
- **Placeholder Guidance**: Example search terms ("ABC Plumbing", "Elite Sewer")
- **Real-time Search**: Debounced search (500ms) with loading indicator
- **Clear Button**: Easy-to-access X button when text is entered
- **Active Search Display**: Blue badge showing current search query
- **Auto-focus**: Keyboard-friendly input

### Filter Panel
- **Collapsible Design**: Toggle filters on/off to save screen space
- **Active Filter Count Badge**: Shows number of active filters in purple
- **Organized Sections**: 
  - Location (City, State, Country) with MapPin icon
  - Service Category with Star icon
  - Quality (Rating, Verified) with Star icon
  - Sort Options with SlidersHorizontal icon
- **Active Filter Tags**: Display active filters as removable tags when panel is collapsed
- **Smart Layout**: 2-column grid on desktop, single column on mobile

### Quick Actions
- **Show/Hide Filters**: Toggle button for advanced filters
- **Clear All**: Reset both search and all filters at once
- **Reset Filters**: Clear only filters, keep search query
- **Apply Filters**: Execute search with current settings
- **Individual Tag Removal**: X button on each active filter tag

### Visual Design
- **Gradient Header Icon**: Blue to purple gradient icon badge
- **Color-Coded Sections**:
  - Blue (#3B82F6): Location filters & search
  - Purple (#9333EA): Service filters & badge
  - Amber (#F59E0B): Quality/rating filters
  - Emerald (#10B981): Verified badge
  - Gray: Sort options
- **Consistent Input Styling**: 
  - White backgrounds
  - Gray borders with blue focus
  - Ring effect on focus (blue-100)
  - Rounded corners (lg)
  - Smooth transitions
- **Icon Integration**: Lucide icons for visual clarity and consistency

### User Experience Enhancements
1. **Progressive Disclosure**: Filters hidden by default, clean initial view
2. **Real-time Feedback**: 
   - Loading spinners during search
   - Active filter count badge
   - Search query display badge
3. **Easy Removal**: Click X on any tag or use Clear All
4. **Smart Defaults**: 
   - Sort: Name A-Z
   - All filters initially empty
5. **Accessibility**: 
   - Proper labels for all inputs
   - ARIA attributes
   - Keyboard navigation support
   - Focus states on all interactive elements
6. **Smooth Animations**: Fade-in effects for filter panel expand/collapse

## API Integration

### Request Format
```typescript
GET /api/v1/companies/search?
  page=1&
  per_page=20&
  company_name=plumbing&
  city=Austin&
  state=Texas&
  service_category=sewer-line-repair&
  verified_only=true&
  min_rating=4.0&
  sort=-rating
```

### Response Handling
- Results replace current list when filters applied
- Pagination maintained across filter changes
- Loading states for both initial load and filter application
- Error handling with user-friendly messages

## State Management

### Filter State Object
```typescript
filters = {
  city: '',
  state: '',
  country: '',
  service_category: '',
  verified_only: false,
  min_rating: '',
  sort: 'name'
}
```

### Reactive Properties
- `showFilters`: Controls filter panel visibility
- `activeFiltersCount`: Computed count of active filters
- `loading`: Shows loading state during data fetch
- `searchQuery`: Separate from filters for company name search

## Implementation Details

### Key Functions
1. **`applyFilters()`**: Apply current filters and fetch data
2. **`clearFilters()`**: Reset all filters to defaults
3. **`toggleFilters()`**: Show/hide filter panel
4. **`fetchData()`**: Fetch companies with all active filters

### Auto-Applied Filters
- Search query triggers automatic fetch with debounce
- Removing individual filter tags auto-applies changes
- "Apply Filters" button gives explicit control

## Best Practices

### Performance
- Debounced search input (300ms)
- Null values removed from API params
- Pagination maintained for efficient data loading

### UX Considerations
- Filter panel starts collapsed to reduce visual clutter
- Active filters always visible as removable tags
- Clear feedback on filter application
- Smooth transitions and animations

### Maintainability
- All filter logic centralized in component
- Type-safe with TypeScript interfaces
- Consistent naming with backend API
- Well-documented code with JSDoc comments

## Future Enhancements

Potential additions based on backend capabilities:
- **Radius Search**: Add lat/lng + radius filtering
- **Address Search**: Geocoded address-based filtering
- **Service Areas**: Filter by service coverage area
- **Advanced Sorting**: Distance-based sorting (requires coordinates)
- **Saved Filters**: User preference persistence
- **Filter Presets**: Common filter combinations (e.g., "Top Rated Near Me")

## Related Files
- `/app/components/Page/Directory.vue` - Main component
- `/app/types/company.ts` - Company interfaces
- `/app/types/city.ts` - City interfaces
- `/app/plugins/api.ts` - API client configuration

## Testing Considerations
- Test each filter individually
- Test filter combinations
- Test filter clearing
- Test pagination with filters
- Test error handling
- Test mobile responsive design
- Test accessibility (keyboard navigation, screen readers)

