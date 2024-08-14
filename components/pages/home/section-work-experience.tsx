import { clashDisplay } from '@/app/layout';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Section } from '@/components/ui/section';
import { data } from '@/data/main';

export const SectionWorkExperience = () => {
	return (
		<Section>
			<h2 className={`${clashDisplay.className} text-xl font-bold`}>Work Experience</h2>
			{data.work.map(({ company, title, description, link, badges, stack, start, end }, index) => {
				return (
					<Card
						key={company}
						className={
							index === 0
								? 'opacity-100'
								: 'opacity-75 hover:opacity-100 transition-all'
						}
					>
						<CardHeader>
							<div className="flex items-center justify-between gap-x-2 text-base">
								<h3 className="inline-flex items-center justify-center gap-x-1 font-semibold leading-none">
									<a className="hover:underline" href={link}>
										{company}
									</a>

									<span className="inline-flex gap-x-1">
										{badges.map((badge) => (
											<Badge
												variant="secondary"
												className="align-middle text-xs"
												key={badge}
											>
												{badge}
											</Badge>
										))}
									</span>
								</h3>
								<div className="text-sm tabular-nums text-gray-500 hidden sm:flex ">
									{start} - {end}
								</div>
							</div>

							<h4 className="font-mono text-sm leading-none">{title}</h4>
							<div className="text-sm tabular-nums text-gray-500 flex sm:hidden ">
								{start} - {end}
							</div>
						</CardHeader>
						<CardContent className="mt-2 text-xs">{description}</CardContent>
						<CardFooter>
							<div className="mt-2 flex flex-wrap gap-1">
								{stack.map((tag) => (
									<Badge
										className="py-1 px-3 text-[10px] hover:bg-orange-50"
										variant="outline"
										key={tag}
									>
										{tag}
									</Badge>
								))}
							</div>
						</CardFooter>
					</Card>
				);
			})}
		</Section>
	);
};
