import { clashDisplay } from '@/app/layout';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Section } from '@/components/ui/section';
import { data } from '@/data/main';
import Image from 'next/image';
import { ReactElement } from 'react';

export const SectionWorkExperience = () => {
	return (
		<Section className="animate-fade-in-left delay-500">
			<h2 className={`${clashDisplay.className} text-xl font-bold`}>Work Experience</h2>
			{data.work.map(({ company, title, description, link, preview, stack, start, end }) => {
				return (
					<Card key={company} className="bg-card/35 shadow-xl">
						<CardHeader>
							<div className="flex flex-row gap-x-4">
								{preview && (
									<div className="flex flex-shrink-0 justify-center items-center border dark:border-white/20 rounded-md h-10 w-10 dark:bg-gray-950 shadow-xl overflow-hidden">
										<Image
											className="self-center w-auto"
											src={preview}
											alt={`Logo of ${title}`}
											height={25}
											width={25}
										/>
									</div>
								)}
								<div className="flex flex-col flex-grow gap-2 items-start">
									<h3 className="inline-flex items-center justify-center font-semibold leading-none">
										<a className="hover:underline" href={link}>
											{company}
										</a>
									</h3>
									<h4 className="font-mono text-sm leading-none opacity-50">
										{title}
									</h4>
								</div>

								<div className="font-mono text-sm text-gray-500 flex flex-shrink-0">
									{start} - {end}
								</div>
							</div>
						</CardHeader>
						<CardContent className="mt-2 text-pretty font-mono text-xs text-foreground leading-5">
							{description}
						</CardContent>
						<CardFooter>
							<div className="mt-2 flex flex-wrap gap-1">
								{stack.map((st) => {
									const { label, icon } = st as {
										label: string;
										icon: ReactElement;
									};
									return (
										<Badge
											className="py-1 px-3 gap-2 text-[10px] hover:mix-blend-luminosity cursor-default"
											variant="outline"
											key={label}
										>
											{icon}
											<span>{label}</span>
										</Badge>
									);
								})}
							</div>
						</CardFooter>
					</Card>
				);
			})}
		</Section>
	);
};
