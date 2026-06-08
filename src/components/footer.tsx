import { data } from '@/data/main';

const FOOTER_SOCIALS = ['GitHub', 'LinkedIn', 'Instagram'];

export function Footer() {
	const year = new Date().getFullYear();
	const socials = data.contact.social.filter((s) => FOOTER_SOCIALS.includes(s.name));

	return (
		<footer className="container mx-auto mt-16 mb-6 flex items-center justify-between border-t border-border pt-4 font-mono text-xs text-muted-foreground">
			<span>
				© {year} {data.name} · {data.location}
			</span>
			<span className="flex gap-4">
				{socials.map((social) => (
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
