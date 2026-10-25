import PropTypes from "prop-types";

const icons = {
  GitHub: (
    <path d="M12 .5A11.5 11.5 0 0 0 8.36 22.91c.58.11.79-.25.79-.56v-2.16c-3.23.7-3.91-1.37-3.91-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.06-.72.08-.7.08-.7 1.17.08 1.79 1.2 1.79 1.2 1.04 1.78 2.72 1.27 3.39.97.1-.75.41-1.27.74-1.56-2.58-.29-5.29-1.29-5.29-5.74 0-1.27.45-2.3 1.2-3.11-.12-.29-.52-1.47.12-3.06 0 0 .98-.31 3.16 1.19a10.9 10.9 0 0 1 5.76 0c2.2-1.5 3.17-1.19 3.17-1.19.63 1.59.23 2.77.11 3.06.75.81 1.2 1.84 1.2 3.11 0 4.46-2.72 5.45-5.31 5.74.42.37.79 1.08.79 2.18v3.23c0 .31.21.68.8.56A11.5 11.5 0 0 0 12 .5z" />
  ),
  LinkedIn: (
    <>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </>
  ),
  Instagram: (
    <>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <path d="M17.5 6.5h.01" />
    </>
  ),
  Facebook: (
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  ),
};

export default function SocialIcon({ name, className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill={name === "GitHub" ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {icons[name]}
    </svg>
  );
}

SocialIcon.propTypes = {
  name: PropTypes.oneOf(Object.keys(icons)).isRequired,
  className: PropTypes.string.isRequired,
};
