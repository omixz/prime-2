export function BurgerArt({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label="Illustration of a smashed burger">
      <ellipse cx="100" cy="176" rx="70" ry="10" fill="#1E1A17" opacity="0.15" />
      {/* top bun */}
      <path d="M35 96C35 62 63 40 100 40C137 40 165 62 165 96C165 101.5 160.5 106 155 106H45C39.5 106 35 101.5 35 96Z" fill="#F2A93B" />
      <path d="M35 96C35 62 63 40 100 40C137 40 165 62 165 96" fill="none" stroke="#D5451B" strokeOpacity="0.15" strokeWidth="2" />
      <circle cx="72" cy="60" r="2.6" fill="#F6EFE4" />
      <circle cx="100" cy="52" r="2.6" fill="#F6EFE4" />
      <circle cx="128" cy="60" r="2.6" fill="#F6EFE4" />
      <circle cx="88" cy="68" r="2.2" fill="#F6EFE4" />
      <circle cx="114" cy="68" r="2.2" fill="#F6EFE4" />
      {/* lettuce */}
      <path d="M32 108C40 102 50 112 58 106C66 100 74 112 84 106C94 100 104 112 114 106C124 100 134 112 144 106C152 102 164 106 168 110L164 122H36L32 108Z" fill="#5B8C4A" />
      {/* patty */}
      <rect x="34" y="118" width="132" height="18" rx="8" fill="#5A2E1D" />
      {/* cheese */}
      <path d="M30 132L60 140L45 150L20 142Z" fill="#F2A93B" />
      <path d="M170 132L140 140L155 150L180 142Z" fill="#F2A93B" />
      <rect x="34" y="132" width="132" height="10" fill="#F2A93B" opacity="0.9" />
      {/* bottom bun */}
      <path d="M38 148H162C160 164 134 176 100 176C66 176 40 164 38 148Z" fill="#E08B3A" />
      <rect x="38" y="146" width="124" height="8" rx="4" fill="#F2A93B" />
    </svg>
  );
}

export function FriesArt({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} role="img" aria-label="Illustration of fries">
      <path d="M28 92L24 40H72L68 92C68 96 64 98 60 98H36C32 98 28.5 96 28 92Z" fill="#D5451B" />
      <rect x="27" y="30" width="10" height="42" rx="3" fill="#F2A93B" transform="rotate(-6 32 51)" />
      <rect x="40" y="22" width="10" height="52" rx="3" fill="#F6EFE4" />
      <rect x="52" y="26" width="10" height="48" rx="3" fill="#F2A93B" />
      <rect x="63" y="34" width="10" height="42" rx="3" fill="#F6EFE4" transform="rotate(7 68 55)" />
    </svg>
  );
}

export function DrinkArt({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} role="img" aria-label="Illustration of a soft drink cup">
      <path d="M30 30H70L64 92C63.6 95.9 60.3 99 56.3 99H43.7C39.7 99 36.4 95.9 36 92L30 30Z" fill="#F2A93B" />
      <rect x="26" y="22" width="48" height="12" rx="4" fill="#D5451B" />
      <path d="M40 40L60 40" stroke="#F6EFE4" strokeWidth="4" strokeLinecap="round" />
      <path d="M50 12C50 12 42 20 42 26C42 30.4 45.6 32 50 32C54.4 32 58 30.4 58 26C58 20 50 12 50 12Z" fill="#D5451B" />
    </svg>
  );
}
