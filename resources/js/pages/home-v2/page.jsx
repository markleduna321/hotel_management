/**
 * asuraHOTEL — Luxury Minimalist Homepage (v2)
 *
 * Design System:
 *   BG      #08080A  │  Surface   #111114  │  Border  rgba(201,169,110,0.13)
 *   Text    #F0EBE1  │  Muted     #786C5E  │  Gold    #C9A96E / Light #E2C898
 *
 * Sections: Navbar → Hero → Stats → Rooms → Story → Amenities → Quote → CTA → Footer
 * Motion:   GSAP ScrollTrigger fade-up reveals — no canvas, no 3D
 * Images:   Static Unsplash placeholders
 */

import { useEffect, useRef, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown, ArrowRight, MapPin, Phone, Mail } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────────────────────
   Design tokens
───────────────────────────────────────────────────────────── */
const T = {
    bg:     '#08080A',
    surf:   '#111114',
    surf2:  '#19191D',
    border: 'rgba(201,169,110,0.13)',
    txt:    '#F0EBE1',
    muted:  '#786C5E',
    gold:   '#C9A96E',
    goldL:  '#E2C898',
};

/* ─────────────────────────────────────────────────────────────
   Static assets (Pexels CDN)
───────────────────────────────────────────────────────────── */
const PX = (id, w, h) =>
    `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}&h=${h}&dpr=1&fit=crop`;

const IMG = {
    // Hero: wide exterior + tall portrait for right panel
    hero:   PX(261102, 1920, 1080),
    heroR:  PX(1579253, 900,  1300),
    // Sections
    story:  PX(1838554, 1400, 1000),
    // Rooms
    king:   PX(271624,  900,  700),
    suite:  PX(164595,  900,  700),
    pres:   PX(1743229, 900,  700),
    // Amenities
    pool:   PX(261327,  1000, 800),
    dining: PX(941861,  1000, 800),
    spa:    PX(3757952, 1000, 800),
    bar:    PX(1484516, 1000, 800),
};

/* ─────────────────────────────────────────────────────────────
   Scroll reveal hook — wires every [data-reveal] element to
   a GSAP fade-up ScrollTrigger on mount.
───────────────────────────────────────────────────────────── */
function useReveal() {
    useEffect(() => {
        const ctx = gsap.context(() => {
            document.querySelectorAll('[data-reveal]').forEach((el) => {
                const delay = parseFloat(el.dataset.delay ?? 0);
                const fromY = parseFloat(el.dataset.y    ?? 50);
                gsap.fromTo(
                    el,
                    { opacity: 0, y: fromY },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 1.1,
                        delay,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: el,
                            start: 'top 84%',
                            toggleActions: 'play none none none',
                        },
                    }
                );
            });
        });
        return () => ctx.revert();
    }, []);
}

/* ─────────────────────────────────────────────────────────────
   Micro-components
───────────────────────────────────────────────────────────── */
function SectionLabel({ children }) {
    return (
        <p
            className="text-[10px] tracking-[0.45em] uppercase mb-6 select-none"
            style={{ color: T.gold }}
        >
            {children}
        </p>
    );
}

function GoldRule({ className = '' }) {
    return (
        <div
            className={`h-px ${className}`}
            style={{ background: T.gold, width: '3rem' }}
        />
    );
}

/* ─────────────────────────────────────────────────────────────
   Navbar
───────────────────────────────────────────────────────────── */
const NAV_LINKS = ['Rooms', 'Dining', 'Spa', 'Events', 'Contact'];

