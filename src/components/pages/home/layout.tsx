import { ReactLenis } from 'lenis/react';
import { SectionAbout } from '@/components/pages/home/section-about';
import { SectionContact } from '@/components/pages/home/section-contact';
import { SectionEducation } from '@/components/pages/home/section-education';
import { SectionHero } from '@/components/pages/home/section-hero';
import { SectionProjects } from '@/components/pages/home/section-projects';
import { SectionWorkExperience } from '@/components/pages/home/section-work-experience';
import { ScrollFadeReveal } from '@/components/ui/section-reveal';
import type { Project } from '@/data/projects';

export const HomeLayout = ({ projects }: { projects: Project[] }) => {
	return (
		<ReactLenis root options={{ syncTouch: true }}>
			<section className="mx-auto w-full max-w-[1100px] space-y-64 md:space-y-48 print:space-y-6 animate-fade-in-left delay-500">
				<ScrollFadeReveal onLoadVisibility>
					<SectionHero />
				</ScrollFadeReveal>
				<ScrollFadeReveal onLoadVisibility>
					<SectionAbout />
				</ScrollFadeReveal>
				<ScrollFadeReveal>
					<SectionWorkExperience />
				</ScrollFadeReveal>
				<ScrollFadeReveal>
					<SectionEducation />
				</ScrollFadeReveal>
				<ScrollFadeReveal>
					<SectionProjects projects={projects} />
				</ScrollFadeReveal>
				<SectionContact />
			</section>
		</ReactLenis>
	);
};
