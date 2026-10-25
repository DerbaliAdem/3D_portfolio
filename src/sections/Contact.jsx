import emailjs from "@emailjs/browser";
import PropTypes from "prop-types";
import { useEffect, useMemo, useRef, useState } from "react";
import { mySocials } from "../constants";
import SocialIcon from "../components/SocialIcon";

/* ---------- helpers ---------- */

// deterministic pseudo-random so the sky doesn't change on re-render
const rng = (seed) => {
  let s = seed;
  return () => (s = (s * 9301 + 49297) % 233280) / 233280;
};

// row of crystal-pine trees as a single SVG path
const treePath = (x0, x1, baseFn, h, seed) => {
  const r = rng(seed);
  let d = "";
  for (let x = x0; x < x1; x += 8 + r() * 11) {
    const th = h * (0.6 + r() * 0.8);
    const w = th * 0.34;
    const b = baseFn(x);
    d += `M${x - w / 2} ${b}L${x} ${b - th}L${x + w / 2} ${b}Z`;
  }
  return d;
};

const prefersReducedMotion = () =>
  typeof window !== "undefined" && !!window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const C = {
  bg: "#030305",
  ink: "#f4f4f8",
  muted: "#8d8ea8",
  accent: "#7cf0e0",
  line: "rgba(255,255,255,.12)",
};
const CONTACT_EMAIL = "adamderbali16@gmail.com";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap');
.sf-wrap{background:${C.bg};color:${C.ink};font-family:"Inter","Segoe UI",system-ui,sans-serif;position:relative;overflow:hidden;width:100vw;min-height:100vh;margin-left:calc(50% - 50vw);padding-top:clamp(3rem,8vh,6rem);box-sizing:border-box}
.sf-wrap.sf-reveal{opacity:0;transform:translateY(32px);transition:opacity .8s ease,transform .8s cubic-bezier(.2,.7,.2,1)}
.sf-wrap.sf-reveal.sf-visible{opacity:1;transform:translateY(0)}
.sf-scene{display:block;width:100%;height:auto}
.sf-body{max-width:1160px;margin:0 auto;padding:0 28px 32px;position:relative;margin-top:-110px}
.sf-top{display:grid;grid-template-columns:1.1fr 1fr;gap:56px;align-items:end}
.sf-title{font-family:"Space Grotesk","Inter",sans-serif;font-size:clamp(2.6rem,6.5vw,4.8rem);line-height:1.02;font-weight:700;margin:0;letter-spacing:-.03em;background:linear-gradient(100deg,#fff 0%,#b7b8d6 30%,#7cf0e0 50%,#b7b8d6 70%,#fff 100%);background-size:250% 100%;-webkit-background-clip:text;background-clip:text;color:transparent}
.sf-sub{color:${C.muted};margin:18px 0 0;max-width:38ch;line-height:1.7;font-size:.97rem}
.sf-card{background:linear-gradient(160deg,rgba(255,255,255,.07),rgba(255,255,255,.02));border:1px solid ${C.line};border-radius:20px;padding:28px;backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);box-shadow:0 30px 80px -30px rgba(124,240,224,.18),inset 0 1px 0 rgba(255,255,255,.08)}
.sf-card h3{font-family:"Space Grotesk","Inter",sans-serif;margin:0 0 18px;font-size:1.15rem;font-weight:600;letter-spacing:-.01em}
.sf-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.sf-field{display:block;margin-bottom:12px}
.sf-field span{display:block;font-size:.78rem;font-weight:500;color:${C.muted};margin-bottom:6px}
.sf-field input,.sf-field textarea{width:100%;box-sizing:border-box;background:rgba(0,0,0,.55);border:1px solid ${C.line};border-radius:10px;color:${C.ink};padding:12px 14px;font:inherit;font-size:.92rem;transition:border-color .2s,box-shadow .2s,transform .2s}
.sf-field textarea{resize:vertical;min-height:96px}
.sf-field input:focus,.sf-field textarea:focus{outline:none;border-color:${C.accent};box-shadow:0 0 0 3px rgba(124,240,224,.18);transform:translateY(-1px)}
.sf-btn{position:relative;overflow:hidden;width:100%;background:#fff;color:#07070c;border:0;border-radius:10px;padding:13px 22px;font:inherit;font-weight:600;font-size:.92rem;cursor:pointer;transition:transform .2s,box-shadow .2s}
.sf-btn::after{content:"";position:absolute;top:0;left:-60%;width:40%;height:100%;background:linear-gradient(100deg,transparent,rgba(124,240,224,.55),transparent);transform:skewX(-20deg);animation:sf-sweep 4.5s ease-in-out infinite}
.sf-btn:hover{transform:translateY(-2px);box-shadow:0 12px 34px -8px rgba(124,240,224,.55)}
.sf-btn:active{transform:translateY(0) scale(.99)}
.sf-btn:disabled{cursor:not-allowed;opacity:.55;transform:none;box-shadow:none}
.sf-btn:focus-visible{outline:2px solid ${C.accent};outline-offset:3px}
.sf-msg{font-size:.85rem;margin:12px 0 0;min-height:1.2em}
.sf-pop{animation:sf-rise .5s cubic-bezier(.2,.7,.2,1) both}
.sf-bottom{display:flex;justify-content:space-between;align-items:center;gap:32px;flex-wrap:wrap;margin-top:64px;padding-top:36px;border-top:1px solid ${C.line}}
.sf-links{display:flex;flex-wrap:wrap;gap:16px 36px}
.sf-links a{position:relative;color:#d5d5e6;text-decoration:none;font-size:.95rem;font-weight:500;padding:4px 0;transition:color .2s}
.sf-links a::after{content:"";position:absolute;left:0;bottom:-2px;height:1px;width:100%;background:${C.accent};transform:scaleX(0);transform-origin:left;transition:transform .3s}
.sf-links a:hover{color:${C.accent}}
.sf-links a:hover::after{transform:scaleX(1)}
.sf-links a:focus-visible,.sf-social a:focus-visible{outline:2px solid ${C.accent};outline-offset:4px;border-radius:4px}
.sf-meta{display:flex;justify-content:space-between;align-items:center;margin-top:30px;padding-top:18px;border-top:1px solid ${C.line};gap:16px;flex-wrap:wrap}
.sf-meta p{margin:0;font-size:.8rem;color:${C.muted}}
.sf-social{display:flex;gap:10px}
.sf-social a{color:#d5d5e6;display:inline-flex;width:38px;height:38px;align-items:center;justify-content:center;border:1px solid ${C.line};border-radius:50%;transition:color .2s,border-color .2s,background .2s,transform .25s}
.sf-social a:hover{color:${C.accent};border-color:${C.accent};background:rgba(124,240,224,.08);transform:translateY(-4px)}
.sf-logo{display:flex;align-items:center;gap:10px;font-family:"Space Grotesk","Inter",sans-serif;font-size:1.4rem;font-weight:600;letter-spacing:-.02em}
.sf-logo svg{animation:sf-spin 18s linear infinite}

@keyframes sf-twinkle{0%,100%{opacity:.15}50%{opacity:1}}
@keyframes sf-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes sf-shoot{0%{transform:translate(0,0);opacity:0}3%{opacity:1}12%{transform:translate(-360px,180px);opacity:0}100%{transform:translate(-360px,180px);opacity:0}}
@keyframes sf-drift{0%{transform:translateX(0)}100%{transform:translateX(-36px)}}
@keyframes sf-nebula{0%{transform:translateX(-26px);opacity:.45}50%{opacity:.95}100%{transform:translateX(26px);opacity:.45}}
@keyframes sf-breathe{0%,100%{transform:scale(1);opacity:.85}50%{transform:scale(1.08);opacity:1}}
@keyframes sf-glow{0%,100%{opacity:.15}50%{opacity:.42}}
@keyframes sf-flow{to{stroke-dashoffset:-56}}
@keyframes sf-rise-fly{0%{transform:translate(0,0);opacity:0}25%{opacity:1}100%{transform:translate(10px,-46px);opacity:0}}
@keyframes sf-rise{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes sf-shine{0%{background-position:150% 0}100%{background-position:-100% 0}}
@keyframes sf-sweep{0%,55%{left:-60%}100%{left:130%}}
@keyframes sf-spin{to{transform:rotate(360deg)}}

.sf-star{animation:sf-twinkle 4s ease-in-out infinite}
.sf-float{animation:sf-float 9s ease-in-out infinite}
.sf-shoot{animation:sf-shoot 12s linear infinite;opacity:0}
.sf-drift{animation:sf-drift 50s ease-in-out infinite alternate}
.sf-nebula{animation:sf-nebula 24s ease-in-out infinite alternate}
.sf-breathe{animation:sf-breathe 6s ease-in-out infinite;transform-box:fill-box;transform-origin:center}
.sf-riverglow{animation:sf-glow 5s ease-in-out infinite}
.sf-flow{stroke-dasharray:6 22;animation:sf-flow 2.4s linear infinite}
.sf-fly{animation:sf-rise-fly 6s ease-in infinite;opacity:0}
.sf-in{animation:sf-rise 1s cubic-bezier(.2,.7,.2,1) both}
.sf-title.sf-in{animation:sf-rise 1s cubic-bezier(.2,.7,.2,1) both,sf-shine 9s linear 1s infinite}

@media (max-width:820px){
  .sf-top{grid-template-columns:1fr;gap:30px}
  .sf-bottom{flex-direction:column;align-items:flex-start;gap:24px}
  .sf-body{margin-top:-60px}
  .sf-row{grid-template-columns:1fr}
}
@media (min-width:821px){
  .sf-scene{position:absolute;top:0;left:0;pointer-events:none}
  .sf-body{display:flex;flex:1;flex-direction:column;justify-content:space-between;margin-top:0;min-height:calc(100vh - clamp(3rem,8vh,6rem))}
  .sf-top{flex:1;align-items:center}
}
@media (prefers-reduced-motion:reduce){
  .sf-wrap.sf-reveal{opacity:1;transform:none;transition:none}
  .sf-star,.sf-float,.sf-shoot,.sf-drift,.sf-nebula,.sf-breathe,.sf-riverglow,.sf-flow,.sf-fly,.sf-in,.sf-title.sf-in,.sf-logo svg,.sf-btn::after,.sf-pop{animation:none}
  .sf-shoot,.sf-fly{opacity:0}
}
`;

/* ---------- scene ---------- */

const sparkle = (s) => `M0 ${-s}Q0 0 ${s} 0Q0 0 0 ${s}Q0 0 ${-s} 0Q0 0 0 ${-s}Z`;

const Shoot = ({ x, y, delay, dur }) => (
  <g className="sf-shoot" style={{ animationDelay: `${delay}s`, animationDuration: `${dur}s` }}>
    <line x1={x + 64} y1={y - 32} x2={x} y2={y} stroke="url(#sf-trail)" strokeWidth="1.8" strokeLinecap="round" />
  </g>
);
Shoot.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  delay: PropTypes.number.isRequired,
  dur: PropTypes.number.isRequired,
};

// moon orbiting the ringed planet: one copy passes behind, one in front
const ORBIT = "M840 240A240 44 0 0 0 360 240A240 44 0 0 0 840 240";
const Moon = ({ front, animate }) => (
  <g opacity={animate ? 0 : front ? 1 : 0}>
    <circle r="8" fill="url(#sf-moon)" cx={animate ? 0 : 840} cy={animate ? 0 : 240} />
    {animate && (
      <>
        <animateMotion dur="26s" repeatCount="indefinite" path={ORBIT} />
        <animate attributeName="opacity" dur="26s" repeatCount="indefinite" calcMode="discrete" keyTimes="0;0.5" values={front ? "0;1" : "1;0"} />
      </>
    )}
  </g>
);
Moon.propTypes = {
  front: PropTypes.bool.isRequired,
  animate: PropTypes.bool.isRequired,
};

function Scene() {
  const animate = useMemo(() => !prefersReducedMotion(), []);

  const sky = useMemo(() => {
    const r = rng(42);
    const X = () => r() * 1280 - 40; // extra width so the drifting layer never shows an edge
    const dust = Array.from({ length: 260 }, () => ({ x: X(), y: r() * 340, r: 0.4 + r() * 0.7, o: 0.3 + r() * 0.6 }));
    const twinkle = Array.from({ length: 80 }, () => ({ x: X(), y: r() * 330, r: 0.8 + r() * 1.3, d: r() * 5, p: 2.5 + r() * 4 }));
    const sparkles = Array.from({ length: 10 }, () => ({ x: 40 + r() * 1120, y: 20 + r() * 230, s: 5 + r() * 7, d: r() * 5, p: 3 + r() * 3 }));
    const band = Array.from({ length: 170 }, () => {
      const t = r();
      return { x: t * 1280 - 40, y: 40 + t * 150 + (r() - 0.5) * 90, r: 0.3 + r() * 0.6, o: 0.25 + r() * 0.5 };
    });
    const flies = Array.from({ length: 18 }, () => ({ x: 90 + r() * 1020, y: 340 + r() * 80, r: 1 + r() * 1.5, d: r() * 6, p: 4 + r() * 4 }));
    return { dust, twinkle, sparkles, band, flies };
  }, []);

  const back = useMemo(() => treePath(0, 1200, () => 322, 30, 3), []);
  const mid = useMemo(() => treePath(0, 1200, () => 348, 48, 11), []);
  const frontL = useMemo(() => treePath(0, 470, (x) => 398 + x * 0.02, 80, 21), []);
  const frontR = useMemo(() => treePath(740, 1200, (x) => 442 - (x - 740) * 0.1, 80, 33), []);

  return (
    <svg className="sf-scene" viewBox="0 0 1200 520" role="img" aria-label="Night valley beneath a ringed planet with an orbiting moon, a dense starfield and a glowing river">
      <defs>
        <linearGradient id="sf-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000000" />
          <stop offset=".55" stopColor="#07061a" />
          <stop offset=".85" stopColor="#1a0f3d" />
          <stop offset="1" stopColor="#2c1650" />
        </linearGradient>
        <radialGradient id="sf-neb1" cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#5b3cff" stopOpacity=".35" />
          <stop offset="1" stopColor="#5b3cff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="sf-neb2" cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#ff4fa3" stopOpacity=".22" />
          <stop offset="1" stopColor="#ff4fa3" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="sf-neb3" cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#2fd0ff" stopOpacity=".18" />
          <stop offset="1" stopColor="#2fd0ff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="sf-main" cx=".3" cy=".28" r=".95">
          <stop offset="0" stopColor="#fff0c8" />
          <stop offset=".35" stopColor="#f0b36a" />
          <stop offset=".7" stopColor="#8a4a2e" />
          <stop offset="1" stopColor="#1a0b0b" />
        </radialGradient>
        <radialGradient id="sf-ice" cx=".3" cy=".28" r=".95">
          <stop offset="0" stopColor="#e6fbff" />
          <stop offset=".5" stopColor="#5fb4d9" />
          <stop offset="1" stopColor="#0a1a30" />
        </radialGradient>
        <radialGradient id="sf-violet" cx=".3" cy=".28" r=".95">
          <stop offset="0" stopColor="#f0d9ff" />
          <stop offset=".5" stopColor="#8b5bd6" />
          <stop offset="1" stopColor="#140a2a" />
        </radialGradient>
        <radialGradient id="sf-moon" cx=".3" cy=".28" r=".95">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset=".6" stopColor="#a9abc0" />
          <stop offset="1" stopColor="#25263a" />
        </radialGradient>
        <radialGradient id="sf-halo">
          <stop offset="0" stopColor="#ffb86b" stopOpacity=".38" />
          <stop offset="1" stopColor="#ffb86b" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="sf-ridgeA" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a2358" />
          <stop offset="1" stopColor="#0b0a1f" />
        </linearGradient>
        <linearGradient id="sf-ridgeB" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#171340" />
          <stop offset="1" stopColor="#07071a" />
        </linearGradient>
        <linearGradient id="sf-valley" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1a1450" />
          <stop offset="1" stopColor="#06061a" />
        </linearGradient>
        <linearGradient id="sf-river" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7cf0e0" />
          <stop offset="1" stopColor="#4a8cff" />
        </linearGradient>
        <linearGradient id="sf-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.bg} stopOpacity="0" />
          <stop offset="1" stopColor={C.bg} />
        </linearGradient>
        {/* bright head on the left (leading end), fading tail on the right */}
        <linearGradient id="sf-trail" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#fff" />
        </linearGradient>
        <filter id="sf-blur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
      </defs>

      <rect width="1200" height="520" fill="url(#sf-sky)" />

      {/* drifting nebula clouds */}
      <g className="sf-nebula">
        <ellipse cx="220" cy="150" rx="320" ry="140" fill="url(#sf-neb1)" />
        <ellipse cx="980" cy="120" rx="340" ry="130" fill="url(#sf-neb3)" />
        <ellipse cx="620" cy="260" rx="380" ry="120" fill="url(#sf-neb2)" />
      </g>

      {/* slowly drifting starfield */}
      <g className="sf-drift">
        {sky.band.map((s, i) => (
          <circle key={`b${i}`} cx={s.x} cy={s.y} r={s.r} fill="#cfd3ff" opacity={s.o} />
        ))}
        {sky.dust.map((s, i) => (
          <circle key={`d${i}`} cx={s.x} cy={s.y} r={s.r} fill="#fff" opacity={s.o} />
        ))}
        {sky.twinkle.map((s, i) => (
          <circle key={`t${i}`} className="sf-star" cx={s.x} cy={s.y} r={s.r} fill="#fff" style={{ animationDelay: `${s.d}s`, animationDuration: `${s.p}s` }} />
        ))}
      </g>
      {sky.sparkles.map((s, i) => (
        <path key={`s${i}`} className="sf-star" d={sparkle(s.s)} transform={`translate(${s.x} ${s.y})`} fill="#fff" style={{ animationDelay: `${s.d}s`, animationDuration: `${s.p}s` }} />
      ))}

      {/* shooting stars */}
      <Shoot x={1010} y={30} delay={1} dur={11} />
      <Shoot x={700} y={14} delay={5} dur={14} />
      <Shoot x={330} y={50} delay={8} dur={12} />
      <Shoot x={1140} y={95} delay={11} dur={16} />

      {/* distant planets */}
      <g className="sf-float" style={{ animationDuration: "10s" }}>
        <circle cx="165" cy="100" r="30" fill="url(#sf-violet)" />
        <path d="M137 96q28 -8 56 2M136 110q30 8 58 -2" stroke="#3a1c6e" strokeWidth="3" fill="none" opacity=".45" />
      </g>
      <g className="sf-float" style={{ animationDelay: "-4s", animationDuration: "12s" }}>
        <circle cx="1035" cy="125" r="46" fill="url(#sf-ice)" />
        <path d="M992 116q42 -12 86 4M990 136q44 10 90 -4" stroke="#1d5c86" strokeWidth="4" fill="none" opacity=".5" />
        <ellipse cx="1035" cy="125" rx="74" ry="12" transform="rotate(-18 1035 125)" fill="none" stroke="#bfe9ff" strokeWidth="2" opacity=".35" />
      </g>
      <g className="sf-float" style={{ animationDelay: "-2s", animationDuration: "7s" }}>
        <circle cx="860" cy="66" r="12" fill="url(#sf-moon)" />
        <circle cx="856" cy="63" r="2.5" fill="#25263a" opacity=".5" />
      </g>
      <circle className="sf-star" cx="330" cy="205" r="7" fill="#ff7a8a" style={{ animationDuration: "5s" }} />
      <circle className="sf-star" cx="420" cy="60" r="3.5" fill="#9fd8ff" style={{ animationDuration: "3s" }} />

      {/* main ringed planet */}
      <circle className="sf-breathe" cx="600" cy="240" r="210" fill="url(#sf-halo)" />
      <g transform="rotate(-14 600 240)">
        <ellipse cx="600" cy="240" rx="240" ry="44" fill="none" stroke="#e8c58f" strokeWidth="1" strokeDasharray="3 7" opacity=".28" />
        <Moon front={false} animate={animate} />
        <ellipse cx="600" cy="240" rx="190" ry="34" fill="none" stroke="#e8c58f" strokeWidth="8" opacity=".35" />
        <ellipse cx="600" cy="240" rx="168" ry="29" fill="none" stroke="#e8c58f" strokeWidth="3" opacity=".25" />
        <circle cx="600" cy="240" r="110" fill="url(#sf-main)" />
        <path d="M492 218q108 -24 216 0M488 256q112 22 224 0" stroke="#8a4a2e" strokeWidth="6" fill="none" opacity=".35" />
        <circle cx="640" cy="196" r="12" fill="#8a4a2e" opacity=".3" />
        <circle cx="558" cy="276" r="8" fill="#8a4a2e" opacity=".3" />
        <path d="M410 240A190 34 0 0 0 790 240" fill="none" stroke="#f4dcae" strokeWidth="8" opacity=".8" />
        <path d="M432 240A168 29 0 0 0 768 240" fill="none" stroke="#f4dcae" strokeWidth="3" opacity=".55" />
        <Moon front animate={animate} />
      </g>

      {/* mountains: back */}
      <path d="M0 335V160L70 82 120 148 190 52 262 168 340 138 470 318Z" fill="url(#sf-ridgeA)" />
      <path d="M0 160L70 82 120 148 190 52 262 168 340 138 470 318" fill="none" stroke="#8f8cff" strokeWidth="1.2" opacity=".45" />
      <path d="M1200 335V120L1130 58 1070 138 1000 68 930 178 860 148 740 318Z" fill="url(#sf-ridgeA)" />
      <path d="M1200 120L1130 58 1070 138 1000 68 930 178 860 148 740 318" fill="none" stroke="#8f8cff" strokeWidth="1.2" opacity=".45" />
      {/* mountains: front */}
      <path d="M110 335L235 135 292 202 352 172 490 318 560 335Z" fill="url(#sf-ridgeB)" />
      <path d="M110 335L235 135 292 202 352 172 490 318" fill="none" stroke="#c9a6ff" strokeWidth="1" opacity=".4" />
      <path d="M1100 335L985 140 925 210 865 178 722 318 650 335Z" fill="url(#sf-ridgeB)" />
      <path d="M1100 335L985 140 925 210 865 178 722 318" fill="none" stroke="#c9a6ff" strokeWidth="1" opacity=".4" />

      {/* valley */}
      <path d={back} fill="#15123a" />
      <rect y="322" width="1200" height="150" fill="url(#sf-valley)" />
      <path d={mid} fill="#0d0c2c" />

      {/* glowing, flowing river */}
      <path className="sf-riverglow" d="M590 326C720 330 800 352 700 380C640 397 585 407 540 442" stroke="#7cf0e0" strokeWidth="26" fill="none" strokeLinecap="round" filter="url(#sf-blur)" />
      <path d="M590 326C720 330 800 352 700 380C640 397 585 407 540 442" stroke="url(#sf-river)" strokeWidth="11" fill="none" strokeLinecap="round" />
      <path className="sf-flow" d="M590 326C720 330 800 352 700 380C640 397 585 407 540 442" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" opacity=".7" />

      <path d={frontL} fill="#05050f" />
      <path d={frontR} fill="#05050f" />

      {/* glowing particles rising from the valley */}
      {sky.flies.map((f, i) => (
        <circle key={`f${i}`} className="sf-fly" cx={f.x} cy={f.y} r={f.r} fill="#7cf0e0" style={{ animationDelay: `${f.d}s`, animationDuration: `${f.p}s` }} />
      ))}

      {/* foreground */}
      <path d="M0 520V404C150 396 330 428 480 458L720 465C900 424 1050 390 1200 408V520Z" fill={C.bg} />
      <rect y="430" width="1200" height="90" fill="url(#sf-fade)" />
    </svg>
  );
}

/* ---------- icons ---------- */

const links = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Works", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

/* ---------- footer ---------- */

export default function SpaceFooter() {
  const footerRef = useRef(null);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState({ type: "", text: "" });
  const [isSending, setIsSending] = useState(false);
  const emailServiceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const emailTemplateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const emailPublicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
  const isEmailConfigured =
    emailServiceId && emailTemplateId && emailPublicKey;

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
      footer.classList.add("sf-visible");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          footer.classList.add("sf-visible");
          observer.disconnect();
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  const set = (k) => (e) =>
    setForm((current) => ({ ...current, [k]: e.target.value }));

  const send = async (event) => {
    event.preventDefault();
    if (!isEmailConfigured) {
      const subject = encodeURIComponent(`Portfolio contact from ${form.name.trim()}`);
      const body = encodeURIComponent(
        `Name: ${form.name.trim()}\nEmail: ${form.email.trim()}\n\n${form.message.trim()}`,
      );
      setStatus({
        type: "ok",
        text: "Your email app should open with your message ready. Send it there to complete delivery.",
      });
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
      return;
    }

    setIsSending(true);
    setStatus({ type: "", text: "" });
    try {
      await emailjs.send(
        emailServiceId,
        emailTemplateId,
        {
          from_name: form.name.trim(),
          reply_to: form.email.trim(),
          message: form.message.trim(),
          to_email: CONTACT_EMAIL,
        },
        emailPublicKey,
      );
      setStatus({
        type: "ok",
        text: `Thanks ${form.name.trim()}, your message was sent.`,
      });
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus({
        type: "err",
        text: "Your message could not be sent. Please try again or use a social link below.",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <footer id="contact" ref={footerRef} className="sf-wrap sf-reveal">
      <style>{css}</style>
      <Scene />

      <div className="sf-body">
        <div className="sf-top">
          <div>
            <h2 className="sf-title sf-in">Contact me</h2>
            <p className="sf-sub sf-in" style={{ animationDelay: ".15s" }}>
              Have a project, an idea or just a question?{" "}
              {isEmailConfigured
                ? "Use the form below to get in touch."
                : "Use the form below to prepare an email, or reach out through one of my social profiles."}
            </p>
          </div>

          <div className="sf-card sf-in" style={{ animationDelay: ".3s" }}>
            <h3>Say hello</h3>
            <form onSubmit={send}>
              <div className="sf-row">
                <label className="sf-field">
                  <span>Name</span>
                  <input
                    name="name"
                    value={form.name}
                    onChange={set("name")}
                    autoComplete="name"
                    required
                  />
                </label>
                <label className="sf-field">
                  <span>Email</span>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={set("email")}
                    autoComplete="email"
                    required
                  />
                </label>
              </div>
              <label className="sf-field">
                <span>Message</span>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={set("message")}
                  required
                />
              </label>
             
              <button
                type="submit"
                className="sf-btn"
                disabled={isSending}
              >
                {isSending ? "Sending..." : "Send message"}
              </button>
              <p
                key={status.text}
                className="sf-msg sf-pop"
                role={status.type === "err" ? "alert" : "status"}
                style={{
                  color: status.type === "err" ? "#ff9fb4" : C.accent,
                }}
              >
                {status.text}
              </p>
            </form>
          </div>
        </div>

        <div className="sf-bottom sf-in" style={{ animationDelay: ".45s" }}>
          <div className="sf-logo">
            <svg width="34" height="34" viewBox="0 0 34 34" fill="none" stroke={C.ink} strokeWidth="1.8" aria-hidden="true">
              <circle cx="17" cy="17" r="8" />
              <ellipse cx="17" cy="17" rx="15" ry="5" transform="rotate(-20 17 17)" />
            </svg>
            Adem
          </div>

          <nav className="sf-links" aria-label="Footer">
            {links.map((l) => (
              <a key={l.label} href={l.href}>
                {l.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="sf-meta">
          <p>Copyright © {new Date().getFullYear()}  All rights reserved.</p>
          <div className="sf-social">
            {mySocials.map(({ name, href }) => (
              <a
                key={name}
                href={href}
                aria-label={name}
                target="_blank"
                rel="noopener noreferrer"
              >
                <SocialIcon name={name} aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
