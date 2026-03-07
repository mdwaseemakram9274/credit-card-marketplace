# Testing Checklist & Verification Guide

## Overview
This document provides a comprehensive testing checklist for all 6 features. Complete this checklist after database migrations are executed.

**Testing Duration:** 2-3 hours
**Testers Needed:** 1-2 (developer + QA)
**Environment:** Staging (before production deployment)

---

## FEATURE 1: SEO Routing - Testing

### 1.1 Dynamic Card Pages

- [ ] Navigate to `/cards/amex-platinum` (or any card slug)
- [ ] Page loads successfully without errors
- [ ] Card title displays correctly
- [ ] Card image loads
- [ ] Page title matches card name
- [ ] Meta description appears in page source
- [ ] Canonical URL is correct: `https://domain.com/cards/{slug}`
- [ ] Open Graph tags are present:
  - [ ] `og:title` = card name
  - [ ] `og:description` = card description
  - [ ] `og:image` = card image URL
  - [ ] `og:type` = "product"
- [ ] Twitter Card tags present:
  - [ ] `twitter:card` = "summary_large_image"
  - [ ] `twitter:image` = card image
- [ ] JSON-LD Product schema in page source
- [ ] JSON-LD Breadcrumb schema present

**Test URLs:**
- Card with image: `/cards/hdfc-cashback`
- Card without image: `/cards/generic-card`
- Invalid slug: `/cards/non-existent` (should 404)

### 1.2 Dynamic Lender Pages

- [ ] Navigate to `/lenders/hdfc-bank`
- [ ] Page loads successfully
- [ ] Lender name displays
- [ ] Lender logo loads (if available)
- [ ] Page title includes bank name
- [ ] JSON-LD Organization schema present
- [ ] Breadcrumb navigation shows correctly
- [ ] Cards from this lender are listed (if implemented)

### 1.3 ISR (Incremental Static Regeneration)

- [ ] First page load returns static page (fast)
- [ ] Add new card via admin
- [ ] Wait 60 seconds (ISR revalidation period)
- [ ] New card appears on cards page
- [ ] Card detail page accessible immediately

### 1.4 Search Engine Optimization

- [ ] Open DevTools → Network → search for robots.txt
- [ ] robots.txt is accessible
- [ ] Page source contains `<meta name="robots" content="index, follow">`
- [ ] Admin pages have `noindex`:
  - [ ] `/admin` page has `<meta name="robots" content="noindex, nofollow">`
  - [ ] Admin content is not indexed

**Test Methods:**
- Chrome DevTools → Elements → search for "meta robots"
- View page source (Ctrl+U) and search for schema tags
- Use Google Rich Result Tester (search.google.com/test/rich-results)

---

## FEATURE 2: Homepage API - Testing

### 2.1 API Endpoint Tests

#### GET /api/homepage/sections
- [ ] Request: `GET /api/homepage/sections`
- [ ] Response status: 200
- [ ] Response includes 18 sections
- [ ] Each section has: id, key, type, content, is_active
- [ ] Only active sections returned (is_active = true)
- [ ] Response time < 200ms

#### GET /api/homepage/sections/[key]
- [ ] Request: `GET /api/homepage/sections/hero`
- [ ] Response status: 200
- [ ] Returns single section with correct key
- [ ] Response time < 100ms
- [ ] Request with invalid key returns 404

#### POST /api/homepage/sections (Admin Only)
- [ ] Create without token: Returns 401
- [ ] Create with invalid token: Returns 401
- [ ] Create with valid token:
  - [ ] Response status: 201
  - [ ] New section created in database
  - [ ] Returns created section object
- [ ] Required fields present: key, type, content

#### PUT /api/homepage/sections/[key]
- [ ] Update without token: Returns 401
- [ ] Update valid section:
  - [ ] Response status: 200
  - [ ] Content updated in database
  - [ ] Changes visible immediately
- [ ] Update non-existent section: Returns 404

#### DELETE /api/homepage/sections/[key]
- [ ] Delete without token: Returns 401
- [ ] Delete valid section:
  - [ ] Response status: 200
  - [ ] Section marked as inactive (soft delete)
  - [ ] Data not permanently deleted
- [ ] Deleted section no longer in GET all

### 2.2 Admin Component Tests

- [ ] Admin page loads
- [ ] "Homepage" tab appears
- [ ] Click "Homepage" tab shows section list
- [ ] List displays all 18 sections
- [ ] Can click section to edit
- [ ] Edit panel shows JSON content
- [ ] Can modify JSON content
- [ ] Save button works
- [ ] Changes sync to API
- [ ] Can delete section (shows confirmation)
- [ ] Refresh page shows updated data

