// Minimal inline SVG icon set (no external dependency) used in the
// sidebar and stat cards.
const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', viewBox: '0 0 24 24' };

export const IconHome = (p) => (
  <svg {...common} {...p}><path d="M3 11.5 12 4l9 7.5" /><path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" /></svg>
);
export const IconSearch = (p) => (
  <svg {...common} {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
);
export const IconCalendar = (p) => (
  <svg {...common} {...p}><rect x="3.5" y="5" width="17" height="16" rx="2" /><path d="M8 3v4M16 3v4M3.5 10h17" /></svg>
);
export const IconWrench = (p) => (
  <svg {...common} {...p}><path d="M14.7 6.3a4 4 0 0 0-5.4 5.1L4 16.7 7.3 20l5.3-5.3a4 4 0 0 0 5.1-5.4l-2.6 2.6-2-2z" /></svg>
);
export const IconLifeBuoy = (p) => (
  <svg {...common} {...p}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="3.5" /><path d="m5.5 5.5 3.2 3.2M18.5 5.5l-3.2 3.2M5.5 18.5l3.2-3.2M18.5 18.5l-3.2-3.2" /></svg>
);
export const IconLogOut = (p) => (
  <svg {...common} {...p}><path d="M9 20H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h4" /><path d="M16 17l5-5-5-5M21 12H9" /></svg>
);
export const IconBadge = (p) => (
  <svg {...common} {...p}><path d="M12 2l2.4 1.7 2.9-.2 1 2.7 2.5 1.5-.9 2.8.9 2.8-2.5 1.5-1 2.7-2.9-.2L12 19l-2.4-1.7-2.9.2-1-2.7-2.5-1.5.9-2.8-.9-2.8 2.5-1.5 1-2.7 2.9.2z" /><path d="m9 12 2 2 4-4" /></svg>
);
export const IconClock = (p) => (
  <svg {...common} {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></svg>
);
export const IconRupee = (p) => (
  <svg {...common} {...p}><path d="M6 4h12M6 9h12M6 4c4.5 0 8 1.4 8 5s-3.5 5-8 5l8 6" /></svg>
);
export const IconMapPin = (p) => (
  <svg {...common} {...p}><path d="M12 21s7-6.3 7-11.5A7 7 0 0 0 5 9.5C5 14.7 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></svg>
);
export const IconStar = (p) => (
  <svg {...common} {...p}><path d="m12 3 2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.2-5.4 3.2 1.3-6L3.3 9.2l6.1-.6z" /></svg>
);
