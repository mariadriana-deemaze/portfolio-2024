import type { ReactNode } from 'react';

import { cn } from '@/utils/utils';

interface ChipProps {
	children: ReactNode;
	interactive?: boolean;
	className?: string;
}

export function Chip({ children, interactive = false, className }: ChipProps) {
	return (
		<span
			className={cn(
				'inline-flex items-center select-none font-mono text-[10px] font-medium border border-border rounded-full px-[9px] py-[3px] text-foreground',
				'transition-[border-color,background-color] duration-[250ms] ease-linear',
				interactive && 'hover:border-foreground/25 hover:bg-foreground/[0.06]',
				className
			)}
		>
			{children}
		</span>
	);
}
