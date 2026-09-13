# Project Brief: Al Hasad News Agency

**Created:** 2026-09-12
**Status:** DRAFT
**Short Name:** Al Hasad News

---

## 1. Problem Statement

Al Hasad News Agency is a real client project requiring a complete, high-end Arabic news website with full RTL support and responsive mobile design. The site needs to deliver a modern news reading experience with proper admin management for content creators.

---

## 2. Target Users

- **Primary:** Arabic-speaking news readers (adults 25-55) consuming news across desktop and mobile devices
- **Secondary:** Content editors/admin staff managing articles, categories, and media
- **Tertiary:** News agency stakeholders who need analytics/metrics on published content

---

## 3. Main User Workflows

1. **Browse Homepage:** Visitors land on a curated homepage showing latest/breaking news, featured stories across all sections, with clear navigation to all categories
2. **Read Section Pages:** Visitors browse Local News, International News, Sports, Women and Society, or Accidents with filterable, paginated article lists
3. **Read Articles:** Visitors read individual articles with full Arabic typography, related articles, proper media display
4. **Admin Management:** Admin staff log in, create/edit/delete articles, manage categories, upload images, preview before publishing

---

## 4. Functional Requirements

- **FR-001:** Full RTL (right-to-left) Arabic layout with mirrored navigation, reading direction, and UI elements
- **FR-002:** Homepage with breaking news ticker, featured hero, latest articles grid, section highlights
- **FR-003:** Section pages for: Local News, International News, Sports, Women and Society, Accidents
- **FR-004:** Individual article pages with full content, metadata, related articles, social sharing
- **FR-005:** Admin panel with authentication for managing articles, categories, and images
- **FR-006:** Article CRUD with rich text editing, image upload, category assignment
- **FR-007:** Category management (add, edit, reorder)
- **FR-008:** Image/media library with upload, preview, and association
- **FR-009:** Responsive design: 1920×1080 desktop, 390×844 mobile, with proper breakpoints
- **FR-010:** Search functionality across all articles
- **FR-011:** SEO-optimized with proper Arabic meta tags, Open Graph, structured data
- **FR-012:** High-quality stock/editorial images relevant to each news section
- **FR-013:** Publish/draft/schedule status for articles
- **FR-014:** Breaking news flag with visual indicator
- **FR-015:** Related articles algorithm (same category/tag)

---

## 5. Non-Functional Requirements

- **Performance:** LCP < 2.5s on mobile, FID < 100ms, CLS < 0.1
- **Scalability:** Handle 500+ articles without performance degradation
- **Reliability:** 99.9% uptime target
- **Security:** Admin authentication, CSRF protection, input sanitization, rate limiting
- **Accessibility:** WCAG 2.1 AA compliance, proper ARIA labels, keyboard navigation
- **SEO:** Schema.org structured data, Arabic meta tags, Open Graph, Twitter Cards

---

## 6. Success Criteria

- **SC-001:** All 5 section pages render correctly with RTL at 1920×1080 and 390×844
- **SC-002:** Admin panel allows full CRUD on articles, categories, and images without technical knowledge
- **SC-003:** Homepage loads breaking news, featured, and latest sections within performance budget
- **SC-004:** Article pages display full content, related articles, metadata correctly in RTL
- **SC-005:** Mobile responsive with no horizontal scroll, tap targets ≥44px, readable text
- **SC-006:** Zero console errors in browser across all pages
- **SC-007:** Lighthouse performance score ≥ 85, accessibility ≥ 90

---

## 7. User Stories

- **US-001:** As a news reader, I want to browse the latest local news quickly so I stay informed
- **US-002:** As a mobile reader, I want the site to work perfectly on my phone so I can read anywhere
- **US-003:** As an admin, I want to publish articles with images so the site stays fresh
- **US-004:** As a reader, I want to find articles by category so I can read what interests me
- **US-005:** As an admin, I want to upload and manage images without technical help
- **US-006:** As a reader, I want to see related articles after reading so I can explore more
- **US-007:** As an admin, I want to save drafts and schedule publications so I can plan content

---

## 8. Edge Cases

- Empty sections (no articles yet) should show graceful empty states
- Very long article titles should truncate gracefully
- Missing images should have fallback placeholders
- Slow connections should show loading states
- Arabic text with mixed RTL/LTR content (numbers, English) should render correctly
- Admin session timeout should warn before expiring
- Concurrent admin edits should be handled gracefully

---

## 9. Out of Scope

- User comments/discussion system
- Newsletter/subscription management
- Video hosting (external embeds only)
- Multi-language support (Arabic only)
- Analytics dashboard in admin
- Push notifications
- Payment/donation system
- User accounts for readers
- Mobile native apps

---

## 10. Assumptions

- The client uses Arabic as primary language — no bilingual requirement for v1
- Content editors are trusted staff — no complex role/permission tiers for v1
- Images will be sourced from licensed stock photo providers (Unsplash, Pexels, etc.)
- Hosting is on Cloudflare (per Project Alpha standard)
- Breaking news ticker is manually toggled by admin, not automated
- No existing CMS or migration — greenfield build
- Single admin user for v1 (no multi-user admin initially)

---

## 11. Dependencies

- Cloudflare account for deployment
- Arabic typography assets (Google Fonts — IBM Plex Arabic, Noto Kufi, or similar)
- Stock image API or CDN for editorial-quality photos
- Cursor availability for design architecture phase

---

## 12. Design Direction

- **Tone:** Professional, credible, modern Arabic news identity
- **Visual Style:** High-end editorial — clean typography, strong hierarchy, sophisticated color palette, generous spacing
- **Responsive Priorities:** Mobile-first with progressive enhancement
- **Typography:** Premium Arabic serif/sans combination with excellent readability
- **Color:** News-credible palette — likely deep neutrals with refined accent

---

## Clarifications

### Session 2026-09-12

[Pending — critical questions below]

---

## Notes

- Real client project for Project Alpha Tech
- Must follow Premium Website Production pipeline
- Must use Cursor for design architecture
- Must follow Project Alpha Design DNA principles
- Staging environment required before production
