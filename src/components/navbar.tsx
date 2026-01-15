
import { NowPlaying } from '@/components/now-playing';
import { ThemeToggle } from '@/components/theme-toggle';
import { ROUTES } from '@/utils/routes';
import { Link, useRouterState } from '@tanstack/react-router';
import { useCallback, useEffect, useState } from 'react';

const navItems = [
	{ path: ROUTES.home, name: 'home' },
	{ path: ROUTES.projects, name: 'projects' },
	{ path: ROUTES.blog, name: 'blog' },
	{ path: ROUTES.contact, name: 'contact' },
];

export function Navbar() {
	const [show, setShow] = useState(true);
	const [lastScrollY, setLastScrollY] = useState(0);

	const location = useRouterState({ select: (s) => s.location });

	const controlNavbarVisibility = useCallback(() => {
		if (window.scrollY > lastScrollY) {
			setShow(false);
		} else {
			setShow(true);
		}
		setLastScrollY(window.scrollY);
	}, [lastScrollY]);

	useEffect(() => {
		window.addEventListener('scroll', controlNavbarVisibility);
		return () => window.removeEventListener('scroll', controlNavbarVisibility);
	}, [controlNavbarVisibility]);

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
						{navItems.map(({ path, name }) => {
							return (
								<a
									key={path}
									href={path}
									className={`transition-all hover:text-neutral-2 flex align-middle relative py-1 px-2 ${
										location.pathname.split('/')[1] === path.replace('/', '') &&
										'dark:text-orange-200 text-orange-700'
									}`}
								>
									{name}
								</a>
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
