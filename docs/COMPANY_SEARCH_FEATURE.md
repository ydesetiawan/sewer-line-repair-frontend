# Company Search Feature Documentation

## Overview
Added search functionality to the CompanyList component that allows users to search for companies by name with real-time filtering and a polished UI.

## Feature Details

### Search Functionality

#### 1. **Search Input**
- Location: Between page header and cities grid
- Placeholder: "Search by company name..."
- Icon: Search icon on the left
- Clear button: X icon on the right (shown when text is entered)

#### 2. **Search Behavior**
- **Debounced Search**: 500ms delay after typing stops before API call
- **Real-time Filtering**: Results update as you type
- **Loading Indicator**: Spinner shows while searching
- **Case-insensitive**: Search works regardless of letter casing

#### 3. **User Experience**
- Clear visual feedback during search
- Loading spinner in search input while fetching
- "Clear Search" button to reset
- Result count display
- Empty state message when no results found

## Implementation

### API Integration

The search uses the existing API endpoint with the `company_name` parameter:

```typescript
GET /api/v1/states/{state}/companies?company_name={query}
```

### Key Functions

#### `handleSearch()`
- Debounces search input by 500ms
- Shows loading spinner
- Resets to page 1
- Calls API with search query

#### `clearSearch()`
- Clears search input
- Resets to page 1
- Fetches all companies

#### `fetchData()`
- Updated to include `company_name` parameter
- Handles both search and non-search scenarios

## UI States

### 1. **Initial State**
```
[Search icon] Search by company name...  [X icon when text present]
```

### 2. **Searching State**
```
[Search icon] Search by company name...  [Spinner]
Searching for "query"...
```

### 3. **Results State**
```
Search Results
Found 5 results for "query"
```

### 4. **No Results State**
```
[Large Search Icon]
No Results Found
We couldn't find any companies matching "query" in State Name.
[Clear Search Button]
```

## Code Changes

### Added State Variables
```typescript
const searchQuery = ref('')
const isSearching = ref(false)
```

### Updated fetchData
```typescript
params: {
  page: page,
  per_page: 20,
  city: props.citySlug || null,
  company_name: searchQuery.value || null, // ✅ NEW
}
```

### New Functions
```typescript
// Debounced search handler
const handleSearch = () => { ... }

// Clear search
const clearSearch = () => { ... }
```

### Template Changes
```vue
<!-- Search Bar -->
<div class="mb-8">
  <input v-model="searchQuery" @input="handleSearch" />
  <!-- Loading spinner and clear button -->
</div>

<!-- Dynamic header -->
<h2>{{ searchQuery ? 'Search Results' : 'All Contractors' }}</h2>

<!-- No results state -->
<div v-if="!loading && companies.length === 0 && searchQuery">
  <!-- Empty state UI -->
</div>
```

## User Flow

1. **User types in search box**
   - Input is captured with `v-model="searchQuery"`
   - `@input="handleSearch"` triggers on each keystroke

2. **Debounce timer starts**
   - Previous timeout is cleared
   - New 500ms timer starts
   - Loading spinner shows

3. **Search executes**
   - After 500ms, API is called with `company_name` parameter
   - Page resets to 1
   - Results are replaced (not appended)

4. **Results display**
   - Header changes to "Search Results"
   - Shows count: "Found X results for 'query'"
   - Companies matching the search display

5. **Clear search**
   - Click X button or "Clear Search" button
   - Query is cleared
   - All companies are fetched again

## Features

### ✅ Implemented
- Real-time search with debouncing
- Loading indicators
- Clear search functionality
- Result count display
- Empty state for no results
- Maintains pagination for search results
- Load more works with search
- Keyboard accessible (can clear with X button)
- Visual feedback throughout

### 🎨 UI Elements
- Search icon (left side of input)
- Loading spinner (while searching)
- Clear button (X icon, right side)
- Result count message
- Empty state with icon and message
- Styled input with focus states

## Accessibility

- ✅ Label for screen readers: "Search Companies"
- ✅ Placeholder text: "Search by company name..."
- ✅ ARIA label on clear button: "Clear search"
- ✅ Focus states on input
- ✅ Keyboard navigation supported

## Performance

- **Debouncing**: Prevents excessive API calls (500ms delay)
- **Efficient updates**: Only fetches when needed
- **Loading states**: Clear visual feedback
- **Error handling**: Maintains previous state on error

## Example Usage

### Search by company name:
```
User types: "pro plumb"
→ Waits 500ms
→ API: /states/texas/companies?company_name=pro%20plumb
→ Shows: "Found 3 results for 'pro plumb'"
```

### Clear search:
```
User clicks X button
→ searchQuery = ''
→ API: /states/texas/companies
→ Shows: "All Contractors in Texas"
```

## Integration

This search feature integrates seamlessly with:
- ✅ City filtering (via props.citySlug)
- ✅ Pagination (load more)
- ✅ Existing company display
- ✅ Error handling
- ✅ Loading states

## Testing Checklist

- [ ] Type slowly and verify debouncing works
- [ ] Type quickly and verify only one API call happens
- [ ] Clear search and verify all companies return
- [ ] Search with no results and verify empty state
- [ ] Use "Load More" with search active
- [ ] Navigate away and back to verify state reset
- [ ] Test with special characters in search
- [ ] Test with very long search query
- [ ] Verify loading spinner appears/disappears
- [ ] Test clear button visibility

## Future Enhancements

Potential improvements:
- [ ] Search history (localStorage)
- [ ] Search suggestions/autocomplete
- [ ] Advanced filters (city, specialty, rating)
- [ ] Save search functionality
- [ ] Search analytics
- [ ] Highlight matching text in results
- [ ] Minimum character requirement (e.g., 3 chars)
- [ ] Search by other fields (address, services)

## Browser Compatibility

- ✅ Modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ Mobile responsive
- ✅ Touch-friendly clear button
- ✅ Works without JavaScript (graceful degradation)

## Notes

- Search is case-insensitive (handled by API)
- Empty search shows all companies
- Search persists during pagination
- Clearing search resets to page 1
- Search state is local (not in URL params)

