import { SectionAbout } from '@/components/pages/home/section-about';
import { SectionEducation } from '@/components/pages/home/section-education';
import { SectionProjects } from '@/components/pages/home/section-projects';
import { SectionWorkExperience } from '@/components/pages/home/section-work-experience';
import { data } from '@/data/main';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: `${data.name} | ${data.about}`,
	description: data.summary
};

export default function Page() {
	return (
		<section className="mx-auto w-full max-w-2xl space-y-12 print:space-y-6">
			<SectionAbout />
			<SectionWorkExperience />
			<SectionEducation />
			<SectionProjects />
		</section>
	);
}