function Navbar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 64);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <header
            className="fixed top-0 left-0 right-0 z-[100] transition-all duration-500"
            style={{
                background:     scrolled ? `${T.surf}F2` : 'transparent',
                backdropFilter: scrolled ? 'blur(20px)' : 'none',
                borderBottom:   `1px solid ${scrolled ? T.border : 'transparent'}`,
            }}
        >
            <div
                className="flex items-center justify-between mx-auto px-8"
                style={{ maxWidth: '1440px', height: '72px' }}
            >
                {/* Logo */}
                <Link
                    href="/home-v2"
                    className="font-extralight text-xl tracking-[0.45em] uppercase select-none"
                    style={{ color: T.txt, textDecoration: 'none' }}
                >
                    asura<span style={{ color: T.gold }} className="font-light">HOTEL</span>
                </Link>

                {/* Centre links */}
                <nav className="hidden md:flex items-center gap-10">
                    {NAV_LINKS.map((lnk) => (
                        <a
                            key={lnk}
                            href={`#${lnk.toLowerCase()}`}
                            className="text-[10px] tracking-[0.35em] uppercase transition-colors duration-200"
                            style={{ color: T.muted, textDecoration: 'none' }}
                            onMouseEnter={e => e.currentTarget.style.color = T.txt}
                            onMouseLeave={e => e.currentTarget.style.color = T.muted}
                        >
                            {lnk}
                        </a>
                    ))}
                </nav>

                {/* Right cluster */}
                <div className="flex items-center gap-6">
                    {/* Switch to cinematic */}
                    <Link
                        href="/"
                        className="hidden md:block text-[9px] tracking-[0.3em] uppercase transition-opacity duration-200"
                        style={{ color: T.muted, textDecoration: 'none', opacity: 0.55 }}
                        onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                        onMouseLeave={e => e.currentTarget.style.opacity = '0.55'}
                    >
                        ← Cinematic
                    </Link>

                    {/* Book */}
                    <a
                        href="#reserve"
                        className="text-[10px] tracking-[0.35em] uppercase px-6 py-2.5 transition-all duration-300"
                        style={{ border: `1px solid ${T.gold}`, color: T.gold, textDecoration: 'none' }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = T.gold;
                            e.currentTarget.style.color = T.bg;
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = T.gold;
                        }}
                    >
                        Book a Stay
                    </a>
                </div>
            </div>
        </header>
    );
}

