const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/ScrollCanvas-BxiCMRDr.js","assets/three-vendor-DRJMAyi6.js","assets/redux-vendor-COntyn5G.js"])))=>i.map(i=>d[i]);
import{j as e,_}from"./three-vendor-DRJMAyi6.js";import{u as C,a as H,r as n}from"./redux-vendor-COntyn5G.js";import{s as M,H as O,L as m}from"./app-DpFa9P2B.js";import{g,S as b,P}from"./ScrollTrigger-Cp0w5KLF.js";import T from"./BookingBar-jgKyu-m4.js";import z from"./ExperienceCards-CSa2y4hk.js";import A from"./RoomDetailPanel-C5a8O9Aw.js";import{c as j}from"./createLucideIcon-T7x9mhF8.js";import"./chevron-down-DTRMEHSn.js";/**
 * @license lucide-react v1.21.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $=[["path",{d:"M4 5h16",key:"1tepv9"}],["path",{d:"M4 12h16",key:"1lakjw"}],["path",{d:"M4 19h16",key:"1djgab"}]],D=j("menu",$);/**
 * @license lucide-react v1.21.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const I=[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]],B=j("x",I),V=n.lazy(()=>_(()=>import("./ScrollCanvas-BxiCMRDr.js"),__vite__mapDeps([0,1,2])));g.registerPlugin(b);const c=[.2,.55,.7];function G(t){return t<c[0]?0:t<c[1]?1:t<c[2]?2:3}function F(t){const r=c[2];if(t<r)return 0;const a=(t-r)/(1-r);return Math.min(3,Math.floor(a*4))}const f=["Rooms","Dining","Spa","Events","Contact"];function U({scrolled:t}){const[r,a]=n.useState(!1);return e.jsxs("nav",{className:`
                absolute top-0 left-0 right-0 z-20
                flex items-center justify-between
                px-8 pt-6 pb-4
                transition-all duration-500
            `,children:[e.jsxs(m,{href:"/",className:"text-white font-extralight text-xl tracking-[0.45em] uppercase select-none",children:["asura",e.jsx("span",{className:"font-light text-amber-400",children:"HOTEL"})]}),e.jsx("ul",{className:"hidden md:flex gap-8 items-center",children:f.map(s=>e.jsx("li",{children:e.jsx("a",{href:`#${s.toLowerCase()}`,className:`\r
                                text-white/55 hover:text-white\r
                                text-[10px] tracking-[0.3em] uppercase\r
                                transition-colors duration-200\r
                            `,children:s})},s))}),e.jsxs("div",{className:"hidden md:flex items-center gap-3",children:[e.jsxs("a",{href:"tel:+1800ASURA01",className:"flex items-center gap-1.5 text-white/40 text-[10px] tracking-widest hover:text-white/70 transition-colors",children:[e.jsx(P,{size:11}),"+1 800 ASURA 01"]}),e.jsx("span",{className:"text-white/15",children:"|"}),e.jsx(m,{href:"/home-v2",className:`\r
                        text-white/40 hover:text-amber-400/70\r
                        text-[10px] tracking-widest uppercase\r
                        transition-colors duration-200\r
                    `,children:"Minimal View →"}),e.jsx("span",{className:"text-white/15",children:"|"}),e.jsx(m,{href:"/login",className:`\r
                        px-4 py-1.5 rounded-full\r
                        border border-white/20 hover:border-amber-400/50\r
                        text-white/60 hover:text-amber-400\r
                        text-[10px] tracking-widest uppercase\r
                        transition-all duration-200\r
                    `,children:"Sign In"})]}),e.jsx("button",{type:"button",className:"md:hidden text-white/60 hover:text-white transition-colors",onClick:()=>a(s=>!s),"aria-label":"Toggle navigation",children:r?e.jsx(B,{size:22}):e.jsx(D,{size:22})}),r&&e.jsx("div",{className:`\r
                    absolute top-full left-0 right-0\r
                    bg-black/80 backdrop-blur-xl\r
                    border-t border-white/10\r
                    px-8 py-6 flex flex-col gap-4\r
                `,children:f.map(s=>e.jsx("a",{href:`#${s.toLowerCase()}`,onClick:()=>a(!1),className:"text-white/70 text-sm tracking-widest uppercase",children:s},s))})]})}function K({visible:t}){return e.jsxs(e.Fragment,{children:[e.jsx("div",{className:`
                    absolute inset-0 pointer-events-none
                    transition-opacity duration-700
                    ${t?"opacity-100":"opacity-0"}
                `,style:{background:"linear-gradient(105deg, rgba(5,8,18,0.93) 0%, rgba(5,8,18,0.72) 28%, rgba(5,8,18,0.2) 52%, transparent 68%)"}}),e.jsxs("div",{className:`
                    absolute top-1/2 left-12 md:left-20
                    -translate-y-1/2
                    pointer-events-none max-w-[500px]
                    transition-all duration-700 ease-out
                    ${t?"opacity-100 translate-x-0":"opacity-0 -translate-x-10"}
                `,children:[e.jsx("div",{className:"w-px h-16 bg-gradient-to-b from-transparent via-amber-400/80 to-transparent mb-6"}),e.jsx("p",{className:"text-white/30 text-[9px] tracking-[0.55em] uppercase mb-5",children:"Luxury Redefined · Est. 2008"}),e.jsxs("h1",{className:"text-white font-thin leading-[0.88] uppercase text-5xl md:text-6xl lg:text-[5.5rem] tracking-[0.04em]",children:["Welcome",e.jsx("br",{}),"to"]}),e.jsxs("h2",{className:"text-amber-400 font-extralight leading-[0.88] uppercase mt-3 text-5xl md:text-6xl lg:text-[5.5rem] tracking-[0.18em]",children:["Asura",e.jsx("span",{className:"font-bold",children:"Hotel"})]}),e.jsxs("div",{className:"mt-8 flex items-center gap-4",children:[e.jsx("div",{className:"h-px w-10 bg-amber-400/50"}),e.jsx("p",{className:"text-white/25 text-[9px] tracking-[0.4em] uppercase",children:"Five-Star  ·  City Centre"})]})]})]})}function W({visible:t}){return e.jsxs("div",{className:`
                absolute top-12 left-10
                transition-all duration-700
                ${t?"opacity-100 translate-x-0":"opacity-0 -translate-x-8"}
                pointer-events-none
            `,children:[e.jsx("p",{className:"text-white/25 text-[9px] tracking-[0.4em] uppercase",children:"Grand Lobby"}),e.jsx("h3",{className:"text-white text-2xl font-thin tracking-widest mt-1",children:"The Grand Entrance"}),e.jsx("p",{className:"text-white/40 text-xs leading-relaxed mt-2 max-w-[220px] font-light",children:"An 18-metre soaring atrium of hand-laid Italian marble, framed by bespoke chandeliers from Venetian craftsmen."})]})}function X({visible:t,selectedRoomIndex:r}){const a=["Deluxe King Room","Executive Suite","Premier Ocean View","Presidential Suite"];return e.jsxs("div",{className:`
                absolute top-12 left-10
                transition-all duration-700
                ${t?"opacity-100 translate-x-0":"opacity-0 -translate-x-8"}
                pointer-events-none
            `,children:[e.jsx("p",{className:"text-white/25 text-[9px] tracking-[0.4em] uppercase",children:"Guest Suite"}),e.jsx("h3",{className:"text-white text-2xl font-thin tracking-widest mt-1",children:a[r]}),e.jsx("div",{className:"flex gap-1.5 mt-3",children:a.map((s,o)=>e.jsx("div",{className:`h-0.5 rounded-full transition-all duration-500 ${o===r?"w-8 bg-amber-400":"w-4 bg-white/20"}`},o))})]})}function q(){const t=C(),{selectedRoomIndex:r}=H(x=>x.booking),a=n.useRef(0),s=n.useRef(0),o=n.useRef(null),[i,v]=n.useState(0),[h,w]=n.useState(!1);n.useEffect(()=>{s.current=r},[r]),n.useEffect(()=>{const x=g.context(()=>{b.create({trigger:o.current,start:"top top",end:"bottom bottom",scrub:1.8,onUpdate(L){const l=L.progress;a.current=l;const d=F(l);d!==s.current&&(s.current=d,t(M(d)));const p=G(l);v(u=>u!==p?p:u),w(l>.03)}})});return()=>x.revert()},[t]);const N=i===0,k=i===1,y=i>=2,S=i===1,R=i>=2,E=i<=1;return e.jsxs(e.Fragment,{children:[e.jsx(O,{title:"asuraHOTEL — Luxury Redefined"}),e.jsx("div",{ref:o,style:{height:"500vh"},"aria-hidden":"true"}),e.jsx("div",{className:"fixed inset-0 z-0",children:e.jsx(n.Suspense,{fallback:e.jsx("div",{className:"w-full h-full bg-[#080c1a]"}),children:e.jsx(V,{scrollProgressRef:a,selectedRoomRef:s})})}),e.jsxs("div",{className:"fixed inset-0 z-10 pointer-events-none overflow-hidden",children:[e.jsx("div",{className:"pointer-events-auto",children:e.jsx(U,{scrolled:h})}),e.jsx(K,{visible:N}),e.jsx(T,{visible:E,minimized:h}),e.jsx(W,{visible:k}),e.jsx(z,{visible:S}),e.jsx(X,{visible:y,selectedRoomIndex:r}),e.jsx(A,{visible:R,stage:i})]})]})}q.layout=t=>t;export{q as default};
