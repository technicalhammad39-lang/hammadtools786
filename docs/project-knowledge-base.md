# Hammad Tools Project Knowledge Base

Last updated: 2026-05-07

## 1) Project Purpose and Scope

Hammad Tools is a production marketplace for:
- Digital tools/subscriptions (primary)
- Agency services (secondary catalog)
- Checkout + manual payment proof workflow
- Admin operations (catalog, orders, users, coupons, notifications, settings)
- User dashboard (orders, order chat, profile, notifications)

Primary stack:
- Next.js App Router (v15)
- React 19 + TypeScript
- Tailwind CSS
- Firebase Auth + Firestore + Firebase Admin + FCM
- Hostinger/local filesystem upload system through API routes

## 2) High-Level Architecture

### Frontend
- App Router pages in `app/`
- Shared UI components in `components/`
- Client state/providers in `context/`

### Backend (inside Next app)
- Secure API routes in `app/api/*`
- Server-side Firebase Admin helpers in `lib/server/*`
- Firestore security rules in `firestore.rules`

### Storage
- Public assets: `public/uploads/*`
- Protected assets: `storage/uploads/*`
- File metadata registry: Firestore `media_files` collection

### Deploy/runtime
- `next.config.ts` uses `output: "standalone"`
- Post-build asset copier: `scripts/prepare-standalone.mjs`
- Production start command: `node .next/standalone/server.js`

## 3) Directory Map (Important Parts)

- `app/`: routes + layouts + API handlers
- `app/admin/`: admin panel modules
- `app/dashboard/`: user dashboard
- `app/checkout/`: order placement flow
- `app/tools/`: tool listing + detail pages
- `app/services/`: agency services listing + detail pages
- `app/giveaway/`: social-style giveaway feed
- `app/api/`: server APIs (auth/profile, uploads, admin users, orders messages, newsletter, cron, push token)

- `components/`: reusable UI (Navbar, Footer, NotificationBell, MediaLibraryModal, tickers, etc.)
- `context/`: AuthContext, CartContext, SettingsContext
- `lib/`: utility modules (SEO, coupons, image normalization, order helpers, storage client utils)
- `lib/server/`: admin/auth/upload/notification server utilities
- `docs/`: project docs (this file + media docs)

## 4) Core Runtime and Bootstrap

Root layout (`app/layout.tsx`) wires:
- `AuthProvider`
- `CartProvider`
- `SettingsProvider`
- `ToastProvider`
- `LenisProvider`, `GsapSectionAnimator`, `ChunkLoadRecovery`
- Global UI: `GlobalPromoTicker`, `Navbar`, `UserOrderTicker`, `CartDrawer`, `Footer`

This means most pages automatically get auth/cart/settings/toast and global ticker behavior.

## 5) Data Model and Collections

Typed models are centralized in `lib/types/domain.ts`.

Primary Firestore collections used by app:
- `users`
- `services`
- `agency_services`
- `categories`
- `payment_methods`
- `orders`
- `notifications`
- `coupons`
- `service_reviews`
- `media_files`
- `newsletter_subscribers`
- `entitlements`
- `push_tokens`
- `notification_dispatches`
- `blogPosts`
- `giveaways` (+ subcollections `comments`, `entries`)
- `user_entries`
- `service_activations`
- `admin_audit_logs`

### Order status semantics
Canonical order statuses in code:
- `pending`
- `approved`
- `rejected`
- legacy-compatible: `pending_verification`, `needs_info`, `completed`

Normalization helper (`lib/order-system.ts`):
- `pending_verification` and `needs_info` map to `pending`
- `completed` maps to `approved`

## 6) Auth, Roles, Access Control

### Client-side auth (`context/AuthContext.tsx`)
- Supports Google popup login and email/password login/signup.
- Ensures profile exists in `users/{uid}`.
- If client profile write fails (permissions), falls back to `/api/auth/profile`.
- Banned users are forced to sign out.

### Server-side auth (`lib/server/auth.ts`)
- `requireAuth`: verifies Firebase ID token (header bearer, optional query token for protected file streaming).
- `requireAdmin`: admin email OR profile role `admin`.
- `requireStaff`: admin email OR profile role `admin|manager`.

### Important role nuance
- `isStaffRole()` helper includes `staff` string in some places.
- But `requireStaff()` checks only `admin|manager`.
- Firestore rules also treat `staff`/`Staff` as manager-level in rule helper.
- Keep role values consistent when changing auth model.

