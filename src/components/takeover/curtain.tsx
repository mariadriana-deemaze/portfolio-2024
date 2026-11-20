import { useEffect } from 'react';

import { TakeoverCover } from '@/components/takeover/cover';
import { useTakeover } from '@/contexts/takeover-context';

const MAX_COVER_MS = 4000;
const MAX_REVEAL_MS = 1200;

function TakeoverCurtain() {
	const { takeover, clear } = useTakeover();
	const phase = takeover?.phase;

	useEffect(() => {
		if (!phase) return;
		const watchdog = window.setTimeout(clear, phase === 'revealing' ? MAX_REVEAL_MS : MAX_COVER_MS);
		return () => clearTimeout(watchdog);
	}, [phase, clear]);

	if (!takeover) return null;

	return (
		<div
			aria-hidden
			data-phase={takeover.phase}
			className="takeover-curtain pointer-events-none fixed inset-0 z-[60] overflow-hidden bg-background [clip-path:inset(0_0_0_0)] data-[phase=revealing]:scale-[1.03] data-[phase=revealing]:[clip-path:inset(0_0_100%_0)] data-[phase=revealing]:[transition:clip-path_620ms_var(--ease-out),scale_620ms_var(--ease-out)]"
			onTransitionEnd={(event) => {
				if (event.target !== event.currentTarget) return;
				if (event.propertyName === 'clip-path' && event.elapsedTime > 0) clear();
			}}
		>
			<TakeoverCover imageUrl={takeover.target.imageUrl} />
		</div>
	);
}

export { TakeoverCurtain };
