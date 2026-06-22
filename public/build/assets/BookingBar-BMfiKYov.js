import{j as e}from"./three-vendor-DRJMAyi6.js";import{u as p,a as u}from"./redux-vendor-COntyn5G.js";import{s as b,a as g,b as k}from"./app-8w1QgZZM.js";import{c}from"./createLucideIcon-T7x9mhF8.js";/**
 * @license lucide-react v1.21.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const f=[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}],["path",{d:"M8 14h.01",key:"6423bh"}],["path",{d:"M12 14h.01",key:"1etili"}],["path",{d:"M16 14h.01",key:"1gbofw"}],["path",{d:"M8 18h.01",key:"lrp35t"}],["path",{d:"M12 18h.01",key:"mhygvu"}],["path",{d:"M16 18h.01",key:"kzsmim"}]],m=c("calendar-days",f);/**
 * @license lucide-react v1.21.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y=[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]],j=c("chevron-down",y);/**
 * @license lucide-react v1.21.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const w=[["path",{d:"m18 15-6-6-6 6",key:"153udz"}]],v=c("chevron-up",w);/**
 * @license lucide-react v1.21.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const N=[["path",{d:"m21 21-4.34-4.34",key:"14j7rj"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}]],h=c("search",N);/**
 * @license lucide-react v1.21.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const C=[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["path",{d:"M16 3.128a4 4 0 0 1 0 7.744",key:"16gr8j"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}]],M=c("users",C);function x(t){return t?new Date(t+"T00:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric"}):null}function _(t,s,n){const r=x(t)??"Check-in",i=x(s)??"Check-out";return`${r} – ${i}  ·  ${n} Guest${n!==1?"s":""}`}function d({label:t,value:s,onChange:n,min:r}){return e.jsxs("div",{className:"flex flex-col gap-1 flex-1 min-w-[140px]",children:[e.jsxs("label",{className:"text-white/50 text-[10px] uppercase tracking-[0.2em] flex items-center gap-1.5",children:[e.jsx(m,{size:11}),t]}),e.jsx("input",{type:"date",value:s??"",min:r,onChange:i=>n(i.target.value||null),className:`\r
                    bg-transparent border-0 border-b border-white/20\r
                    text-white text-sm font-light tracking-wide\r
                    py-1 px-0 focus:outline-none focus:border-amber-400/60\r
                    transition-colors duration-200\r
                    [color-scheme:dark]\r
                `})]})}function z({value:t,onChange:s}){return e.jsxs("div",{className:"flex flex-col gap-1 min-w-[110px]",children:[e.jsxs("label",{className:"text-white/50 text-[10px] uppercase tracking-[0.2em] flex items-center gap-1.5",children:[e.jsx(M,{size:11}),"Guests"]}),e.jsxs("div",{className:"flex items-center gap-2 border-b border-white/20 py-1",children:[e.jsx("button",{type:"button",onClick:()=>s(Math.max(1,t-1)),className:"text-white/60 hover:text-amber-400 transition-colors","aria-label":"Decrease guest count",children:e.jsx(j,{size:16})}),e.jsx("span",{className:"text-white text-sm font-light w-5 text-center select-none",children:t}),e.jsx("button",{type:"button",onClick:()=>s(Math.min(10,t+1)),className:"text-white/60 hover:text-amber-400 transition-colors","aria-label":"Increase guest count",children:e.jsx(v,{size:16})})]})]})}function A({minimized:t,visible:s}){const n=p(),{checkIn:r,checkOut:i,guestCount:o}=u(a=>a.booking),l=new Date().toISOString().split("T")[0];return s?t?e.jsx("div",{className:`\r
                    absolute top-0 left-0 right-0 pointer-events-auto\r
                    bg-black/40 backdrop-blur-md border-b border-white/10\r
                    transition-all duration-500\r
                `,children:e.jsxs("div",{className:"max-w-5xl mx-auto px-6 py-3 flex items-center justify-between gap-4",children:[e.jsxs("div",{className:"flex items-center gap-2 text-white/60 text-xs tracking-widest",children:[e.jsx(m,{size:13,className:"text-amber-400/70"}),e.jsx("span",{children:_(r,i,o)})]}),e.jsxs("button",{type:"button",className:`\r
                            flex items-center gap-2 px-4 py-1.5 rounded-full\r
                            bg-amber-500/80 hover:bg-amber-400\r
                            text-black text-xs font-medium tracking-widest\r
                            transition-colors duration-200\r
                        `,children:[e.jsx(h,{size:12}),"CHECK AVAILABILITY"]})]})}):e.jsxs("div",{className:`\r
                absolute bottom-10 left-12 md:left-20\r
                pointer-events-auto\r
                transition-all duration-700 ease-out\r
            `,children:[e.jsx("p",{className:"text-white/25 text-[9px] tracking-[0.35em] uppercase mb-3",children:"Plan Your Stay"}),e.jsxs("div",{className:`\r
                    rounded-xl px-5 py-4\r
                    bg-white/8 backdrop-blur-xl\r
                    border border-white/12\r
                    shadow-[0_16px_48px_rgba(0,0,0,0.75)]\r
                    flex flex-col sm:flex-row items-end gap-5\r
                `,children:[e.jsx(d,{label:"Check-In",value:r,min:l,onChange:a=>n(b(a))}),e.jsx("div",{className:"hidden sm:block w-px h-10 bg-white/15 self-center"}),e.jsx(d,{label:"Check-Out",value:i,min:r??l,onChange:a=>n(g(a))}),e.jsx("div",{className:"hidden sm:block w-px h-10 bg-white/15 self-center"}),e.jsx(z,{value:o,onChange:a=>n(k(a))}),e.jsxs("button",{type:"button",className:`\r
                        flex items-center gap-2 px-6 py-3 rounded-xl\r
                        bg-amber-500 hover:bg-amber-400\r
                        text-black text-xs font-semibold tracking-[0.2em] uppercase\r
                        transition-all duration-200\r
                        shadow-lg shadow-amber-900/40\r
                        whitespace-nowrap\r
                    `,children:[e.jsx(h,{size:14}),"Check Availability"]})]}),e.jsxs("div",{className:"flex items-center gap-3 mt-5",children:[e.jsx("div",{className:"h-px w-10 bg-white/15"}),e.jsxs("div",{className:"flex items-center gap-2 animate-bounce",children:[e.jsxs("svg",{width:"14",height:"20",viewBox:"0 0 14 20",fill:"none",className:"opacity-30",children:[e.jsx("rect",{x:"5.5",y:"0.5",width:"3",height:"19",rx:"1.5",stroke:"white",strokeWidth:"1"}),e.jsx("circle",{cx:"7",cy:"5",r:"1.8",fill:"white",children:e.jsx("animate",{attributeName:"cy",values:"5;13;5",dur:"2s",repeatCount:"indefinite"})})]}),e.jsx("span",{className:"text-white/25 text-[8px] tracking-[0.4em] uppercase",children:"Scroll to explore"})]})]})]}):null}export{A as default};