### Hardcoded super-admin email
Used in multiple places:
- `technicalhammad39@gmail.com`

## 7) Firestore Security Rules Summary

Defined in `firestore.rules`.

Highlights:
- Public read: `services`, `categories`, `agency_services`, public blog posts, giveaways.
- Staff/admin writes for most admin-managed collections.
- `orders`: users create own pending orders; staff can update (with final-status lock logic).
- `notifications`: recipients can mark own notifications read; staff can create/delete.
- `newsletter_subscribers`: client writes blocked (`allow write: if false`), server API uses Admin SDK.
- `service_reviews`: controlled allowed fields and rating validation.

## 8) Upload and Media System (Critical)

Upload subsystem is in:
- `lib/server/local-upload.ts`
- `app/api/upload/*`
- `lib/storage-utils.ts`

### Supported folders
- Public: `tools`, `services`, `blogs`, `partners`, `profiles`
- Protected: `payment-proofs`, `chat-attachments`

### Validation and policy
- Per-folder extension/mime/type/max-size checks
- Staff-only for some folders (`tools`, `services`, `blogs`, `partners`)
- Strict path normalization to prevent traversal
- File metadata saved to `media_files`

### API behavior
- `POST /api/upload`: upload + optional replace old media + relation tagging
- `GET /api/upload/library`: filtered media listing with auth and ownership checks
- `GET /api/upload/:mediaId`: file streaming (token required for protected files)
- `DELETE /api/upload/:mediaId`: owner/staff delete record + file
- `GET /api/upload/diagnostics`: admin-only filesystem and Firebase diagnostics

### Protected media access
- Protected files can be accessed with:
  - `Authorization: Bearer <idToken>`
  - OR `?token=<idToken>` query

## 9) Checkout and Order Lifecycle

Main file: `app/checkout/page.tsx`

Flow:
1. Auth required (`/login?next=...` redirect otherwise)
2. Load cart/single item and active `payment_methods`
3. Optional coupon validation against `coupons`
4. Optional payment proof upload (`folder=payment-proofs`)
5. Create order doc in `orders/{orderId}` with:
- customer + delivery fields
- items and item summary
- pricing (subtotal, discount, total)
- coupon snapshot
- payment method snapshot
- payment proof snapshot
- status `pending`
- ticker state `new`

Manual chat mode:
- Payment method with `paymentType=manual_chat` (or inferred from name)
- Skips sender/transaction/proof requirements
- Creates order then redirects to WhatsApp
- WhatsApp number constant in code: `923209310656`

## 10) Admin Order Ops and Messaging

Main admin order page: `app/admin/orders/page.tsx`

Capabilities:
- Real-time orders list
- Filter/search by status/text
- Approve/reject with status lock handling
- Admin-to-user chat messages
- Attachment support via media library (`chat-attachments`)
- Notification creation to user on admin actions
- Bulk delete all orders (admin only)

Order messaging API:
- `POST /api/orders/[orderId]/messages`
- Validates order access and attachment ownership/related order
- Appends message to `orders.messages`
- Updates latest message preview/timestamps
- If sender is user, sends notifications to staff recipients

## 11) Dashboard (User Side)

Main file: `app/dashboard/page.tsx`

Features:
- Real-time user orders and notifications
- Order message center with attachments
- Mark notifications read/all-read
- Profile update (including avatar upload to `profiles` folder)
- Password change for password-provider accounts

## 12) Notifications and Push

In-app notifications:
- Stored in Firestore `notifications`
- Displayed by `NotificationBell`, dashboard panels, and tickers

Admin broadcast UI:
- `app/admin/notifications/page.tsx`
- Broadcast or targeted sends
- Logs dispatch in `notification_dispatches`

Push token registration:
- Client bootstrap: `components/PushNotificationBootstrap.tsx`
- API: `POST /api/push/register`
- Tokens stored in `push_tokens` (doc ID = SHA256(token))

Current server notification sender (`lib/server/notifications.ts`):
- Creates in-app notifications only
- Does not currently send native FCM push payloads

## 13) Giveaway and Reviews Subsystems

### Giveaway
- Route: `/giveaway`
- Data from `giveaways`
- Likes stored as array field `likedBy`
- Comments in subcollection `giveaways/{id}/comments`
- Uses auth guard by redirect to login for actions

### Service reviews
- Tool detail page uses `service_reviews`
- Submission includes masked email and optional photo URL
- Security rules enforce shape and rating range