/* ─────────────────────────────────────────────────────────────
   Hero — split layout: text left, image right
───────────────────────────────────────────────────────────── */
function Hero() {
    const imgRef = useRef(null);

    useEffect(() => {
        if (!imgRef.current) return;
        // Subtle parallax on right image — drifts slowly upward on scroll
        gsap.to(imgRef.current, {
            yPercent: 18,
            ease: 'none',
            scrollTrigger: {
                trigger: imgRef.current,
                start: 'top top',
                end:   '+=100%',
                scrub: true,
            },
        });
    }, []);

    return (
        <section
            className="relative flex overflow-hidden"
            style={{ height: '100vh', background: T.bg }}
        >
            {/* ── LEFT: Text panel ─────────────────────── */}
            <div
                className="relative flex items-center flex-shrink-0"
                style={{
                    width: '54%',
                    paddingLeft: 'clamp(3rem, 7vw, 7rem)',
                    paddingRight: '3rem',
                }}
            >
                {/* Ambient gold radial glow */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: `radial-gradient(ellipse at 20% 55%, ${T.gold}07 0%, transparent 65%)` }}
                />


                <div className="relative z-10" style={{ maxWidth: '580px' }}>
                    <p
                        className="text-[10px] tracking-[0.5em] uppercase mb-8"
                        style={{ color: T.gold }}
                        data-reveal data-y="20" data-delay="0.1"
                    >
                        A Forbes Five‑Star Collection
                    </p>

                    <h1
                        className="font-thin leading-[1.04] mb-8"
                        style={{
                            fontFamily: "'Playfair Display', Georgia, serif",
                            fontSize:   'clamp(3rem, 5.5vw, 5.75rem)',
                            color:      T.txt,
                            letterSpacing: '-0.02em',
                        }}
                        data-reveal data-y="60" data-delay="0.25"
                    >
                        Where Luxury<br />
                        <em style={{ fontStyle: 'italic', color: T.goldL }}>Finds</em> Its Address
                    </h1>

                    <p
                        className="text-base leading-relaxed mb-12"
                        style={{ color: T.muted, maxWidth: '400px', letterSpacing: '0.01em' }}
                        data-reveal data-y="30" data-delay="0.4"
                    >
                        156 bespoke suites above the city skyline. Michelin‑starred dining.
                        A sanctuary of absolute calm in the heart of the metropolis.
                    </p>

                    <div
                        className="flex items-center gap-6 flex-wrap"
                        data-reveal data-y="20" data-delay="0.55"
                    >
                        <a
                            href="#reserve"
                            className="inline-flex items-center gap-3 text-[11px] tracking-[0.3em] uppercase px-8 py-4 transition-all duration-300"
                            style={{ background: T.gold, color: T.bg, fontWeight: 600, textDecoration: 'none' }}
                            onMouseEnter={e => e.currentTarget.style.background = T.goldL}
                            onMouseLeave={e => e.currentTarget.style.background = T.gold}
                        >
                            Reserve Your Stay <ArrowRight size={13} />
                        </a>
                        <a
                            href="#rooms"
                            className="text-[11px] tracking-[0.3em] uppercase transition-all duration-200 pb-0.5"
                            style={{ color: T.txt, textDecoration: 'none', borderBottom: `1px solid ${T.border}` }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = T.gold}
                            onMouseLeave={e => e.currentTarget.style.borderColor = T.border}
                        >
                            Explore Rooms
                        </a>
                    </div>
                </div>

                {/* Scroll indicator — anchored to left panel bottom centre */}
                <div
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
                    data-reveal data-y="10" data-delay="1.1"
                >
                    <span className="text-[9px] tracking-[0.45em] uppercase" style={{ color: T.muted }}>
                        Scroll
                    </span>
                    <ChevronDown size={13} className="animate-bounce" style={{ color: T.muted }} />
                </div>
            </div>

            {/* ── RIGHT: Image panel ───────────────────── */}
            <div className="relative flex-1 overflow-hidden">
                {/* Parallax image */}
                <img
                    ref={imgRef}
                    src={IMG.heroR}
                    alt="asuraHOTEL luxury suite"
                    className="absolute w-full object-cover"
                    style={{ height: '120%', top: '-10%', objectPosition: 'center' }}
                />

                {/* Left-edge fade — smooth 10-stop sine-ease curve for seamless blend */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: [
                            `linear-gradient(to right,`,
                            `  ${T.bg}FF  0%,`,
                            `  ${T.bg}F5  4%,`,
                            `  ${T.bg}E3  9%,`,
                            `  ${T.bg}C8 17%,`,
                            `  ${T.bg}A3 26%,`,
                            `  ${T.bg}7A 36%,`,
                            `  ${T.bg}52 46%,`,
                            `  ${T.bg}2E 56%,`,
                            `  ${T.bg}12 65%,`,
                            `  ${T.bg}03 74%,`,
                            `  ${T.bg}00 82%`,
                            `)`,
                        ].join(' '),
                    }}
                />
                {/* Top vignette */}
                <div
                    className="absolute top-0 left-0 right-0"
                    style={{ height: '22%', background: `linear-gradient(to bottom, ${T.bg}BB, transparent)` }}
                />
                {/* Bottom vignette */}
                <div
                    className="absolute bottom-0 left-0 right-0"
                    style={{ height: '28%', background: `linear-gradient(to top, ${T.bg}CC, transparent)` }}
                />

                {/* Gold corner frame — top right */}
                <div className="absolute top-14 right-8 w-14 h-px" style={{ background: T.gold, opacity: 0.45 }} />
                <div className="absolute top-14 right-8 w-px h-14" style={{ background: T.gold, opacity: 0.45 }} />
                {/* Gold corner frame — bottom right */}
                <div className="absolute bottom-14 right-8 w-14 h-px" style={{ background: T.gold, opacity: 0.45 }} />
                <div className="absolute bottom-14 right-[33px] w-px h-14" style={{ background: T.gold, opacity: 0.45 }} />

                {/* Location badge */}
                <div className="absolute bottom-10 right-8 flex items-center gap-2">
                    <MapPin size={10} style={{ color: T.gold }} />
                    <span className="text-[9px] tracking-[0.3em] uppercase" style={{ color: T.muted }}>
                        Downtown Metropolitan District
                    </span>
                </div>
            </div>
        </section>
    );
}

/* ─────────────────────────────────────────────────────────────
   Stats strip
───────────────────────────────────────────────────────────── */
const STATS = [
    { value: '156',  label: 'Bespoke Suites'  },
    { value: '7',    label: 'Dining Venues'   },
    { value: '5 ★',  label: 'Forbes Rated'    },
    { value: '1992', label: 'Year Founded'    },
];

