import { clashDisplay } from '@/app/layout';
import { ProjectCard } from '@/components/project-card';
import { Section } from '@/components/ui/section';
import { data } from '@/data/main';
import { Project } from '@/data/projects';

export const SectionProjects = ({ projects }: { projects: Project[] }) => {
	return (
		<Section className="print-force-new-page scroll-mb-16 animate-fade-in-left delay-700">
			<h2 className={`${clashDisplay.className} text-xl font-bold`}>Personal projects</h2>
			<div className="grid grid-cols-1 gap-3 print:grid-cols-3 print:gap-2 md:grid-cols-2 lg:grid-cols-3">
				{projects.map(({ repo, slug, hero, ...rest }) => {
					return (
						<ProjectCard
							key={slug}
							link={data.github + repo}
							preview={hero}
							{...rest}
						/>
					);
				})}
			</div>
		</Section>
	);
};
