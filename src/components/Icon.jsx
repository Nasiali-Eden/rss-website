// Stroke-only icon set. Paths copied from the reference HTML where they exist.
const PATHS = {
  // Programme icons
  book: <><path d="M2 5h7a3 3 0 0 1 3 3v12a2 2 0 0 0-2-2H2z" /><path d="M22 5h-7a3 3 0 0 0-3 3v12a2 2 0 0 1 2-2h8z" /></>,
  heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z" />,
  people: <><circle cx="9" cy="7" r="3.5" /><path d="M2 21v-1a6 6 0 0 1 6-6h2a6 6 0 0 1 6 6v1" /><circle cx="17.5" cy="8.5" r="2.5" /><path d="M19 14.2a5 5 0 0 1 3 4.6V20" /></>,
  shield: <><path d="M12 2l8 3v6c0 5-3.4 9-8 11-4.6-2-8-6-8-11V5z" /><circle cx="12" cy="10" r="2.5" /><path d="M8 16.5a4.5 4.5 0 0 1 8 0" /></>,
  drop: <><path d="M12 2.5S5 10.2 5 14.5a7 7 0 0 0 14 0C19 10.2 12 2.5 12 2.5z" /><path d="M9 15a3 3 0 0 0 3 3" /></>,
  sprout: <><path d="M12 21v-9" /><path d="M12 12C12 7 8 5 4 5c0 4 3 7 8 7z" /><path d="M12 14c0-4 3-6 7-6 0 4-3 6-7 6z" /><path d="M6 21h12" /></>,
  // Partner icons
  funding: <><circle cx="12" cy="12" r="9" /><path d="M15 9a3 3 0 0 0-3-1.5c-1.7 0-3 .9-3 2.2 0 3 6 1.6 6 4.6 0 1.3-1.3 2.2-3 2.2a3 3 0 0 1-3-1.5M12 6v1.5M12 16.5V18" /></>,
  technical: <><path d="M14.7 6.3a4 4 0 0 0 5 5l-8.4 8.4a2.1 2.1 0 0 1-3-3z" /><path d="M14.7 6.3L17 4l3 3-2.3 2.3" /></>,
  strategic: <><path d="M8 12l3 3 5-5" /><path d="M2 12l4-4 3 2M22 12l-4-4-3 2" /><path d="M6 8v8l5 4 7-6V8" /></>,
  prayer: <path d="M12 3v18M7 8h10" />,
  resources: <><path d="M3 7l9-4 9 4-9 4z" /><path d="M3 7v10l9 4 9-4V7M12 11v10" /></>,
  // Who we serve
  language: <><path d="M4 5h16v11H9l-5 4z" /><path d="M8 9h8M8 12h5" /></>,
  women: <><circle cx="12" cy="7" r="3.5" /><path d="M5 21l2.5-8h9L19 21" /></>,
  child: <><circle cx="12" cy="6" r="2.5" /><path d="M8 21v-6l-2-4h12l-2 4v6M10 21v-4h4v4" /></>,
  tent: <><path d="M3 20L12 4l9 16z" /><path d="M12 4v16M9 20l3-6 3 6" /></>,
  route: <><circle cx="6" cy="18" r="2.5" /><circle cx="18" cy="6" r="2.5" /><path d="M8.5 18H15a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h6.5" /></>,
  dove: <><path d="M3 14c4 0 6-2 8-5l2-3c1-1.5 3-2 4.5-1L21 6l-3 1c0 6-4 11-11 11H4z" /><path d="M11 9c-2-2-5-3-8-3 0 3 2 6 5 7" /></>,
  home: <><path d="M3 11l9-7 9 7" /><path d="M5 10v10h14V10M10 20v-6h4v6" /></>,
  // UI icons
  pin: <><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></>,
  phone: <path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z" />,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  check: <path d="M4 12l5 5L20 6" />,
  chevron: <path d="M6 9l6 6 6-6" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  arrowLeft: <path d="M15 5l-7 7 7 7" />,
  arrowRight: <path d="M9 5l7 7-7 7" />,
};

export default function Icon({ name, size = 24, strokeWidth = 1.7, className, title }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : 'true'}
      role={title ? 'img' : undefined}
      focusable="false"
    >
      {title && <title>{title}</title>}
      {PATHS[name]}
    </svg>
  );
}
