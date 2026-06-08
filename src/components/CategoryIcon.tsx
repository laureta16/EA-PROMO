type IconProps = { className?: string };

const props = {
  width: 32,
  height: 32,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const ICONS: Record<string, (p: IconProps) => React.JSX.Element> = {
  stilolapsa: ({ className }) => (
    <svg {...props} className={className}>
      <path d="M14.5 3.5l6 6L9 21H3v-6L14.5 3.5z" />
      <path d="M13 5l6 6" />
    </svg>
  ),
  bluza: ({ className }) => (
    <svg {...props} className={className}>
      <path d="M8.5 3l-5 3 1.5 4L7 9v11h10V9l2 1 1.5-4-5-3-1 2a3 3 0 01-5 0l-1-2z" />
    </svg>
  ),
  flamur: ({ className }) => (
    <svg {...props} className={className}>
      <path d="M5 21V4" />
      <path d="M5 4h11l-2 4 2 4H5" />
    </svg>
  ),
  kartvizita: ({ className }) => (
    <svg {...props} className={className}>
      <rect x="2.5" y="5" width="19" height="14" rx="2" />
      <circle cx="8" cy="11" r="2" />
      <path d="M14 10h5M14 13h5M6 16h12" />
    </svg>
  ),
  cakmak: ({ className }) => (
    <svg {...props} className={className}>
      <path d="M12 3c0 4-4 5-4 9a4 4 0 008 0c0-3-2-4-2-7" />
      <path d="M12 14a2 2 0 002-2c0-1-1-2-2-3" />
    </svg>
  ),
  mousepad: ({ className }) => (
    <svg {...props} className={className}>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <circle cx="17" cy="12" r="1.4" fill="currentColor" />
    </svg>
  ),
  bracelet: ({ className }) => (
    <svg {...props} className={className}>
      <ellipse cx="12" cy="12" rx="9" ry="6" />
      <ellipse cx="12" cy="12" rx="9" ry="2.5" opacity="0.6" />
    </svg>
  ),
  trofe: ({ className }) => (
    <svg {...props} className={className}>
      <path d="M7 4h10v4a5 5 0 01-10 0V4z" />
      <path d="M7 6H4v2a3 3 0 003 3M17 6h3v2a3 3 0 01-3 3" />
      <path d="M9 13l1 4h4l1-4M8 21h8M12 17v4" />
    </svg>
  ),
  "set-biznesi": ({ className }) => (
    <svg {...props} className={className}>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2" />
      <path d="M3 13h18" />
    </svg>
  ),
  tabela: ({ className }) => (
    <svg {...props} className={className}>
      <path d="M8 3l-4 17M16 3l4 17M4 20h16" />
      <rect x="7" y="5" width="10" height="10" rx="1" />
    </svg>
  ),
  erashka: ({ className }) => (
    <svg {...props} className={className}>
      <path d="M12 20V8" />
      <path d="M12 8L4 16" />
      <path d="M12 8L20 16" />
      <path d="M12 8a8 8 0 00-8 8h16a8 8 0 00-8-8z" />
    </svg>
  ),
};

const COLOR_BY_SLUG: Record<string, { bg: string; fg: string }> = {
  stilolapsa: { bg: "linear-gradient(135deg,#2872b8,#3b87cf)", fg: "#ffffff" },
  bluza: { bg: "linear-gradient(135deg,#ef4444,#f97316)", fg: "#ffffff" },
  flamur: { bg: "linear-gradient(135deg,#0e2238,#1a5089)", fg: "#ffffff" },
  kartvizita: { bg: "linear-gradient(135deg,#0ea5e9,#6db2e1)", fg: "#ffffff" },
  cakmak: { bg: "linear-gradient(135deg,#f97316,#facc15)", fg: "#ffffff" },
  mousepad: { bg: "linear-gradient(135deg,#6366f1,#a78bfa)", fg: "#ffffff" },
  bracelet: { bg: "linear-gradient(135deg,#ec4899,#f472b6)", fg: "#ffffff" },
  trofe: { bg: "linear-gradient(135deg,#eab308,#facc15)", fg: "#ffffff" },
  "set-biznesi": { bg: "linear-gradient(135deg,#10b981,#34d399)", fg: "#ffffff" },
  tabela: { bg: "linear-gradient(135deg,#475569,#94a3b8)", fg: "#ffffff" },
  erashka: { bg: "linear-gradient(135deg,#06b6d4,#22d3ee)", fg: "#ffffff" },
};

export function CategoryIcon({ slug }: { slug: string }) {
  const Comp = ICONS[slug];
  const c = COLOR_BY_SLUG[slug] ?? COLOR_BY_SLUG.stilolapsa;
  return (
    <span
      className="w-16 h-16 md:w-20 md:h-20 rounded-full grid place-items-center shadow-md ring-2 ring-white transition-transform duration-200 group-hover:scale-105"
      style={{ background: c.bg, color: c.fg }}
    >
      {Comp ? <Comp className="w-8 h-8" /> : <span className="text-2xl">◆</span>}
    </span>
  );
}
