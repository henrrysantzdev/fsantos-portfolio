// Tailwind 3 build for the static Stitch home (public/stitch). Regenerate with `npm run stitch:css`.
module.exports = {
  content: ["./public/stitch/index.html", "./public/stitch/portfolio.js"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "outline-variant": "#554336", "inverse-on-surface": "#203148", "on-secondary": "#1e314c", "primary-fixed": "#ffdcc4",
        "error": "#ffb4ab", "surface-container-low": "#091c32", "on-error-container": "#ffdad6", "background": "#021429",
        "surface-container-high": "#192b41", "on-secondary-fixed": "#061c36", "surface": "#021429", "surface-bright": "#293a51",
        "tertiary": "#9ccaff", "on-background": "#d4e3ff", "on-secondary-container": "#a3b6d8", "on-surface": "#d4e3ff",
        "secondary-container": "#354764", "surface-dim": "#021429", "on-tertiary-container": "#00375e", "inverse-surface": "#d4e3ff",
        "primary": "#ffb781", "on-primary-container": "#562a00", "on-secondary-fixed-variant": "#354764", "on-tertiary": "#003256",
        "secondary": "#b4c7ea", "primary-fixed-dim": "#ffb781", "on-tertiary-fixed": "#001d35", "on-primary": "#4e2600",
        "primary-container": "#ea8427", "outline": "#a38c7d", "surface-tint": "#ffb781", "tertiary-fixed-dim": "#9ccaff",
        "tertiary-fixed": "#d0e4ff", "on-primary-fixed": "#2f1400", "secondary-fixed": "#d5e3ff", "surface-variant": "#25364d",
        "error-container": "#93000a", "inverse-primary": "#934b00", "surface-container": "#0e2036", "on-error": "#690005",
        "secondary-fixed-dim": "#b4c7ea", "surface-container-lowest": "#000e22", "surface-container-highest": "#25364d",
        "tertiary-container": "#5fa2e5", "on-surface-variant": "#dcc2b1", "on-tertiary-fixed-variant": "#00497b", "on-primary-fixed-variant": "#703800",
      },
      borderRadius: { DEFAULT: "0.25rem", lg: "0.5rem", xl: "0.75rem", full: "9999px" },
      spacing: {
        "margin": "3rem", "space-xl": "2.5rem", "gutter-mobile": "1rem", "gutter": "1.5rem", "space-sm": "0.5rem",
        "space-md": "1rem", "space-lg": "1.5rem", "margin-mobile": "1.25rem", "space-xs": "0.25rem",
      },
      fontFamily: {
        "label-badge": ["Plus Jakarta Sans"], "label-code": ["JetBrains Mono"], "title-lg": ["Plus Jakarta Sans"],
        "body-sm": ["Plus Jakarta Sans"], "headline-lg": ["Plus Jakarta Sans"], "body-lg": ["Plus Jakarta Sans"],
        "headline-md": ["Plus Jakarta Sans"], "headline-xl-mobile": ["Plus Jakarta Sans"], "body-md": ["Plus Jakarta Sans"],
        "headline-xl": ["Plus Jakarta Sans"], "headline-lg-mobile": ["Plus Jakarta Sans"], "title-md": ["Plus Jakarta Sans"],
      },
      fontSize: {
        "label-badge": ["12px", { lineHeight: "16px", fontWeight: "600" }],
        "label-code": ["11px", { lineHeight: "16px", letterSpacing: "0.08em", fontWeight: "600" }],
        "title-lg": ["20px", { lineHeight: "28px", fontWeight: "700" }],
        "body-sm": ["12px", { lineHeight: "18px", fontWeight: "400" }],
        "headline-lg": ["36px", { lineHeight: "44px", fontWeight: "700" }],
        "body-lg": ["16px", { lineHeight: "26px", fontWeight: "400" }],
        "headline-md": ["24px", { lineHeight: "32px", fontWeight: "700" }],
        "headline-xl-mobile": ["32px", { lineHeight: "40px", fontWeight: "800" }],
        "body-md": ["14px", { lineHeight: "22px", fontWeight: "400" }],
        "headline-xl": ["48px", { lineHeight: "56px", fontWeight: "800" }],
        "headline-lg-mobile": ["26px", { lineHeight: "34px", fontWeight: "700" }],
        "title-md": ["16px", { lineHeight: "24px", fontWeight: "600" }],
      },
    },
  },
}
