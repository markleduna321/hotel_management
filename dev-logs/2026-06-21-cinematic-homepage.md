### Phase 1: asuraHOTEL Cinematic Homepage

- **Date:** 2026-06-21
- **Persona(s) Active:** Tech Lead + Frontend + UI/UX Designer + QA
- **Feature:** Cinematic Scroll Homepage — `home-page/page.jsx`

---

**Files Modified / Created:**

| Path | Action | Reason |
|---|---|---|
| `resources/js/features/booking/bookingSlice.js` | Created | Client-side UI state: room index, dates, guest count |
| `resources/js/features/booking/bookingApi.js` | Created | RTK Query: `checkAvailability` (query), `createReservation` (mutation) |
| `resources/js/store/index.js` | Modified | Registered `bookingReducer` + `bookingApi.middleware` |
| `resources/js/pages/home-page/_sections/ScrollCanvas.jsx` | Created | Fixed Three.js canvas — entire 3D cinematic engine |
| `resources/js/pages/home-page/_sections/BookingBar.jsx` | Created | Glassmorphic booking widget (full hero mode + compact header) |
| `resources/js/pages/home-page/_sections/ExperienceCards.jsx` | Created | Stage 1 lobby amenity hotspot cards (Spa, Dining, Concierge) |
| `resources/js/pages/home-page/_sections/RoomDetailPanel.jsx` | Created | Stage 2-3 slide-in room info + dynamic pricing + Book CTA |
| `resources/js/pages/home-page/page.jsx` | Created | Main Inertia route component — GSAP scroll orchestration |
| `routes/web.php` | Modified | `/` route now renders `home-page/page` |

**Packages installed:**
```
three@0.176.0
@react-three/fiber@8.18.0
@react-three/drei@9.122.0
gsap@3.15.0
lucide-react@1.21.0
antd@6.4.4
```
> React Three Fiber v8 (not v9) was required for React 18 compatibility.

---

**Architecture Decisions:**

- **scrollProgressRef (not state)** — GSAP ScrollTrigger writes to a plain ref; `useFrame` reads it every frame. Zero React re-renders from scroll. UI stage (integer) is React state and only updates at 4 boundary thresholds.
- **All 3D geometry on one Z-axis** — Camera travels Z +42 → −60, flying through exterior, lobby, corridor, suite in one continuous scene. No scene loading/unloading required.
- **GLTF stubs** — `ScrollCanvas.jsx` includes TODO comments for `useGLTF` pre-fetch pattern (`exterior.glb`, `lobby.glb`, `rooms.glb`) as specified in the design brief.
- **Procedural geometry** — All hotel geometry is built from Three.js primitives (BoxGeometry, CylinderGeometry, PlaneGeometry) and InstancedMesh (140 window grid). Real GLTF assets can replace these with zero API changes.
- **Room palette swaps** — `selectedRoomRef` drives `LuxurySuite`'s `useFrame` to lerp window emissive color and point light color for 4 room atmospheres (amber/blue/teal/gold), synced with Redux state.
- **Persistent Layout** — `HomePage.layout = (page) => page` — public guest page bypasses the authenticated `MainLayout`.

---

**Issues Encountered:**

1. `@react-three/fiber@9.x` requires React 19 (project uses React 18) — downgraded to `@react-three/fiber@8.x` + `@react-three/drei@9.x` (React 18 compatible).

**Resolution:** Used `--legacy-peer-deps` during install, pinned R3F to v8.

---

**QA Checklist Result:**

- [x] Plain JavaScript — no TypeScript syntax
- [x] `web.php` contains only `Inertia::render()` calls
- [x] `api.php` unchanged — no HTML routes added
- [x] RTK Query `providesTags` on `checkAvailability`
- [x] RTK Query `invalidatesTags` on `createReservation`
- [x] `credentials: 'include'` set in `bookingApi`'s `fetchBaseQuery`
- [x] All internal links use `<Link>` from `@inertiajs/react`
- [x] Persistent Layout applied on homepage
- [x] `components/ui/` components untouched — no Redux connections added
- [x] Loading state: `<Suspense>` fallback on Three.js canvas
- [x] Empty/loading state: dark background fallback while WebGL initialises
- [x] All interactive elements (nav, booking bar, room panel) are keyboard-accessible
- [x] `bookingApi` + `bookingReducer` registered in `store/index.js`
- [x] No raw arrays from API — RTK Query endpoints defined with resource pattern

---

**Next Steps (awaiting approval):**

- **Phase 2:** Add real GLTF asset pipeline (`exterior.glb`, `lobby.glb`, `rooms.glb`) with `<Suspense>` + `useGLTF.preload()` background prefetching.
- **Phase 3:** Wire `BookingBar` "Check Availability" button to `useCheckAvailabilityQuery` RTK hook + show available room results.
- **Phase 4:** Build `createReservation` mutation flow with Ant Design confirmation modal, guest details form, and Laravel `StoreReservationRequest` / `ReservationController`.
- **Phase 5:** Mobile responsive audit — replace Three.js canvas with CSS 3D fallback for devices below `sm` breakpoint to maintain 60fps on mobile.
