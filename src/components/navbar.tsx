'use client';

import { useEffect, useState } from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import { NowPlaying } from './now-playing';
import { ThemeToggle } from './theme-toggle';

const navItems = {
	'/': {
		name: 'home'
	},
	'/work': {
		name: 'work'
	},
	'/blog': {
		name: 'blog'
	},
	'/contact': {
		name: 'contact'
	}
};

export function Navbar() {
	const [show, setShow] = useState(true);
	const [lastScrollY, setLastScrollY] = useState(0);

	const location = useRouterState({ select: (s) => s.location });

	const controlNavbarVisibility = () => {
		if (window.scrollY > lastScrollY) {
			setShow(false);
		} else {
			setShow(true);
		}
		setLastScrollY(window.scrollY);
	};

	useEffect(() => {
		window.addEventListener('scroll', controlNavbarVisibility);
		return () => window.removeEventListener('scroll', controlNavbarVisibility);
	}, [lastScrollY]);

	return (
		<nav
			className={`${
				show ? 'opacity-100 top-0' : 'opacity-0 top-[-400px]'
			} ease-in-out transition-all duration-1000 w-full fixed z-10 pt-3 md:pt-10 border-b border-b-[#F3C6A7] dark:border-b-[#4D2512] from-white-600/10 dark:from-teal-200/10 via-white dark:via-black to-slate-600/10 dark:to-slate-600/10 backdrop-blur-xs`}
		>
			<div className="flex flex-row justify-between flex-wrap w-full container md:px-0 max-w-2xl mx-auto mb-2 md:mb-4 print:space-y-6 gap-2 md:gap-5 place-items-center">
				<div className="flex flex-row pr-1 gap-2">
					<ThemeToggle />
					<div className="flex flex-row pr-1 gap-2">
						{Object.entries(navItems).map(([path, { name }]) => {
							return (
								<Link
									key={path}
									to={path}
									className={`transition-all hover:text-neutral-2 flex align-middle relative py-1 px-2 ${
										location.pathname.split('/')[1] === path.replace('/', '') &&
										'dark:text-orange-200 text-orange-700'
									}`}
								>
									{name}
								</Link>
							);
						})}
					</div>
				</div>
				<div className="flex max-w-80 h-full">
					<NowPlaying />
				</div>
			</div>
		</nav>
	);
}
