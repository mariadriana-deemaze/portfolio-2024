import { clashDisplay } from '@/app/layout';
import { ProjectCard } from '@/components/project-card';
import { Section } from '@/components/ui/section';
import { data } from '@/data/main';

export const SectionProjects = () => {
	return (
		<Section className="print-force-new-page scroll-mb-16">
			<h2 className={`${clashDisplay.className} text-xl font-bold`}>Personal projects</h2>
			<div className="grid grid-cols-1 gap-3 print:grid-cols-3 print:gap-2 md:grid-cols-2 lg:grid-cols-3">
				{data.projects.map(({ title, description, techStack, link, preview }) => {
					return (
						<ProjectCard
							key={title}
							preview={preview}
							title={title}
							description={description}
							tags={techStack}
							link={link?.href || undefined}
						/>
					);
				})}
			</div>
		</Section>
	);
};
