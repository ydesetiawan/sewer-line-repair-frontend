# SearchState Component - Testing Guide

## Quick Start
The server is running at: http://localhost:3002

## Test the Component

### Page to Test: Browse All States
URL: http://localhost:3002/browse-all-states

This page demonstrates the SearchState component with all features.

## Test Scenarios

### 1. Basic Search
1. Navigate to http://localhost:3002/browse-all-states
2. Click on the search input
3. Type "cali" (for California)
4. Wait 400ms (debounce)
5. ✅ Should show California with state code "CA" and companies count

### 2. Real-time Filtering
1. Type "new" in search
2. ✅ Should show: New York, New Jersey, New Hampshire, New Mexico

### 3. Clear Search
1. Type any text in search
2. Click the X button on the right
3. ✅ Input should clear and dropdown should close

### 4. No Results
1. Type "xyz123" in search
2. ✅ Should show: "No states found matching 'xyz123'"

### 5. Loading State
1. Type quickly: "florida"
2. ✅ Should show loading spinner in input
3. ✅ Should show "Searching..." in dropdown

### 6. Keyboard Navigation
1. Type "new" to get multiple results
2. Press ↓ (Down Arrow) - selection moves down
3. Press ↑ (Up Arrow) - selection moves up
4. Press Enter - navigates to selected state
5. Press Escape - closes dropdown

### 7. Click Outside
1. Type to open dropdown
2. Click anywhere outside the search component
3. ✅ Dropdown should close

### 8. Navigation
1. Search for a state (e.g., "texas")
2. Click on the state in results
3. ✅ Should navigate to: /united-states/texas

### 9. Results Count
1. Type "a" to get many results
2. ✅ Should show: "Showing X of Y results" at top of dropdown

### 10. Error Handling
1. Stop the API server (http://localhost:3000)
2. Search for a state
3. ✅ Should show error message with "Try Again" button
4. Click "Try Again"
5. Restart API server
6. ✅ Should retry and show results

## Visual Elements to Verify

### Search Input
- [ ] Placeholder text: "Search states..."
- [ ] Search icon on left
- [ ] Clear button (X) on right when typing
- [ ] Loading spinner when searching
- [ ] Proper focus states

### Results Dropdown
- [ ] Status bar at top showing results count
- [ ] State icon (MapPin) for each result
- [ ] State name in bold
- [ ] State code in badge (e.g., "CA")
- [ ] Companies count (e.g., "152 companies")
- [ ] Hover effects on items
- [ ] Selected item highlighted
- [ ] Smooth animations

### Loading Skeleton
- [ ] 3 animated skeleton items
- [ ] Pulsing animation
- [ ] Proper spacing

### Error State
- [ ] AlertCircle icon in red
- [ ] Error message
- [ ] "Try Again" button
- [ ] Centered layout

### No Results State
- [ ] MapPin icon (faded)
- [ ] "No states found" message
- [ ] Search query in message
- [ ] Centered layout

## Mobile Testing (Optional)
1. Open on mobile device or resize browser to mobile width
2. Test all above scenarios
3. Verify touch interactions work
4. Check responsive layout

## Performance Testing
1. Type very fast: "californianewyorktexas"
2. ✅ Should only make one API call after 400ms
3. ✅ Previous requests should be canceled

## Accessibility Testing
1. Navigate using Tab key only
2. ✅ Should be able to focus search input
3. ✅ Should be able to navigate with arrows
4. ✅ Should be able to select with Enter
5. Use screen reader (if available)
6. ✅ Should announce search results count

## API Testing

### Check Network Tab
1. Open browser DevTools → Network tab
2. Search for "california"
3. ✅ Should see: GET http://localhost:3000/api/v1/states?state=california

### Check Request Cancellation
1. Type "c" → wait 200ms
2. Type "a" → wait 200ms
3. Type "l" → wait 200ms
4. ✅ Only ONE request should complete (for "cal")
5. ✅ Previous requests should be canceled

## Expected API Response
```json
{
  "data": [
    {
      "id": "1",
      "type": "state",
      "attributes": {
        "name": "California",
        "code": "CA",
        "slug": "california",
        "companies_count": 315,
        "country": {
          "id": 1,
          "name": "United States",
          "code": "US",
          "slug": "united-states"
        }
      }
    }
  ],
  "meta": {
    "pagination": {
      "current_page": 1,
      "prev_page": null,
      "next_page": null,
      "total_items": 1,
      "total_pages": 1
    }
  }
}
```

## Troubleshooting

### Component Not Showing
- Check console for errors
- Verify component path: `app/components/features/SearchState.vue`
- Check auto-import is working: `<FeaturesSearchState />`

### API Not Responding
- Verify API server is running on http://localhost:3000
- Check CORS settings on API
- Check API endpoint: /api/v1/states

### Dropdown Not Showing
- Check if `showResults` prop is true (default)
- Verify searchQuery has value
- Check browser console for errors

### Styles Not Applied
- Verify Tailwind CSS is loaded
- Check main.css is imported
- Verify component classes are correct

## Success Criteria

All these should work:
- ✅ Real-time search as typing
- ✅ Debouncing (400ms delay)
- ✅ Request cancellation
- ✅ Loading states
- ✅ Error handling
- ✅ No results message
- ✅ Clear button
- ✅ Keyboard navigation
- ✅ Click outside to close
- ✅ Navigate to state page
- ✅ Results count display
- ✅ Responsive design
- ✅ Smooth animations
- ✅ Accessibility features

## Next Steps
After testing, you can:
1. Integrate with other pages
2. Add search history
3. Add analytics tracking
4. Customize styling
5. Add more filters

## Support
For issues, check:
- `/docs/SEARCH_STATE_COMPONENT.md` - Full documentation
- `/app/composables/useStatesSearch.ts` - Composable code
- `/app/components/features/SearchState.vue` - Component code

