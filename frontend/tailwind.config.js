/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          950: "#020617", // slate-950
          900: "#0f172a", // slate-900 (main dark background)
          800: "#1e293b", // slate-800
          700: "#334155", // slate-700
          600: "#475569"  // slate-600
        },
        brand: {
          danger: "#ef4444",    // Red alert
          success: "#10b981",   // Green recovery
          warning: "#f59e0b",   // Orange warnings
          accent: "#3b82f6",    // Blue tracking info
          indigo: "#6366f1"     // Indigo details
        }
      },
      fontFamily: {
        sans: ["Outfit", "Inter", "system-ui", "sans-serif"]
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
