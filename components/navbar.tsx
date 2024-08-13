'use client';

import Link from 'next/link';
import { NowPlaying } from './now-playing';
import { ThemeToggle } from './theme-toggle';
import { usePathname } from 'next/navigation';

const navItems = {
	'/': {
		name: 'home'
	},
	'/blog': {
		name: 'blog'
	},
	'/contact': {
		name: 'contact'
	}
};

export function Navbar() {
	const pathname = usePathname();

	return (
		<nav className="mx-auto w-full max-w-2xl space-y-8 print:space-y-6">
			<div className="flex justify-between items-center">
				<div className="flex items-center md:flex-row flex-col gap-2">
					<div className="md:flex md:flex-row flex-col space-x-0 pr-1 gap-2">
						<ThemeToggle />
						{Object.entries(navItems).map(([path, { name }]) => {
							return (
								<Link
									key={path}
									href={path}
									className={`transition-all hover:text-neutral-2 flex align-middle relative py-1 px-2 ${
										pathname === path && 'text-orange-200'
									}`}
								>
									{name}
								</Link>
							);
						})}
					</div>
				</div>
				<div className="justify-end">
					<div className="flex items-center">
						<div className="md:flex">
							<NowPlaying />
						</div>
					</div>
				</div>
			</div>
		</nav>
	);
}
