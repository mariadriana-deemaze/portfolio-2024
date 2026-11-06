import { ReactLenis } from 'lenis/react';
import { SectionAbout } from '@/components/pages/home/section-about';
import { SectionContact } from '@/components/pages/home/section-contact';
import { SectionEducation } from '@/components/pages/home/section-education';
import { SectionHero } from '@/components/pages/home/section-hero';
import { SectionProjects } from '@/components/pages/home/section-projects';
import { SectionWorkExperience } from '@/components/pages/home/section-work-experience';
import { FrameBand, FrameRule } from '@/components/ui/frame';
import { ScrollFadeReveal } from '@/components/ui/section-reveal';
import type { Project } from '@/data/projects';

const BAND = 'px-[var(--frame-pad)] py-16 md:py-20 lg:py-24 print:py-6';

export const HomeLayout = ({ projects }: { projects: Project[] }) => {
	return (
		<ReactLenis root options={{ syncTouch: true }}>
			<div className="overflow-x-clip animate-fade-in-left delay-500">
				{/* Unruled: the navbar's bottom border already draws this line. */}
				<FrameRule hatched tone="brand" ruled={false} />

				{/* No side padding: the beam panel runs edge to edge inside the
				    frame, and the copy below it carries the padding itself. */}
				<FrameBand innerClassName="pb-16 md:pb-20 lg:pb-24 print:pb-6">
					<ScrollFadeReveal onLoadVisibility>
						<SectionHero />
					</ScrollFadeReveal>
				</FrameBand>

				<FrameRule hatched />

				<FrameBand innerClassName={BAND}>
					<ScrollFadeReveal onLoadVisibility>
						<SectionAbout />
					</ScrollFadeReveal>
				</FrameBand>

				<FrameBand innerClassName={BAND}>
					<ScrollFadeReveal>
						<SectionWorkExperience />
					</ScrollFadeReveal>
				</FrameBand>

				<FrameBand innerClassName={BAND}>
					<ScrollFadeReveal>
						<SectionEducation />
					</ScrollFadeReveal>
				</FrameBand>

				<FrameRule />

				<FrameBand innerClassName={BAND}>
					<ScrollFadeReveal>
						<SectionProjects projects={projects} />
					</ScrollFadeReveal>
				</FrameBand>

				<FrameRule hatched />

				<FrameBand innerClassName={BAND}>
					<SectionContact />
				</FrameBand>
			</div>
		</ReactLenis>
	);
};
