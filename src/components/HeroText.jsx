import { FlipWords } from "./FlipWords";
import { motion } from "motion/react";
import { Download } from "lucide-react";

const HeroText = () => {
  const words = ["Secure", "Modern", "Scalable"];
  const variants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
  };
  return (
    <div className="z-10 mt-20 w-full text-center md:mt-40 md:w-1/2 md:text-left rounded-3xl bg-clip-text">
      {/* Desktop View */}
      <div className="flex-col hidden md:flex c-space">
        <motion.h1
          className="text-4xl font-medium"
          variants={variants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 1 }}
        >
          Hi I&apos;m Adem
        </motion.h1>
        <div className="flex flex-col items-start">
          <motion.p
            className="text-5xl font-medium text-neutral-300"
            variants={variants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 1.2 }}
          >
            A Developer <br /> Dedicated to Building
          </motion.p>
          <motion.div
            variants={variants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 1.5 }}
          >
            <FlipWords
              words={words}
              className="font-black text-white text-8xl"
            />
          </motion.div>
          <motion.p
            className="text-4xl font-medium text-neutral-300"
            variants={variants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 1.8 }}
          >
            Web & Mobile
Experiences
          </motion.p>
        </div>
      </div>
      {/* Mobile View */}
      <div className="flex- flex-col space-y-6 md:hidden">
        <motion.p
          className="text-4xl font-medium"
          variants={variants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 1 }}
        >
          Hi, I&apos;m Adem
        </motion.p>
        <div>
          <motion.p
            className="text-5xl font-black text-neutral-300"
            variants={variants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 1.2 }}
          >
            Building
          </motion.p>
          <motion.div
            variants={variants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 1.5 }}
          >
            <FlipWords
              words={words}
              className="font-bold text-white text-7xl"
            />
          </motion.div>
          <motion.p
            className="text-4xl font-black text-neutral-300"
            variants={variants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 1.8 }}
          >
            Web Applications
          </motion.p>
        </div>
      </div>
      <motion.div
        className="flex w-full justify-center pt-8"
        variants={variants}
        initial="hidden"
        animate="visible"
        whileHover={{ y: -2, scale: 1.02, transition: { duration: 0.2 } }}
        whileTap={{ scale: 0.98, transition: { duration: 0.2 } }}
        transition={{ delay: 2.1, duration: 0.5 }}
      >
        <a
          href="../../public/assets/socials/CvAdemDerbali.pdf"
          download="Adem-Derbali-CV.pdf"
          className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-3 text-sm font-medium text-white shadow-lg shadow-black/10 backdrop-blur-md transition-colors duration-300 hover:border-aqua/50 hover:bg-white/10 hover:text-aqua focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aqua focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
        >
          <Download size={18} aria-hidden="true" />
          Download CV
        </a>
      </motion.div>
    </div>
  );
};

export default HeroText;
