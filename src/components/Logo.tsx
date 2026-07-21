export function Logo({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      className={className}
      role="img"
      aria-label="Prime Burger Co logo"
    >
      <circle cx="20" cy="20" r="20" fill="#D5451B" />
      <path
        d="M9 17.5C9 13.4 13.9 10 20 10C26.1 10 31 13.4 31 17.5C31 18.3 30.3 19 29.5 19H10.5C9.7 19 9 18.3 9 17.5Z"
        fill="#F6EFE4"
      />
      <rect x="9" y="20.5" width="22" height="2.4" rx="1.2" fill="#F2A93B" />
      <path d="M10 24H30C29.6 27 25.3 30 20 30C14.7 30 10.4 27 10 24Z" fill="#F6EFE4" />
      <rect x="12.5" y="20.5" width="1.6" height="2.4" fill="#D5451B" opacity="0.35" />
      <rect x="26" y="20.5" width="1.6" height="2.4" fill="#D5451B" opacity="0.35" />
    </svg>
  );
}
