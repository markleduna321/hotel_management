/**
 * asuraHOTEL — Cinematic Homepage
 *
 * Scroll Architecture:
 *  • A 500vh invisible scroll surface drives the GSAP ScrollTrigger.
 *  • The Three.js canvas + all UI overlays are position:fixed.
 *  • scrollProgressRef (0–1) is a plain ref — never triggers React
 *    re-renders — fed straight into useFrame inside ScrollCanvas.
 *  • currentStage (integer 0-3) is React state — triggers overlay
 *    transitions only when crossing a stage boundary.
 *
 * Stage map  (scroll progress → currentStage):
 *   0.00 – 0.20  →  0  Hero Arrival   (exterior + full booking bar)
 *   0.20 – 0.55  →  1  Grand Entrance (lobby interior + experience cards)
 *   0.55 – 0.70  →  2  Suite Showcase (suite approach + room panel)
 *   0.70 – 1.00  →  3  Room Carousel  (suite locked + room switching)
 *
 * This component uses the Inertia Persistent Layout pattern:
 *   HomePage.layout = (page) => page;
 * so no sidebar re-renders on client-side navigation.
 */

import { useEffect, useRef, useState, Suspense, lazy } from 'react';
import { Head, Link } from '@inertiajs/react';
import { useDispatch, useSelector } from 'react-redux';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Menu, X, Phone } from 'lucide-react';
import { setSelectedRoom } from '../../features/booking/bookingSlice';

// Sections
// ScrollCanvas is lazy-loaded so the Three.js vendor chunk is fetched
// only after the initial React paint — improves perceived load time.
const ScrollCanvas = lazy(() => import('./_sections/ScrollCanvas'));
import BookingBar      from './_sections/BookingBar';
import ExperienceCards from './_sections/ExperienceCards';
import RoomDetailPanel from './_sections/RoomDetailPanel';

gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────────────────────
// Stage boundary thresholds
// ─────────────────────────────────────────────────────────────
const STAGE_THRESHOLDS = [0.20, 0.55, 0.70];

function progressToStage(p) {
    if (p < STAGE_THRESHOLDS[0]) return 0;
    if (p < STAGE_THRESHOLDS[1]) return 1;
    if (p < STAGE_THRESHOLDS[2]) return 2;
    return 3;
}

/** Room index driven by scroll sub-progress inside Stage 3 (0.70–1.0). */
function progressToRoomIndex(p) {
    const start = STAGE_THRESHOLDS[2]; // 0.70
    if (p < start) return 0;
    const sub = (p - start) / (1 - start); // 0–1 within stage 3
    return Math.min(3, Math.floor(sub * 4));
}

// ─────────────────────────────────────────────────────────────
// Top navigation bar
// ─────────────────────────────────────────────────────────────

const NAV_LINKS = ['Rooms', 'Dining', 'Spa', 'Events', 'Contact'];

function TopNav({ scrolled }) {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <nav
            className={`
                absolute top-0 left-0 right-0 z-20
                flex items-center justify-between
                px-8 pt-6 pb-4
                transition-all duration-500
            `}
        >
            {/* Brand */}
            <Link
                href="/"
                className="text-white font-extralight text-xl tracking-[0.45em] uppercase select-none"
            >
                asura<span className="font-light text-amber-400">HOTEL</span>
            </Link>

            {/* Desktop links */}
            <ul className="hidden md:flex gap-8 items-center">
                {NAV_LINKS.map((label) => (
                    <li key={label}>
                        <a
                            href={`#${label.toLowerCase()}`}
                            className="
                                text-white/55 hover:text-white
                                text-[10px] tracking-[0.3em] uppercase
                                transition-colors duration-200
                            "
                        >
                            {label}
                        </a>
                    </li>
                ))}
            </ul>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3">
                <a
                    href="tel:+1800ASURA01"
                    className="flex items-center gap-1.5 text-white/40 text-[10px] tracking-widest hover:text-white/70 transition-colors"
                >
                    <Phone size={11} />
                    +1 800 ASURA 01
                </a>
                <span className="text-white/15">|</span>
                <Link
                    href="/login"
                    className="
                        px-4 py-1.5 rounded-full
                        border border-white/20 hover:border-amber-400/50
                        text-white/60 hover:text-amber-400
                        text-[10px] tracking-widest uppercase
                        transition-all duration-200
                    "
                >
                    Sign In
                </Link>
            </div>

            {/* Mobile hamburger */}
            <button
                type="button"
                className="md:hidden text-white/60 hover:text-white transition-colors"
                onClick={() => setMobileOpen((v) => !v)}
                aria-label="Toggle navigation"
            >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Mobile drawer */}
            {mobileOpen && (
                <div className="
                    absolute top-full left-0 right-0
                    bg-black/80 backdrop-blur-xl
                    border-t border-white/10
                    px-8 py-6 flex flex-col gap-4
                ">
                    {NAV_LINKS.map((label) => (
                        <a
                            key={label}
                            href={`#${label.toLowerCase()}`}
                            onClick={() => setMobileOpen(false)}
                            className="text-white/70 text-sm tracking-widest uppercase"
                        >
                            {label}
                        </a>
                    ))}
                </div>
            )}
        </nav>
    );
}

