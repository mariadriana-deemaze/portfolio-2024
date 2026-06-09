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
				'entry-card',
				'relative grid grid-cols-[48px_1fr_auto] gap-[18px] p-[22px_22px_22px_20px]',
				'border border-border rounded-[12px] overflow-hidden shadow-card',
				'transition-[transform,border-color,box-shadow] duration-500 ease-out will-change-transform',
				className
			)}
		>
			{children}
		</div>
	);
}

export function EntryCardLogo({ src, alt }: { src?: string; alt: string }) {
	return (
		<div className="w-11 h-11 rounded-[9px] border border-border bg-background dark:bg-[#0a0908] grid place-items-center overflow-hidden shrink-0 shadow-sm">
			{src ? (
				<img src={src} alt={alt} className="w-[26px] h-[26px] object-contain" />
			) : (
				<span className="font-clash font-semibold text-[17px] text-[var(--color-orange-primary)]">
					{alt.charAt(0)}
				</span>
			)}
		</div>
	);
}