### 2.3 Frontend Integration Tests

- [ ] Homepage loads
- [ ] Hero section content displays
- [ ] Sections render in correct order
- [ ] Styling is consistent
- [ ] Links in sections are clickable
- [ ] Responsive on mobile

**Test with:**
- Desktop browser (1920x1080)
- Tablet (768px width)
- Mobile (375px width)

---

## FEATURE 3: FAQ Management - Testing

### 3.1 FAQ API Endpoint Tests

#### GET /api/faqs
- [ ] Request: `GET /api/faqs`
- [ ] Response status: 200
- [ ] Returns 18 FAQs
- [ ] Only active FAQs returned
- [ ] Each FAQ has: id, question, answer, category, display_order, is_featured
- [ ] Response time < 200ms

#### GET /api/faqs?category=General
- [ ] Filter by category works
- [ ] Only FAQs with matching category returned
- [ ] Response time < 100ms

#### GET /api/faqs?featured_only=true
- [ ] Returns only pinned FAQs
- [ ] Sorted by display_order

#### GET /api/faqs?limit=5&offset=0
- [ ] Pagination works
- [ ] Returns first 5 FAQs
- [ ] Total count provided
- [ ] Second page: `offset=5` returns next 5

#### GET /api/faqs/[id]
- [ ] Valid FAQ ID returns single FAQ
- [ ] Invalid ID returns 404
- [ ] Response includes full FAQ object

#### POST /api/faqs (Admin Only)
- [ ] Without token: Returns 401
- [ ] With valid token:
  - [ ] Creates new FAQ
  - [ ] Returns 201
  - [ ] Validates required fields
- [ ] New FAQ appears in list

#### PUT/PATCH /api/faqs/[id]
- [ ] Update without token: Returns 401
- [ ] Update valid FAQ:
  - [ ] Status: 200
  - [ ] Content updated
  - [ ] Changes visible immediately
- [ ] Can update: question, answer, category, is_featured

#### DELETE /api/faqs/[id]
- [ ] Delete without token: Returns 401
- [ ] Delete valid FAQ:
  - [ ] Status: 200
  - [ ] Marked as inactive
  - [ ] No longer in GET list
  - [ ] Data preserved in database

### 3.2 Admin Component Tests

- [ ] Admin page shows "FAQs" tab
- [ ] Click tab opens FAQ manager
- [ ] Left panel shows FAQ list (18 items)
- [ ] Right panel shows FAQ details on select
- [ ] Category filter dropdown works
- [ ] Can filter by category
- [ ] Search by question works
- [ ] Can create new FAQ:
  - [ ] "New FAQ" button works
  - [ ] Form shows all fields
  - [ ] Save creates FAQ
  - [ ] New FAQ appears in list
- [ ] Can edit FAQ:
  - [ ] Click FAQ loads into editor
  - [ ] Can modify fields
  - [ ] Save updates FAQ
  - [ ] Changes visible immediately
- [ ] Can delete FAQ:
  - [ ] Delete button shows confirmation
  - [ ] Confirm deletion removes FAQ
  - [ ] FAQ no longer in list
- [ ] Can toggle active/inactive
- [ ] Can pin FAQ as featured
- [ ] Pinned FAQs show indicator

### 3.3 Frontend Integration Tests

- [ ] Homepage loads
- [ ] FAQ section displays
- [ ] Shows 15 FAQs by default
- [ ] Pinned FAQs appear first
- [ ] Click FAQ expands answer
- [ ] Click again collapses
- [ ] Multiple FAQs can be open
- [ ] Accordion animation smooth
- [ ] Mobile: Responsive layout
- [ ] Mobile: Touch friendly

**Expected Behavior:**
- FAQs sorted by: is_featured DESC, display_order ASC
- Fallback to 15 hardcoded FAQs if API fails
- Loading state shows "Loading FAQs..."
- No errors in browser console

---

## FEATURE 4: Search & Filter - Testing

### 4.1 Search API Tests

#### Basic Full-Text Search
- [ ] GET `/api/cards/search?q=cashback`
  - [ ] Returns cards matching "cashback"
  - [ ] Response includes: results[], total, limit, offset
  - [ ] Response time < 300ms
- [ ] GET `/api/cards/search?q=hdfc`
  - [ ] Returns HDFC cards and FAQs matching
- [ ] GET `/api/cards/search?q=xyz123` (no results)
  - [ ] Returns empty array
  - [ ] Total count = 0

#### Network Filter
- [ ] `?network=Visa` returns only Visa cards
- [ ] `?network=Mastercard` returns only Mastercard
- [ ] Only one network can be selected at a time

