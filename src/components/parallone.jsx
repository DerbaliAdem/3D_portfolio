import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
} from "motion/react";

/* -------------------------------------------------------------------------- */
/*  Data                                                                      */
/* -------------------------------------------------------------------------- */

const ASSETS = {
  stars: "/assets/stars.png",
  planets: "/assets/planets2.png",
  sun: "/assets/sun.png",
  mountains: "/assets/mountains.png",
};

// Pinned version so icons never change unexpectedly.
const ICON_BASE =
  "https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons";

const SKILLS = [
  // Frontend
  { name: "HTML5", icon: "html5/html5-original" },
  { name: "CSS3", icon: "css3/css3-original" },
  { name: "JavaScript", icon: "javascript/javascript-original" },
  { name: "TypeScript", icon: "typescript/typescript-original" },
  { name: "React", icon: "react/react-original" },
  { name: "Tailwind CSS", icon: "tailwindcss/tailwindcss-original" },
  // Mobile
  { name: "React Native", icon: "react/react-original" },
  // Backend
  { name: "Spring Boot", icon: "spring/spring-original" },
  { name: "NestJS", icon: "nestjs/nestjs-original" },
  // Languages
  { name: "Java", icon: "java/java-original" },
  { name: "Python", icon: "python/python-original" },
  { name: "PHP", icon: "php/php-original" },
  { name: "C", icon: "c/c-original" },
  // Databases
  { name: "PostgreSQL", icon: "postgresql/postgresql-original" },
  { name: "pgAdmin", icon: "postgresql/postgresql-original" },
  // Tools
  { name: "Git", icon: "git/git-original" },
  { name: "Postman", icon: "postman/postman-original" },
  { name: "VS Code", icon: "vscode/vscode-original" },
];

/* -------------------------------------------------------------------------- */
/*  Shared classes & animation variants                                       */
/* -------------------------------------------------------------------------- */

const layerBox =
  "absolute bottom-0 left-[-45%] w-[190%] lg:inset-0 lg:left-0 lg:h-full lg:w-full";

const layerImg =
  "block h-auto w-full select-none pointer-events-none lg:h-full lg:object-cover lg:object-bottom";

const cardVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      delay: index * 0.03,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

/* -------------------------------------------------------------------------- */
/*  Skill card                                                                */
/* -------------------------------------------------------------------------- */

