import { useEffect, useState } from 'react';

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

	const words = text.split(' ');
	let charIndex = -1;

	return (
		<span className={className}>
			{words.map((word, wi) => (
				<span key={wi}>
					<span className="inline-block overflow-hidden align-top [padding:0.12em_0.12em_0.18em] [margin:-0.12em_-0.12em_-0.18em]">
						{[...word].map((ch) => {
							charIndex++;
							return (
								<span
									key={charIndex}
									className="inline-block will-change-[translate]"
									style={{
										translate: revealed ? 'none' : '0 118%',
										transition: revealed ? 'translate 720ms var(--ease-out)' : 'none',
										transitionDelay: revealed ? `${baseDelay + charIndex * letterDelay}s` : '0s'
									}}
								>
									{ch}
								</span>
							);
						})}
					</span>
					{wi < words.length - 1 ? ' ' : null}
				</span>
			))}
		</span>
	);
}
