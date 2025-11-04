import { STACKS } from '../components/stacks';
import { LuGithub, LuLinkedin, LuInstagram, LuDribbble, LuCodepen } from 'react-icons/lu';

export const data = {
	name: 'Maria Adriana',
	role: 'Full Stack Developer',
	github: 'https://github.com/mariadriana-deemaze',
	mottos: [
		'Full Stack Designer',
		'Front-end Developer',
		'Interaction Designer',
		'Back-ender wannabe'
	],
	location: 'Portugal, Coimbra',
	locationLink: 'https://www.google.com/maps/place/Coimbra',
	about: 'The dangerous combo of a curious yet anxious overthinker - I think coffee is also somewhere in the equation.',
	summary: `A communication designer turned software developer, driven by a deep passion for problem-solving and the precision of the exact sciences. \n
My journey began in the world of web design, crafting intuitive and visually striking digital experiences. As my curiosity grew, I embraced the challenge of bringing those designs to life through code—blurring the lines between creativity and technical execution. This natural progression led me to fully immerse myself in software development, where I now thrive. \n
I’m excited to continue building innovative solutions that merge design sensibility with technical expertise, leveraging my unique background to create meaningful and impactful digital experiences.`,
	contact: {
		email: 'hello@maria-adriana.com',
		social: [
			{
				name: 'GitHub',
				url: 'https://github.com/mariadriana-deemaze',
				icon: LuGithub
			},
			{
				name: 'LinkedIn',
				url: 'https://www.linkedin.com/in/mariadriana/',
				icon: LuLinkedin
			},
			{
				name: 'Instagram',
				url: 'https://www.instagram.com/mariadriana94/',
				icon: LuInstagram
			},
			{
				name: 'CodePen',
				url: 'https://codepen.io/mariaadriana94/',
				icon: LuCodepen
			},
			{
				name: 'Dribbble',
				url: 'https://dribbble.com/mariadriana94/',
				icon: LuDribbble
			}
		]
	},
	education: [
		{
			preview: '/images/education/arca_euac.png',
			school: 'Coimbra University School of Arts',
			degree: 'Communication design',
			summary: `Learned the basics of communication design, gaining a broader, enriching vision and background on design history and its applications in today's primary communication mediums.
Came into contact with a variety of multimedia tools, along with traditional art methods.
As a highlight, represented EUAC, with my peers, in a group project at the 2015 Eunique Fair.`,
			start: '2012',
			end: '2015'
		}
	],
	work: [
		{
			company: 'Deemaze Software',
			link: 'https://deemaze.com/',
			preview: '/images/work/deemaze.png',
			title: 'Full Stack Developer',
			logo: '',
			start: '2022',
			end: 'Present',
			description: `
				Consulting in delivering software solutions by closely collaborating with clients to understand their needs and translating them into functional applications. This role has honed my problem-solving skills and adaptability, as I've been challenged on diverse projects with varying technological requirements. I primarily work with web technologies, mainly within the Ruby and NodeJS landscapes.`,
			stack: [
				STACKS.React,
				STACKS.Remix,
				STACKS.TypeScript,
				STACKS.NestJS,
				STACKS.Prisma,
				STACKS.KnexJS,
				STACKS.MikroORM,
				STACKS.Ruby,
				STACKS.Rails,
				STACKS.AWS,
				STACKS.Chakra,
				STACKS.MaterialUI,
				STACKS.PostgreSQL
			]
		},
		{
			company: 'Hes-inovação',
			link: 'https://www.hes-inovacao.com/',
			preview: '/images/work/hes-inov.png',
			title: 'Designer/Front-end developer',
			logo: '',
			start: '2020',
			end: '2022',
			description: `
				Developed cross-platform mobile apps with React Native (TS), Kalipso, and Axway Titanium for seamless experiences on multiple devices. Provided support for e-commerce stores, including customizing and maintaining systems built on WooCommerce and PrestaShop. Designed and implemented intuitive user interfaces that met client acceptance criteria and enhanced the overall user experience. Created visually appealing graphics for web and print materials, and edited video content for social media to promote the brand and drive engagement.`,
			stack: [
				STACKS.ReactNative,
				STACKS.Expo,
				STACKS.Appcelerator,
				STACKS.PHP,
				STACKS.MySQL,
				STACKS.Wordpress,
				STACKS.Prestashop,
				STACKS.Figma
			]
		}
	]
} as const;
