'use client';

import { SectionAbout } from '@/components/pages/home/section-about';
import { SectionEducation } from '@/components/pages/home/section-education';
import { SectionProjects } from '@/components/pages/home/section-projects';
import { SectionWorkExperience } from '@/components/pages/home/section-work-experience';
import ProgressIndicator from '@/components/progress-indicator';
import ScrollFadeReveal from '@/components/ui/section-reveal';
import ReactLenis from '@studio-freight/react-lenis';
import { SectionHero } from './section-hero';

export const HomeLayout = () => {
	return (
		<ReactLenis root options={{ syncTouch: true }}>
			<ProgressIndicator />
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
					<SectionProjects />
				</ScrollFadeReveal>
			</section>
		</ReactLenis>
	);
};
