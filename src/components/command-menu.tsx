import { useNavigate } from '@tanstack/react-router';
import { useLenis } from 'lenis/react';
import { useEffect, useState } from 'react';
import { LuExternalLink, LuFileText, LuLayers, LuNavigation, LuSearch } from 'react-icons/lu';

import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator
} from '@/components/ui/command';
import { cn } from '@/utils/utils';

const FAB_HIDE_MARGIN = 130;

type LinkType = 'blog' | 'internal' | 'projects' | 'social';

const LINK_ICON: Record<LinkType, React.ReactNode> = {
	blog: <LuFileText className="w-[17px] h-[17px]" />,
	internal: <LuNavigation className="w-[17px] h-[17px]" />,
	projects: <LuLayers className="w-[17px] h-[17px]" />,
	social: <LuExternalLink className="w-[17px] h-[17px]" />
};

interface Link {
	url: string;
	title: string;
	type: LinkType;
}

const LinkGroup = ({
	heading,
	links,
	onSelect
}: {
	heading: string;
	links: Link[];
	onSelect: (url: string) => void;
}) => (
	<CommandGroup heading={heading}>
		{links.map(({ url, title, type }) => (
			<CommandItem key={url} onSelect={() => onSelect(url)}>
				<span className="w-[17px] h-[17px] text-muted-foreground grid place-items-center shrink-0">
					{LINK_ICON[type]}
				</span>
				<span>{title}</span>
			</CommandItem>
		))}
	</CommandGroup>
);

interface Props {
	links: Link[];
}

export const CommandMenu = ({ links }: Props) => {
	const [open, setOpen] = useState(false);
	const [fabHidden, setFabHidden] = useState(false);
	const [navMenuOpen, setNavMenuOpen] = useState(false);
	const navigate = useNavigate();

	const internalLinks = links.filter((link) => link.type === 'internal');
	const blogLinks = links.filter((link) => link.type === 'blog');
	const projectsLinks = links.filter((link) => link.type === 'projects');
	const socialsLinks = links.filter((link) => link.type === 'social');

	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen((prev) => !prev);
			}
		};
		const onNavMenu = (e: Event) => {
			if (e instanceof CustomEvent) setNavMenuOpen(e.detail.open);
		};
		document.addEventListener('keydown', down);
		window.addEventListener('navmenu', onNavMenu);
		return () => {
			document.removeEventListener('keydown', down);
			window.removeEventListener('navmenu', onNavMenu);
		};
	}, []);

	useLenis(({ scroll }) => {
		const doc = document.documentElement;
		setFabHidden(scroll + doc.clientHeight > doc.scrollHeight - FAB_HIDE_MARGIN);
	});

	return (
		<>
			<button
				className={cn(
					'fixed left-1/2 bottom-[22px] -translate-x-1/2 z-[55] print:hidden',
					'flex items-center gap-[10px]',
					'font-mono text-[12px] text-muted-foreground',
					'pl-[15px] pr-3 py-[9px] rounded-full',
					'border border-border',
					'bg-[color-mix(in_srgb,hsl(var(--card))_82%,transparent)]',
					'[backdrop-filter:blur(12px)_saturate(1.2)]',
					'shadow-[0_14px_38px_-12px_rgba(0,0,0,0.34)]',
					'cursor-pointer',
					'transition-[translate,opacity,box-shadow,color] duration-[450ms] [transition-timing-function:var(--ease-out)]',
					'hover:text-foreground hover:-translate-y-[3px] hover:shadow-[0_22px_46px_-14px_rgba(0,0,0,0.42)]',
					fabHidden || navMenuOpen
						? 'opacity-0 translate-y-[140%] pointer-events-none'
						: 'opacity-100 translate-y-0'
				)}
				onClick={() => setOpen(true)}
				aria-label="Open command menu"
			>
				<LuSearch className="w-[14px] h-[14px] shrink-0" />
				<span className="max-[480px]:hidden">search & jump anywhere</span>
				<span className="flex gap-[3px]">
					<kbd className="font-mono text-[10px] border border-border rounded-[4px] px-[5px] py-[3px] bg-background text-foreground leading-none">
						⌘
					</kbd>
					<kbd className="font-mono text-[10px] border border-border rounded-[4px] px-[5px] py-[3px] bg-background text-foreground leading-none">
						K
					</kbd>
				</span>
			</button>

			<CommandDialog open={open} onOpenChange={setOpen}>
				<CommandInput placeholder="Type a command or search…" />
				<CommandList>
					<CommandEmpty>No results found.</CommandEmpty>
					<LinkGroup
						heading="Links"
						links={internalLinks}
						onSelect={(url) => {
							setOpen(false);
							void navigate({ to: url });
						}}
					/>
					<CommandSeparator />
					<LinkGroup
						heading="Projects"
						links={projectsLinks}
						onSelect={(url) => {
							setOpen(false);
							void navigate({ to: url });
						}}
					/>
					<CommandSeparator />
					<LinkGroup
						heading="Blog"
						links={blogLinks}
						onSelect={(url) => {
							setOpen(false);
							void navigate({ to: url });
						}}
					/>
					<CommandSeparator />
					<LinkGroup
						heading="Socials"
						links={socialsLinks}
						onSelect={(url) => {
							setOpen(false);
							window.open(url);
						}}
					/>
				</CommandList>
			</CommandDialog>
		</>
	);
};
