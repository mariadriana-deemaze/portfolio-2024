import { data } from '@/data/main';

export function Footer() {
	const year = new Date().getFullYear();

	return (
		<footer className="container mx-auto mt-16 mb-6 flex items-center justify-between border-t border-border pt-4 font-mono text-xs text-muted-foreground">
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
		</footer>
	);
}
