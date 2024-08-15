import { Card, CardHeader, CardContent, CardDescription, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import Image from 'next/image';

interface Props {
	title: string;
	description: string;
	tags: readonly string[];
	preview?: string;
	link?: string;
}

export function ProjectCard({ title, description, tags, link, preview }: Props) {
	return (
		<Card className="flex flex-col overflow-hidden">
			<div className="flex relative bg-muted rounded-lg rounded-bl-none rounded-br-none h-32 w-full overflow-hidden">
				{/* // TODO: Review grad for per project spec. */}
				{/* <div
					className="absolute h-[600px]  lg:h-[1100px] w-full right-0 top-0
		  bg-[radial-gradient(ellipse_at_center_200px,_var(--tw-gradient-stops))]
		  from-green-400/40 via-white/70 to-white to-[67%]
		  dark:from-green-400/40 dark:via-black/70 dark:to-black dark:to-[67%]"
				/> */}
				
				{/* // TODO: Need a fallback here. */}
				{preview && (
					<Image
						className="self-center md:blur-[2px] hover:blur-none transition-all duration-700 ease-in-out"
						src={preview}
						alt={`Image preview of project ${title}`}
						height={200}
						width={800}
					/>
				)}

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
					<div className="hidden font-mono text-xs underline print:visible">
						{link?.replace('https://', '').replace('www.', '').replace('/', '')}
					</div>
					<CardDescription className="font-mono text-xs text-foreground">
						{description}
					</CardDescription>
				</div>
			</CardHeader>
			<CardContent className="mt-auto flex">
				<div className="mt-2 flex flex-wrap gap-1">
					{tags.map((tag) => (
						<Badge className="px-2 py-1 text-[10px]" variant="outline" key={tag}>
							{tag}
						</Badge>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
