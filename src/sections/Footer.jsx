import { mySocials } from "../constants";
import SocialIcon from "../components/SocialIcon";
const Footer = () => {
  return (
    <section className="flex flex-wrap items-center justify-between gap-5 pb-3 text-sm text-neutral-400 c-space">
      <div className="mb-4 bg-gradient-to-r from-transparent via-neutral-700 to-transparent h-[1px] w-full" />
      <div className="flex gap-2">
        <p>Terms & Conditions</p>
        <p>|</p>
        <p>Privacy Policy</p>
      </div>
      <div className="flex gap-3">
        {mySocials.map((social) => (
          <a
            href={social.href}
            key={social.name}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.name}
          >
            <SocialIcon
              name={social.name}
              className="h-5 w-5"
              aria-hidden="true"
            />
          </a>
        ))}
      </div>
      <p>© 2025 Ali. All rights reserved.</p>
    </section>
  );
};

export default Footer;
