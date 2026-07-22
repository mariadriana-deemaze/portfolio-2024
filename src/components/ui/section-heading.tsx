import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';

import { StaggerText } from '@/components/ui/stagger-text';
import { cn } from '@/utils/utils';

interface SectionHeadingProps {
	num?: string;
	title: string;
	count?: ReactNode;
	className?: string;
}

export function SectionHeading({ num, title, count, className }: SectionHeadingProps) {
	const ref = useRef<HTMLDivElement>(null);
	const [revealed, setRevealed] = useState(false);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			setRevealed(true);
			return;
		}
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setRevealed(true);
					observer.disconnect();
				}
			},
			{ threshold: 0.3 }
		);
		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	return (
		<div ref={ref} className={cn('flex items-center gap-[14px] mb-7', className)}>
			{num && (
				<span
					className="font-mono text-[12px] font-semibold text-[var(--color-orange-primary)] tracking-[0.05em] transition-opacity duration-700"
					style={{ opacity: revealed ? 1 : 0, transitionDelay: revealed ? '0.3s' : '0s' }}
				>
					{num}
				</span>
			)}
			<h2 className="m-0 font-clash text-3xl font-bold tracking-[-0.015em] leading-none shrink-0">
				<StaggerText text={title} revealed={revealed} baseDelay={0.05} letterDelay={0.03} />
			</h2>
			<div
				className="flex-1 h-px bg-border self-center origin-left transition-[scale] duration-[1.2s] [transition-timing-function:var(--ease-out)] max-sm:hidden"
				style={{ scale: revealed ? '1' : '0 1', transitionDelay: revealed ? '0.3s' : '0s' }}
			/>
			{count && (
				<span
					className="font-mono text-[11px] text-muted-foreground self-center transition-[opacity,color] duration-700 [&_a:hover]:text-[var(--color-orange-primary)] max-sm:hidden"
					style={{ opacity: revealed ? 1 : 0, transitionDelay: revealed ? '0.3s' : '0s' }}
				>
					{count}
				</span>
			)}
		</div>
	);
}
