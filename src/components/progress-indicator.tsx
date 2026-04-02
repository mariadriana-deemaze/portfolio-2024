import { useCallback, useEffect, useState } from 'react';

const ProgressIndicator = () => {
	const [progress, setProgress] = useState(0);

	const calculateProgress = useCallback(() => {
		const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
		const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
		const scrolled = winScroll / height;
		setProgress(scrolled);
	}, []);

	useEffect(() => {
		const { matches } = window.matchMedia('(prefers-reduced-motion: no-preference)');
		if (matches) {
			calculateProgress();
			window.addEventListener('scroll', calculateProgress);
			return () => window.removeEventListener('scroll', calculateProgress);
		}
	}, [calculateProgress]);

	return (
		<div className="progress w-full fixed top-0 left-0 z-50">
			<div className="progress-bar" style={{ transform: `scaleX(${progress})` }} />
		</div>
	);
};

export default ProgressIndicator;
