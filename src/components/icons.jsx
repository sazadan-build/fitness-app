// Simple line-style icons (stroke uses currentColor, so they inherit
// text color/opacity from whatever className is passed in) — used in
// place of emoji for a cleaner, more neutral look.

export function DumbbellIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className}>
      <path d="M4 9v6M2.5 10.5v3M7 7v10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 9v6M21.5 10.5v3M17 7v10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 12h10" strokeLinecap="round" />
    </svg>
  )
}

export function FootstepsIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className}>
      <path
        d="M9 4.5c-1.4 0-2.5 1.4-2.5 3.2 0 1.1.4 1.9.7 2.7.3.8.5 1.4.5 2.3 0 1.9-1.4 2.8-1.4 4.6 0 1.3.9 2.2 2 2.2 1.6 0 2.2-1.6 2.2-3.6V8.9c0-2.6-.5-4.4-1.5-4.4Z"
        strokeLinejoin="round"
      />
      <path
        d="M16 9.5c1.4 0 2.5 1.4 2.5 3.2 0 1.1-.4 1.9-.7 2.7-.3.8-.5 1.4-.5 2.3 0 1.9 1.4 2.8 1.4 4.6 0 1.3-.9 2.2-2 2.2-1.6 0-2.2-1.6-2.2-3.6v-6.9c0-2.6.5-4.5 1.5-4.5Z"
        strokeLinejoin="round"
      />
    </svg>
  )
}
