/**
 * RoomDetailPanel — Stage 2-3 slide-in suite showcase panel.
 *
 * Slides in from the right when the camera enters the suite.
 * Shows live dynamic pricing, room specs, and amenities.
 * Navigation arrows let users cycle through 4 room types, which
 * also drives the 3D scene's atmospheric palette swap.
 */

import { useDispatch, useSelector } from 'react-redux';
import {
    Maximize2, BedDouble, Layers, Star,
    ChevronLeft, ChevronRight, Wifi, Coffee,
    Dumbbell, Car, Wind, Bath,
} from 'lucide-react';
import { setSelectedRoom } from '../../../features/booking/bookingSlice';

// ─────────────────────────────────────────────────────────────
// Room data
// ─────────────────────────────────────────────────────────────

const ROOMS = [
    {
        id: 0,
        name: 'Deluxe King',
        category: 'Superior Room',
        floor: '8th – 14th Floor',
        size: '42 m²',
        bedType: 'King Bed',
        maxGuests: 2,
        pricePerNight: 280,
        currency: 'USD',
        rating: 4.8,
        view: 'City Panorama',
        palette: 'amber',
        amenities: [
            { icon: Wifi,    label: 'High-Speed Wi-Fi' },
            { icon: Coffee,  label: 'Nespresso Machine' },
            { icon: Bath,    label: 'Rainfall Shower' },
            { icon: Wind,    label: 'Climate Control' },
        ],
        highlight: 'Floor-to-ceiling windows with sweeping city views.',
    },
    {
        id: 1,
        name: 'Executive Suite',
        category: 'Suite',
        floor: '22nd – 28th Floor',
        size: '78 m²',
        bedType: 'King + Sofa Bed',
        maxGuests: 3,
        pricePerNight: 550,
        currency: 'USD',
        rating: 4.9,
        view: 'Skyline & Bay',
        palette: 'blue',
        amenities: [
            { icon: Wifi,     label: 'Dedicated Gigabit' },
            { icon: Dumbbell, label: 'Private Gym Access' },
            { icon: Bath,     label: 'Soaking Tub + Shower' },
            { icon: Star,     label: 'Butler Service' },
        ],
        highlight: 'Separate living area with panoramic bay terrace.',
    },
    {
        id: 2,
        name: 'Premier Ocean View',
        category: 'Deluxe Suite',
        floor: '15th – 21st Floor',
        size: '56 m²',
        bedType: 'Twin King',
        maxGuests: 4,
        pricePerNight: 390,
        currency: 'USD',
        rating: 4.9,
        view: 'Ocean Horizon',
        palette: 'teal',
        amenities: [
            { icon: Wifi,   label: 'Hi-Speed Wi-Fi' },
            { icon: Coffee, label: 'Espresso Bar' },
            { icon: Car,    label: 'Valet Parking' },
            { icon: Bath,   label: 'Private Balcony Tub' },
        ],
        highlight: 'Private balcony overlooking the ocean at sunrise.',
    },
    {
        id: 3,
        name: 'Presidential Suite',
        category: 'Penthouse',
        floor: '35th – 38th (Penthouse)',
        size: '220 m²',
        bedType: 'Super King',
        maxGuests: 6,
        pricePerNight: 2400,
        currency: 'USD',
        rating: 5.0,
        view: '360° City & Ocean',
        palette: 'gold',
        amenities: [
            { icon: Star,     label: '24-Hour Butler' },
            { icon: Dumbbell, label: 'Private Pool' },
            { icon: Car,      label: 'Chauffeur Transfer' },
            { icon: Bath,     label: 'Spa Suite Ensuite' },
        ],
        highlight: 'Dedicated dining room, private pool, and rooftop terrace.',
    },
];

