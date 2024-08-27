import { clashDisplay } from '@/app/layout';
import { ProjectCard } from '@/components/project-card';
import { Section } from '@/components/ui/section';
import { data } from '@/data/main';

export const SectionProjects = () => {
	return (
		<Section className="print-force-new-page scroll-mb-16 animate-fade-in-left delay-700">
			<h2 className={`${clashDisplay.className} text-xl font-bold`}>Personal projects</h2>
			<div className="grid grid-cols-1 gap-3 print:grid-cols-3 print:gap-2 md:grid-cols-2 lg:grid-cols-3">
				{data.projects.map(
					({ title, description, intervention, medium, link, preview }, index) => (
						<ProjectCard
							index={index}
							key={title}
							preview={preview}
							title={title}
							description={description}
							medium={medium}
							tags={intervention}
							link={link?.href}
						/>
					)
				)}
			</div>
		</Section>
	);
};
