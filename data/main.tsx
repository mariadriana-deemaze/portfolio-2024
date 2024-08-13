import { Github, Instagram, Linkedin } from 'lucide-react';

// TODO: Review.
export const data = {
	name: 'Maria Adriana',
	role: 'Full stack developer',
	initials: 'MA',
	location: 'Portugal, Coimbra',
	locationLink: 'https://www.google.com/maps/place/Coimbra',
	about: 'The dangerous combo of a curious yet anxious overthinker. Think coffe is also somewhere on the equation.',
	summary: `Since I was young I always had a special taste for drawing and the arts field, and my journey has always been tangent to this taste that has grown with me. I love drawing, imagining, creating, surrounded by things that inspire me to do better - to know, to do, to learn. 
	Overtime, during my work experience, Ive found a new passion in the exact sciences.`,
	contact: {
		email: 'hello@maria-adriana.com',
		social: [
			{
				name: 'GitHub',
				url: 'https://github.com/mariadriana-deemaze',
				icon: Github
			},
			{
				name: 'LinkedIn',
				url: 'https://www.linkedin.com/in/mariadriana/',
				icon: Linkedin
			},
			{
				name: 'Instagram',
				url: 'https://www.instagram.com/mariadriana94/',
				icon: Instagram
			}
		]
	},
	education: [
		{
			school: 'Coimbra University School of Arts',
			degree: 'Communication design',
			summary: `
			Lernt the bases of communication design.
			Represented EUAC in a group project on 2015 Eunique Fair.`,
			start: '2012',
			end: '2015'
		}
	],
	work: [
		{
			company: 'Deemaze Software',
			link: 'https://deemaze.com/',
			badges: [],
			title: 'Full Stack Developer',
			logo: '',
			start: '2022',
			end: 'Present',
			description: `
				Consulted in successfully delivering software solutions by closely collaborating with clients to understand their needs and translate them into functional applications. This role has honed my problem-solving skills and adaptability, as I've worked on diverse projects with varying technological requirements.
				Over time, I expanded my skill set to encompass back-end development, becoming a full-stack developer
				This holistic perspective has been invaluable to my growth, enabling me to deliver comprehensive software solutions that meet both user and business needs.`,
			stack: [
				'React',
				'Remix',
				'Typescript',
				'NestJS',
				'Mikro-ORM',
				'PostgreSQL',
				'AWS',
				'Ruby',
				'Rails'
			]
		},
		{
			company: 'Hes-inovação',
			link: 'https://deemaze.com/',
			badges: [],
			title: 'Designer / Front-end developer',
			logo: '',
			start: '2020',
			end: '2022',
			description: `
				Developed cross-platform mobile apps with React Native (TS), Kalipso, and Axway Titanium for seamless experiences on multiple devices. Provided support for e-commerce stores, including customizing and maintaining systems built on WooCommerce and PrestaShop. Designed and implemented intuitive user interfaces that met client acceptance criteria and enhanced the overall user experience. Created visually appealing graphics for web and print materials, and edited video content for social media to promote the brand and drive engagement.`,
			stack: [
				'React',
				'React Native',
				'Kalipso',
				'Axway Titanium',
				'Figma',
				'PHP',
				'MySQL',
				'Wordpress',
				'Prestashop'
			]
		}
	],
	projects: [
		{
			title: 'maria-adriana.com',
			techStack: ['Next.js', 'Tailwind', 'Resend', 'Spotify API'],
			description: 'This very site, built with Next.js',
			logo: '',
			link: {
				label: 'maria-adriana.com',
				href: 'https://maria-adriana.com/'
			}
		}
	]
} as const;