// ─────────────────────────────────────────────────────────────
// Stage 0 — Hero headline: editorial left-side layout
// ─────────────────────────────────────────────────────────────

function HeroHeadline({ visible }) {
    return (
        <>
            {/* Left-side gradient vignette so text is legible against the 3D scene */}
            <div
                className={`
                    absolute inset-0 pointer-events-none
                    transition-opacity duration-700
                    ${visible ? 'opacity-100' : 'opacity-0'}
                `}
                style={{
                    background:
                        'linear-gradient(105deg, rgba(5,8,18,0.93) 0%, rgba(5,8,18,0.72) 28%, rgba(5,8,18,0.2) 52%, transparent 68%)',
                }}
            />

            {/* Hero copy */}
            <div
                className={`
                    absolute top-1/2 left-12 md:left-20
                    -translate-y-1/2
                    pointer-events-none max-w-[500px]
                    transition-all duration-700 ease-out
                    ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}
                `}
            >
                {/* Gold vertical accent line */}
                <div className="w-px h-16 bg-gradient-to-b from-transparent via-amber-400/80 to-transparent mb-6" />

                <p className="text-white/30 text-[9px] tracking-[0.55em] uppercase mb-5">
                    Luxury Redefined &middot; Est.&nbsp;2008
                </p>

                <h1 className="text-white font-thin leading-[0.88] uppercase text-5xl md:text-6xl lg:text-[5.5rem] tracking-[0.04em]">
                    Welcome<br />to
                </h1>
                <h2 className="text-amber-400 font-extralight leading-[0.88] uppercase mt-3 text-5xl md:text-6xl lg:text-[5.5rem] tracking-[0.18em]">
                    Asura<span className="font-bold">Hotel</span>
                </h2>

                <div className="mt-8 flex items-center gap-4">
                    <div className="h-px w-10 bg-amber-400/50" />
                    <p className="text-white/25 text-[9px] tracking-[0.4em] uppercase">
                        Five-Star &nbsp;·&nbsp; City Centre
                    </p>
                </div>
            </div>
        </>
    );
}

// ─────────────────────────────────────────────────────────────
// Stage 1 — Lobby text overlay
// ─────────────────────────────────────────────────────────────

