import { Link, useRouterState } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';

import { LogoMark } from '@/components/logo-ma';
import { ThemeToggle } from '@/components/theme-toggle';
import { StaggerText } from '@/components/ui/stagger-text';
import { data } from '@/data/main';
import { ROUTES } from '@/utils/routes';
import { cn } from '@/utils/utils';

const SM_BREAKPOINT = 640;
const SCROLL_HIDE_THRESHOLD = 140;
const SCROLL_BG_THRESHOLD = 20;

const navItems = [
	{ path: ROUTES.home, name: 'home' },
	{ path: ROUTES.projects, name: 'projects' },
	{ path: ROUTES.blog, name: 'blog' },
	{ path: ROUTES.contact, name: 'contact' }
];

export function Navbar() {
	const [hidden, setHidden] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const [menuOpen, setMenuOpen] = useState(false);
	const menuOpenRef = useRef(false);

	const location = useRouterState({ select: (s) => s.location });

	useEffect(() => {
		menuOpenRef.current = menuOpen;
	}, [menuOpen]);

	useEffect(() => {
		let last = window.scrollY;
		const onScroll = () => {
			const y = window.scrollY;
			setScrolled(y > SCROLL_BG_THRESHOLD);
			setHidden(!menuOpenRef.current && y > SCROLL_HIDE_THRESHOLD && y > last);
			last = y;
		};
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	}, []);

	useEffect(() => {
		const onResize = () => {
			if (window.innerWidth >= SM_BREAKPOINT && menuOpenRef.current) setMenuOpen(false);
		};
		window.addEventListener('resize', onResize);
		return () => window.removeEventListener('resize', onResize);
	}, []);

	useEffect(() => {
		document.body.style.overflow = menuOpen ? 'hidden' : '';
		return () => {
			document.body.style.overflow = '';
		};
	}, [menuOpen]);

	const isActive = (path: string) =>
		path === ROUTES.home ? location.pathname === ROUTES.home : location.pathname.startsWith(path);

	return (
		<>
			<nav
				className={cn(
					'fixed top-0 left-0 w-full z-50 pt-3',
					'border-b border-[var(--nav-border)]',
					'nav-transition',
					scrolled ? 'nav-bg-scrolled' : 'nav-bg',
					hidden ? '-translate-y-[130%] opacity-0' : 'translate-y-0 opacity-100'
				)}
			>
				<div className="max-w-[760px] mx-auto px-6 pb-[9px] flex items-center justify-between gap-[10px]">
					<div className="flex items-center gap-1 min-w-0">
						<Link
							to={ROUTES.home}
							className="flex items-center mr-2 no-underline text-foreground"
							aria-label="Home"
							onClick={() => setMenuOpen(false)}
						>
							<LogoMark className="logo-fade h-[19px]" />
						</Link>

						<div className="hidden sm:flex gap-px">
							{navItems.map(({ path, name }) => (
								<Link
									key={path}
									to={path}
									className={cn(
										'font-mono text-[13px] tracking-[0.01em] no-underline',
										'opacity-70 px-[9px] py-1 rounded-[6px] cursor-pointer',
										'transition-[opacity,background,color] duration-[250ms] ease-linear',
										'hover:opacity-100 hover:bg-[color-mix(in_srgb,hsl(var(--accent))_55%,transparent)]',
										isActive(path)
											? 'opacity-100 text-[var(--color-orange-primary)]'
											: 'text-foreground'
									)}
								>
									{name}
								</Link>
							))}
						</div>
					</div>

					<div className="flex items-center gap-[7px] shrink-0">
						<ThemeToggle />

						<button
							className="sm:hidden bg-card-ghost relative w-8 h-8 rounded-[8px] border border-border cursor-pointer shrink-0 transition-[background] duration-[250ms] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
							onClick={() => setMenuOpen((m) => !m)}
							aria-label="Toggle menu"
							aria-expanded={menuOpen}
						>
							<span
								className={cn(
									'absolute left-1/2 top-1/2 w-[15px] h-[1.5px] bg-foreground rounded-[2px]',
									'transition-[translate,rotate] duration-[320ms] ease-out',
									menuOpen
										? 'translate-x-[-50%] translate-y-[-50%] rotate-45'
										: 'translate-x-[-50%] translate-y-[calc(-50%_-_4px)]'
								)}
							/>
							<span
								className={cn(
									'absolute left-1/2 top-1/2 w-[15px] h-[1.5px] bg-foreground rounded-[2px]',
									'transition-[translate,rotate] duration-[320ms] ease-out',
									menuOpen
										? 'translate-x-[-50%] translate-y-[-50%] -rotate-45'
										: 'translate-x-[-50%] translate-y-[calc(-50%_+_4px)]'
								)}
							/>
						</button>
					</div>
				</div>
			</nav>

			<div
				aria-hidden={!menuOpen}
				className={cn(
					'fixed inset-0 z-[48] flex flex-col justify-center',
					'px-[max(28px,7vw)] pt-24 pb-10 bg-background',
					'transition-[clip-path] duration-500 [transition-timing-function:cubic-bezier(0.25,1,0.5,1)]',
					menuOpen
						? 'nav-overlay-open pointer-events-auto'
						: 'nav-overlay-closed pointer-events-none'
				)}
			>
				<div
					className="absolute inset-0 overlay-grid opacity-[0.04] pointer-events-none"
					aria-hidden="true"
				/>

				<nav className="relative flex flex-col">
					{navItems.map(({ path, name }, i) => (
						<Link
							key={path}
							to={path}
							className={cn(
								'flex items-baseline gap-4 border-b border-border no-underline',
								'font-clash font-medium tracking-[-0.03em]',
								'text-[clamp(40px,13vw,68px)] leading-[1.04] py-[10px]',
								'transition-opacity duration-300 ease-out',
								isActive(path) ? 'text-[var(--color-orange-primary)]' : 'text-foreground'
							)}
							style={{
								opacity: menuOpen ? 1 : 0,
								transitionDelay: menuOpen ? `${0.1 + i * 0.05}s` : '0s'
							}}
							onClick={() => setMenuOpen(false)}
						>
							<span className="font-mono text-[13px] font-semibold text-[var(--color-orange-primary)] translate-y-[-0.4em]">
								{String(i + 1).padStart(2, '0')}
							</span>
							<StaggerText
								text={name}
								revealed={menuOpen}
								baseDelay={0.15 + i * 0.05}
								letterDelay={0.025}
								className="flex-1"
							/>
							<span
								className={cn(
									'font-mono text-[22px]',
									'[transition:opacity_300ms_ease-out,translate_300ms_ease-out,color_300ms_ease-out]',
									isActive(path) ? 'text-[var(--color-orange-primary)]' : 'text-muted-foreground'
								)}
								style={{
									opacity: isActive(path) ? 1 : 0,
									translate: isActive(path) ? 'none' : '-8px 4px'
								}}
							>
								↗
							</span>
						</Link>
					))}
				</nav>

				<div
					className={cn(
						'relative flex items-center flex-wrap gap-4 mt-auto pt-8',
						'transition-opacity duration-500',
						menuOpen ? 'opacity-100' : 'opacity-0'
					)}
				>
					<span className="flex gap-4 font-mono text-[12px]">
						{data.contact.social.map((s) => (
							<a
								key={s.name}
								href={s.url}
								target="_blank"
								rel="noopener noreferrer"
								className="lowercase text-foreground no-underline opacity-70 transition-[opacity,color] duration-200 hover:opacity-100 hover:text-[var(--color-orange-primary)]"
							>
								{s.name}
							</a>
						))}
					</span>
				</div>
			</div>
		</>
	);
}
