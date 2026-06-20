import { Link } from '@tanstack/react-router';

interface NotFoundPageProps {
	title: string;
	description: string;
	backTo: string;
	backLabel: string;
}

export function NotFoundPage({ title, description, backTo, backLabel }: NotFoundPageProps) {
	return (
		<div className="grid flex-1 place-content-center text-center">
			<h1 className="m-0 font-clash font-medium text-[clamp(40px,6vw,72px)] leading-[0.95] tracking-[-0.03em] text-foreground">
				{title}
			</h1>
			<p className="mt-6 font-mono text-sm text-muted-foreground">{description}</p>
			<Link
				to={backTo}
				className="mt-8 inline-flex items-center justify-center gap-2 font-mono text-sm text-[var(--color-orange-primary)] no-underline hover:gap-3 transition-[gap] duration-300"
			>
				<span>←</span>
				<span>{backLabel}</span>
			</Link>
		</div>
	);
}
