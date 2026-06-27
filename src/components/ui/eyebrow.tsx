import type { ReactNode } from 'react';

import { cn } from '@/utils/utils';

interface EyebrowProps {
	children: ReactNode;
	pulse?: boolean;
	className?: string;
}

export function Eyebrow({ children, pulse = false, className }: EyebrowProps) {
	return (
		<div
			className={cn(
				'inline-flex items-center gap-[9px] font-mono text-[12px] tracking-[0.05em] text-muted-foreground mb-[26px]',
				className
			)}
		>
			{pulse && (
				<span
					className="w-[7px] h-[7px] rounded-full bg-[#1f8a5b] shrink-0"
					style={{ animation: 'pulse-dot 2.6s infinite' }}
					aria-hidden="true"
				/>
			)}
			{children}
		</div>
	);
}
