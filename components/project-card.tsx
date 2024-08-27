'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

interface ProjectCardProps {
	index: number;
	title: string;
	description: string;
	tags: readonly string[];
	medium: 'web' | 'mobile';
	preview?: string;
	link?: string;
}

export function ProjectCard({
	index,
	title,
	description,
	tags,
	link,
	medium,
	preview
}: ProjectCardProps) {
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
			q('.project-card'),
			{ opacity: 0, y: 100, translateY: -70 },
			{
				opacity: 1,
				y: 0,
				ease: 'Power3.easeInOut',
				duration: 0.5,
				stagger: 0.2,
				translateY: 0,
				delay: 0.2 * index
			}
		)
			.fromTo(
				q('.project-image'),
				{ opacity: 0, y: 100, rotationZ: 12 },
				{
					opacity: 1,
					y: 0,
					rotationZ: 0,
					ease: 'Power3.easeInOut',
					duration: 0.5,
					stagger: 0.2
				}
			)
			.fromTo(
				q('.project-text'),
				{ opacity: 0, y: 100 },
				{ opacity: 1, y: 0, stagger: 0.2 },
				'<25%'
			)
			.fromTo(q('.project-desc'), { opacity: 0 }, { opacity: 1, stagger: 0.2 }, '<10%')
			.fromTo(
				q('.project-tags'),
				{ opacity: 0, y: -40 },
				{ opacity: 1, y: 0, stagger: 0.05, ease: 'Elastic.easeOut' },
				'<25%'
			);
	}, [index]);

	return (
		<Card ref={sectionRef} className={`h-full relative flex flex-col overflow-hidden`}>
			<div className={`project-card project-card-${index}`}></div>
			<div className="flex relative bg-muted rounded-lg rounded-bl-none rounded-br-none h-32 w-full overflow-hidden">
				{/* // TODO: Need a fallback here. */}
				{preview && (
					<div className="overflow-hidden">
						<Image
							className="project-image self-center md:blur-[2px] hover:blur-none transition-all duration-700 ease-in-out"
							src={preview}
							alt={`Image preview of project ${title}`}
							height={200}
							width={800}
						/>
					</div>
				)}
			</div>

			<div className="absolute top-2 left-2">
				<Badge
					className="project-tags px-2 py-1 text-[10px] bg-card text-card-foreground z-10"
					variant="outline"
				>
					{medium}
				</Badge>
			</div>
			<CardHeader>
				<div className="space-y-1">
					<CardTitle className="text-base">
						{link ? (
							<a
								href={link}
								target="_blank"
								rel="noreferrer"
								className="inline-flex items-center gap-1 hover:underline"
							>
								{title} <span className="h-1 w-1 rounded-full bg-green-500"></span>
							</a>
						) : (
							title
						)}
					</CardTitle>
					<div className="overflow-hidden">
						<div className="project-text hidden font-mono text-xs underline print:visible">
							{link?.replace('https://', '').replace('www.', '').replace('/', '')}
						</div>
					</div>
					<div className="overflow-hidden">
						<CardDescription className="project-desc font-mono text-xs text-foreground">
							{description}
						</CardDescription>
					</div>
				</div>
			</CardHeader>
			<CardContent className="mt-auto flex">
				<div className="overflow-hidden mt-2 flex flex-wrap gap-1">
					{tags.map((tag) => (
						<Badge
							className="project-tags px-2 py-1 text-[10px]"
							variant="outline"
							key={tag}
						>
							{tag}
						</Badge>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
