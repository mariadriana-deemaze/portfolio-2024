import type { RouteModule } from '../types';
import { getProjects, type Project } from '../../src/data/projects';
import { data } from '@/data/main';
import { BASE_URL } from '.';

type WorkData = { projects: Project[] };

const workRoute: RouteModule<WorkData> = {
	path: '/work',
	getProps: (req) => ({ location: req.url }),
	async getInitialData() {
		try {
			const projects = await getProjects();
			return { projects };
		} catch (e) {
			console.error('Failed to load work projects', e);
			return { projects: [] };
		}
	},
	getSeo: (_ctx) => ({
		title: `${data.name} | ${data.role} :: Projects`,
		description:
			'Explore Maria Adriana’s full stack development projects, featuring work with Node.js, NestJS, Next.js, TypeScript, Go and React. Discover scalable solutions, clean architecture, and modern web applications.',
		alternates: {
			canonical: `${BASE_URL}/projects`
		}
	})
};

export default workRoute;
