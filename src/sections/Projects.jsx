import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { projects } from "../constants/Projectsdata";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
} from "motion/react";
import { Code } from "lucide-react";
import Starfield from "../components/Starfield";

/* ------------------------------------------------------------------ */
/* 2. SMALL PRESENTATIONAL PIECES                                      */
/* ------------------------------------------------------------------ */
const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black";
const technologyPropType = PropTypes.shape({
  name: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
}).isRequired;
const projectPropType = PropTypes.shape({
  title: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  technologies: PropTypes.arrayOf(technologyPropType).isRequired,
  githubUrl: PropTypes.string,
}).isRequired;

function TechBadge({ name, icon: Icon }) {
  return (
    <li className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-zinc-300 backdrop-blur-sm">
      <Icon className="h-3.5 w-3.5 text-cyan-300" aria-hidden="true" />
      {name}
    </li>
  );
}
TechBadge.propTypes = {
  name: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
};

function ProjectImage({ src, title, reduceMotion, active }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="relative w-full">
      {/* Ambient light behind the preview */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-tr from-violet-600/30 via-blue-600/20 to-cyan-400/20 blur-3xl"
        animate={
          reduceMotion
            ? undefined
            : { opacity: [0.55, 0.9, 0.55], scale: [1, 1.05, 1] }
        }
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        whileHover={reduceMotion ? undefined : { scale: 1.015 }}
        transition={{ type: "spring", stiffness: 200, damping: 24 }}
        className="relative aspect-[16/10] max-h-[32svh] w-full overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 shadow-2xl shadow-black/60 sm:max-h-[40svh] lg:max-h-[56svh]"
      >
        {failed ? (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-950 to-black px-6 text-center text-sm text-zinc-500">
            Add an image for “{title}” in the projects array
          </div>
        ) : (
          <img
            src={src}
            alt={`Screenshot of ${title}`}
            loading={active ? "eager" : "lazy"}
            onError={() => setFailed(true)}
            className="h-full w-full object-contain"
            draggable={false}
          />
        )}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/5"
        />
      </motion.div>
    </div>
  );
}
ProjectImage.propTypes = {
  src: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  reduceMotion: PropTypes.bool,
  active: PropTypes.bool.isRequired,
};

function ProjectDetails({ project, index, active }) {
  const tabIndex = active ? 0 : -1;
  return (
    <div className="w-full">
      <p className="mb-2 flex items-center gap-3 text-sm text-zinc-400">
        <span className="font-medium tabular-nums text-violet-300">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="h-px w-8 bg-white/15" aria-hidden="true" />
        <span>{project.category}</span>
      </p>

      <h3 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
        {project.title}
      </h3>

      <p className="mt-3 max-w-prose text-sm leading-relaxed text-zinc-400 line-clamp-4 sm:text-base lg:mt-5 lg:line-clamp-none">
        {project.description}
      </p>

      <ul
        className="mt-4 flex flex-wrap gap-2 lg:mt-6"
        aria-label={`Technologies used in ${project.title}`}
      >
        {project.technologies.map((t) => (
          <TechBadge key={t.name} {...t} />
        ))}
      </ul>

      <div className="mt-5 flex flex-wrap items-center gap-3 lg:mt-8">
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={tabIndex}
            className={`inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm text-zinc-200 transition hover:border-cyan-300/60 hover:text-white ${focusRing}`}
          >
            <Code className="h-4 w-4" aria-hidden="true" />
            View Source Code
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        )}
      </div>
    </div>
  );
}
ProjectDetails.propTypes = {
  project: projectPropType,
  index: PropTypes.number.isRequired,
  active: PropTypes.bool.isRequired,
};

