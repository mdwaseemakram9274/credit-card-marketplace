# Database Migration Execution Guide

## Overview
This guide provides step-by-step instructions for executing the database migrations required for the credit card marketplace features.

**Status:** Ready for execution
**Total Migrations:** 3
**Estimated Time:** 10-15 minutes

---

## Prerequisites

- Access to Supabase dashboard for your project
- PostgreSQL client (optional, for command-line execution)
- Git repository with latest commits

---

## Migration Files

### 1. Migration 002: Homepage Sections
**File:** `supabase/migrations/002_add_homepage_sections.sql`
**Creates:**
- `homepage_sections` table
- 18 seed sections with default content
- Indexes for performance
- RLS policies for access control

**Size:** ~150 lines of SQL

### 2. Migration 003: FAQ Management
**File:** `supabase/migrations/003_add_faqs.sql`
**Creates:**
- `faqs` table with 10 category types
- 18 seed FAQs across categories
- Indexes for filtering and searching
- Trigger for auto-update timestamps
- RLS policies for admin access
- Support table for FAQ categories (optional)

**Size:** ~300 lines of SQL

### 3. Migration 004: Search Indexes
**File:** `supabase/migrations/004_add_search_indexes.sql`
**Creates:**
- 13 database indexes for performance:
  - Faceted search indexes (4)
  - Full-text search index (1)
  - JSONB search indexes (3)
  - Array search indexes (3)
  - Special filters (1)
- Search analytics table
- Performance optimizations

**Size:** ~250 lines of SQL

---

## Execution Methods

### Method 1: Supabase Dashboard (Recommended for Non-Developers)

1. **Access Supabase Console:**
   - Go to https://app.supabase.com
   - Select your project
   - Navigate to "SQL Editor" tab

2. **Execute Migration 002 (Homepage Sections):**
   - Click "New Query"
   - Copy contents of `supabase/migrations/002_add_homepage_sections.sql`
   - Paste into editor
   - Review the SQL (should create `homepage_sections` table)
   - Click "Run"
   - Verify: Table appears in "Table Editor"
   - Check that 18 default sections are created

3. **Execute Migration 003 (FAQ Management):**
   - Click "New Query"
   - Copy contents of `supabase/migrations/003_add_faqs.sql`
   - Paste into editor
   - Review the SQL (should create `faqs` table)
   - Click "Run"
   - Verify: Table appears in "Table Editor"
   - Check that 18 sample FAQs are created

4. **Execute Migration 004 (Search Indexes):**
   - Click "New Query"
   - Copy contents of `supabase/migrations/004_add_search_indexes.sql`
   - Paste into editor
   - Review the SQL (should create indexes and analytics table)
   - Click "Run"
   - Verify: No errors, indexes are created

### Method 2: Supabase CLI (For Developers)

1. **Install Supabase CLI:**
   ```bash
   npm install -g supabase
   ```

2. **Link to Your Project:**
   ```bash
   supabase link --project-ref YOUR_PROJECT_REF
   ```
   (Find project ref in Supabase dashboard → Settings → General)

3. **Execute Migrations:**
   ```bash
   supabase db push
   ```
   This automatically detects all migrations in `supabase/migrations/` and applies them.

4. **Verify:**
   ```bash
   supabase db remote get
   ```
   Should show all 3 migrations as applied.

### Method 3: psql Command Line (For Advanced Users)

1. **Get Connection String:**
   - Supabase Dashboard → Settings → Database
   - Copy "URI" connection string
   - Looks like: `postgresql://postgres:[password]@db.[region].supabase.co:5432/postgres`

2. **Execute Migrations:**
   ```bash
   psql "postgresql://postgres:password@db.region.supabase.co:5432/postgres" -f supabase/migrations/002_add_homepage_sections.sql
   psql "postgresql://postgres:password@db.region.supabase.co:5432/postgres" -f supabase/migrations/003_add_faqs.sql
   psql "postgresql://postgres:password@db.region.supabase.co:5432/postgres" -f supabase/migrations/004_add_search_indexes.sql
   ```

3. **Or Execute All At Once:**
   ```bash
   cat supabase/migrations/002_add_homepage_sections.sql supabase/migrations/003_add_faqs.sql supabase/migrations/004_add_search_indexes.sql | psql "postgresql://postgres:password@db.region.supabase.co:5432/postgres"
   ```

---

## Verification Checklist

After executing migrations, verify everything is set up correctly:

### Tables Created
- [ ] `homepage_sections` table exists
- [ ] `faqs` table exists
- [ ] `search_queries` table exists (optional analytics)

### Data Seeding
- [ ] `homepage_sections` contains 18 rows
- [ ] `faqs` contains 18 rows
- [ ] At least 5 FAQs for each category

### Indexes Created
- [ ] `idx_cards_status_created` - For status browsing
- [ ] `idx_cards_network_status` - For network filtering
- [ ] `idx_cards_cardtype_status_created` - For type filtering
- [ ] `idx_cards_bank_status_created` - For bank filtering
- [ ] `idx_cards_fulltext_search` - For full-text search
- [ ] `idx_cards_rewards_details` - For reward filtering
- [ ] `idx_cards_benefits` - For benefit filtering
- [ ] `idx_cards_categories` - For category filtering
- [ ] Additional indexes as listed in migration

### RLS Policies
- [ ] `faqs` table has RLS enabled
- [ ] Public read policy for active FAQs
- [ ] Admin full access policy for FAQs
- [ ] `homepage_sections` has appropriate policies

