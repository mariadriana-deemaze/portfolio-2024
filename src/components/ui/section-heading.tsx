import type { ReactNode } from 'react';

import { cn } from '@/utils/utils';

interface SectionHeadingProps {
	num?: string;
	title: string;
	count?: ReactNode;
	className?: string;
}

export function SectionHeading({ num, title, count, className }: SectionHeadingProps) {
	return (
		<div className={cn('flex items-center gap-[14px] mb-7', className)}>
			{num && (
				<span className="font-mono text-[12px] font-semibold text-[var(--color-orange-primary)] tracking-[0.05em]">
					{num}
				</span>
			)}
			<h2 className="m-0 font-clash text-3xl font-bold tracking-[-0.015em] leading-none">
				{title}
			</h2>
			<div className="flex-1 h-px bg-border self-center" />
			{count && (
				<span className="font-mono text-[11px] text-muted-foreground self-center transition-colors [&_a:hover]:text-[var(--color-orange-primary)]">
					{count}
				</span>
			)}
		</div>
	);
}
