export function BurgerArt({
  className = "",
  pattyColor = "#5A2E1D",
  bunColor = "#F2A93B",
  drizzle,
  extra,
}: {
  className?: string;
  /** Patty fill — darker wagyu brown for beef, golden for a chicken fillet. */
  pattyColor?: string;
  bunColor?: string;
  /** Optional sauce squiggle drawn over the cheese layer (e.g. mustard, BBQ). */
  drizzle?: string;
  /** Optional extra topping poking out from the side. */
  extra?: "bacon" | "egg";
}) {
  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label="Illustration of a smashed burger">
      <ellipse cx="100" cy="176" rx="70" ry="10" fill="#1E1A17" opacity="0.15" />
      {/* top bun */}
      <path d="M35 96C35 62 63 40 100 40C137 40 165 62 165 96C165 101.5 160.5 106 155 106H45C39.5 106 35 101.5 35 96Z" fill={bunColor} />
      <path d="M35 96C35 62 63 40 100 40C137 40 165 62 165 96" fill="none" stroke="#D5451B" strokeOpacity="0.15" strokeWidth="2" />
      <circle cx="72" cy="60" r="2.6" fill="#F6EFE4" />
      <circle cx="100" cy="52" r="2.6" fill="#F6EFE4" />
      <circle cx="128" cy="60" r="2.6" fill="#F6EFE4" />
      <circle cx="88" cy="68" r="2.2" fill="#F6EFE4" />
      <circle cx="114" cy="68" r="2.2" fill="#F6EFE4" />
      {/* lettuce */}
      <path d="M32 108C40 102 50 112 58 106C66 100 74 112 84 106C94 100 104 112 114 106C124 100 134 112 144 106C152 102 164 106 168 110L164 122H36L32 108Z" fill="#5B8C4A" />
      {/* patty */}
      <rect x="34" y="118" width="132" height="18" rx="8" fill={pattyColor} />
      {extra === "bacon" ? (
        <path
          d="M28 116C44 110 56 122 72 116C88 110 100 122 116 116C132 110 144 122 160 116L164 128C148 134 136 122 120 128C104 134 92 122 76 128C60 134 48 122 32 128Z"
          fill="#B23A2E"
        />
      ) : null}
      {extra === "egg" ? (
        <g>
          <ellipse cx="100" cy="114" rx="30" ry="12" fill="#F6EFE4" />
          <circle cx="100" cy="114" r="9" fill="#F2A93B" />
        </g>
      ) : null}
      {/* cheese */}
      <path d="M30 132L60 140L45 150L20 142Z" fill="#F2A93B" />
      <path d="M170 132L140 140L155 150L180 142Z" fill="#F2A93B" />
      <rect x="34" y="132" width="132" height="10" fill="#F2A93B" opacity="0.9" />
      {drizzle ? (
        <path
          d="M40 137C55 129 65 145 80 137C95 129 105 145 120 137C135 129 145 145 160 137"
          fill="none"
          stroke={drizzle}
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      ) : null}
      {/* bottom bun */}
      <path d="M38 148H162C160 164 134 176 100 176C66 176 40 164 38 148Z" fill="#E08B3A" />
      <rect x="38" y="146" width="124" height="8" rx="4" fill="#F2A93B" />
    </svg>
  );
}

export function FriesArt({ className = "", topping }: { className?: string; topping?: "cheese" | "mushroom" }) {
  return (
    <svg viewBox="0 0 100 100" className={className} role="img" aria-label="Illustration of fries">
      <path d="M28 92L24 40H72L68 92C68 96 64 98 60 98H36C32 98 28.5 96 28 92Z" fill="#D5451B" />
      <rect x="27" y="30" width="10" height="42" rx="3" fill="#F2A93B" transform="rotate(-6 32 51)" />
      <rect x="40" y="22" width="10" height="52" rx="3" fill="#F6EFE4" />
      <rect x="52" y="26" width="10" height="48" rx="3" fill="#F2A93B" />
      <rect x="63" y="34" width="10" height="42" rx="3" fill="#F6EFE4" transform="rotate(7 68 55)" />
      {topping === "cheese" ? (
        <path d="M26 58C36 52 46 62 56 56C64 51 70 58 70 58L67 70C56 76 46 66 36 72C31 75 27 72 27 72Z" fill="#F2A93B" opacity="0.92" />
      ) : null}
      {topping === "mushroom" ? (
        <>
          <path d="M26 58C36 52 46 62 56 56C64 51 70 58 70 58L67 70C56 76 46 66 36 72C31 75 27 72 27 72Z" fill="#EADFC8" opacity="0.9" />
          <circle cx="38" cy="62" r="3" fill="#8C7A5A" />
          <circle cx="52" cy="66" r="3" fill="#8C7A5A" />
        </>
      ) : null}
    </svg>
  );
}

export function DrinkArt({
  className = "",
  cupColor = "#F2A93B",
  capColor = "#D5451B",
}: {
  className?: string;
  cupColor?: string;
  capColor?: string;
}) {
  return (
    <svg viewBox="0 0 100 100" className={className} role="img" aria-label="Illustration of a soft drink cup">
      <path d="M30 30H70L64 92C63.6 95.9 60.3 99 56.3 99H43.7C39.7 99 36.4 95.9 36 92L30 30Z" fill={cupColor} />
      <rect x="26" y="22" width="48" height="12" rx="4" fill={capColor} />
      <path d="M40 40L60 40" stroke="#F6EFE4" strokeWidth="4" strokeLinecap="round" />
      <path d="M50 12C50 12 42 20 42 26C42 30.4 45.6 32 50 32C54.4 32 58 30.4 58 26C58 20 50 12 50 12Z" fill={capColor} />
    </svg>
  );
}