#### Bank Filter
- [ ] `?bank=HDFC` returns HDFC cards
- [ ] `?bank=SBI` returns SBI cards
- [ ] Works with bank ID or slug

#### Category Filter
- [ ] `?categories=Travel` returns travel cards
- [ ] `?categories=Travel&categories=Rewards` returns travel OR rewards cards
- [ ] Multiple categories work (comma-separated or repeated params)

#### Benefits Filter
- [ ] `?benefits=Lounge+Access` returns cards with lounge
- [ ] `?benefits=Cashback+Rewards` returns cards with cashback

#### Annual Fee Filter
- [ ] `?minAnnualFee=0` returns free cards only
- [ ] `?hasWelcomeBonus=true` returns cards with welcome bonus
- [ ] `?hasCashback=true` returns cards with cashback
- [ ] `?hasLounge=true` returns cards with lounge

#### Sorting
- [ ] `?sortBy=relevance` returns matched results first
- [ ] `?sortBy=newest` returns newest cards first
- [ ] `?sortBy=name` returns sorted A-Z
- [ ] `?sortBy=fee_asc` returns lowest fee first
- [ ] `?sortBy=fee_desc` returns highest fee first

#### Pagination
- [ ] `?limit=20&offset=0` returns first 20 results
- [ ] `?limit=20&offset=20` returns next 20 results
- [ ] Limit capped at 100 (test `?limit=200` returns 100)
- [ ] Offset cannot be negative

#### Combined Filters
- [ ] `?q=visa&network=Visa&minAnnualFee=0&sortBy=newest`
  - [ ] All filters applied correctly
  - [ ] Returns relevant results

### 4.2 Search UI Component Tests

- [ ] Search page loads at `/search`
- [ ] Search box appears with placeholder
- [ ] Type query and results update
- [ ] Clear button (X) clears search
- [ ] Sort dropdown changes sort order
- [ ] Filter button shows/hides filter panel

#### Filter Panel
- [ ] Click "Filters" button opens panel
- [ ] Show proper filter sections:
  - [ ] Annual Fee (Free Card filter)
  - [ ] Benefits (Welcome Bonus, Cashback, Lounge)
  - [ ] Card Network (Radio buttons)
  - [ ] Bank (Radio buttons)
  - [ ] Category (Checkboxes)
- [ ] Each filter updates results immediately
- [ ] Multiple filters combine with AND logic
- [ ] "Reset All" button clears all filters

#### Results Display
- [ ] Results grid shows cards
- [ ] Each card shows:
  - [ ] Card image
  - [ ] Card name
  - [ ] Bank name
  - [ ] Network badge
  - [ ] Annual fee (or "Free")
  - [ ] Welcome bonus (if any)
  - [ ] Benefits preview (3 shown, +N more)
  - [ ] "View Details →" button
- [ ] Hover effect on card (visual feedback)
- [ ] "View Details" link goes to card page

#### Search States
- [ ] **Loading:** Spinner shows while searching
- [ ] **No Results:** Message shows "No cards found"
- [ ] **Empty:** Message shows "Start searching..."
- [ ] **Error:** Error message displayed if API fails

### 4.3 Pagination Tests

- [ ] More than 20 results shows pagination
- [ ] "Previous" button disabled on page 1
- [ ] "Next" button disabled on last page
- [ ] Page numbers display (1, 2, 3, ...)
- [ ] Ellipsis (...) shows between ranges
- [ ] Click page number goes to page
- [ ] Click next goes to next page
- [ ] Click previous goes to previous page
- [ ] Results update after page change
- [ ] Summary shows "Showing X to Y of Z results"
- [ ] Page number info shows "Page X of Y"

**Test Pagination With:**
- 42 results: Should show pages 1, 2, 3
- 150 results: Should show pages 1-7+ with ellipsis
- 1000+ results: Should handle efficiently

### 4.4 Mobile & Responsive Tests

**Device Sizes:**
- Desktop (1920px)
- Tablet (768px)
- Mobile (375px)

- [ ] Search box responsive on all sizes
- [ ] Filter panel responsive:
  - [ ] Desktop: Side panel
  - [ ] Mobile: Full-width below search
- [ ] Results grid responsive:
  - [ ] Desktop: 3-4 columns
  - [ ] Tablet: 2 columns
  - [ ] Mobile: 1 column
- [ ] Pagination responsive:
  - [ ] Desktop: Full controls visible
  - [ ] Mobile: Text hidden, icons only
- [ ] Touch-friendly buttons (min 44px size)
- [ ] No horizontal scroll on mobile

