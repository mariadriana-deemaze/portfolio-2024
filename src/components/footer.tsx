import { FrameBand } from '@/components/ui/frame';
import { data } from '@/data/main';

export function Footer() {
	const year = new Date().getFullYear();

	return (
		<FrameBand
			as="footer"
			innerClassName="flex flex-wrap items-center justify-center sm:justify-between gap-3 border-b px-[var(--frame-pad)] py-4 font-mono text-xs text-muted-foreground"
		>
			<span>
				© {year} {data.name} · {data.location}
			</span>
			<span className="flex gap-4">
				{data.contact.social.map((social) => (
					<a
						key={social.name}
						href={social.url}
						target="_blank"
						rel="noopener noreferrer"
						className="lowercase transition-colors hover:text-foreground"
					>
						{social.name}
					</a>
				))}
			</span>
		</FrameBand>
	);
}
