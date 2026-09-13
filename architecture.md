# Architecture: Al Hasad News Agency

**Created:** 2026-09-12
**Status:** PROPOSED

---

## 1. Architecture Overview

Full-stack Next.js 15 application with App Router, TypeScript, and Tailwind CSS. Server-side rendering for news pages (SEO), client-side interactivity for admin panel. Database via better-sqlite3 for local development, Cloudflare D1 for production edge deployment.

```
┌─────────────────────────────────────────────────────────┐
│                    Next.js 15 App                        │
├─────────────────────┬───────────────────────────────────┤
│   Frontend (SSR)    │        Admin Panel (SPA)          │
│   - Homepage        │        - Auth gate                │
│   - Section pages   │        - Article CRUD             │
│   - Article pages   │        - Category management      │
│   - Search          │        - Image upload/library     │
├─────────────────────┴───────────────────────────────────┤
│              Next.js API Routes (App Router)             │
├─────────────────────────────────────────────────────────┤
│     better-sqlite3 (dev)  │  Cloudflare D1 (production)      │
├─────────────────────────────────────────────────────────┤
│         Unsplash/Pexels CDN for editorial images         │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Technology Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Framework | Next.js 15 (App Router) | SSR for SEO, API routes, image optimization, mature RTL support |
| Language | TypeScript | Type safety, fewer runtime errors |
| Styling | Tailwind CSS 4 | Utility-first, RTL utilities, responsive design system |
| Database | better-sqlite3 (dev) / D1 (prod) | Zero-config local dev, Cloudflare-native production edge DB |
| Auth | NextAuth.js / custom JWT | Admin session management |
| ORM | Drizzle ORM | Type-safe SQL, migrations, works with SQLite and D1 |
| Forms | React Hook Form + Zod | Validation, type-safe forms |
| Rich Text | TipTap / Slate | WYSIWYG article editor |
| State | React Context + hooks | Simple, no Redux needed |
| Icons | Lucide React | Clean, consistent icon set |
| Fonts | IBM Plex Arabic + Noto Kufi Arabic | Premium Arabic typography, excellent readability |

---

## 3. Data Model

### Articles Table
```sql
articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,        -- HTML from rich text editor
  featured_image TEXT,          -- URL
  category_id TEXT REFERENCES categories(id),
  author TEXT,
  status TEXT DEFAULT 'draft',  -- draft | published | scheduled
  is_breaking INTEGER DEFAULT 0,
  published_at TIMESTAMP,
  scheduled_at TIMESTAMP,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

### Categories Table
```sql
categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  parent_id TEXT REFERENCES categories(id),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

### Images Table
```sql
images (
  id TEXT PRIMARY KEY,
  filename TEXT NOT NULL,
  original_url TEXT NOT NULL,   -- source URL
  alt_text TEXT,
  width INTEGER,
  height INTEGER,
  size_bytes INTEGER,
  uploaded_by TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

### Admin Users Table
```sql
admin_users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  display_name TEXT,
  is_active INTEGER DEFAULT 1,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

### Seed Categories
1. Local News (أخبار محلية)
2. International News (أخبار دولية)
3. Sports (رياضة)
4. Women and Society (المرأة والمجتمع)
5. Accidents (حوادث)

---

## 4. Interface Contracts

### API Routes

| Method | Path | Purpose |
|--------|------|---------|
| GET | /api/articles | List articles (paginated, filterable) |
| POST | /api/articles | Create article (admin) |
| GET | /api/articles/[slug] | Get single article |
| PUT | /api/articles/[id] | Update article (admin) |
| DELETE | /api/articles/[id] | Delete article (admin) |
| GET | /api/categories | List all categories |
| POST | /api/categories | Create category (admin) |
| PUT | /api/categories/[id] | Update category (admin) |
| DELETE | /api/categories/[id] | Delete category (admin) |
| POST | /api/images/upload | Upload image (admin) |
| GET | /api/images | List images (admin) |
| POST | /api/auth/login | Admin login |
| POST | /api/auth/logout | Admin logout |

### Frontend Routes

| Route | Type | Purpose |
|-------|------|---------|
| / | SSR | Homepage |
| /section/[slug] | SSR | Section page |
| /article/[slug] | SSR | Article page |
| /search | SSR | Search results |
| /admin | Client | Admin login/dashboard |
| /admin/articles | Client | Article management |
| /admin/articles/new | Client | Create article |
| /admin/articles/[id]/edit | Client | Edit article |
| /admin/categories | Client | Category management |
| /admin/media | Client | Image library |

---

## 5. Integration Patterns

- **Image Source:** Download high-quality editorial images from Unsplash API/Pexels during staging setup
- **Fonts:** Google Fonts (IBM Plex Arabic, Noto Kufi Arabic) via `next/font/google`
- **Auth:** JWT stored in httpOnly cookie, middleware protection for /admin routes
- **Rich Text:** TipTap editor with image embed support
- **Search:** Full-text search via SQLite FTS5 or simple LIKE query (scale: 500 articles)

---

## 6. Deployment Target

**Cloudflare Workers + D1** (per Project Alpha standard for new React/Vite applications)

| Environment | Target | URL |
|-------------|--------|-----|
| Development | Local Next.js dev server | http://localhost:3000 |
| Staging | Cloudflare Workers (preview) | https://staging.al-hasad-news.pages.dev |
| Production | Cloudflare Workers | TBD — pending client domain |

---

## 7. Security

- Admin routes protected by JWT middleware
- All inputs validated with Zod
- CSRF protection for admin mutations
- Rate limiting on auth endpoints (Cloudflare WAF)
- Password hashing with bcrypt
- No secrets in client bundle
- SQL injection prevention via Drizzle parameterized queries

---

## 8. Assumptions (clarify timed out — proceeding with defaults)

Since the architecture clarification timed out, I'm proceeding with:
1. **Next.js full-stack** — only option that satisfies FR-005 to FR-008 (real admin CRUD)
2. **Stock images + realistic Arabic placeholder content** for staging validation
3. **SQLite for dev, D1 for prod** — zero-config local, Cloudflare-native edge
4. **Single admin user** for v1 (no multi-user management)

If any of these need to change, say so before I lock the project.