export function TenderArt({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} role="img" aria-label="Illustration of chicken tenders">
      <ellipse cx="50" cy="85" rx="38" ry="8" fill="#1E1A17" opacity="0.12" />
      <path d="M20 62C16 50 26 38 40 40C48 30 62 32 66 44C78 44 84 58 76 68C80 78 70 88 58 84C50 90 36 88 32 78C20 78 16 70 20 62Z" fill="#F2A93B" />
      <path d="M46 66C42 56 50 48 60 50C66 44 74 48 74 56C82 58 84 68 76 74C78 80 70 86 62 82C56 86 48 82 48 74C42 74 42 68 46 66Z" fill="#E8933C" />
      <circle cx="32" cy="56" r="2" fill="#B5741F" />
      <circle cx="44" cy="48" r="2" fill="#B5741F" />
      <circle cx="60" cy="60" r="2" fill="#B5741F" />
      <circle cx="66" cy="70" r="2" fill="#B5741F" />
    </svg>
  );
}

export function SauceArt({ className = "", color = "#D5451B" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} role="img" aria-label="Illustration of a sauce cup">
      <path d="M28 42H72L67 84C66.6 88.4 62.9 92 58.5 92H41.5C37.1 92 33.4 88.4 33 84L28 42Z" fill="#F6EFE4" />
      <path d="M31 45H69L64.5 82C64.2 84.8 61.8 87 59 87H41C38.2 87 35.8 84.8 35.5 82L31 45Z" fill={color} />
      <rect x="24" y="32" width="52" height="12" rx="6" fill="#EADFC8" />
    </svg>
  );
}

export function ToppingArt({
  className = "",
  type,
}: {
  className?: string;
  type: "patty" | "cheese" | "bacon" | "egg" | "onion" | "pickle" | "beetroot";
}) {
  switch (type) {
    case "patty":
      return (
        <svg viewBox="0 0 100 100" className={className} role="img" aria-label="Illustration of an extra patty">
          <ellipse cx="50" cy="72" rx="34" ry="9" fill="#1E1A17" opacity="0.12" />
          <rect x="16" y="48" width="68" height="24" rx="10" fill="#5A2E1D" />
          <circle cx="34" cy="60" r="2" fill="#3B1E12" />
          <circle cx="50" cy="56" r="2" fill="#3B1E12" />
          <circle cx="66" cy="60" r="2" fill="#3B1E12" />
        </svg>
      );
    case "cheese":
      return (
        <svg viewBox="0 0 100 100" className={className} role="img" aria-label="Illustration of extra cheese">
          <path d="M15 70L85 70L55 32Z" fill="#F2A93B" />
          <circle cx="60" cy="55" r="2.4" fill="#E08B3A" />
          <circle cx="50" cy="62" r="2" fill="#E08B3A" />
        </svg>
      );
    case "bacon":
      return (
        <svg viewBox="0 0 100 100" className={className} role="img" aria-label="Illustration of a bacon rasher">
          <path
            d="M14 34C30 26 40 42 56 34C72 26 82 42 90 36L84 52C74 58 64 44 50 52C36 60 26 46 14 52Z"
            fill="#B23A2E"
          />
          <path
            d="M18 58C34 50 44 66 60 58C76 50 84 64 90 60L84 76C74 82 64 68 50 76C36 84 26 70 16 76Z"
            fill="#8C2A20"
          />
        </svg>
      );
    case "egg":
      return (
        <svg viewBox="0 0 100 100" className={className} role="img" aria-label="Illustration of a fried egg">
          <ellipse cx="50" cy="58" rx="38" ry="24" fill="#F6EFE4" />
          <circle cx="50" cy="58" r="15" fill="#F2A93B" />
          <circle cx="50" cy="58" r="15" fill="none" stroke="#E08B3A" strokeWidth="2" />
        </svg>
      );
    case "onion":
      return (
        <svg viewBox="0 0 100 100" className={className} role="img" aria-label="Illustration of minced onion">
          <circle cx="36" cy="46" r="14" fill="none" stroke="#B78CC7" strokeWidth="5" />
          <circle cx="62" cy="40" r="10" fill="none" stroke="#F6EFE4" strokeWidth="4" />
          <circle cx="52" cy="66" r="12" fill="none" stroke="#B78CC7" strokeWidth="5" />
          <circle cx="74" cy="64" r="9" fill="none" stroke="#F6EFE4" strokeWidth="4" />
        </svg>
      );
    case "pickle":
      return (
        <svg viewBox="0 0 100 100" className={className} role="img" aria-label="Illustration of pickles">
          <ellipse cx="34" cy="50" rx="16" ry="15" fill="#5B8C4A" />
          <ellipse cx="64" cy="60" rx="16" ry="15" fill="#6FA05A" />
          <circle cx="30" cy="46" r="1.6" fill="#3E6332" />
          <circle cx="38" cy="54" r="1.6" fill="#3E6332" />
          <circle cx="60" cy="56" r="1.6" fill="#4C7A3E" />
          <circle cx="68" cy="64" r="1.6" fill="#4C7A3E" />
        </svg>
      );
    case "beetroot":
      return (
        <svg viewBox="0 0 100 100" className={className} role="img" aria-label="Illustration of beetroot">
          <circle cx="50" cy="55" r="26" fill="#7A1F3A" />
          <circle cx="50" cy="55" r="26" fill="none" stroke="#5C1628" strokeWidth="3" />
          <path d="M50 29C46 22 54 18 58 14" stroke="#5B8C4A" strokeWidth="4" fill="none" strokeLinecap="round" />
        </svg>
      );
  }
}
