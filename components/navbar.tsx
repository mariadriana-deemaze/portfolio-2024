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
			<div className="flex justify-between items-center flex-wrap gap-5">
				<div className="flex items-center flex-row gap-2">
					<div className="flex flex-row space-x-0 pr-1 gap-2">
						<ThemeToggle />
						<div className="flex flex-row space-x-0 pr-1 gap-2">
							{Object.entries(navItems).map(([path, { name }]) => {
								return (
									<Link
										key={path}
										href={path}
										className={`transition-all hover:text-neutral-2 flex align-middle relative py-1 px-2 ${
											pathname === path &&
											'dark:text-orange-200 text-orange-700'
										}`}
									>
										{name}
									</Link>
								);
							})}
						</div>
					</div>
				</div>
				<div className="justify-end">
					<div className="flex items-center">
						<div className="flex max-w-80">
							<NowPlaying />
						</div>
					</div>
				</div>
			</div>
		</nav>
	);
}
