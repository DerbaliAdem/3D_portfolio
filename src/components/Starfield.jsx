import PropTypes from "prop-types";
import { useEffect, useRef } from "react";

/**
 * Moving starfield drawn on a canvas.
 * - Stars drift slowly upward; nearer (bigger) stars move faster = parallax.
 * - Pass a framer-motion MotionValue as `progress` to make the stars
 *   also shift with scroll.
 * - Respects prefers-reduced-motion (renders a static field).
 * - Pauses when the tab is hidden.
 */
export default function Starfield({
  progress,
  density = 0.00012, // stars per px²
  speed = 14, // px/sec for the nearest layer
  className = "",
}) {
  const canvasRef = useRef(null);
  const progressRef = useRef(progress);
  progressRef.current = progress;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    let stars = [];
    let raf = 0;
    let last = performance.now();
    const palette = ["255,255,255", "186,230,253", "221,214,254"]; // white, cyan, violet tints

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(220, Math.max(40, Math.round(w * h * density)));
      stars = Array.from({ length: count }, () => {
        const depth = Math.random(); // 0 = far, 1 = near
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          depth,
          r: 0.4 + depth * 1.3,
          color: palette[Math.floor(Math.random() * palette.length)],
          base: 0.25 + depth * 0.6,
          phase: Math.random() * Math.PI * 2,
          twinkle: 0.6 + Math.random() * 1.4,
        };
      });
    };

    const draw = (t, dt) => {
      ctx.clearRect(0, 0, w, h);
      const p = progressRef.current?.get ? progressRef.current.get() : 0;
      const scrollShift = p * h * 0.8; // parallax offset from scroll

      for (const s of stars) {
        if (!reduce) {
          s.y -= speed * (0.15 + s.depth) * dt;
          s.x += speed * 0.1 * (0.15 + s.depth) * dt;
          if (s.y < -2) s.y = h + 2;
          if (s.x > w + 2) s.x = -2;
        }
        const yy = (((s.y - scrollShift * s.depth) % h) + h) % h;
        const a = reduce
          ? s.base
          : s.base * (0.7 + 0.3 * Math.sin(t / 1000 * s.twinkle + s.phase));

        ctx.beginPath();
        ctx.fillStyle = `rgba(${s.color},${a.toFixed(3)})`;
        ctx.arc(s.x, yy, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      draw(now, dt);
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      last = performance.now();
      raf = requestAnimationFrame(loop);
    };

    const onVisibility = () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else if (!reduce) start();
    };

    build();
    if (reduce) draw(0, 0);
    else start();

    const ro = new ResizeObserver(() => {
      build();
      if (reduce) draw(0, 0);
    });
    ro.observe(canvas);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [density, speed]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}

Starfield.propTypes = {
  progress: PropTypes.object,
  density: PropTypes.number,
  speed: PropTypes.number,
  className: PropTypes.string,
};
