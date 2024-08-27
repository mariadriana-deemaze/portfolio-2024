import {
	SiAmazon,
	SiBootstrap,
	SiChakraui,
	SiExpo,
	SiExpress,
	SiFigma,
	SiFirebase,
	SiJest,
	SiJquery,
	SiKnexdotjs,
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
import { DiAppcelerator } from "react-icons/di";

const iconSize = 15;

export const STACKS = {
	PHP: {
		label: 'PHP',
		icon: <SiPhp size={iconSize} className="text-blue-500" />
	},
	Appcelerator: {
		label: 'Appcelerator',
		icon: <DiAppcelerator  size={iconSize} className="text-red-500" />
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
		label: 'Ruby on Rails',
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
	Figma: { label: 'Figma', icon: <SiFigma size={iconSize} className="text-black" /> },
	Express: { label: 'Express', icon: <SiExpress size={iconSize} /> },
	NestJS: { label: 'NestJS', icon: <SiNestjs size={iconSize} className="text-red-600" /> },
	Jquery: { label: 'JQuery', icon: <SiJquery size={iconSize} className="text-blue-600" /> },
	AWS: { label: 'AWS', icon: <SiAmazon size={iconSize} className="text-orange-600" /> },
	PostgreSQL: {
		label: 'PostgreSQL',
		icon: <SiPostgresql size={iconSize} className="text-blue-600" />
	},
	MySQL: { label: 'MySQL', icon: <SiMysql size={iconSize} className="text-orange-600" /> },
	Prestashop: {
		label: 'Prestashop',
		icon: <SiPrestashop size={iconSize} className="text-pink-600" />
	},
	Wordpress: {
		label: 'Wordpress',
		icon: <SiWordpress size={iconSize} className="text-blue-600" />
	},
	KnexJS: {
		label: 'KnexJS',
		icon: <SiKnexdotjs size={iconSize} className="text-orange-600" />
	},
	MikroORM: {
		label: 'Mikro-ORM',
		icon: (
			<svg
				width={iconSize}
				height={iconSize}
				viewBox={`0 0 441 461`}
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M383.862 322.531C340.167 347.759 282.223 361.648 220.681 361.648C159.139 361.648 101.181 347.758 57.5 322.531C40.97 312.987 27.216 302.239 16.4 290.593C6.34802 304.819 0.760986 320.317 0.760986 336.54C0.760986 405.067 99.416 460.827 220.681 460.827C341.939 460.827 440.591 405.067 440.591 336.54C440.591 320.31 435.004 304.819 424.951 290.593C414.13 302.239 400.384 312.987 383.862 322.531Z"
					fill="#166788"
				/>
				<path
					d="M429.263 185.334C417.878 198.864 402.672 211.31 383.863 222.178C378.836 225.08 373.599 227.81 368.208 230.413C365.693 231.617 363.159 232.781 360.607 233.906C358.002 235.05 355.381 236.159 352.746 237.234C314.242 252.844 268.558 261.288 220.683 261.288C172.791 261.288 127.121 252.844 88.61 237.234C85.9719 236.161 83.3486 235.051 80.741 233.906C78.1907 232.78 75.6574 231.615 73.142 230.413C67.757 227.81 62.521 225.08 57.502 222.178C38.676 211.31 23.463 198.865 12.094 185.334C4.77899 197.712 0.761963 210.906 0.761963 224.646C0.761963 240.861 6.34899 256.366 16.386 270.577C17.6573 272.356 18.9745 274.102 20.3361 275.813C21.6492 277.438 23.0009 279.031 24.39 280.592C60.681 321.086 135.012 348.925 220.682 348.925C306.337 348.925 380.668 321.086 416.966 280.592C418.357 279.035 419.706 277.441 421.013 275.813C422.377 274.109 423.69 272.365 424.952 270.584C435.005 256.365 440.592 240.876 440.592 224.645C440.592 210.906 436.583 197.705 429.263 185.334Z"
					fill="#166788"
				/>
				<path
					d="M220.682 0C99.417 0 0.761963 55.759 0.761963 124.287C0.761963 138.019 4.77799 151.228 12.094 163.584C13.2361 165.518 14.4458 167.412 15.7209 169.261C16.9494 171.027 18.2212 172.763 19.535 174.467C34.846 193.989 58.765 210.884 88.609 223.593C91.4544 224.81 94.3219 225.974 97.21 227.086C100.234 228.243 103.276 229.353 106.335 230.414C139.679 241.925 178.827 248.574 220.682 248.574C262.521 248.574 301.677 241.925 335.021 230.414C338.079 229.351 341.121 228.242 344.145 227.086C347.032 225.973 349.9 224.808 352.746 223.593C382.584 210.885 406.503 193.989 421.806 174.467C423.135 172.771 424.412 171.034 425.636 169.261C426.909 167.413 428.119 165.522 429.264 163.592C436.584 151.228 440.593 138.02 440.593 124.287C440.592 55.759 341.939 0 220.682 0ZM335.298 145.88C334.669 146.945 334.003 147.987 333.301 149.006C332.632 149.98 331.932 150.933 331.204 151.863C322.79 162.581 309.641 171.87 293.263 178.849C291.694 179.518 290.112 180.159 288.52 180.771C286.862 181.41 285.194 182.023 283.517 182.611C265.193 188.924 243.673 192.589 220.682 192.589C197.69 192.589 176.17 188.924 157.846 182.611C156.164 182.022 154.491 181.409 152.827 180.771C151.242 180.16 149.668 179.519 148.107 178.849C131.712 171.87 118.57 162.581 110.149 151.863C109.427 150.928 108.728 149.976 108.054 149.006C107.354 147.988 106.691 146.945 106.065 145.88C102.041 139.081 99.827 131.841 99.827 124.287C99.827 86.628 154.039 55.984 220.681 55.984C287.323 55.984 341.528 86.628 341.528 124.287C341.528 131.841 339.32 139.081 335.298 145.88Z"
					fill="#1A1A1A"
				/>
			</svg>
		)
	}
} as const;