function StatsStrip() {
    return (
        <div
            className="py-10"
            style={{ background: T.surf, borderBottom: `1px solid ${T.border}` }}
        >
            <div
                className="mx-auto px-8 grid grid-cols-2 md:grid-cols-4"
                style={{ maxWidth: '1440px' }}
            >
                {STATS.map((s, i) => (
                    <div
                        key={s.label}
                        className={`flex flex-col items-center py-4 ${i < STATS.length - 1 ? 'md:border-r' : ''}`}
                        style={{ borderColor: T.border }}
                        data-reveal data-delay={`${0.1 + i * 0.1}`} data-y="20"
                    >
                        <span
                            className="font-light text-3xl mb-1.5"
                            style={{
                                fontFamily: "'Playfair Display', Georgia, serif",
                                color: T.gold,
                            }}
                        >
                            {s.value}
                        </span>
                        <span
                            className="text-[9px] tracking-[0.35em] uppercase"
                            style={{ color: T.muted }}
                        >
                            {s.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────
   Rooms section
───────────────────────────────────────────────────────────── */
const ROOMS = [
    {
        name:  'Deluxe King',
        tag:   'Classic Collection',
        price: '$320',
        sqft:  '540 sq ft',
        desc:  'Warm amber tones and hand‑crafted furnishings define this sanctuary of refined comfort.',
        img:   IMG.king,
    },
    {
        name:  'Executive Suite',
        tag:   'Premier Collection',
        price: '$680',
        sqft:  '860 sq ft',
        desc:  'Navy palette with panoramic city views. A living space worthy of the most discerning traveller.',
        img:   IMG.suite,
    },
    {
        name:  'Presidential Suite',
        tag:   'Signature Collection',
        price: '$1,800',
        sqft:  '2,100 sq ft',
        desc:  'The pinnacle of palatial luxury — three private rooms, dedicated butler, and gold‑leaf interiors.',
        img:   IMG.pres,
    },
];

function RoomCard({ room, delay = 0 }) {
    const [hov, setHov] = useState(false);

    return (
        <article
            className="relative overflow-hidden cursor-pointer"
            style={{
                border:     `1px solid ${hov ? T.gold + '45' : T.border}`,
                boxShadow:  hov ? `0 0 48px ${T.gold}14` : 'none',
                transition: 'border-color 0.4s ease, box-shadow 0.4s ease',
            }}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            data-reveal
            data-delay={delay}
            data-y="50"
        >
            {/* Image */}
            <div className="relative overflow-hidden" style={{ height: '300px', background: T.surf2 }}>
                <img
                    src={room.img}
                    alt={room.name}
                    className="w-full h-full object-cover"
                    style={{
                        transform:  hov ? 'scale(1.07)' : 'scale(1)',
                        transition: 'transform 0.7s ease',
                    }}
                />
                <div
                    className="absolute inset-0"
                    style={{ background: `linear-gradient(to top, ${T.bg}CC 0%, transparent 60%)` }}
                />
                {/* Price badge */}
                <div
                    className="absolute top-4 right-4 px-3 py-1.5"
                    style={{ background: `${T.bg}CC`, backdropFilter: 'blur(10px)' }}
                >
                    <span
                        className="text-[10px] tracking-[0.2em] uppercase"
                        style={{ color: T.gold }}
                    >
                        From {room.price} / night
                    </span>
                </div>
            </div>

            {/* Body */}
            <div className="p-8" style={{ background: T.surf }}>
                <p className="text-[9px] tracking-[0.4em] uppercase mb-3" style={{ color: T.gold }}>
                    {room.tag}
                </p>
                <h3
                    className="font-light text-2xl mb-1"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif", color: T.txt }}
                >
                    {room.name}
                </h3>
                <p className="text-[10px] tracking-widest mb-5" style={{ color: T.muted }}>
                    {room.sqft}
                </p>
                <p className="text-sm leading-relaxed mb-7" style={{ color: T.muted }}>
                    {room.desc}
                </p>
                <span
                    className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase"
                    style={{ color: hov ? T.gold : T.muted, transition: 'color 0.2s' }}
                >
                    View Details
                    <ArrowRight
                        size={11}
                        style={{ transform: hov ? 'translateX(4px)' : 'none', transition: 'transform 0.3s' }}
                    />
                </span>
            </div>
        </article>
    );
}

function RoomsSection() {
    return (
        <section id="rooms" className="py-32" style={{ background: T.bg }}>
            <div className="mx-auto px-8" style={{ maxWidth: '1440px' }}>
                {/* Header */}
                <div className="mb-16" data-reveal>
                    <SectionLabel>Our Collection</SectionLabel>
                    <h2
                        className="font-light leading-tight mb-5"
                        style={{
                            fontFamily:    "'Playfair Display', Georgia, serif",
                            fontSize:      'clamp(2.5rem, 4vw, 3.75rem)',
                            color:         T.txt,
                            letterSpacing: '-0.01em',
                        }}
                    >
                        Curated Accommodations
                    </h2>
                    <p className="text-base max-w-md" style={{ color: T.muted }}>
                        From intimate retreats to expansive presidential suites — every space
                        crafted with deliberate intention.
                    </p>
                </div>

                {/* Cards — hairline gap between them */}
                <div
                    className="grid grid-cols-1 md:grid-cols-3"
                    style={{ gap: '1px', background: T.border }}
                >
                    {ROOMS.map((room, i) => (
                        <div key={room.name} style={{ background: T.bg }}>
                            <RoomCard room={room} delay={0.1 * i} />
                        </div>
                    ))}
                </div>

                {/* All rooms link */}
                <div className="mt-12 flex justify-end" data-reveal data-delay="0.3">
                    <a
                        href="#"
                        className="inline-flex items-center gap-2 text-[10px] tracking-[0.35em] uppercase pb-0.5"
                        style={{
                            color: T.gold,
                            textDecoration: 'none',
                            borderBottom: `1px solid ${T.gold}50`,
                        }}
                    >
                        View All Accommodations <ArrowRight size={11} />
                    </a>
                </div>
            </div>
        </section>
    );
}

/* ─────────────────────────────────────────────────────────────
   Our Story
───────────────────────────────────────────────────────────── */
function StorySection() {
    return (
        <section id="story" className="py-32 overflow-hidden" style={{ background: T.surf }}>
            <div
                className="mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-20 items-center"
                style={{ maxWidth: '1440px' }}
            >
                {/* Image — gold corner accent */}
                <div
                    className="relative overflow-hidden"
                    style={{ height: '620px', background: T.surf2 }}
                    data-reveal data-y="60"
                >
                    <img
                        src={IMG.story}
                        alt="asuraHOTEL grand lobby"
                        className="w-full h-full object-cover"
                    />
                    {/* Gold corner */}
                    <div className="absolute bottom-0 left-0 w-12 h-px" style={{ background: T.gold }} />
                    <div className="absolute bottom-0 left-0 w-px h-12" style={{ background: T.gold }} />
                </div>

                {/* Text */}
                <div data-reveal data-y="40" data-delay="0.2">
                    <SectionLabel>Our Heritage</SectionLabel>
                    <h2
                        className="font-light leading-tight mb-8"
                        style={{
                            fontFamily:    "'Playfair Display', Georgia, serif",
                            fontSize:      'clamp(2rem, 3.5vw, 3.25rem)',
                            color:         T.txt,
                            letterSpacing: '-0.01em',
                        }}
                    >
                        Three Decades of<br />
                        <em style={{ fontStyle: 'italic' }}>Uncommon Grace</em>
                    </h2>

                    <blockquote
                        className="mb-8 pl-6"
                        style={{ borderLeft: `2px solid ${T.gold}` }}
                    >
                        <p
                            className="font-light italic text-xl leading-relaxed"
                            style={{ fontFamily: "'Playfair Display', Georgia, serif", color: T.goldL }}
                        >
                            "We do not simply offer rooms. We offer an experience
                            that becomes a story worth telling."
                        </p>
                    </blockquote>

                    <p className="text-sm leading-relaxed mb-5" style={{ color: T.muted }}>
                        Founded in 1992, asuraHOTEL was born from a singular vision — to create a
                        space where architecture, art, and hospitality converge. Every stone chosen,
                        every detail considered. Nothing here is accidental.
                    </p>
                    <p className="text-sm leading-relaxed mb-10" style={{ color: T.muted }}>
                        Our team of over 400 professionals dedicate themselves to one purpose:
                        ensuring that every guest departs carrying a memory that cannot be replicated elsewhere.
                    </p>

                    <a
                        href="#"
                        className="inline-flex items-center gap-2 text-[10px] tracking-[0.35em] uppercase"
                        style={{ color: T.gold, textDecoration: 'none' }}
                    >
                        Our Full Story <ArrowRight size={11} />
                    </a>
                </div>
            </div>
        </section>
    );
}

/* ─────────────────────────────────────────────────────────────
   Amenities
───────────────────────────────────────────────────────────── */
const AMENITIES = [
    { id: 'pool',   label: 'Infinity Pool',  sub: 'Sky‑high, city view',      img: IMG.pool   },
    { id: 'dining', label: 'Fine Dining',    sub: 'Michelin‑starred',          img: IMG.dining },
    { id: 'spa',    label: 'Luxury Spa',     sub: 'Full‑service wellness',     img: IMG.spa    },
    { id: 'bar',    label: 'Signature Bar',  sub: 'Craft cocktails, live jazz', img: IMG.bar   },
];

function AmenityCard({ item, delay = 0 }) {
    const [hov, setHov] = useState(false);

    return (
        <div
            className="relative overflow-hidden cursor-pointer"
            style={{ height: '420px', background: T.surf2 }}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            data-reveal
            data-delay={delay}
            data-y="40"
        >
            <img
                src={item.img}
                alt={item.label}
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                    transform:  hov ? 'scale(1.08)' : 'scale(1)',
                    transition: 'transform 0.7s ease',
                }}
            />
            {/* Base overlay */}
            <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to top, rgba(8,8,10,0.92) 0%, rgba(8,8,10,0.35) 60%, rgba(8,8,10,0.1) 100%)' }}
            />
            {/* Hover overlay */}
            <div
                className="absolute inset-0"
                style={{
                    background: `linear-gradient(to top, ${T.bg}F0 0%, ${T.bg}80 100%)`,
                    opacity:    hov ? 1 : 0,
                    transition: 'opacity 0.4s ease',
                }}
            />
            {/* Label block */}
            <div className="absolute bottom-0 left-0 right-0 p-8">
                <GoldRule className="mb-5" />
                <h3
                    className="font-light text-xl mb-1.5"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif", color: T.txt }}
                >
                    {item.label}
                </h3>
                <p className="text-[10px] tracking-[0.3em] uppercase" style={{ color: T.muted }}>
                    {item.sub}
                </p>
                <div
                    className="mt-4 overflow-hidden"
                    style={{
                        maxHeight:  hov ? '40px' : '0',
                        opacity:    hov ? 1 : 0,
                        transition: 'max-height 0.4s ease, opacity 0.4s ease',
                    }}
                >
                    <span
                        className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase"
                        style={{ color: T.gold }}
                    >
                        Discover <ArrowRight size={10} />
                    </span>
                </div>
            </div>
        </div>
    );
}

function AmenitiesSection() {
    return (
        <section id="spa" className="py-32" style={{ background: T.bg }}>
            <div className="mx-auto px-8" style={{ maxWidth: '1440px' }}>
                <div className="flex items-end justify-between mb-16" data-reveal>
                    <div>
                        <SectionLabel>The Experience</SectionLabel>
                        <h2
                            className="font-light leading-tight"
                            style={{
                                fontFamily:    "'Playfair Display', Georgia, serif",
                                fontSize:      'clamp(2.5rem, 4vw, 3.75rem)',
                                color:         T.txt,
                                letterSpacing: '-0.01em',
                            }}
                        >
                            Beyond the Room
                        </h2>
                    </div>
                    <p className="text-sm max-w-xs text-right hidden md:block" style={{ color: T.muted }}>
                        Every amenity designed to elevate your stay
                        from memorable to extraordinary.
                    </p>
                </div>

                <div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
                    style={{ gap: '1px', background: T.border }}
                >
                    {AMENITIES.map((item, i) => (
                        <div key={item.id} style={{ background: T.bg }}>
                            <AmenityCard item={item} delay={0.08 * i} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ─────────────────────────────────────────────────────────────
   Testimonial
───────────────────────────────────────────────────────────── */
function TestimonialSection() {
    return (
        <section className="py-40" style={{ background: T.surf }}>
            <div
                className="mx-auto px-8 text-center"
                style={{ maxWidth: '900px' }}
                data-reveal data-y="40"
            >
                <GoldRule className="mx-auto mb-12" />

                <blockquote
                    className="font-light leading-relaxed mb-10"
                    style={{
                        fontFamily:    "'Playfair Display', Georgia, serif",
                        fontSize:      'clamp(1.4rem, 2.8vw, 2.1rem)',
                        color:         T.txt,
                        letterSpacing: '-0.01em',
                    }}
                >
                    "There is a particular kind of stillness at asuraHOTEL — the kind that only
                    exists when every last detail has been attended to with love. I have stayed
                    in the finest hotels on four continents. This is my favourite."
                </blockquote>

                <GoldRule className="mx-auto mb-6" />

                <p className="text-[10px] tracking-[0.4em] uppercase mb-3" style={{ color: T.muted }}>
                    Isabelle Fontaine — Paris, France
                </p>
                <div className="flex justify-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} style={{ color: T.gold, fontSize: '0.65rem' }}>★</span>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ─────────────────────────────────────────────────────────────
   Reserve CTA banner
───────────────────────────────────────────────────────────── */
function ReserveSection() {
    return (
        <section id="reserve" className="relative py-44 overflow-hidden">
            {/* BG */}
            <div className="absolute inset-0">
                <img src={IMG.hero} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: 'rgba(8,8,10,0.90)' }} />
                {/* Subtle gold glow */}
                <div
                    className="absolute inset-0"
                    style={{ background: `radial-gradient(ellipse at center, ${T.gold}0D 0%, transparent 65%)` }}
                />
            </div>

            <div
                className="relative z-10 mx-auto px-8 text-center"
                style={{ maxWidth: '1440px' }}
                data-reveal data-y="40"
            >
                <SectionLabel>Your Escape Awaits</SectionLabel>
                <h2
                    className="font-light leading-tight mb-6"
                    style={{
                        fontFamily:    "'Playfair Display', Georgia, serif",
                        fontSize:      'clamp(2.8rem, 5.5vw, 4.75rem)',
                        color:         T.txt,
                        letterSpacing: '-0.02em',
                    }}
                >
                    A Stay Unlike<br />
                    <em style={{ fontStyle: 'italic', color: T.goldL }}>Any Other</em>
                </h2>
                <p className="text-base mb-12 mx-auto" style={{ color: T.muted, maxWidth: '420px' }}>
                    Begin your journey. Reserve your suite and allow us to craft
                    an experience that lingers long after you leave.
                </p>
                <a
                    href="#"
                    className="inline-flex items-center gap-3 text-[11px] tracking-[0.35em] uppercase px-12 py-5 transition-all duration-300"
                    style={{ background: T.gold, color: T.bg, fontWeight: 600, textDecoration: 'none' }}
                    onMouseEnter={e => e.currentTarget.style.background = T.goldL}
                    onMouseLeave={e => e.currentTarget.style.background = T.gold}
                >
                    Reserve Now <ArrowRight size={13} />
                </a>
            </div>
        </section>
    );
}

/* ─────────────────────────────────────────────────────────────
   Footer
───────────────────────────────────────────────────────────── */
const FOOTER_LINKS = ['Rooms & Suites', 'Dining', 'Spa & Wellness', 'Events', 'Gallery', 'About Us', 'Press'];

function Footer() {
    return (
        <footer style={{ background: T.surf, borderTop: `1px solid ${T.border}` }}>
            {/* Main grid */}
            <div
                className="mx-auto px-8 py-20 grid grid-cols-1 md:grid-cols-3 gap-16"
                style={{ maxWidth: '1440px' }}
            >
                {/* Brand */}
                <div>
                    <p
                        className="font-extralight text-xl tracking-[0.45em] uppercase mb-6"
                        style={{ color: T.txt }}
                    >
                        asura<span style={{ color: T.gold }}>HOTEL</span>
                    </p>
                    <p className="text-sm leading-relaxed mb-8" style={{ color: T.muted }}>
                        A Forbes Five‑Star property redefining the boundaries of luxury
                        hospitality in the heart of the metropolitan district.
                    </p>
                    <div className="flex gap-3">
                        {['IG', 'TW', 'FB'].map((s) => (
                            <a
                                key={s}
                                href="#"
                                className="w-9 h-9 flex items-center justify-center text-[9px] tracking-widest transition-all duration-200"
                                style={{ border: `1px solid ${T.border}`, color: T.muted, textDecoration: 'none' }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.borderColor = T.gold;
                                    e.currentTarget.style.color = T.gold;
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.borderColor = T.border;
                                    e.currentTarget.style.color = T.muted;
                                }}
                            >
                                {s}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Quick links */}
                <div>
                    <p className="text-[9px] tracking-[0.45em] uppercase mb-6" style={{ color: T.gold }}>
                        Navigate
                    </p>
                    {FOOTER_LINKS.map((lnk) => (
                        <a
                            key={lnk}
                            href="#"
                            className="block text-sm mb-3 transition-colors duration-200"
                            style={{ color: T.muted, textDecoration: 'none' }}
                            onMouseEnter={e => e.currentTarget.style.color = T.txt}
                            onMouseLeave={e => e.currentTarget.style.color = T.muted}
                        >
                            {lnk}
                        </a>
                    ))}
                </div>

                {/* Contact */}
                <div>
                    <p className="text-[9px] tracking-[0.45em] uppercase mb-6" style={{ color: T.gold }}>
                        Contact
                    </p>
                    <div className="flex items-start gap-3 mb-4">
                        <MapPin size={13} style={{ color: T.gold, marginTop: '2px', flexShrink: 0 }} />
                        <p className="text-sm leading-relaxed" style={{ color: T.muted }}>
                            1 Prestige Boulevard<br />
                            Metropolitan District, 10001
                        </p>
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                        <Phone size={13} style={{ color: T.gold }} />
                        <a
                            href="tel:+12345678900"
                            className="text-sm"
                            style={{ color: T.muted, textDecoration: 'none' }}
                        >
                            +1 (234) 567‑8900
                        </a>
                    </div>
                    <div className="flex items-center gap-3 mb-10">
                        <Mail size={13} style={{ color: T.gold }} />
                        <a
                            href="mailto:concierge@asurahotel.com"
                            className="text-sm"
                            style={{ color: T.muted, textDecoration: 'none' }}
                        >
                            concierge@asurahotel.com
                        </a>
                    </div>
                    <a
                        href="#reserve"
                        className="inline-flex items-center gap-2 text-[10px] tracking-[0.35em] uppercase px-6 py-3 transition-all duration-300"
                        style={{ border: `1px solid ${T.gold}`, color: T.gold, textDecoration: 'none' }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = T.gold;
                            e.currentTarget.style.color = T.bg;
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = T.gold;
                        }}
                    >
                        Make a Reservation <ArrowRight size={11} />
                    </a>
                </div>
            </div>

            {/* Bottom bar */}
            <div style={{ borderTop: `1px solid ${T.border}` }}>
                <div
                    className="mx-auto px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4"
                    style={{ maxWidth: '1440px' }}
                >
                    <p className="text-[9px] tracking-[0.3em]" style={{ color: T.muted }}>
                        © 2026 asuraHOTEL. All rights reserved.
                    </p>
                    <div className="flex gap-8">
                        {['Privacy Policy', 'Terms & Conditions', 'Cookie Preferences'].map((lnk) => (
                            <a
                                key={lnk}
                                href="#"
                                className="text-[9px] tracking-[0.25em] uppercase transition-colors duration-200"
                                style={{ color: T.muted, textDecoration: 'none' }}
                                onMouseEnter={e => e.currentTarget.style.color = T.txt}
                                onMouseLeave={e => e.currentTarget.style.color = T.muted}
                            >
                                {lnk}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}

/* ─────────────────────────────────────────────────────────────
   Page root
───────────────────────────────────────────────────────────── */
export default function HomeV2() {
    useReveal();

    return (
        <div style={{ background: T.bg, overflowX: 'hidden' }}>
            <Head>
                <title>asuraHOTEL — Luxury Collection</title>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,300;0,400;0,500;1,300;1,400&display=swap"
                    rel="stylesheet"
                />
            </Head>

            <Navbar />
            <Hero />
            <StatsStrip />
            <RoomsSection />
            <StorySection />
            <AmenitiesSection />
            <TestimonialSection />
            <ReserveSection />
            <Footer />
        </div>
    );
}

// No layout wrapper — this page owns its own full-page shell
HomeV2.layout = (page) => page;
