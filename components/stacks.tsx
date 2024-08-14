import {
	SiAmazon,
	SiAngular,
	SiBootstrap,
	SiChakraui,
	SiExpo,
	SiExpress,
	SiFigma,
	SiFirebase,
	SiJest,
	SiJquery,
	SiLaravel,
	SiMui,
	SiMysql,
	SiNestjs,
	SiNextdotjs,
	SiNodedotjs,
	SiPhp,
	SiPostgresql,
	SiPrestashop,
	SiPrisma,
	SiReact,
	SiRedux,
	SiRemix,
	SiRuby,
	SiRubyonrails,
	SiSass,
	SiStorybook,
	SiStyledcomponents,
	SiTailwindcss,
	SiTypescript,
	SiVite,
	SiWebpack,
	SiWordpress
} from 'react-icons/si';

const iconSize = 15;

export const STACKS = {
	PHP: {
		label: 'PHP',
		icon: <SiPhp size={iconSize} className="text-blue-500" />
	},
	TypeScript: {
		label: 'Typescript',
		icon: <SiTypescript size={iconSize} className="text-blue-400" />
	},
	Next: { label: 'NextJS', icon: <SiNextdotjs size={iconSize} /> },
	React: { label: 'ReactJS', icon: <SiReact size={iconSize} className="text-sky-500" /> },
	Remix: { label: 'Remix', icon: <SiRemix size={iconSize} /> },
	Expo: { label: 'Expo', icon: <SiExpo size={iconSize} /> },
	TailwindCSS: {
		label: 'TailwindCSS',
		icon: <SiTailwindcss size={iconSize} className="text-cyan-300" />
	},
	Bootstrap: {
		label: 'BootstrapCSS',
		icon: <SiBootstrap size={iconSize} className="text-purple-500" />
	},
	Laravel: { label: 'Laravel', icon: <SiLaravel size={iconSize} className="text-red-500" /> },
	MaterialUI: { label: 'MUI', icon: <SiMui size={iconSize} className="text-sky-400" /> },
	Chakra: { label: 'Chakra', icon: <SiChakraui size={iconSize} className="text-emerald-300" /> },
	Vite: { label: 'Vite', icon: <SiVite size={iconSize} className="text-purple-500" /> },
	Prisma: { label: 'Prisma', icon: <SiPrisma size={iconSize} className="text-blue-500" /> },
	Ruby: { label: 'Ruby', icon: <SiRuby size={iconSize} className="text-red-700" /> },
	Rails: {
		label: 'Ruby on rails',
		icon: <SiRubyonrails size={iconSize} className="text-red-700" />
	},
	Firebase: {
		label: 'Firebase',
		icon: <SiFirebase size={iconSize} className="text-yellow-500" />
	},
	NodeJS: { label: 'NodeJS', icon: <SiNodedotjs size={iconSize} className="text-green-600" /> },
	Redux: { label: 'Redux', icon: <SiRedux size={iconSize} className="text-purple-500" /> },
	Webpack: { label: 'Webpack', icon: <SiWebpack size={iconSize} className="text-blue-500" /> },
	StyledComponents: {
		label: 'Styled components',
		icon: <SiStyledcomponents size={iconSize} className="text-pink-500" />
	},
	Jest: { label: 'Jest', icon: <SiJest size={iconSize} className="text-red-600" /> },
	Storybook: {
		label: 'Storybook',
		icon: <SiStorybook size={iconSize} className="text-amber-500" />
	},
	SASS: { label: 'Sass', icon: <SiSass size={iconSize} className="text-pink-300" /> },
	Figma: { label: 'Sass', icon: <SiFigma size={iconSize} className="text-emerald-300" /> },
	Express: { label: 'Express', icon: <SiExpress size={iconSize} /> },
	NestJS: { label: 'NestJS', icon: <SiNestjs size={iconSize} className="text-red-600" /> },
	Jquery: { label: 'JQuery', icon: <SiJquery size={iconSize} className="text-blue-600" /> },
	AWS: { label: 'AWS', icon: <SiAmazon size={iconSize} className="text-orange-600" /> },
	PostgreSQL: {
		label: 'PostgreSQL',
		icon: <SiPostgresql size={iconSize} className="text-blue-600" />
	},
	MySQL: { label: 'MySQL ', icon: <SiMysql size={iconSize} className="text-orange-600" /> },
	Prestashop: {
		label: 'Prestashop',
		icon: <SiPrestashop size={iconSize} className="text-pink-600" />
	},
	Wordpress: {
		label: 'Wordpress  ',
		icon: <SiWordpress size={iconSize} className="text-blue-600" />
	}
} as const;