/* ------------------------------------------------------------------ */
/* 3. ONE SCENE = ONE PROJECT, DRIVEN BY SHARED SCROLL PROGRESS        */
/* ------------------------------------------------------------------ */
function ProjectScene({ project, index, total, progress, active, reduceMotion }) {
  // Scroll progress (0..1) is split into `total` equal "stops".
  // Project i is fully focused at progress = i / (total - 1).
  const step = total > 1 ? 1 / (total - 1) : 1;
  const center = index * step;
  const isFirst = index === 0;
  const isLast = index === total - 1;

  // First project starts fully visible; last stays visible at the end.
  const fadeIn = [center - step * 0.5, center - step * 0.15];
  const fadeOut = [center + step * 0.15, center + step * 0.5];

  const inputs = [
    ...(isFirst ? [] : fadeIn),
    center,
    ...(isLast ? [] : fadeOut),
  ];
  const map = (enter, mid, leave) => [
    ...(isFirst ? [] : [enter, mid]),
    mid,
    ...(isLast ? [] : [mid, leave]),
  ];

  // Opacity: 0 → 1 → 1 → 0
  const opacityOut = isFirst && isLast ? [1] : map(0, 1, 0);
  // Entering from below, leaving upward and shrinking slightly.
  const yOut = map(70, 0, -70);
  const scaleOut = map(0.96, 1, 0.92);

  const safeInputs = inputs.length === 1 ? [0, 1] : inputs;
  const fix = (arr) => (inputs.length === 1 ? [arr[0], arr[0]] : arr);

  const opacity = useTransform(progress, safeInputs, fix(opacityOut));
  const y = useTransform(progress, safeInputs, fix(yOut));
  const scale = useTransform(progress, safeInputs, fix(scaleOut));

  const reversed = index % 2 === 1;

  return (
    <motion.article
      aria-hidden={!active}
      aria-label={`Project ${index + 1} of ${total}: ${project.title}`}
      style={reduceMotion ? { opacity } : { opacity, y, scale }}
      className={`absolute inset-0 flex items-center ${
        active ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      <div
        className={`mx-auto flex w-full max-w-7xl flex-col items-center gap-5 px-5 sm:px-8 lg:gap-14 ${
          reversed ? "lg:flex-row-reverse" : "lg:flex-row"
        }`}
      >
        <div className="w-full lg:w-[56%]">
          <ProjectImage
            src={project.image}
            title={project.title}
            reduceMotion={reduceMotion}
            active={active}
          />
        </div>
        <div className="w-full lg:w-[44%]">
          <ProjectDetails project={project} index={index} active={active} />
        </div>
      </div>
    </motion.article>
  );
}
ProjectScene.propTypes = {
  project: projectPropType,
  index: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  progress: PropTypes.object.isRequired,
  active: PropTypes.bool.isRequired,
  reduceMotion: PropTypes.bool,
};

/* ------------------------------------------------------------------ */
/* 4. SECTION: sticky stage + tall scroll track                        */
/* ------------------------------------------------------------------ */
export default function Projects({ items = projects }) {
  const total = items.length;
  const trackRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);

  // 0 when the track's top hits the viewport top, 1 when its bottom hits the
  // viewport bottom. Reads real scroll position, so it reverses naturally.
  const scrollYProgress = useMotionValue(0);
  useEffect(() => {
    const updateProgress = () => {
      const track = trackRef.current;
      if (!track) return;

      const { top, height } = track.getBoundingClientRect();
      const scrollDistance = height - window.innerHeight;
      const progress =
        scrollDistance > 0 ? Math.min(1, Math.max(0, -top / scrollDistance)) : 0;
      scrollYProgress.set(progress);
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, [scrollYProgress]);
  const smooth = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  });
  const progress = reduceMotion ? scrollYProgress : smooth;

  // Bar: full width at the start, empty at the end.
  const barScale = useTransform(progress, [0, 1], [1, 0]);

  useMotionValueEvent(progress, "change", (v) => {
    const next = Math.min(total - 1, Math.max(0, Math.round(v * (total - 1))));
    setActiveIndex((prev) => (prev === next ? prev : next));
  });

  return (
    <section
      id="projects"
      aria-label="Projects"
      className="relative scroll-mt-16 overflow-x-clip bg-transparent text-white"
    >
      {/* Track height = one viewport per project, so scrolling travels
          (total - 1) viewports while the stage stays pinned. */}
      <div ref={trackRef} style={{ height: `${total * 100}svh` }} className="relative">
        {/* Set --navbar-height (e.g. 4.5rem) on :root if your navbar is fixed/sticky. */}
        <div className="sticky top-[var(--navbar-height,0px)] flex h-[calc(100svh-var(--navbar-height,0px))] flex-col overflow-hidden">
          {/* Moving stars: sits behind everything in the stage and
              shifts with scroll progress for a parallax effect */}
          <Starfield progress={progress} />

          {/* Persistent heading + progress */}
          <header className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-2 pt-6 sm:px-8 lg:pt-8">
            <p className="text-xs tracking-[0.3em] text-zinc-400">SELECTED WORK</p>
            <h2 className="mt-1 text-3xl font-semibold tracking-tight sm:text-5xl">
              Projects
            </h2>
            <div className="mt-3 flex items-center gap-4">
              <div
                className="h-[3px] w-full max-w-md overflow-hidden rounded-full bg-white/5"
                role="progressbar"
                aria-label="Projects progress"
                aria-valuemin={1}
                aria-valuemax={total}
                aria-valuenow={activeIndex + 1}
              >
                <motion.div
                  style={{ scaleX: barScale }}
                  className="h-full origin-left rounded-full bg-gradient-to-r from-violet-500 to-blue-500 shadow-[0_0_10px_rgba(99,102,241,0.55)]"
                />
              </div>
              <span className="text-sm tabular-nums text-zinc-400" aria-live="polite">
                {String(activeIndex + 1).padStart(2, "0")} /{" "}
                {String(total).padStart(2, "0")}
              </span>
            </div>
          </header>

          {/* Scenes */}
          <div className="relative flex-1">
            {items.map((project, i) => (
              <ProjectScene
                key={project.title + i}
                project={project}
                index={i}
                total={total}
                progress={progress}
                active={i === activeIndex}
                reduceMotion={reduceMotion}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
Projects.propTypes = {
  items: PropTypes.arrayOf(projectPropType),
};
