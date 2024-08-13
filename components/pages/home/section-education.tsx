import { clashDisplay } from '@/app/layout';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Section } from '@/components/ui/section';
import { data } from '@/data/main';

export const SectionEducation = () => {
	return (
		<Section>
			<h2 className={`${clashDisplay.className} text-xl font-bold`}>Education</h2>
			{data.education.map(({ school, start, end, degree }) => {
				return (
					<Card key={school}>
						<CardHeader>
							<div className="flex items-center justify-between gap-x-2 text-base opac">
								<h3 className="font-semibold leading-none">{school}</h3>
								<div className="text-sm tabular-nums text-gray-500">
									{start} - {end}
								</div>
							</div>
							<h4 className="font-mono text-sm leading-none">{degree}</h4>
						</CardHeader>
						<CardContent>Summary here</CardContent>
					</Card>
				);
			})}
		</Section>
	);
};
