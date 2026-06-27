import { useEffect } from 'react';

export function AppLoaderShell() {
	return (
		<div id="app-loader" aria-hidden="true">
			<div id="app-loader-bar" />
		</div>
	);
}

export function AppLoaderDismiss() {
	useEffect(() => {
		const el = document.getElementById('app-loader');
		if (!el) return;

		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			el.remove();
			return;
		}

		el.style.opacity = '0';
		const timer = setTimeout(() => el.remove(), 550);
		return () => clearTimeout(timer);
	}, []);

	return null;
}
