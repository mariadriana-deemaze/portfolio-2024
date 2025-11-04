import { Card, CardHeader, CardContent, CardDescription, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

interface Props {
	title: string;
	description: string;
	tags: readonly string[];
	colors: string[];
	medium: string;
	preview?: string;
	link?: string;
}

export function ProjectCard({ title, description, tags, link, medium, preview, colors }: Props) {
	return (
		<Card className="group relative flex flex-col h-48 overflow-hidden">
			<div
				className="flex relative rounded-lg rounded-bl-none rounded-br-none h-full w-full overflow-hidden"
				style={{
					background: `linear-gradient(150deg, ${colors[0]} 0%, ${colors[1]} 35%, ${colors[2]} 100%)`
				}}
			>
				{preview && (
					<img
						className="aspect-auto object-cover w-full h-full self-center group-hover:scale-105 group-active:scale-105 ease-in-out duration-1000"
						src={preview}
						alt={`Image preview of project ${title}`}
						height={200}
						width={400}
					/>
				)}
			</div>

			<div className="absolute top-2 left-2">
				<Badge
					className="px-2 py-1 text-[10px] bg-card text-card-foreground z-10"
					variant="outline"
				>
					{medium}
				</Badge>
			</div>

			<div className="absolute bottom-0 w-full translate-y-full group-hover:translate-y-0 group-active:translate-y-0 border-t duration-700 bg-card/95">
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
									{title} <span className="h-1 w-1 rounded-full bg-green-400" />
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
							<Badge
								className="px-2 py-1 text-[10px]"
								variant="outline"
								key={`${title}_${tag}`}
							>
								{tag}
							</Badge>
						))}
					</div>
				</CardContent>
			</div>
		</Card>
	);
}