function LobbyOverlay({ visible }) {
    return (
        <div
            className={`
                absolute top-12 left-10
                transition-all duration-700
                ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}
                pointer-events-none
            `}
        >
            <p className="text-white/25 text-[9px] tracking-[0.4em] uppercase">Grand Lobby</p>
            <h3 className="text-white text-2xl font-thin tracking-widest mt-1">
                The Grand Entrance
            </h3>
            <p className="text-white/40 text-xs leading-relaxed mt-2 max-w-[220px] font-light">
                An 18-metre soaring atrium of hand-laid Italian marble,
                framed by bespoke chandeliers from Venetian craftsmen.
            </p>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// Stage 2-3 — Suite text overlay (left side)
// ─────────────────────────────────────────────────────────────

function SuiteOverlay({ visible, selectedRoomIndex }) {
    const LABELS = ['Deluxe King Room', 'Executive Suite', 'Premier Ocean View', 'Presidential Suite'];

    return (
        <div
            className={`
                absolute top-12 left-10
                transition-all duration-700
                ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}
                pointer-events-none
            `}
        >
            <p className="text-white/25 text-[9px] tracking-[0.4em] uppercase">Guest Suite</p>
            <h3 className="text-white text-2xl font-thin tracking-widest mt-1">
                {LABELS[selectedRoomIndex]}
            </h3>
            <div className="flex gap-1.5 mt-3">
                {LABELS.map((_, i) => (
                    <div
                        key={i}
                        className={`h-0.5 rounded-full transition-all duration-500 ${
                            i === selectedRoomIndex
                                ? 'w-8 bg-amber-400'
                                : 'w-4 bg-white/20'
                        }`}
                    />
                ))}
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// HOME PAGE
// ─────────────────────────────────────────────────────────────

export default function HomePage() {
    const dispatch   = useDispatch();
    const { selectedRoomIndex } = useSelector((s) => s.booking);

    // Refs that change every scroll frame — never trigger React re-renders
    const scrollProgressRef = useRef(0);
    const selectedRoomRef   = useRef(0); // mirrors Redux without re-render cost
    const scrollContainerRef = useRef(null);

    // React state — only for UI visibility/stage transitions
    const [currentStage, setCurrentStage]       = useState(0);
    const [bookingMinimized, setBookingMinimized] = useState(false);

    // Keep selectedRoomRef in sync with Redux (Redux is source of truth for UI;
    // the ref is source of truth for the 3D scene to avoid useFrame stalling)
    useEffect(() => {
        selectedRoomRef.current = selectedRoomIndex;
    }, [selectedRoomIndex]);

    // ── GSAP ScrollTrigger setup ──────────────────────────────
    useEffect(() => {
        const ctx = gsap.context(() => {
            ScrollTrigger.create({
                trigger: scrollContainerRef.current,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 1.8,  // slight lag for cinematic glide
                onUpdate(self) {
                    const p = self.progress;

                    // Update ref (read by Three.js useFrame — no re-render)
                    scrollProgressRef.current = p;

                    // Update room index ref + Redux when stage 3 sub-progress changes
                    const roomIdx = progressToRoomIndex(p);
                    if (roomIdx !== selectedRoomRef.current) {
                        selectedRoomRef.current = roomIdx;
                        dispatch(setSelectedRoom(roomIdx));
                    }

                    // Update stage state (triggers React re-render for overlays)
                    const stage = progressToStage(p);
                    setCurrentStage((prev) => (prev !== stage ? stage : prev));

                    // Booking bar minimises on first scroll
                    setBookingMinimized(p > 0.03);
                },
            });
        });

        return () => ctx.revert();
    }, [dispatch]);

    const showHeroHeadline     = currentStage === 0;
    const showLobbyOverlay     = currentStage === 1;
    const showSuiteOverlay     = currentStage >= 2;
    const showExperienceCards  = currentStage === 1;
    const showRoomDetailPanel  = currentStage >= 2;
    const showBookingBar       = currentStage <= 1;

    return (
        <>
            <Head title="asuraHOTEL — Luxury Redefined" />

            {/* ── 500vh scroll surface (invisible) ── */}
            <div
                ref={scrollContainerRef}
                style={{ height: '500vh' }}
                aria-hidden="true"
            />

            {/* ── Fixed fullscreen canvas ── */}
            <div className="fixed inset-0 z-0">
                <Suspense fallback={<div className="w-full h-full bg-[#080c1a]" />}>
                    <ScrollCanvas
                        scrollProgressRef={scrollProgressRef}
                        selectedRoomRef={selectedRoomRef}
                    />
                </Suspense>
            </div>

            {/* ── Fixed UI layer (pointer-events-none container) ── */}
            <div className="fixed inset-0 z-10 pointer-events-none overflow-hidden">

                {/* Brand nav — always on top */}
                <div className="pointer-events-auto">
                    <TopNav scrolled={bookingMinimized} />
                </div>

                {/* Stage 0 — Hero headline */}
                <HeroHeadline visible={showHeroHeadline} />

                {/* Stage 0 — Full booking bar + scroll indicator */}
                <BookingBar
                    visible={showBookingBar}
                    minimized={bookingMinimized}
                />

                {/* Stage 1 — Lobby text */}
                <LobbyOverlay visible={showLobbyOverlay} />

                {/* Stage 1 — Amenity experience cards */}
                <ExperienceCards visible={showExperienceCards} />

                {/* Stage 2-3 — Suite text + room indicator */}
                <SuiteOverlay visible={showSuiteOverlay} selectedRoomIndex={selectedRoomIndex} />

                {/* Stage 2-3 — Room detail + booking panel */}
                <RoomDetailPanel
                    visible={showRoomDetailPanel}
                    stage={currentStage}
                />
            </div>
        </>
    );
}

/**
 * Persistent Layout — no sidebar for the public homepage.
 * Returning `page` directly means Inertia skips any global layout wrapper.
 */
HomePage.layout = (page) => page;
