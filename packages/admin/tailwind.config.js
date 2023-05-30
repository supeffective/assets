/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // all paths with code containing tailwind classes to analyze:
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './forms/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      boxShadow: {
        'b-current-color-1': 'currentcolor 0px 0px 0px 0px inset, currentcolor 0px 1px 0px 0px',
        'b-current-color-2': 'currentcolor 0px -1px 0px 0px inset, currentcolor 0px 2px 0px 0px',
      },
      colors: {
        // https://vercel.com/design/color
        primary: {
          DEFAULT: '#111111',
          foreground: '#fafafa',
        },
        nxt: {
          // ---- colors go from darkest to lightest and they have 4 shades
          // blacks
          b1: '#000000',
          b2: '#111111',
          b3: '#1a1a1a', // not official
          b4: '#222222', // not official
          // grays
          g1: '#333333',
          g2: '#444444',
          g3: '#666666',
          g4: '#888888',
          // whites
          w1: '#999999',
          w2: '#eaeaea',
          w3: '#fafafa',
          w4: '#ffffff',
          // errors (red)
          err1: '#e60000',
          err2: '#ff0000',
          err3: '#ff3333',
          err4: '#f7d4d6',
          // accent / success (blue)
          acc1: '#0761d1',
          acc2: '#0070f3',
          acc3: '#3291ff',
          acc4: '#d3e5ff',
          // highlights (mix)
          high1: '#ff0080',
          high2: '#eb367f',
          high3: '#f81ce5',
          high4: '#fff500',
          // warnings (yellow)
          warn1: '#ab570a',
          warn2: '#f5a623',
          warn3: '#f7b955',
          warn4: '#ffefcf',
          // violet/purple
          purp1: '#4c2889',
          purp2: '#7928ca',
          purp3: '#8a63d2',
          purp4: '#d8ccf1',
          // cyan/teal
          teal1: '#29bc9b',
          teal2: '#50e3c2',
          teal3: '#79ffe1',
          teal4: '#aaffec',
        },
      },
    },
  },
  plugins: [],
}
