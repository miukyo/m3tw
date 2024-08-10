/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  theme: {
    extend: {
      colors: {
        "primary": "hsl(var(--primary))",
        "on-primary": "hsl(var(--on-primary))",
        "primary-container": "hsl(var(--primary-container))",
        "on-primary-container": "hsl(var(--on-primary-container))",
        "secondary": "hsl(var(--secondary))",
        "on-secondary": "hsl(var(--on-secondary))",
        "secondary-container": "hsl(var(--secondary-container))",
        "on-secondary-container": "hsl(var(--on-secondary-container))",
        "tertiary": "hsl(var(--tertiary))",
        "on-tertiary": "hsl(var(--on-tertiary))",
        "tertiary-container": "hsl(var(--tertiary-container))",
        "on-tertiary-container": "hsl(var(--on-tertiary-container))",
        "error": "hsl(var(--error))",
        "on-error": "hsl(var(--on-error))",
        "error-container": "hsl(var(--error-container))",
        "on-error-container": "hsl(var(--on-error-container))",
        "background": "hsl(var(--background))",
        "on-background": "hsl(var(--on-background))",
        "surface": "hsl(var(--surface))",
        "surface-dim": "hsl(var(--surface-dim))",
        "surface-bright": "hsl(var(--surface-bright))",
        "surface-container-lowest": "hsl(var(--surface-container-lowest))",
        "surface-container-low": "hsl(var(--surface-container-low))",
        "surface-container": "hsl(var(--surface-container))",
        "surface-container-high": "hsl(var(--surface-container-high))",
        "surface-container-highest": "hsl(var(--surface-container-highest))",
        "surface-tint": "hsl(var(--surface-tint))",
        "on-surface": "hsl(var(--on-surface))",
        "surface-variant": "hsl(var(--surface-variant))",
        "on-surface-variant": "hsl(var(--on-surface-variant))",
        "outline": "hsl(var(--outline))",
        "outline-variant": "hsl(var(--outline-variant))",
        "shadow": "hsl(var(--shadow))",
        "scrim": "hsl(var(--scrim))",
        "inverse-surface": "hsl(var(--inverse-surface))",
        "inverse-on-surface": "hsl(var(--inverse-on-surface))",
        "inverse-primary": "hsl(var(--inverse-primary))",
      },
      transitionTimingFunction: {
        emphasized: "cubic-bezier(0.2, 0, 0, 1)",
        "emphasized-accelerate": "cubic-bezier(0.3, 0, 0.8, 0.15)",
        "emphasized-decelerate": "cubic-bezier(0.05, 0.7, 0.1, 1)",
        legacy: "cubic-bezier(0.4, 0, 0.2, 1)",
        "legacy-accelerate": "cubic-bezier(0.4, 0, 1, 1)",
        "legacy-decelerate": "cubic-bezier(0, 0, 0.2, 1)",
        standard: "cubic-bezier(0.2, 0, 0, 1)",
        "standard-accelerate": "cubic-bezier(0.3, 0, 1, 1)",
        "standard-decelerate": "cubic-bezier(0, 0, 0, 1)",
      },
      transitionDuration: {
        "extra-long1": "700ms",
        "extra-long2": "800ms",
        "extra-long3": "900ms",
        "extra-long4": "1000ms",
        long1: "450ms",
        long2: "500ms",
        long3: "550ms",
        long4: "600ms",
        medium1: "250ms",
        medium2: "300ms",
        medium3: "350ms",
        medium4: "400ms",
        short1: "50ms",
        short2: "100ms",
        short3: "150ms",
        short4: "200ms",
      },
      borderRadius: {
        "extra-large": "28px",
        "extra-large-top": "28px 28px 0px 0px",
        "extra-small": "4px",
        "extra-small-top": "4px 4px 0px 0px",
        large: "16px",
        "large-end": "0px 16px 16px 0px",
        "large-start": "16px 0px 0px 16px",
        "large-top": "16px 16px 0px 0px",
        medium: "12px",
        small: "8px",
      },
      boxShadow: {
        level1: "0 0.5px 1.5px 0 rgba(var(--shadow), 19%), 0 0 1px 0 rgba(var(--shadow), 3.9%)",
        level2: "0 0.85px 3px 0 rgba(var(--shadow), 19%), 0 0.25px 1px 0 rgba(var(--shadow), 3.9%)",
        level3: "0 1.25px 5px 0 rgba(var(--shadow), 19%), 0 0.3333px 1.5px 0 rgba(var(--shadow), 3.9%)",
        level4: "0 1.85px 6.25px 0 rgba(var(--shadow), 19%), 0 0.5px 1.75px 0 rgba(var(--shadow), 3.9%)",
        level5: "0 2.75px 9px 0 rgba(var(--shadow), 19%), 0 0.25px 3px 0 rgba(var(--shadow), 3.9%)",
      },
      fontSize: {
        "body-large": [
          "1rem",
          {
            lineHeight: "1.5rem",
            letterSpacing: "0.03125rem",
            fontWeight: "400"
          }
        ],
        "body-medium": [
          "0.875rem",
          {
            lineHeight: "1.25rem",
            letterSpacing: "0.015625rem",
            fontWeight: "400"
          }
        ],
        "body-small": [
          "0.75rem",
          {
            lineHeight: "1rem",
            letterSpacing: "0.025rem",
            fontWeight: "400"
          }
        ],
        "display-large": [
          "3.5625rem",
          {
            lineHeight: "4rem",
            letterSpacing: "-0.015625rem",
            fontWeight: "400"
          }
        ],
        "display-medium": [
          "2.8125rem",
          {
            lineHeight: "3.25rem",
            letterSpacing: "0rem",
            fontWeight: "400"
          }
        ],
        "display-small": [
          "2.25rem",
          {
            lineHeight: "2.75rem",
            letterSpacing: "0rem",
            fontWeight: "400"
          }
        ],
        "headline-large": [
          "2rem",
          {
            lineHeight: "2.5rem",
            letterSpacing: "0rem",
            fontWeight: "400"
          }
        ],
        "headline-medium": [
          "1.75rem",
          {
            lineHeight: "2.25rem",
            letterSpacing: "0rem",
            fontWeight: "400"
          }
        ],
        "headline-small": [
          "1.5rem",
          {
            lineHeight: "2rem",
            letterSpacing: "0rem",
            fontWeight: "400"
          }
        ],
        "label-large": [
          "0.875rem",
          {
            lineHeight: "1.25rem",
            letterSpacing: "0.00625rem",
            fontWeight: "500"
          }
        ],
        "label-medium": [
          "0.75rem",
          {
            lineHeight: "1rem",
            letterSpacing: "0.03125rem",
            fontWeight: "500"
          }
        ],
        "label-small": [
          "0.6875rem",
          {
            lineHeight: "1rem",
            letterSpacing: "0.03125rem",
            fontWeight: "500"
          }
        ],
        "title-large": [
          "1.375rem",
          {
            lineHeight: "1.75rem",
            letterSpacing: "0rem",
            fontWeight: "400"
          }
        ],
        "title-medium": [
          "1rem",
          {
            lineHeight: "1.5rem",
            letterSpacing: "0.009375rem",
            fontWeight: "500"
          }
        ],
        "title-small": [
          "0.875rem",
          {
            lineHeight: "1.25rem",
            letterSpacing: "0.00625rem",
            fontWeight: "500"
          }
        ],
      },
      fontWeight: {
        bold: "700",
        medium: "500",
        regular: "400",
      }
    }
  },
  plugins: [],
}