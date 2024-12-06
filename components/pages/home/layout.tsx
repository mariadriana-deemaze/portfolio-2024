"use client"

import { SectionAbout } from '@/components/pages/home/section-about';
import { SectionEducation } from '@/components/pages/home/section-education';
import { SectionProjects } from '@/components/pages/home/section-projects';
import { SectionWorkExperience } from '@/components/pages/home/section-work-experience';
import ProgressIndicator from '@/components/progress-indicator';
import ReactLenis from '@studio-freight/react-lenis';

export const HomeLayout = () => {
	return (
		<ReactLenis root>
			<ProgressIndicator />
			<section className="wrapper-anim mx-auto w-full max-w-2xl space-y-20 md:space-y-32 print:space-y-6 animate-fade-in-left delay-500">
				<SectionAbout />
				<SectionWorkExperience />
				<SectionEducation />
				<SectionProjects />
			</section>
		</ReactLenis>
	);
};
