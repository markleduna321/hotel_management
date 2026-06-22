/**
 * BookingBar — Glassmorphic booking widget.
 *
 * Two display modes:
 *  • Full   — centred hero card at bottom of viewport (Stage 0, before scroll)
 *  • Compact — thin sticky strip at top of viewport (after first scroll)
 */

import { useDispatch, useSelector } from 'react-redux';
import { CalendarDays, Users, ChevronDown, ChevronUp, Search } from 'lucide-react';
import {
    setCheckIn,
    setCheckOut,
    setGuestCount,
} from '../../../features/booking/bookingSlice';

/** Format "2026-06-25" → "Jun 25" */
function fmtDate(iso) {
    if (!iso) return null;
    const d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/** Compact summary string for the minimised bar */
function summaryText(checkIn, checkOut, guestCount) {
    const ci = fmtDate(checkIn)  ?? 'Check-in';
    const co = fmtDate(checkOut) ?? 'Check-out';
    return `${ci} – ${co}  ·  ${guestCount} Guest${guestCount !== 1 ? 's' : ''}`;
}

// ─────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────

function DateField({ label, value, onChange, min }) {
    return (
        <div className="flex flex-col gap-1 flex-1 min-w-[140px]">
            <label className="text-white/50 text-[10px] uppercase tracking-[0.2em] flex items-center gap-1.5">
                <CalendarDays size={11} />
                {label}
            </label>
            <input
                type="date"
                value={value ?? ''}
                min={min}
                onChange={(e) => onChange(e.target.value || null)}
                className="
                    bg-transparent border-0 border-b border-white/20
                    text-white text-sm font-light tracking-wide
                    py-1 px-0 focus:outline-none focus:border-amber-400/60
                    transition-colors duration-200
                    [color-scheme:dark]
                "
            />
        </div>
    );
}

function GuestSelector({ value, onChange }) {
    return (
        <div className="flex flex-col gap-1 min-w-[110px]">
            <label className="text-white/50 text-[10px] uppercase tracking-[0.2em] flex items-center gap-1.5">
                <Users size={11} />
                Guests
            </label>
            <div className="flex items-center gap-2 border-b border-white/20 py-1">
                <button
                    type="button"
                    onClick={() => onChange(Math.max(1, value - 1))}
                    className="text-white/60 hover:text-amber-400 transition-colors"
                    aria-label="Decrease guest count"
                >
                    <ChevronDown size={16} />
                </button>
                <span className="text-white text-sm font-light w-5 text-center select-none">
                    {value}
                </span>
                <button
                    type="button"
                    onClick={() => onChange(Math.min(10, value + 1))}
                    className="text-white/60 hover:text-amber-400 transition-colors"
                    aria-label="Increase guest count"
                >
                    <ChevronUp size={16} />
                </button>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// Main export
// ─────────────────────────────────────────────────────────────

export default function BookingBar({ minimized, visible }) {
    const dispatch   = useDispatch();
    const { checkIn, checkOut, guestCount } = useSelector((s) => s.booking);

    const today = new Date().toISOString().split('T')[0];

    if (!visible) return null;

    // ── COMPACT MODE ──────────────────────────────────────────
    if (minimized) {
        return (
            <div
                className="
                    absolute top-0 left-0 right-0 pointer-events-auto
                    bg-black/40 backdrop-blur-md border-b border-white/10
                    transition-all duration-500
                "
            >
                <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-white/60 text-xs tracking-widest">
                        <CalendarDays size={13} className="text-amber-400/70" />
                        <span>{summaryText(checkIn, checkOut, guestCount)}</span>
                    </div>
                    <button
                        type="button"
                        className="
                            flex items-center gap-2 px-4 py-1.5 rounded-full
                            bg-amber-500/80 hover:bg-amber-400
                            text-black text-xs font-medium tracking-widest
                            transition-colors duration-200
                        "
                    >
                        <Search size={12} />
                        CHECK AVAILABILITY
                    </button>
                </div>
            </div>
        );
    }

    // ── FULL HERO MODE ────────────────────────────────────────
    return (
        <div
            className="
                absolute bottom-10 left-12 md:left-20
                pointer-events-auto
                transition-all duration-700 ease-out
            "
        >
            {/* Section label */}
            <p className="text-white/25 text-[9px] tracking-[0.35em] uppercase mb-3">
                Plan Your Stay
            </p>

            {/* Glassmorphic booking card */}
            <div
                className="
                    rounded-xl px-5 py-4
                    bg-white/8 backdrop-blur-xl
                    border border-white/12
                    shadow-[0_16px_48px_rgba(0,0,0,0.75)]
                    flex flex-col sm:flex-row items-end gap-5
                "
            >
                <DateField
                    label="Check-In"
                    value={checkIn}
                    min={today}
                    onChange={(v) => dispatch(setCheckIn(v))}
                />
                {/* Divider */}
                <div className="hidden sm:block w-px h-10 bg-white/15 self-center" />
                <DateField
                    label="Check-Out"
                    value={checkOut}
                    min={checkIn ?? today}
                    onChange={(v) => dispatch(setCheckOut(v))}
                />
                {/* Divider */}
                <div className="hidden sm:block w-px h-10 bg-white/15 self-center" />
                <GuestSelector
                    value={guestCount}
                    onChange={(v) => dispatch(setGuestCount(v))}
                />

                <button
                    type="button"
                    className="
                        flex items-center gap-2 px-6 py-3 rounded-xl
                        bg-amber-500 hover:bg-amber-400
                        text-black text-xs font-semibold tracking-[0.2em] uppercase
                        transition-all duration-200
                        shadow-lg shadow-amber-900/40
                        whitespace-nowrap
                    "
                >
                    <Search size={14} />
                    Check Availability
                </button>
            </div>

            {/* Scroll indicator */}
            <div className="flex items-center gap-3 mt-5">
                <div className="h-px w-10 bg-white/15" />
                <div className="flex items-center gap-2 animate-bounce">
                    <svg width="14" height="20" viewBox="0 0 14 20" fill="none" className="opacity-30">
                        <rect x="5.5" y="0.5" width="3" height="19" rx="1.5" stroke="white" strokeWidth="1" />
                        <circle cx="7" cy="5" r="1.8" fill="white">
                            <animate attributeName="cy" values="5;13;5" dur="2s" repeatCount="indefinite" />
                        </circle>
                    </svg>
                    <span className="text-white/25 text-[8px] tracking-[0.4em] uppercase">Scroll to explore</span>
                </div>
            </div>
        </div>
    );
}
