import type { ReactNode } from 'react';

import { cn } from '@/utils/utils';

interface ImageFrameProps {
	children: ReactNode;
	className?: string;
}

export function ImageFrame({ children, className }: ImageFrameProps) {
	return (
		<div
			className={cn(
				'relative overflow-hidden bg-muted',
				'[&>img]:absolute [&>img]:inset-0 [&>img]:w-full [&>img]:h-full [&>img]:object-cover [&>img]:block',
				'[&>img]:transition-transform [&>img]:duration-[1100ms] [&>img]:[transition-timing-function:var(--ease-out)]',
				'hover:[&>img]:scale-[1.05]',
				className
			)}
		>
			{children}
		</div>
	);
}
