import type { ReactNode } from 'react';

import { cn } from '@/utils/utils';

interface EntryCardProps {
	children: ReactNode;
	className?: string;
}

export function EntryCard({ children, className }: EntryCardProps) {
	return (
		<div
			className={cn(
				'entry-card spotlight-border',
				'grid grid-cols-[48px_1fr_auto] gap-[14px] sm:gap-[18px] p-[14px] sm:p-[22px_22px_22px_20px]',
				'border border-border rounded-xl shadow-card',
				className
			)}
			onMouseMove={(e) => {
				const r = e.currentTarget.getBoundingClientRect();
				e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - r.left}px`);
				e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - r.top}px`);
			}}
			onMouseLeave={(e) => {
				e.currentTarget.style.setProperty('--mouse-x', '-999px');
				e.currentTarget.style.setProperty('--mouse-y', '-999px');
			}}
		>
			{children}
		</div>
	);
}

export function EntryCardLogo({ src, alt }: { src?: string; alt: string }) {
	return (
		<div className="w-11 h-11 rounded-[9px] border border-border bg-background dark:bg-[#0a0908] grid place-items-center overflow-hidden shrink-0 shadow-sm">
			{src ? (
				<img
					src={src}
					alt={alt}
					width={26}
					height={26}
					className="w-[26px] h-[26px] object-contain"
				/>
			) : (
				<span className="font-clash font-semibold text-[17px] text-[var(--color-orange-primary)]">
					{alt.charAt(0)}
				</span>
			)}
		</div>
	);
}
