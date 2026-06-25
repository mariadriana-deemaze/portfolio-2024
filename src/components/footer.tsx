import { data } from '@/data/main';

export function Footer() {
	const year = new Date().getFullYear();

	return (
		<footer className="mx-auto w-full max-w-[1100px] px-[var(--content-inset)] mt-16 mb-6 flex flex-wrap items-center justify-center sm:justify-between gap-3 border-t border-border pt-4 font-mono text-xs text-muted-foreground">
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