---

## FEATURE 5: Meta Tags & Schema - Testing

### 5.1 Open Graph Tags

**Test Using:**
1. Facebook Sharing Debugger: facebook.com/developers/tools/debug/sharing
2. LinkedIn Post Inspector: linkedin.com/post-inspector
3. Twitter Card Validator: cards-dev.twitter.com/validator
4. View page source (Ctrl+U)

#### Test Pages:
- [ ] Card page (`/cards/[slug]`):
  - [ ] og:title = card name
  - [ ] og:description = card description
  - [ ] og:image = card image
  - [ ] og:type = "product"
  - [ ] og:url = full page URL
- [ ] Lender page (`/lenders/[slug]`):
  - [ ] og:title = bank name
  - [ ] og:description = bank description
  - [ ] og:image = bank logo
- [ ] Search page (`/search`):
  - [ ] og:title = "Find Your Perfect Credit Card"
  - [ ] og:description includes search info
  - [ ] og:type = "website"

### 5.2 Twitter Card Tags

- [ ] Card page has `twitter:card = summary_large_image`
- [ ] Card page has `twitter:image` set
- [ ] Card page has `twitter:title` set
- [ ] Card page has `twitter:description` set

**Test:** Post card link on Twitter, preview should show image and description

### 5.3 JSON-LD Schema

**Test Using:**
1. Google Rich Result Tester: search.google.com/test/rich-results
2. Schema.org Validator: validator.schema.org
3. View page source and search for `<script type="application/ld+json">`

#### Card Pages
- [ ] Product schema present
- [ ] Schema includes:
  - [ ] name (card name)
  - [ ] description
  - [ ] image
  - [ ] url
  - [ ] brand (bank name)
  - [ ] aggregateRating (if available)
  - [ ] offers (price/fee info)
  - [ ] additionalProperty (custom properties)

#### Lender Pages
- [ ] Organization schema present
- [ ] Schema includes:
  - [ ] name (bank name)
  - [ ] url
  - [ ] logo
  - [ ] description
  - [ ] sameAs (social links, if available)

#### All Pages
- [ ] Breadcrumb schema present
- [ ] BreadcrumbList includes correct hierarchy:
  - [ ] 1. Home
  - [ ] 2. Category (Cards / Lenders)
  - [ ] 3. Specific item (Card name / Bank name)

### 5.4 Canonical URLs

- [ ] Every page has `<link rel="canonical" href="...">`
- [ ] Canonical URLs are correct (no query params, proper case)
- [ ] Card page canonical: `https://domain.com/cards/{slug}`
- [ ] Lender page canonical: `https://domain.com/lenders/{slug}`
- [ ] No rel=alternate tags incorrectly used

### 5.5 Meta Tags Audit

**Using Google PageSpeed Insights:**
1. Go to pagespeed.web.dev
2. Enter card page URL
3. Check "Page Experience" tab
4. Verify:
   - [ ] Mobile-friendly
   - [ ] No Core Web Vitals issues
   - [ ] Proper viewport meta tag
   - [ ] No Flash content

**Manual Checks (View Source):**
- [ ] `<title>` tag present and unique
- [ ] `<meta name="description">` present
- [ ] `<meta name="viewport">` present
- [ ] Character encoding: `<meta charset="utf-8">`
- [ ] No duplicate meta tags
- [ ] All URLs are https (not http)

---

## FEATURE 6: Pagination - Testing

### 6.1 Pagination UI Tests

#### Navigation Buttons
- [ ] "Previous" button appears and works
- [ ] "Next" button appears and works
- [ ] Buttons disabled at edges (first/last page)
- [ ] Hover effect on buttons
- [ ] Click changes page

#### Page Numbers
- [ ] Page numbers display (1, 2, 3, ...)
- [ ] Current page highlighted (different color)
- [ ] Click page number navigates to page
- [ ] Ellipsis (...) shows for large page counts
- [ ] First and last pages always visible

#### Page Size
- [ ] Default: 20 results per page
- [ ] Max: 100 results per page
- [ ] Results count matches page size

#### Summary Information
- [ ] Shows "Showing X to Y of Z results"
- [ ] Shows "Page X of Y"
- [ ] Numbers update correctly on page change

### 6.2 Pagination Logic Tests

#### Single Page (≤20 results)
- [ ] Pagination not shown
- [ ] All results on one page

#### Multiple Pages (21-100 results)
- [ ] All pages accessible
- [ ] Results correct on each page
- [ ] No duplicate results between pages
- [ ] All results covered (no gaps)

