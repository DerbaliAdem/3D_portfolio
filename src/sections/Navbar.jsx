import { useState } from "react";
import PropTypes from "prop-types";
import { motion } from "motion/react";
function Navigation({ onNavigate }) {
  return (
    <ul className="nav-ul">
      <li className="nav-li">
        <a className="nav-link" href="#home" onClick={onNavigate}>
          Home
        </a>
      </li>
      <li className="nav-li">
        <a className="nav-link" href="#about" onClick={onNavigate}>
          About
        </a>
      </li>
      <li className="nav-li">
        <a className="nav-link" href="#projects" onClick={onNavigate}>
          Work
        </a>
      </li>
      <li className="nav-li">
        <a className="nav-link" href="#contact" onClick={onNavigate}>
          Contact
        </a>
      </li>
    </ul>
  );
}
Navigation.propTypes = {
  onNavigate: PropTypes.func,
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 w-full bg-primary/80 backdrop-blur-lg">
      <div className="mx-auto c-space max-w-7xl">
        <div className="flex items-center justify-between py-2 sm:py-0">
          <a
            href="#home"
            onClick={closeMenu}
            className="text-xl font-bold transition-colors text-neutral-400 hover:text-white"
          >
            Adem
          </a>
          <button
            type="button"
            onClick={() => setIsOpen((open) => !open)}
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            className="flex cursor-pointer text-neutral-400 hover:text-white focus:outline-none sm:hidden"
          >
            <img
              src={isOpen ? "/assets/close.svg" : "/assets/menu.svg"}
              className="w-6 h-6"
              alt=""
            />
          </button>
          <nav className="hidden sm:flex">
            <Navigation onNavigate={closeMenu} />
          </nav>
        </div>
      </div>
      {isOpen && (
        <motion.div
          id="mobile-navigation"
          className="block overflow-hidden text-center sm:hidden"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
        >
          <nav className="pb-5">
            <Navigation onNavigate={closeMenu} />
          </nav>
        </motion.div>
      )}
    </header>
  );
};

export default Navbar;