## 14) Blog and SEO

Blog routes:
- `/blogs` (main)
- `/blog` redirects to `/blogs`

Server helpers:
- `lib/server/blog-posts.ts` (published status + legacy flag support)

SEO infra:
- `lib/seo.ts` metadata builders
- `app/robots.ts` disallows `/admin`, `/dashboard`, `/checkout`, `/api`
- `app/sitemap.ts` includes static and dynamic routes from Firestore when admin creds exist

## 15) Settings System

`context/SettingsContext.tsx` listens to:
- `settings/general`
- `settings/socials`

Used for global support/contact/social links with defaults fallback.

Admin editors:
- `app/admin/settings/page.tsx` -> `settings/general`
- `app/admin/socials/page.tsx` -> `settings/socials`

## 16) Environment Variables (Operational)

Reference source: `.env.example`

Major groups:
- App URL: `APP_URL`, `NEXT_PUBLIC_APP_URL`
- Firebase public client config
- Firebase admin service credentials
- FCM web push VAPID key
- Cron secret
- Hostinger upload roots/base/max sizes/debug flags

Important behavior:
- Client Firebase config can fallback to `firebase-config.json`.
- Password reset URL must start with `https://hammadtools.com/reset-password`.

## 17) Build and Deploy Notes

NPM scripts:
- `npm run dev`
- `npm run build` (runs Next build + standalone preparation)
- `npm run start` (standalone server)
- `npm run lint`

Cron:
- `vercel.json` schedules `/api/cron/expire-entitlements` daily at `0 0 * * *`.

Expiry cron behavior:
- Expires due active entitlements
- Marks near-expiry notifications (24h window)
- Creates in-app notifications

## 18) API Surface Map

- `POST /api/auth/profile`: upsert authenticated user profile
- `POST /api/newsletter/subscribe`: validated + rate-limited newsletter subscribe
- `POST /api/push/register`: register/update push token for current user
- `POST /api/upload`: upload media
- `GET /api/upload/library`: list media by folder/filter
- `GET /api/upload/:mediaId`: stream media
- `DELETE /api/upload/:mediaId`: delete media
- `GET /api/upload/diagnostics`: admin diagnostics
- `POST /api/orders/:orderId/messages`: append order message
- `POST /api/admin/users`: create auth user + profile
- `PATCH /api/admin/users/:userId`: set role / set ban
- `DELETE /api/admin/users/:userId`: full user cleanup delete
- `GET /api/admin/subscribers`: admin subscriber list
- `GET|POST /api/cron/expire-entitlements`: entitlement expiry job

## 19) Known Constraints and Hardcoded Values

- Super admin email hardcoded in multiple modules.
- Manual WhatsApp number hardcoded in checkout page.
- Role handling has mixed support for `staff` vs `manager` in different checks.
- No automated test suite currently in repository.

## 20) Change Playbooks (Where to Edit)

### A) Add or change checkout fields
- UI validation and payload: `app/checkout/page.tsx`
- Order type/interface compatibility: `lib/types/domain.ts`
- Admin display mapping: `app/admin/orders/page.tsx`
- Dashboard display mapping: `app/dashboard/page.tsx`
- Rules if needed: `firestore.rules`

### B) Change order status workflow
- Status normalization/labels: `lib/order-system.ts`
- Admin approve/reject logic: `app/admin/orders/page.tsx`
- Message route side-effects: `app/api/orders/[orderId]/messages/route.ts`
- Rule locks: `firestore.rules`

### C) Modify upload limits/types/folders
- Folder config: `lib/server/local-upload.ts`
- Upload endpoint behavior: `app/api/upload/route.ts`
- File serve/delete behavior: `app/api/upload/[mediaId]/route.ts`
- Client wrappers/UI: `lib/storage-utils.ts`, `components/MediaLibraryModal.tsx`

### D) Add admin-only tool or page
- Add route under `app/admin/*`
- Register nav item/search integration in `app/admin/layout.tsx`
- Apply role guard using `useAuth()` (`isAdmin` or `isStaff`)
- Update rules/API if new collection is added

### E) Change notification strategy
- In-app generation logic: `app/admin/notifications/page.tsx`, `lib/server/notifications.ts`
- User/admin consumers: `components/NotificationBell.tsx`, dashboard/admin pages
- Push registration flow: `components/PushNotificationBootstrap.tsx`, `/api/push/register`

