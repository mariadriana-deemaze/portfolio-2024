import { useLenis } from 'lenis/react';
import type { ReactNode } from 'react';
import { useCallback, useEffect, useRef } from 'react';

import { cn } from '@/utils/utils';

const REVEAL_OFFSET_PX = 28;

interface ScrollFadeRevealProps {
	children: ReactNode;
	className?: string;
	onLoadVisibility?: boolean;
}

export function ScrollFadeReveal({
	children,
	className,
	onLoadVisibility = false
}: ScrollFadeRevealProps) {
	const ref = useRef<HTMLDivElement>(null);
	const lenisActive = useRef(false);

	const applyReveal = useCallback(() => {
		const el = ref.current;
		if (!el || onLoadVisibility) return;
		const rect = el.getBoundingClientRect();
		const vh = window.innerHeight;
		const progress = Math.max(0, Math.min(1, (vh - rect.top) / (vh * 0.45)));
		el.style.opacity = String(progress);
		el.style.translate = `0 ${(1 - progress) * REVEAL_OFFSET_PX}px`;
	}, [onLoadVisibility]);

	useLenis(() => {
		lenisActive.current = true;
		applyReveal();
	});

	useEffect(() => {
		if (onLoadVisibility) return;
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		applyReveal();
		if (lenisActive.current) return;
		window.addEventListener('scroll', applyReveal, { passive: true });
		return () => window.removeEventListener('scroll', applyReveal);
	}, [applyReveal, onLoadVisibility]);

	return (
		<div ref={ref} className={cn(!onLoadVisibility && 'scroll-fade-reveal', className)}>
			{children}
		</div>
	);
}
