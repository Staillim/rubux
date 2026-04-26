export default function RobloxLogo({ size = 16, className = '' }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M50 0L100 50L50 100L0 50Z M50 32L68 50L50 68L32 50Z"
      />
    </svg>
  );
}
