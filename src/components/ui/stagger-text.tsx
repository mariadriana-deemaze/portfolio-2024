import { useEffect, useState } from 'react';

import { cn } from '@/utils/utils';

interface StaggerTextProps {
	text: string;
	revealed?: boolean;
	autoReveal?: boolean;
	baseDelay?: number;
	letterDelay?: number;
	className?: string;
}

export function StaggerText({
	text,
	revealed: externalRevealed,
	autoReveal = false,
	baseDelay = 0.04,
	letterDelay = 0.028,
	className
}: StaggerTextProps) {
	const [internalRevealed, setInternalRevealed] = useState(false);

	useEffect(() => {
		if (autoReveal) setInternalRevealed(true);
	}, [autoReveal]);

	const revealed = externalRevealed ?? internalRevealed;

	return (
		<span
			className={cn(
				'inline-block overflow-hidden align-top [padding:0.12em_0.04em_0.18em] [margin:-0.12em_-0.04em_-0.18em]',
				className
			)}
		>
			{[...text].map((ch, i) => (
				<span
					key={i}
					className="inline-block will-change-[translate]"
					style={{
						translate: revealed ? 'none' : '0 118%',
						transition: revealed ? `translate 720ms var(--ease-out)` : 'none',
						transitionDelay: revealed ? `${baseDelay + i * letterDelay}s` : '0s'
					}}
				>
					{ch === ' ' ? '\u00A0' : ch}
				</span>
			))}
		</span>
	);
}