function SkillCard({ skill, index, revealed, reduceMotion }) {
  return (
    <motion.li
      custom={index}
      variants={cardVariants}
      initial={reduceMotion ? false : "hidden"}
      animate={revealed ? "visible" : "hidden"}
      whileHover={
        reduceMotion ? undefined : { y: -3, transition: { duration: 0.2 } }
      }
      className="group flex h-[calc(var(--tw)*1.05)] w-[var(--tw)] flex-col items-center justify-center gap-[calc(var(--tw)*0.06)] rounded-xl border border-white/10 bg-white/[0.04] px-1 text-center transition-colors duration-300 hover:border-indigo-300/40 hover:bg-indigo-400/10 sm:rounded-2xl"
    >
      <img
        src={`${ICON_BASE}/${skill.icon}.svg`}
        alt=""
        width={36}
        height={36}
        loading="lazy"
        draggable="false"
        onError={(e) => {
          e.currentTarget.style.visibility = "hidden";
        }}
        className="h-[calc(var(--tw)*0.4)] w-[calc(var(--tw)*0.4)] object-contain transition-transform duration-300 group-hover:scale-110"
      />
      <span className="w-full text-balance font-medium leading-[1.15] text-slate-100 [font-size:clamp(9px,calc(var(--tw)*0.115),14px)]">
        {skill.name}
      </span>
    </motion.li>
  );
}
SkillCard.propTypes = {
  skill: PropTypes.shape({
    name: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
  revealed: PropTypes.bool.isRequired,
  reduceMotion: PropTypes.bool.isRequired,
};

/* -------------------------------------------------------------------------- */
/*  Main component                                                            */
/* -------------------------------------------------------------------------- */

export default function AboutMeParallax() {
  const sectionRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const [revealed, setRevealed] = useState(false);

  const scrollYProgress = useMotionValue(0);

  useEffect(() => {
    const updateProgress = () => {
      const section = sectionRef.current;
      if (!section) return;

      const { top, height } = section.getBoundingClientRect();
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

  // Start the card animation only once the panel is actually coming into view.
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = v > 0.3;
    setRevealed((prev) => (prev === next ? prev : next));
  });

  const showPanel = reduceMotion || revealed;

  // With reduced motion, every transform stays at its settled value.
  const range = (from, to, settled = from) =>
    reduceMotion ? [settled, settled] : [from, to];

  const starsX = useTransform(scrollYProgress, [0, 1], range("0%", "23%"));
  const planetsY = useTransform(scrollYProgress, [0, 0.85], range("0%", "52%"));
  const sunY = useTransform(scrollYProgress, [0, 0.85], range("0%", "46%"));

  const titleY = useTransform(
    scrollYProgress,
    [0, 0.55],
    range("0vh", "78vh", "78vh"),
  );
  const titleOpacity = useTransform(
    scrollYProgress,
    [0, 0.28, 0.48],
    reduceMotion ? [0, 0, 0] : [1, 0.9, 0],
  );

  const contentOpacity = useTransform(
    scrollYProgress,
    [0.28, 0.43, 0.58],
    reduceMotion ? [1, 1, 1] : [0, 0.85, 1],
  );
  const contentY = useTransform(
    scrollYProgress,
    [0.28, 0.58],
    range("4vh", "0vh", "0vh"),
  );

  const fadeOpacity = useTransform(scrollYProgress, [0.88, 1], range(0, 1));

  return (
    <section
      ref={sectionRef}
      aria-labelledby="about-title"
      className={`relative left-1/2 w-screen -translate-x-1/2 ${
        reduceMotion ? "h-screen" : "h-[300vh]"
      }`}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#05030f]">
        {/* Space background */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-[#03020a] via-[#0b0922] to-[#1b103c]"
        />

        {/* Stars drift sideways */}
        <motion.div
          aria-hidden="true"
          style={{ x: starsX }}
          className="absolute inset-y-0 -left-[30%] z-0 w-[130%] will-change-transform"
        >
          <img
            src={ASSETS.stars}
            alt=""
            draggable="false"
            className="h-full w-full select-none object-cover"
          />
        </motion.div>

        {/* Sun sinks behind the mountains */}
        <motion.div
          aria-hidden="true"
          style={{ y: sunY }}
          className={`${layerBox} z-10 will-change-transform`}
        >
          <img
            src={ASSETS.sun}
            alt=""
            draggable="false"
            className={layerImg}
            style={{ clipPath: "inset(0 45% 0 0)" }}
          />
        </motion.div>

        {/* Planets sink behind the mountains */}
        <motion.div
          aria-hidden="true"
          style={{ y: planetsY }}
          className={`${layerBox} z-10 will-change-transform`}
        >
          <img
            src={ASSETS.planets}
            alt=""
            draggable="false"
            className={layerImg}
          />
        </motion.div>

        {/* Giant title (decorative: the real heading is inside the panel) */}
        <motion.div
          aria-hidden="true"
          style={{ y: titleY, opacity: titleOpacity }}
          className="absolute inset-x-0 top-[22%] z-20 px-4 text-center will-change-transform sm:top-[19%]"
        >
          <p className="bg-gradient-to-b from-white via-indigo-50 to-indigo-300/70 bg-clip-text text-[24vw] font-black leading-[0.85] tracking-[-0.07em] text-transparent sm:text-[13vw]">
            <span className="block sm:inline">ABOUT</span>{" "}
            <span className="block sm:inline">ME</span>
          </p>

          <p className="mt-5 text-sm font-light tracking-[0.15em] text-indigo-100/80 sm:text-lg">
            Building ideas into digital experiences.
          </p>
        </motion.div>

        {/* Mountain foreground */}
        <div aria-hidden="true" className={`${layerBox} z-30`}>
          <img
            src={ASSETS.mountains}
            alt=""
            draggable="false"
            className={layerImg}
          />
        </div>

        {/* About + skills panel: one centred card that scales to fit the screen */}
        <motion.div
          style={{ opacity: contentOpacity, y: contentY }}
          className={`absolute inset-0 z-50 flex items-center justify-center p-3 sm:p-6 ${
            showPanel ? "" : "pointer-events-none"
          }`}
        >
          <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-white/15 bg-[#090817]/85 shadow-[0_0_80px_rgba(99,102,241,0.16)] backdrop-blur-2xl">
            {/* Ambient lighting */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 overflow-hidden"
            >
              <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-indigo-500/15 blur-[90px]" />
              <div className="absolute -bottom-24 left-1/4 h-60 w-60 rounded-full bg-violet-500/10 blur-[90px]" />
              <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-indigo-300/60 to-transparent" />
            </div>

            {/* Everything is sized with vh/vw clamps so the card always fits
                on one screen, like a presentation slide. No scrolling. */}
            <div className="relative z-10 flex flex-col items-center px-4 py-[clamp(16px,4.5vh,44px)] text-center sm:px-8 lg:px-12">
              <header className="mx-auto max-w-2xl">
                <h2
                  id="about-title"
                  className="font-bold tracking-tight text-white [font-size:clamp(1.5rem,5.2vh,3rem)]"
                >
                  Beyond the code
                </h2>

                {/* Hidden on very short screens (e.g. phone landscape) */}
                <p className="mt-[clamp(6px,1.5vh,16px)] text-slate-300 [font-size:clamp(12px,1.9vh,16px)] leading-relaxed [@media(max-height:460px)]:hidden">
                  I&apos;m a software engineering student specializing in
                  information systems, and I enjoy building full-stack and
                  mobile applications from idea to release.
                </p>
              </header>

              {/* Divider */}
              <div
                role="presentation"
                className="my-[clamp(10px,3vh,32px)] flex w-full max-w-2xl items-center gap-4"
              >
                <span className="h-px flex-1 bg-white/10" />
                <h3 className="font-medium text-slate-400 [font-size:clamp(12px,1.8vh,16px)]">
                  My toolkit
                </h3>
                <span className="h-px flex-1 bg-white/10" />
              </div>

              {/* 5 per row on phones, 6 per row from sm up (18 skills = 3 even
                  rows). Flex + justify-center keeps any incomplete row centred. */}
              <ul className="mx-auto flex w-full max-w-[calc(var(--tw)*5_+_1.5rem)] flex-wrap justify-center gap-1.5 [--tw:clamp(50px,min(11.5vh,15vw),124px)] sm:max-w-[calc(var(--tw)*6_+_3.75rem)] sm:gap-3 sm:[--tw:clamp(56px,min(11.5vh,12.5vw),124px)]">
                {SKILLS.map((skill, index) => (
                  <SkillCard
                    key={skill.name}
                    skill={skill}
                    index={index}
                    revealed={showPanel}
                    reduceMotion={reduceMotion}
                  />
                ))}
              </ul>

              {/* Summary (hidden on short screens) */}
              <p className="mt-[clamp(10px,3vh,32px)] w-full max-w-2xl border-t border-white/10 pt-[clamp(8px,2vh,20px)] text-slate-400 [font-size:clamp(11px,1.6vh,14px)] [@media(max-height:560px)]:hidden">
                Web, mobile, backend and databases
              </p>
            </div>
          </div>
        </motion.div>

        {/* Fade into the next section */}
        <motion.div
          aria-hidden="true"
          style={{
            opacity: fadeOpacity,
            backgroundImage: "linear-gradient(to bottom, transparent, #0a0817)",
          }}
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[60] h-1/3"
        />
      </div>
    </section>
  );
}