const PALETTE_ACCENT = {
    amber: { badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30', cta: 'bg-amber-500 hover:bg-amber-400 shadow-amber-900/50', star: 'text-amber-400', line: 'bg-amber-500/40' },
    blue:  { badge: 'bg-sky-500/20 text-sky-300 border-sky-500/30',       cta: 'bg-sky-500 hover:bg-sky-400 shadow-sky-900/50',       star: 'text-sky-400',   line: 'bg-sky-500/40' },
    teal:  { badge: 'bg-teal-500/20 text-teal-300 border-teal-500/30',    cta: 'bg-teal-500 hover:bg-teal-400 shadow-teal-900/50',    star: 'text-teal-400',  line: 'bg-teal-500/40' },
    gold:  { badge: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30', cta: 'bg-yellow-500 hover:bg-yellow-400 shadow-yellow-900/50', star: 'text-yellow-400', line: 'bg-yellow-500/40' },
};

// ─────────────────────────────────────────────────────────────
// Sub-component: amenity pill
// ─────────────────────────────────────────────────────────────

function AmenityTag({ icon: Icon, label }) {
    return (
        <div className="flex items-center gap-2 text-white/60 text-[11px]">
            <Icon size={12} strokeWidth={1.5} className="text-white/40 flex-shrink-0" />
            {label}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// Main export
// ─────────────────────────────────────────────────────────────

export default function RoomDetailPanel({ visible, stage }) {
    const dispatch   = useDispatch();
    const { selectedRoomIndex, checkIn, checkOut } = useSelector((s) => s.booking);
    const room   = ROOMS[selectedRoomIndex];
    const accent = PALETTE_ACCENT[room.palette];

    function prev() {
        dispatch(setSelectedRoom((selectedRoomIndex - 1 + ROOMS.length) % ROOMS.length));
    }
    function next() {
        dispatch(setSelectedRoom((selectedRoomIndex + 1) % ROOMS.length));
    }

    // Compute nights if dates set
    const nights = (() => {
        if (!checkIn || !checkOut) return null;
        const ms = new Date(checkOut) - new Date(checkIn);
        return Math.max(1, Math.round(ms / 86_400_000));
    })();

    return (
        <div
            className={`
                absolute top-1/2 right-0 -translate-y-1/2
                w-[340px] max-h-[88vh]
                pointer-events-auto
                flex flex-col
                rounded-l-3xl overflow-hidden
                bg-black/55 backdrop-blur-2xl
                border-l border-t border-b border-white/10
                shadow-[-20px_0_60px_rgba(0,0,0,0.6)]
                transition-all duration-700 ease-out
                ${visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
            `}
        >
            {/* ── Room carousel nav header ── */}
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-white/8">
                <div>
                    <p className="text-white/35 text-[9px] tracking-[0.3em] uppercase">
                        Room {selectedRoomIndex + 1} of {ROOMS.length}
                    </p>
                    <p className={`text-[10px] tracking-[0.2em] uppercase mt-0.5 ${accent.star}`}>
                        {room.category}
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={prev}
                        className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center text-white/50 hover:text-white hover:border-white/40 transition-all duration-200"
                        aria-label="Previous room"
                    >
                        <ChevronLeft size={15} />
                    </button>
                    <button
                        type="button"
                        onClick={next}
                        className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center text-white/50 hover:text-white hover:border-white/40 transition-all duration-200"
                        aria-label="Next room"
                    >
                        <ChevronRight size={15} />
                    </button>
                </div>
            </div>

            {/* ── Scrollable body ── */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5 space-y-5">

                {/* Room name */}
                <div>
                    <h2 className="text-white text-2xl font-light tracking-wide leading-tight">
                        {room.name}
                    </h2>
                    <p className="text-white/40 text-xs mt-1 tracking-widest">{room.floor}</p>
                </div>

                {/* Specs row */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="flex flex-col items-center gap-1 rounded-xl bg-white/5 border border-white/8 py-3">
                        <Maximize2 size={13} className="text-white/35" />
                        <span className="text-white text-xs font-medium">{room.size}</span>
                        <span className="text-white/30 text-[9px] uppercase tracking-wider">Size</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 rounded-xl bg-white/5 border border-white/8 py-3">
                        <BedDouble size={13} className="text-white/35" />
                        <span className="text-white text-[10px] font-medium text-center leading-tight">{room.bedType}</span>
                        <span className="text-white/30 text-[9px] uppercase tracking-wider">Bed</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 rounded-xl bg-white/5 border border-white/8 py-3">
                        <Layers size={13} className="text-white/35" />
                        <span className="text-white text-xs font-medium">{room.view.split(' ')[0]}</span>
                        <span className="text-white/30 text-[9px] uppercase tracking-wider">View</span>
                    </div>
                </div>

                {/* Highlight */}
                <div className={`rounded-xl px-4 py-3 border ${accent.badge} text-xs leading-relaxed`}>
                    {room.highlight}
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                                key={i}
                                size={11}
                                className={i < Math.floor(room.rating) ? accent.star : 'text-white/15'}
                                fill={i < Math.floor(room.rating) ? 'currentColor' : 'none'}
                            />
                        ))}
                    </div>
                    <span className="text-white/40 text-xs">{room.rating.toFixed(1)}</span>
                </div>

                {/* Separator */}
                <div className={`h-px w-full ${accent.line}`} />

                {/* Amenities */}
                <div>
                    <p className="text-white/30 text-[9px] tracking-[0.25em] uppercase mb-3">Included</p>
                    <div className="grid grid-cols-2 gap-y-3">
                        {room.amenities.map((a) => (
                            <AmenityTag key={a.label} icon={a.icon} label={a.label} />
                        ))}
                    </div>
                </div>

                {/* Separator */}
                <div className={`h-px w-full ${accent.line}`} />

                {/* Live dynamic pricing */}
                <div>
                    <p className="text-white/30 text-[9px] tracking-[0.25em] uppercase mb-2">Rate</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-white text-3xl font-light">
                            ${room.pricePerNight.toLocaleString()}
                        </span>
                        <span className="text-white/40 text-xs">/ night</span>
                    </div>
                    {nights !== null && (
                        <div className="mt-1 flex items-center gap-2">
                            <span className="text-white/50 text-xs">{nights} night{nights !== 1 ? 's' : ''}</span>
                            <span className="text-white/20 text-xs">·</span>
                            <span className="text-white/70 text-sm font-medium">
                                ${(room.pricePerNight * nights).toLocaleString()} total
                            </span>
                        </div>
                    )}
                    <p className="text-white/25 text-[10px] mt-1">Taxes & fees not included.</p>
                </div>
            </div>

            {/* ── CTA footer ── */}
            <div className="px-5 pb-5 pt-4 border-t border-white/8">
                <button
                    type="button"
                    className={`
                        w-full py-3.5 rounded-xl
                        ${accent.cta}
                        text-black text-xs font-bold tracking-[0.2em] uppercase
                        shadow-lg transition-all duration-200
                    `}
                >
                    Book This Suite
                </button>
                <p className="text-white/20 text-[9px] text-center mt-2 tracking-wider">
                    Free cancellation · Best rate guaranteed
                </p>
            </div>
        </div>
    );
}