#### Large Dataset (1000+ results)
- [ ] Handles efficiently
- [ ] Page 1: Results 1-20
- [ ] Page 2: Results 21-40
- [ ] Page 50: Results 981-1000
- [ ] Last page shows remaining results

### 6.3 Pagination Behavior Tests

- [ ] Clicking page scrolls to top of results
- [ ] URL updates with page number (if implemented)
- [ ] Back/forward buttons navigate correctly
- [ ] Refresh page stays on same page number
- [ ] Filters + pagination work together:
  - [ ] Filter results
  - [ ] Pagination updates for filtered set
  - [ ] Page 1 shows filtered results
  - [ ] Total count reflects filter

### 6.4 Mobile Pagination Tests

- [ ] Pagination visible on mobile
- [ ] Buttons fit screen width
- [ ] No horizontal scroll
- [ ] Button text hidden, icons only on mobile
- [ ] Touch-friendly (44px minimum)
- [ ] Scrolling to top on page change works

### 6.5 Edge Cases

- [ ] Going beyond last page: Shows last page
- [ ] Going to page 0: Shows page 1
- [ ] Negative page numbers: Shows page 1
- [ ] Non-numeric page: Shows page 1
- [ ] Very high page number: Shows last page
- [ ] After filtering (fewer results): Pages recalculate

---

## Integration Tests

### Cross-Feature Tests

- [ ] Search → View Card Detail:
  - [ ] Search for card
  - [ ] Click "View Details"
  - [ ] Card detail page loads
  - [ ] Schema/OG tags correct
  - [ ] Breadcrumb shows search path

- [ ] Admin Creates FAQ → Appears in Search:
  - [ ] Create new FAQ
  - [ ] FAQ appears on homepage
  - [ ] Search for FAQ question (if indexed)
  - [ ] FAQ appears in results

- [ ] Filter by Category → Pagination Works:
  - [ ] Select category filter
  - [ ] Results show only category
  - [ ] Pagination shows correct count
  - [ ] Page through results

- [ ] Homepage Sections → Admin Edit:
  - [ ] Edit section via admin
  - [ ] Changes appear on homepage
  - [ ] No cache issues
  - [ ] Styling intact

### Performance Tests

- [ ] Page load time < 2 seconds:
  - [ ] Search page
  - [ ] Card detail page
  - [ ] Lender page
  - [ ] Homepage

- [ ] API response time < 500ms:
  - [ ] `/api/cards/search`
  - [ ] `/api/faqs`
  - [ ] `/api/homepage/sections`

- [ ] Search with filters < 200ms
- [ ] Pagination navigation < 100ms
- [ ] Admin API calls < 300ms

### Browser Compatibility

Test on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

**Check:**
- [ ] No console errors
- [ ] All features work
- [ ] Styling renders correctly
- [ ] Animations smooth

---

## Security Tests

- [ ] Admin endpoints require JWT token
- [ ] Invalid tokens rejected (401)
- [ ] Expired tokens rejected
- [ ] Anonymous users can only read public data
- [ ] SQL injection attempts blocked
- [ ] CORS headers correct
- [ ] No sensitive data in responses
- [ ] RLS policies enforced

---

## Accessibility Tests

- [ ] Keyboard navigation works
- [ ] Tab order logical
- [ ] Form labels associated with inputs
- [ ] ARIA labels on buttons
- [ ] Color contrast sufficient (WCAG AA minimum)
- [ ] Screen reader compatible
- [ ] Touch targets minimum 44px
- [ ] Focus indicators visible

**Test Using:**
- Chrome DevTools → Lighthouse (Accessibility)
- WAVE (WebAIM.org/articles/contrast)
- Screen reader (NVDA, JAWS, or Mac VoiceOver)

---

## Regression Tests

After fixes or changes, verify:
- [ ] Existing FAQs still appear
- [ ] Search still returns correct results
- [ ] Pagination still works
- [ ] Admin features still work
- [ ] SEO tags still render
- [ ] No new console errors

---

## Sign-Off Checklist

- [ ] Test Lead verified all tests completed
- [ ] No high-priority bugs found
- [ ] All medium-priority bugs logged
- [ ] Performance acceptable
- [ ] Security verified
- [ ] Accessibility verified
- [ ] Browser compatibility verified
- [ ] Ready for production deployment

---

## Next Steps

1. **All Tests Passing:** Proceed to production deployment
2. **Bugs Found:** Fix bugs and re-test
3. **Performance Issues:** Optimize and re-test
4. **Major Issues:** Escalate to team lead

---

**Last Updated:** $(date)
**Status:** Ready for Testing
**Estimated Time:** 2-3 hours
