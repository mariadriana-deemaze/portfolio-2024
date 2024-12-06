import { clashDisplay } from '@/app/layout';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Section } from '@/components/ui/section';
import { data } from '@/data/main';
import Image from 'next/image';

export const SectionEducation = () => {
	return (
		<Section className="animate-fade-in-left delay-300">
			<h2 className={`${clashDisplay.className} text-xl font-bold`}>Education</h2>
			{data.education.map(({ school, preview, summary, start, end, degree }) => {
				return (
					<Card key={school} className='bg-card/35 shadow-xl'>
						<CardHeader>
							<div className="flex flex-row items-start justify-between gap-x-4 text-base">
								{preview && (
									<div className="flex flex-shrink-0 border dark:border-white/20 rounded-md h-10 w-10 dark:bg-gray-950 shadow-xl justify-center overflow-hidden">
										<Image
											className="self-center"
											src={preview}
											alt={`Logo of ${school}`}
											height={25}
											width={25}
										/>
									</div>
								)}

								<div className='flex flex-col gap-2 flex-grow'>
									<h3 className="font-semibold leading-none">{school}</h3>
									<h4 className="font-mono text-sm leading-none opacity-50">
										{degree}
									</h4>
								</div>
									<div className="text-sm tabular-nums text-gray-500 flex flex-shrink-0">
										{start} - {end}
									</div>
							</div>
						</CardHeader>
						<CardContent className="mt-2 text-pretty font-mono text-xs text-foreground leading-5">
							{summary}
						</CardContent>
					</Card>
				);
			})}
		</Section>
	);
};
