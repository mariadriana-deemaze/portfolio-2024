import { STACKS } from '@/components/stacks';
import { LuGithub, LuLinkedin, LuInstagram } from 'react-icons/lu';

enum Intervention {
	FrontEndDevelopment = 'Front-end',
	BackEndDevelopment = 'Back-end',
	FullStackDevelopment = 'Full stack',
	Design = 'Design'
}

export const data = {
	name: 'Maria Adriana',
	role: 'Full stack developer',
	initials: 'MA',
	location: 'Portugal, Coimbra',
	locationLink: 'https://www.google.com/maps/place/Coimbra',
	about: 'The dangerous combo of a curious yet anxious overthinker - I think coffee is also somewhere in the equation.',
	summary: `Communication designer, who ultimately ended up self-converting to software development, due to a more akin liking over the exact sciences. 
Started my career path by working in webdesign, embraced a few more challenges within the role of bringing said designs to life, and et voila, now we are here.
Thrilled to continue my journey as a software developer, blending my design background with technical skills to build awesome things.`,
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
			}
		]
	},
	education: [
		{
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
			title: 'Designer/Front-end developer',
			logo: '',
			start: '2020',
			end: '2022',
			description: `
				Developed cross-platform mobile apps with React Native (TS), Kalipso, and Axway Titanium for seamless experiences on multiple devices. Provided support for e-commerce stores, including customizing and maintaining systems built on WooCommerce and PrestaShop. Designed and implemented intuitive user interfaces that met client acceptance criteria and enhanced the overall user experience. Created visually appealing graphics for web and print materials, and edited video content for social media to promote the brand and drive engagement.`,
			stack: [
				STACKS.React,
				STACKS.Expo,
				STACKS.Appcelerator,
				STACKS.PHP,
				STACKS.MySQL,
				STACKS.Wordpress,
				STACKS.Prestashop,
				STACKS.Figma
			]
		}
	],
	projects: [
		{
			title: 'maria-adriana.com',
			techStack: [Intervention.FullStackDevelopment, Intervention.Design],
			description: 'This very site, built with Next.js.',
			preview: '/images/projects/portfolio/preview.png',
			link: {
				label: 'maria-adriana.com',
				href: 'https://maria-adriana.com/'
			}
		},
		{
			title: 'Eativity',
			techStack: [Intervention.FullStackDevelopment, Intervention.Design],
			description:
				'A daily log mobile App for helping tracking adherence to a healthier life style.',
			preview: '/images/projects/eativity/preview.png',
			link: {
				label: 'github repo',
				href: 'https://github.com/mariadriana-deemaze/eativity'
			}
		},
		{
			title: 'Ask me anything',
			techStack: [Intervention.FullStackDevelopment],
			description: 'Web rooms of questions with websockets.',
			preview: '/images/projects/ama/preview.png',
			link: {
				label: 'maria-adriana.com',
				href: 'https://github.com/mariadriana-deemaze/AMA-go-react'
			}
		}
	]
} as const;
