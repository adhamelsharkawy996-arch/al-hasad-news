# Al Hasad News — Correction Plan

**Status:** PLAN ONLY — Awaiting Cursor approval before implementation
**Created:** 2026-09-13
**Blocker:** Security vulnerabilities confirmed

---

## 1. SECURITY — CRITICAL (Fix First)

### 1.1 Create Server-Side Auth Middleware
**File:** `src/middleware.ts` (new)
- Protect all `/admin/**` routes — redirect to `/admin` (login) if no valid session
- Protect all `/api/admin/**` routes — return 401 if no valid session
- Protect all write API routes (`POST`, `PUT`, `DELETE`) — return 401/403 if no valid session
- Allow `GET /api/articles`, `GET /api/categories`, `GET /api/search`, `GET /api/articles/[slug]` (public read-only)

### 1.2 Fix Hardcoded JWT Secret
**File:** `src/lib/auth.ts`
- Remove fallback `'al-hasad-news-secret-key-change-in-production'`
- Throw error if `JWT_SECRET` env var is missing
- Add to systemd service file with strong random value

### 1.3 Add Security Headers
**File:** `next.config.js`
- `Content-Security-Policy`: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self'
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains`
- `Cache-Control: no-store, no-cache, must-revalidate` for `/admin/**` routes
- `X-Robots-Tag: noindex, nofollow` for `/admin/**` routes

### 1.4 Add CSRF Protection
**File:** `src/lib/auth.ts`
- Generate CSRF token on login, store in cookie
- Validate CSRF token on all state-changing requests (POST, PUT, DELETE)
- Use `csrf` token in forms and API calls

### 1.5 Add Login Rate Limiting
**File:** `src/lib/rate-limit.ts` (new)
- In-memory rate limiter: max 5 attempts per 15 minutes per IP
- Return 429 with `Retry-After` header when exceeded

### 1.6 Sanitize Article HTML
**File:** `src/lib/sanitize.ts` (new)
- Use `DOMPurify` (jsdom server-side) with strict allowlist
- Allowed tags: `p, br, strong, em, h2, h3, ul, ol, li, blockquote, a[href|target], img[src|alt]`
- Allowed attributes: `href` (http/https only), `src` (relative or https only), `alt`, `target`
- Strip all event handlers, inline styles, scripts
- Sanitize on save (admin) and on render (defense in depth)

### 1.7 Validate All Server Inputs
**File:** `src/lib/validate.ts` (new)
- `title`: required, 5-200 chars
- `slug`: required, lowercase alphanumeric + hyphens, 3-100 chars
- `content`: required, 50-50000 chars (after sanitization)
- `excerpt`: optional, 10-500 chars
- `categoryId`: must exist in categories table
- `author`: optional, 2-100 chars
- `status`: must be one of `draft`, `published`, `scheduled`
- `featuredImage`: optional, valid URL (https only) or empty
- Reject all other fields

### 1.8 Remove Drafts from Public APIs
**File:** `src/lib/data.ts`
- `getAllArticles()` without status filter → return 401 (admin only)
- `searchArticles()` → already filters `status = 'published'` ✓
- `getArticleBySlug()` → already filters `status = 'published'` ✓
- `getArticlesByCategory()` → already filters `status = 'published'` ✓
- `getBreakingArticles()` → already filters `status = 'published'` ✓
- `getLatestArticles()` → already filters `status = 'published'` ✓
- `getRelatedArticles()` → already filters `status = 'published'` ✓

---

## 2. CONTENT AND IMAGES

### 2.1 Fix Article Image Data Contract Bug
**File:** `src/lib/data.ts`
- **Root cause:** `...row` spread copies `featured_image` (snake_case) but `Article` interface expects `featuredImage` (camelCase)
- **Fix:** Add explicit mapping: `featuredImage: row.featured_image ?? null`
- Apply same fix to all other snake_case fields if any

### 2.2 Replace Hotlinked Images
**File:** `public/images/` (new directory)
- Download 5-10 relevant editorial images (Unsplash/Pexels with license)
- Store in `public/images/`
- Record source, license, credit, Arabic alt text in `src/lib/image-manifest.ts`
- Update seed data to use local paths

### 2.3 Remove Fabricated Demo Content
**File:** `seed.ts`
- Remove all fake news articles, authors, phone numbers, emails
- Replace with clearly labeled placeholder content:
  - Title: "[تجريبي] عنوان تجريبي"
  - Content: "<p>هذا محتوى تجريبي. استبدل بمحتوى حقيقي.</p>"
  - Author: "محرر تجريبي"
  - Phone: Remove
  - Email: Remove

---

## 3. DESIGN AND RESPONSIVENESS

### 3.1 Fix Desktop Empty Spaces
**File:** `src/app/page.tsx`
- Reduce hero aspect ratio from `aspect-[16/9]` to `aspect-[2/1]` on large screens
- Reduce padding from `py-8` to `py-6`
- Use tighter grid gaps

### 3.2 Correct Section Order
**File:** `src/app/page.tsx`
- Current: International, Local, Women, Accidents, Sports
- Required: Local, International, Sports, Women and Society, Accidents
- Reorder `categories.map()` output

### 3.3 Mobile Admin Dashboard
**File:** `src/app/admin/dashboard/page.tsx`
- Replace table with responsive card layout on mobile
- Each card: title, status badge, date, action buttons
- Use `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` for stats
- Add horizontal scroll wrapper for table on medium screens

### 3.4 Remove Public Admin Link
**File:** `src/components/ui/Header.tsx`
- Remove `<Link href="/admin">لوحة التحكم</Link>` from public header
- Keep only in footer (low-key) or remove entirely

### 3.5 Branded Arabic 404 Page
**File:** `src/app/not-found.tsx` (new)
- Full Arabic RTL layout
- "الصفحة غير موجودة" heading
- Link back to homepage
- Consistent with site branding

---

## 4. SEARCH, SEO AND ACCESSIBILITY

### 4.1 URL-Based Search
**File:** `src/app/search/page.tsx`
- Read `q` from URL search params: `const { searchParams } = useParams()` or `window.location.search`
- On search, update URL: `router.push(`/search?q=${encodeURIComponent(query)}`)`
- On page load, read `q` from URL and auto-search
- Preserve results on refresh and back/forward navigation

### 4.2 SEO Meta Tags
**File:** `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/section/[slug]/page.tsx`, `src/app/article/[slug]/page.tsx`
- Unique `<title>` per page
- Unique `<meta name="description">` per page
- Open Graph: `og:title`, `og:description`, `og:image`, `og:url`, `og:type`, `og:locale="ar_EG"`
- Twitter Card: `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`
- Canonical URL: `<link rel="canonical">`
- `NewsArticle` structured data (JSON-LD) on article pages

### 4.3 Sitemap, Robots, RSS
**File:** `src/app/sitemap.ts` (new)
- List all public pages, section pages, article pages
- Include `lastmod` for articles

**File:** `src/app/robots.ts` (new)
- Allow all, disallow `/admin`, `/api/admin`
- Reference sitemap

**File:** `src/app/feed.xml/route.ts` (new)
- RSS 2.0 feed of latest 20 published articles
- Include title, description, link, pubDate, guid

### 4.4 Accessibility
- One `<h1>` per page
- Icon buttons: add `aria-label` in Arabic
- Form labels: connect `<label htmlFor>` to inputs
- Add `autocomplete` attributes
- Visible focus outlines
- Respect `prefers-reduced-motion` (disable ticker animation)

---

## 5. VERIFICATION GATES

### 5.1 Security Gates
- [ ] Unauthenticated `/admin/dashboard` → redirects to `/admin`
- [ ] Unauthenticated `/api/admin/data` → 401
- [ ] Unauthenticated `POST /api/articles` → 401
- [ ] Unauthenticated `PUT /api/articles/[id]` → 401
- [ ] Unauthenticated `DELETE /api/articles/[id]` → 401
- [ ] Unauthenticated `POST /api/images/upload` → 401
- [ ] Unauthenticated `DELETE /api/images/[id]` → 401
- [ ] Unauthenticated `POST /api/categories` → 401
- [ ] Unauthenticated `PUT /api/categories/[id]` → 401
- [ ] Unauthenticated `DELETE /api/categories/[id]` → 401
- [ ] Public `GET /api/articles` → never returns drafts
- [ ] Public `GET /api/search` → never returns drafts
- [ ] Login rate limiting → 429 after 5 failed attempts
- [ ] Security headers present on all responses
- [ ] Admin pages have `no-store` and `noindex`
- [ ] HTML content is sanitized (no `<script>`, no `onclick`, etc.)
- [ ] No hardcoded credentials in source

### 5.2 Content/Image Gates
- [ ] Article images render correctly (not "لا صورة")
- [ ] All images are locally stored with license/credit
- [ ] Demo content is clearly labeled or removed

### 5.3 Design Gates
- [ ] Section order: Local, International, Sports, Women, Accidents
- [ ] No excessive empty space on desktop
- [ ] Mobile admin dashboard usable
- [ ] No public "Admin Dashboard" link in header
- [ ] Arabic 404 page exists

### 5.4 Search/SEO Gates
- [ ] `/search?q=الأهلي` works and survives refresh
- [ ] Back/forward navigation preserves search results
- [ ] Unique titles/descriptions per page
- [ ] Open Graph tags present
- [ ] NewsArticle structured data present
- [ ] Sitemap accessible at `/sitemap.xml`
- [ ] Robots accessible at `/robots.txt`
- [ ] RSS feed accessible at `/feed.xml`
- [ ] One H1 per page
- [ ] Icon buttons have Arabic `aria-label`
- [ ] Labels connected to inputs
- [ ] Reduced motion respected

### 5.5 Functional Gates
- [ ] Create article → appears in admin list
- [ ] Edit article → changes persist
- [ ] Publish article → visible on public site
- [ ] Delete article → removed from list
- [ ] Upload image → file saved, URL returned
- [ ] Service restart → data persists
- [ ] All public routes: 200 at desktop, tablet, 390px
- [ ] No browser console errors
- [ ] Admin usable on mobile

---

## IMPLEMENTATION ORDER

1. **Phase 1:** Security (1.1–1.8) — all critical fixes
2. **Phase 2:** Content/Images (2.1–2.3) — fix bug, replace images, clean demo
3. **Phase 3:** Design (3.1–3.5) — layout, order, mobile, 404
4. **Phase 4:** Search/SEO/A11y (4.1–4.4) — URL search, meta, sitemap, a11y
5. **Phase 5:** Verification (5.1–5.5) — all gates must pass

---

## DEPLOYMENT (After All Gates Pass)

1. Push to GitHub
2. Create Cloudflare Pages project connected to GitHub
3. Build command: `npx next build`
4. Output directory: `.next`
5. Set env vars: `JWT_SECRET` (strong random)
6. Deploy to `al-hasad-news.pages.dev`
7. Configure named Cloudflare Tunnel for custom domain (when client approves)
8. **Do not modify production DNS without client approval**
