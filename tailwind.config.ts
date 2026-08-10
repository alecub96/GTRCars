import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        alisios: {
          bg: '#FDFBF7',         // Fondo crema cálido como Alisios Picnic
          cardBg: '#F4F9F8',     // Fondo suave azulado/menta de contenedores
          teal: '#14B8A6',       // Verde turquesa/menta principal (#14B8A6 / #0D9488)
          tealHover: '#0F766E',
          berry: '#9D174D',      // Granate de la barra superior / acentos
          gold: '#D97706',       // Dorado tostado de subtítulos ("OPCIÓN MÁS ACCESIBLE")
          textDark: '#0F172A',   // Azul/negro profundo para títulos
          textMuted: '#64748B',  // Gris azulado suave para subtítulos
          border: '#E2E8F0',     // Bordes finos redondeados
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-outfit)', 'Georgia', 'serif'],
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};

export default config;
