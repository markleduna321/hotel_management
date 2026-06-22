import{j as e}from"./three-vendor-DRJMAyi6.js";import{c as r}from"./createLucideIcon-T7x9mhF8.js";import"./redux-vendor-COntyn5G.js";/**
 * @license lucide-react v1.21.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const n=[["path",{d:"M10.268 21a2 2 0 0 0 3.464 0",key:"vwvbt9"}],["path",{d:"M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",key:"11g9vi"}]],s=r("bell",n);/**
 * @license lucide-react v1.21.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const l=[["path",{d:"m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8",key:"n7qcjb"}],["path",{d:"M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 2 .7 2.8 0L15 15Zm0 0 7 7",key:"d0u48b"}],["path",{d:"m2.1 21.8 6.4-6.3",key:"yn04lh"}],["path",{d:"m19 5-7 7",key:"194lzd"}]],c=r("utensils-crossed",l);/**
 * @license lucide-react v1.21.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const d=[["path",{d:"M2 12q2.5 2 5 0t5 0 5 0 5 0",key:"8ddzzs"}],["path",{d:"M2 19q2.5 2 5 0t5 0 5 0 5 0",key:"1wj4st"}],["path",{d:"M2 5q2.5 2 5 0t5 0 5 0 5 0",key:"69x50u"}]],p=r("waves-horizontal",d),h=[{id:"spa",icon:p,title:"The Asura Spa",subtitle:"Wellness & Restoration",description:"Six treatment rooms, a thermal pool, and bespoke programmes curated by world-renowned therapists.",accent:"from-teal-900/60 to-teal-800/40",border:"border-teal-500/20",iconColor:"text-teal-400",dot:"bg-teal-400"},{id:"dining",icon:c,title:"Étoile Restaurant",subtitle:"Fine Dining",description:"A Michelin-starred kitchen celebrating the finest seasonal ingredients with theatrical presentation.",accent:"from-amber-900/60 to-amber-800/40",border:"border-amber-500/20",iconColor:"text-amber-400",dot:"bg-amber-400"},{id:"concierge",icon:s,title:"Personal Concierge",subtitle:"24-Hour Service",description:"Your dedicated concierge handles every request — from private transfers to bespoke city itineraries.",accent:"from-purple-900/60 to-purple-800/40",border:"border-purple-500/20",iconColor:"text-purple-400",dot:"bg-purple-400"}];function x({visible:o}){return e.jsx("div",{className:`
                absolute bottom-8 left-0 right-0
                flex justify-center gap-4 px-6
                pointer-events-none
                transition-all duration-700 ease-out
                ${o?"opacity-100 translate-y-0":"opacity-0 translate-y-8"}
            `,children:h.map((t,a)=>{const i=t.icon;return e.jsxs("div",{className:`
                            pointer-events-auto
                            relative flex-1 max-w-[280px]
                            rounded-2xl px-5 py-5
                            bg-gradient-to-br ${t.accent}
                            backdrop-blur-xl
                            border ${t.border}
                            shadow-[0_8px_32px_rgba(0,0,0,0.5)]
                            transition-all duration-500 ease-out
                            hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(0,0,0,0.6)]
                            cursor-default
                        `,style:{transitionDelay:`${a*80}ms`},children:[e.jsx("span",{className:`
                            absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full
                            ${t.dot} opacity-80
                            shadow-[0_0_10px_2px] shadow-current
                            animate-pulse
                        `}),e.jsx("div",{className:`mb-3 ${t.iconColor}`,children:e.jsx(i,{size:20,strokeWidth:1.5})}),e.jsx("h3",{className:"text-white text-sm font-medium tracking-wide mb-0.5",children:t.title}),e.jsx("p",{className:"text-white/40 text-[10px] tracking-[0.2em] uppercase mb-3",children:t.subtitle}),e.jsx("p",{className:"text-white/65 text-xs leading-relaxed font-light",children:t.description}),e.jsxs("button",{type:"button",className:`\r
                                mt-4 text-[10px] tracking-[0.25em] uppercase\r
                                text-white/40 hover:text-white/80\r
                                transition-colors duration-200\r
                                flex items-center gap-1.5\r
                            `,children:["Explore",e.jsx("svg",{width:"12",height:"12",viewBox:"0 0 12 12",fill:"none",children:e.jsx("path",{d:"M2 6h8M7 3l3 3-3 3",stroke:"currentColor",strokeWidth:"1.2",strokeLinecap:"round",strokeLinejoin:"round"})})]})]},t.id)})})}export{x as default};
