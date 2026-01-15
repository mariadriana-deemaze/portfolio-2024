import type { Config } from 'tailwindcss';

import typography from '@tailwindcss/typography';
import tailwindcssAnimate from 'tailwindcss-animate';

const config = {
	darkMode: ['class'],
	content: [
		'./index.html',
		'./src/**/*.{ts,tsx,mdx}',
		'./src/styles/**/*.css',
		'./content/**/*.mdx',
	],
	theme: {
		container: {
			center: true,
			padding: {
				DEFAULT: '0.75rem',
				sm: '2rem',
			},
			screens: {
				'2xl': '1400px',
			},
		},
		extend: {
			fontFamily: {
				clash: ['ClashDisplay', 'sans-serif'],
			},
			gridTemplateColumns: {
				27: 'repeat(27, minmax(0, 1fr))',
				52: 'repeat(52, minmax(0, 1fr))',
			},
			typography: {
				quoteless: {
					css: {
						'blockquote p:first-of-type::before': { content: 'none' },
						'blockquote p:first-of-type::after': { content: 'none' },
					},
				},
			},
            colors: {
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
			animation: {
				'hand-wave': 'hand-wave 1s ease-in-out infinite',
			},
			keyframes: {
				'hand-wave': {
					'0%': { transform: 'rotate(-15deg)' },
					'30%': { transform: 'rotate(10deg)' },
					'60%': { transform: 'rotate(-15deg)' },
					'100%': { transform: 'rotate(-15deg)' },
				},
			},
		},
	},
	future: {
		hoverOnlyWhenSupported: true,
	},
	plugins: [tailwindcssAnimate, typography],
} satisfies Config;

export default config;
