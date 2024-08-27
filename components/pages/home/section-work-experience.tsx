'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { clashDisplay } from '@/app/layout';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Section } from '@/components/ui/section';
import { data } from '@/data/main';

export const SectionWorkExperience = () => {
	const sectionRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const q = gsap.utils.selector(sectionRef);

		gsap.registerPlugin(ScrollTrigger);

		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: sectionRef.current,
				start: `70% bottom`
			}
		});

		tl.fromTo(
			q('.work-experience-card'),
			{ opacity: 0, y: 100, translateY: -100 },
			{
				opacity: 1,
				y: 0,
				ease: 'Power3.easeInOut',
				duration: 0.5,
				stagger: 0.2,
				translateY: 0
			}
		);
	}, []);
	
	return (
		<Section className="animate-fade-in-left delay-500">
			<h2 className={`${clashDisplay.className} text-xl font-bold`}>Work Experience</h2>
			<div ref={sectionRef} className="flex flex-col gap-y-3">
				{data.work.map(
					({ company, title, description, link, stack, start, end }, index) => {
						return (
							<Card
								key={company}
								className={`${index === 0 ? 'opacity-100' : 'opacity-75 hover:opacity-100 transition-all'} work-experience-card work-experience-card-${index}`}
							>
								<CardHeader>
									<div className="flex items-center justify-between gap-x-2 text-base">
										<h3 className="inline-flex items-center justify-center gap-x-1 font-semibold leading-none">
											<a className="hover:underline" href={link}>
												{company}
											</a>
										</h3>
										<div className="text-sm tabular-nums text-gray-500 hidden sm:flex ">
											{start} - {end}
										</div>
									</div>

									<h4 className="font-mono text-sm leading-none opacity-50">
										{title}
									</h4>
									<div className="text-sm tabular-nums text-gray-500 flex sm:hidden ">
										{start} - {end}
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
												icon: JSX.Element;
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
					}
				)}
			</div>
		</Section>
	);
};