### Triggers
- [ ] `updated_at_trigger` on `faqs` table
- [ ] Auto-update `updated_at` when FAQs modified

---

## Rollback Instructions (If Needed)

If migrations fail or need to be rolled back:

### Method 1: Supabase Dashboard Rollback
1. Go to Supabase Dashboard
2. Settings → Database
3. Find failed migration
4. Click "Rollback"
5. Confirm rollback

### Method 2: Manual Rollback (Drop Tables)

```sql
-- CAUTION: This deletes all data!
DROP TABLE IF EXISTS search_queries CASCADE;
DROP TABLE IF EXISTS faqs CASCADE;
DROP TABLE IF EXISTS homepage_sections CASCADE;

-- Then re-run migrations from scratch
```

### Method 3: Restore from Backup
- Supabase automatically creates backups
- Go to Settings → Backups
- Select a backup point before migrations
- Click "Restore"

---

## Post-Migration Tasks

### 1. Verify API Endpoints

Test the following endpoints to ensure they work:

```bash
# Test search endpoint
curl "http://localhost:3000/api/cards/search?q=visa&limit=10"

# Test FAQ endpoint
curl "http://localhost:3000/api/faqs?limit=10"

# Test homepage sections endpoint
curl "http://localhost:3000/api/homepage/sections"
```

### 2. Test Admin Features

1. Go to `/admin` page
2. Check "Homepage" tab - should display sections
3. Check "FAQs" tab - should display FAQ manager
4. Try creating/editing a FAQ
5. Refresh homepage to verify changes

### 3. Test Search Functionality

1. Go to `/search` page
2. Type a search query (e.g., "Visa")
3. Verify results appear
4. Test filters (network, bank, category)
5. Test pagination

### 4. Verify Frontend Integration

1. Check homepage for FAQ section
2. Verify FAQs are loading from API (not hardcoded)
3. Check card detail pages for schema
4. Verify search page routing

---

## Troubleshooting

### Issue: "Table already exists" error
**Solution:** Table was already created by previous migration. This is safe to ignore.

### Issue: Foreign key constraint error
**Solution:** Check that referenced tables exist:
- `cards` table must exist
- `banks` table must exist
- `card_types` table must exist

### Issue: Permission denied error
**Solution:** 
- Verify you have database admin privileges
- Check connection string is correct
- May need to use `postgres` user instead of limited user

### Issue: Index creation timeout
**Solution:**
- Indexes on large tables take time to create
- Wait for completion (can take 30+ seconds)
- Can run indexes separately if needed

### Issue: RLS policies not working
**Solution:**
- Verify RLS is enabled on table
- Check that policies are created correctly
- Test with both authenticated and anonymous users

---

## Performance Impact

After migrations:

- **Search queries** should be faster due to indexes (50-80% improvement)
- **FAQ queries** should be instant with proper indexes
- **Full-text search** should complete in <100ms
- **Pagination** optimized for responsive results

Monitor query performance in Supabase Dashboard → Reports.

---

## Maintenance Tasks

After migrations are in production:

### Weekly Tasks
- Monitor slow queries dashboard
- Check for index fragmentation
- Verify backup schedules

### Monthly Tasks
- Review search analytics (if enabled)
- Check FAQ engagement metrics
- Optimize indexes if needed

### Quarterly Tasks
- Full database health check
- Backup retention review
- Performance optimization analysis

---

## Rollout Strategy

### Staging Environment
1. Execute migrations in staging first
2. Run full testing suite
3. Verify all features work
4. Get approval for production

### Production Deployment
1. Create backup before migration
2. Execute migrations during low-traffic time
3. Monitor for errors
4. Verify all features in production
5. Notify team of changes

### Rollback Plan
- Keep previous backup for 30 days
- Document all changes made
- Have rollback plan tested and ready
- Monitor system 24 hours post-deployment

---

## Success Criteria

Migrations are successful when:

✅ All 3 migration files execute without errors
✅ All tables exist with correct schema
✅ All seed data is created (18 FAQs, 18 sections)
✅ All indexes are created and queryable
✅ RLS policies are in place
✅ API endpoints return valid responses
✅ Frontend displays data correctly
✅ Admin features work properly
✅ Search functionality works as expected
✅ Pagination displays correctly

---

## Contact & Support

For issues during migration:

1. Check Supabase Status Page: https://status.supabase.com
2. Review error messages in Supabase Console
3. Check GitHub Issues: https://github.com/supabase/supabase/issues
4. Contact Supabase Support if database is inaccessible

---

## Appendix: Migration Checklist

```markdown
## Pre-Migration
- [ ] Backup current database
- [ ] Notify team of maintenance window
- [ ] Have rollback plan ready
- [ ] Review all migration files

## Migration Execution
- [ ] Execute Migration 002 (Homepage Sections)
- [ ] Verify tables and data created
- [ ] Execute Migration 003 (FAQ Management)
- [ ] Verify tables and data created
- [ ] Execute Migration 004 (Search Indexes)
- [ ] Verify indexes created

## Post-Migration
- [ ] Run verification checklist
- [ ] Test API endpoints
- [ ] Test admin features
- [ ] Test search functionality
- [ ] Verify frontend integration
- [ ] Monitor for errors
- [ ] Document any issues

## Sign-Off
- [ ] Migrations complete
- [ ] All tests passing
- [ ] Ready for production
- [ ] Notify stakeholders
```

---

**Next Step:** After migrations are complete and verified, proceed to [TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md) for comprehensive testing procedures.
