# Database Requirements for Full Analytics

The following features in the `Analytics.tsx` design are currently not supported by the existing `setup.sql` schema and require database updates or additional tracking mechanisms.

## Missing Features

### 1. Average Session Time (`Avg. Session`, `Avg Time`)
*   **Current State**: The `clicks` table only records the timestamp of the redirect. We do not track how long the user stays on the destination page.
*   **Requirement**: To track this, we would need:
    *   An intermediate landing page (preview page) where we can measure time.
    *   OR an embedded tracking script on the destination website (only possible if the user owns the destination).
*   **Temporary Solution**: Use Mock Data.

### 2. Conversions (`Conversions`)
*   **Current State**: We track clicks, but not what happens after (e.g., purchases, signups).
*   **Requirement**:
    *   A "Conversion Pixel" or "Postback URL" system.
    *   A `conversions` table to link events back to `clicks` or `links`.
*   **Temporary Solution**: Use Mock Data.

### 3. Click-Through Rate (CTR) (`CTR`)
*   **Current State**: CTR usually implies (Clicks / Impressions). We only track Clicks. We don't know how many times the link was *seen* but not clicked (unless we track impressions of the link on a landing page we host).
*   **Alternative Definition**: Could be defined as (Unique Clicks / Total Clicks) or similar, but standard CTR requires Impressions.
*   **Temporary Solution**: Use Mock Data or calculate as `(Unique / Total) * 100` as a placeholder metric.

## Future Schema Recommendations

```sql
-- Table to track conversions
CREATE TABLE public.conversions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  link_id UUID REFERENCES public.links(id),
  click_id UUID REFERENCES public.clicks(id),
  event_name TEXT, -- e.g., 'signup', 'purchase'
  value DECIMAL(10, 2), -- e.g., revenue
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table to track link impressions (if we have a way to track them)
CREATE TABLE public.link_impressions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  link_id UUID REFERENCES public.links(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```
