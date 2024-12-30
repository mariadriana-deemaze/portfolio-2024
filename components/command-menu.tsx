'use client';

import { useState, useEffect } from 'react';
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator
} from '@/components/ui/command';

interface Props {
	links: {
		url: string;
		title: string;
		type: string;
	}[];
}

export const CommandMenu = ({ links }: Props) => {
	const [open, setOpen] = useState(false);

	const internalLinks = links.filter((link) => link.type === 'internal');
	const blogLinks = links.filter((link) => link.type === 'blog');
	const socialsLinks = links.filter((link) => link.type === 'social');

	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen((prevState) => !prevState);
			}
		};
		document.addEventListener('keydown', down);
		return () => document.removeEventListener('keydown', down);
	}, []);

	return (
		<>
			<p className="hidden md:inline fixed bottom-0 left-0 right-0 border-t border-t-muted p-1 text-center text-sm text-muted-foreground print:hidden">
				Press{' '}
				<kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
					<span className="text-xs">⌘</span>K
				</kbd>{' '}
				to open the command menu
			</p>
			<CommandDialog open={open} onOpenChange={setOpen}>
				<CommandInput placeholder="Type a command or search..." />
				<CommandList>
					<CommandEmpty>No results found.</CommandEmpty>
					<CommandGroup heading="Links">
						{internalLinks.map(({ url, title }) => (
							<CommandItem
								key={url}
								onSelect={() => {
									setOpen(false);
									window.location.href = url;
								}}
							>
								<span>{title}</span>
							</CommandItem>
						))}
					</CommandGroup>
					<CommandSeparator />
					<CommandGroup heading="Blog">
						{blogLinks.map(({ url, title }) => (
							<CommandItem
								key={url}
								onSelect={() => {
									setOpen(false);
									window.location.href = url;
								}}
							>
								<span>{title}</span>
							</CommandItem>
						))}
					</CommandGroup>
					<CommandSeparator />
					<CommandGroup heading="Socials">
						{socialsLinks.map(({ url, title }) => (
							<CommandItem
								key={url}
								onSelect={() => {
									setOpen(false);
									window.open(url);
								}}
							>
								<span>{title}</span>
							</CommandItem>
						))}
					</CommandGroup>
				</CommandList>
			</CommandDialog>
		</>
	);
};
