import { Slot } from '@radix-ui/react-slot';
import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/utils/utils';

interface RoundedCTAProps extends HTMLAttributes<HTMLElement> {
	asChild?: boolean;
	children: ReactNode;
	size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
	sm: 'w-8 h-8',
	md: 'w-10 h-10',
	lg: 'w-[clamp(48px,8vw,76px)] h-[clamp(48px,8vw,76px)] p-3.5'
};

export function RoundedCTA({
	asChild,
	children,
	size = 'md',
	className,
	...props
}: RoundedCTAProps) {
	const Comp = asChild ? Slot : 'button';
	return (
		<Comp
			className={cn(
				'inline-grid place-items-center rounded-full',
				'border border-border',
				'text-[var(--color-orange-primary)]',
				'backdrop-blur-[6px]',
				'transition-all duration-500 ease-out',
				'hover:scale-105',
				'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
				sizeClasses[size],
				className
			)}
			style={{
				background: 'color-mix(in srgb, hsl(var(--background)) 78%, transparent)'
			}}
			{...props}
		>
			{children}
		</Comp>
	);
}
