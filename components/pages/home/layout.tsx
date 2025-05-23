'use client';

import { SectionAbout } from '@/components/pages/home/section-about';
import { SectionEducation } from '@/components/pages/home/section-education';
import { SectionProjects } from '@/components/pages/home/section-projects';
import { SectionWorkExperience } from '@/components/pages/home/section-work-experience';
import ScrollFadeReveal from '@/components/ui/section-reveal';
import { ReactLenis } from 'lenis/react';
import { SectionHero } from './section-hero';
import { Project } from '@/data/projects';

export const HomeLayout = ({ projects }: { projects: Project[] }) => {
	return (
		<ReactLenis root options={{ syncTouch: true }}>
			<section className="mx-auto w-full max-w-2xl space-y-48 md:space-y-32 print:space-y-6 animate-fade-in-left delay-500">
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
			</section>
		</ReactLenis>
	);
};