### F) Change public branding/SEO
- Site metadata helpers: `lib/seo.ts`
- Root metadata/layout schema: `app/layout.tsx`
- Robots and sitemap: `app/robots.ts`, `app/sitemap.ts`
- Settings-driven contact/social: `context/SettingsContext.tsx`, admin settings/socials pages

## 21) Safe Change Checklist

Before shipping major changes:
1. Validate Firestore rules impact for new/changed writes.
2. Verify role behavior for both admin and non-admin accounts.
3. Test upload path for both public and protected folders.
4. Test checkout end-to-end (normal + manual chat payment modes).
5. Test order messaging with and without attachments.
6. Test dashboard notifications read flow.
7. Run `npm run lint` and `npm run build`.
8. Confirm cron secret behavior if modifying entitlement job.

## 22) Related Existing Docs

- `docs/media-records-schema.md`
- `docs/media-api-examples.md`

These two docs remain useful for media API payload examples and record structure.

## 18) 2026-05-07 System Audit Fixes

### Stability / IP Blocking
- No app-wide middleware firewall, deny list, or 429 IP blocking logic exists in this codebase after audit.
- Removed the newsletter subscribe route's in-memory per-IP rate limiter so normal repeated access from the same IP is not blocked by app code.
- If users still see ERR_QUIC or VPN-only access, inspect Hostinger/CDN/WAF/HTTP3/QUIC settings because that is outside this Next.js app.

### Hero Visibility / Performance
- `components/GsapSectionAnimator.tsx` now only animates elements explicitly marked with `data-gsap-reveal="gsap"` and skips hero-critical text.
- `components/Hero.tsx` marks desktop hero text as GSAP-skip to prevent opacity/transform animation from hiding the headline.
- `components/AnimatedBackground.tsx` disables falling particles; `app/globals.css` removes heavy FAQ/ambient animation CSS.

### Notifications / Engagement
- `components/EngagementPrompt.tsx` shows the WhatsApp/notifications popup after 12-18 seconds with a 3-day localStorage cooldown.
- Browser notification permission is requested only when permission is still `default`, never when already granted/denied.
- `components/PushNotificationBootstrap.tsx` no longer prompts immediately; it only registers FCM when permission is already granted.

### Search
- Public navbar search now opens a slide-down search panel and live-searches tools, published blogs, and giveaways.
- Admin layout search now uses realtime Firestore listeners and searches tools/services, orders, blogs, giveaways, and users for admins.
- Mobile admin header has a search icon and mobile search panel.
- Closed public search panel uses `pointer-events: none` and `visibility: hidden` so it cannot intercept mobile clicks.

### Rich Text / Links
- Lightweight editor: `components/RichTextEditor.tsx`.
- Renderer: `components/RichTextContent.tsx`.
- Helpers: `lib/rich-text.ts`.
- Supports bold, italic, underline, small/medium/large span sizing, white/yellow/grey span color, manual links, and pasted URL auto-linking.
- Applied to admin blog, giveaways, and tools content. Blog/giveaway/tool detail pages render clickable rich content.

### Coupons
- `lib/coupons.ts` centralizes scope visibility rules.
- Global coupons show on all non-admin pages.
- Category coupons show on home, tools, matching category, and tools in the matching category.
- Product coupons show on home, tools, and matching product page.
- `components/GlobalPromoTicker.tsx` now picks the best active coupon for the current route and supports coupons without expiry using `LIMITED` countdown text.

### Uploads / Media Library
- `app/api/upload/library/route.ts` supports unified multi-folder library queries for staff.
- `components/MediaLibraryModal.tsx` accepts `includeFolders` while uploads still go to the selected destination folder.
- Admin tools/blog/giveaways/categories/agency modals show a unified `tools + blogs + services` media library.
- `components/UploadedImage.tsx` defaults to fallback-on-error so stale or missing uploaded URLs do not leave blank UI.

### Admin UX
- Tools, blogs, giveaways, categories, and agency services scroll to their editor when add/edit opens.
- Category filter row on `/tools` supports pointer drag horizontal scrolling on desktop and mobile.

### Verification
- `npm run lint` passes.
- `npm run build` passes and `scripts/prepare-standalone.mjs` copies `.next/static` and `public` into `.next/standalone` for Hostinger.
- Standalone server smoke-tested on localhost desktop/mobile/fresh-storage state. Local uploaded-media URLs 404 if the matching files are absent from `public/uploads`; UI falls back visually, but production needs the Hostinger uploaded files present in the configured upload root.
