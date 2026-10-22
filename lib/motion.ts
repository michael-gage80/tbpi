// House motion language. One ease-out curve ("settling") for almost everything,
// long durations, short staggers. Mirrors the CSS tokens in app/globals.css.
export const EASE = [0.22, 1, 0.36, 1] as const;
export const EASE_IN_OUT = [0.76, 0, 0.24, 1] as const;

export const DURATION = {
  fast: 0.5,
  base: 0.9,
  slow: 1.25,
} as const;

export const STAGGER = 0.08;
