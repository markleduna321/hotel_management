/**
 * ExperienceCards — Stage 1 (Lobby) interactive amenity hotspots.
 *
 * Three cards fade into the lower third of the screen as the camera
 * settles inside the grand lobby.  Each card acts as an interactive
 * hotspot that mimics the 3D overlay concept from the design spec.
 */

import { Waves, UtensilsCrossed, Bell } from 'lucide-react';

const EXPERIENCES = [
    {
        id: 'spa',
        icon: Waves,
        title: 'The Asura Spa',
        subtitle: 'Wellness & Restoration',
        description: 'Six treatment rooms, a thermal pool, and bespoke programmes curated by world-renowned therapists.',
        accent: 'from-teal-900/60 to-teal-800/40',
        border: 'border-teal-500/20',
        iconColor: 'text-teal-400',
        dot: 'bg-teal-400',
    },
    {
        id: 'dining',
        icon: UtensilsCrossed,
        title: 'Étoile Restaurant',
        subtitle: 'Fine Dining',
        description: 'A Michelin-starred kitchen celebrating the finest seasonal ingredients with theatrical presentation.',
        accent: 'from-amber-900/60 to-amber-800/40',
        border: 'border-amber-500/20',
        iconColor: 'text-amber-400',
        dot: 'bg-amber-400',
    },
    {
        id: 'concierge',
        icon: Bell,
        title: 'Personal Concierge',
        subtitle: '24-Hour Service',
        description: 'Your dedicated concierge handles every request — from private transfers to bespoke city itineraries.',
        accent: 'from-purple-900/60 to-purple-800/40',
        border: 'border-purple-500/20',
        iconColor: 'text-purple-400',
        dot: 'bg-purple-400',
    },
];

export default function ExperienceCards({ visible }) {
    return (
        <div
            className={`
                absolute bottom-8 left-0 right-0
                flex justify-center gap-4 px-6
                pointer-events-none
                transition-all duration-700 ease-out
                ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
            `}
        >
            {EXPERIENCES.map((exp, idx) => {
                const Icon = exp.icon;
                return (
                    <div
                        key={exp.id}
                        className={`
                            pointer-events-auto
                            relative flex-1 max-w-[280px]
                            rounded-2xl px-5 py-5
                            bg-gradient-to-br ${exp.accent}
                            backdrop-blur-xl
                            border ${exp.border}
                            shadow-[0_8px_32px_rgba(0,0,0,0.5)]
                            transition-all duration-500 ease-out
                            hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(0,0,0,0.6)]
                            cursor-default
                        `}
                        style={{ transitionDelay: `${idx * 80}ms` }}
                    >
                        {/* Hotspot indicator dot */}
                        <span className={`
                            absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full
                            ${exp.dot} opacity-80
                            shadow-[0_0_10px_2px] shadow-current
                            animate-pulse
                        `} />

                        <div className={`mb-3 ${exp.iconColor}`}>
                            <Icon size={20} strokeWidth={1.5} />
                        </div>

                        <h3 className="text-white text-sm font-medium tracking-wide mb-0.5">
                            {exp.title}
                        </h3>
                        <p className="text-white/40 text-[10px] tracking-[0.2em] uppercase mb-3">
                            {exp.subtitle}
                        </p>
                        <p className="text-white/65 text-xs leading-relaxed font-light">
                            {exp.description}
                        </p>

                        <button
                            type="button"
                            className="
                                mt-4 text-[10px] tracking-[0.25em] uppercase
                                text-white/40 hover:text-white/80
                                transition-colors duration-200
                                flex items-center gap-1.5
                            "
                        >
                            Explore
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                );
            })}
        </div>
    );
}
