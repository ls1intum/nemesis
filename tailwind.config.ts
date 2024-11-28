import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      // Currently no fix available to get the typed version of theme
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            "--tw-prose-body": theme("colors.foreground"),
            "--tw-prose-headings": theme("colors.foreground"),
            "--tw-prose-lead": theme("colors.foreground"),
            "--tw-prose-links": theme("colors.primary.DEFAULT"),
            "--tw-prose-bold": theme("colors.foreground"),
            "--tw-prose-counters": theme("colors.foreground"),
            "--tw-prose-bullets": theme("colors.foreground"),
            "--tw-prose-hr": theme("colors.border"),
            "--tw-prose-quotes": theme("colors.muted.foreground"),
            "--tw-prose-quote-borders": theme("colors.muted.DEFAULT"),
            "--tw-prose-captions": theme("colors.foreground"),
            "--tw-prose-code": theme("colors.muted.foreground"),
            "--tw-prose-pre-code": theme("colors.muted.foreground"),
            "--tw-prose-pre-bg": theme("colors.muted.background"),
            "--tw-prose-th-borders": theme("colors.border"),
            "--tw-prose-td-borders": theme("colors.border"),
            fontFamily: "inherit",
            code: {
              fontFamily: `"IBM Plex Mono"`,
              background: theme("colors.muted.DEFAULT"),
              fontWeight: 400,
              padding: theme("padding.1"),
              borderRadius: theme("borderRadius.md"),
              "&::before": {
                display: "none",
              },
              "&::after": {
                display: "none",
              },
            },
            thead: {
              background: theme("colors.muted.DEFAULT"),
              color: theme("colors.muted.foreground"),
            },
            "thead th": {
              borderWidth: "1px",
              paddingTop: theme("padding.2"),
              paddingBottom: theme("padding.2"),
              borderColor: "var(--tw-prose-th-borders)",
            },
            "tbody td": {
              borderWidth: "1px !important",
              borderColor: "var(--tw-prose-td-borders)",
            },
            "thead th:first-child": {
              paddingInlineStart: "auto",
            },
            "thead th:last-child": {
              paddingInlineEnd: "auto",
            },
            "tbody td:first-child, tfoot td:first-child": {
              paddingInlineStart: "auto",
            },
            "tbody td:last-child, tfoot td:last-child": {
              paddingInlineEnd: "auto",
            },
          },
        },
      }),
      fontFamily: {
        sans: [
          "IBM Plex Sans",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
        },
        controller: {
          DEFAULT: "hsl(var(--controller))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      padding: {
        "md-screen": "var(--p-md-screen)",
      },
      margin: {
        "md-screen": "var(--p-md-screen)",
      },
      fontSize: {
        "8.5xl": "7rem",
      },
      backgroundImage: {
        nebula:
          "radial-gradient(circle farthest-corner at 3.2% 49.6%, rgba(80,12,139,0.87) 0%, rgba(161,10,144,0.72) 83.6%)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "neon-lights": {
          "0%": { opacity: "0" },
          "15%": { opacity: "1" },
          "30%": { opacity: "0" },
          "50%": { opacity: "0" },
          "65%": { opacity: "1" },
          "80%": { opacity: "0" },
          "100%": { opacity: "0" },
        },
        "rotate-keyframes": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "neon-lights": "neon-lights 2s linear infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "rotate-animation": "rotate-keyframes 1s linear infinite",
      },
    },
  },
} satisfies Config;
