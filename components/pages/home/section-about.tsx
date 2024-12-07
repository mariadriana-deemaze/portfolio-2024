import { clashDisplay } from '@/app/layout';
import { Section } from '@/components/ui/section';
import { data } from '@/data/main';

export const SectionAbout = () => {
	return (
		<Section className="animate-fade-in-left delay-300">
			<h2 className={`${clashDisplay.className} text-xl font-bold`}>About</h2>
			<p className="text-pretty font-mono text-sm text-foreground">{data.summary}</p>
		</Section>
	);
};
