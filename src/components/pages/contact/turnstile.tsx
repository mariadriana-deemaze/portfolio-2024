import { useEffect, useRef, useState } from 'react';

import { publicEnvSchema } from '@/lib/env';

type TurnstileSize = 'normal' | 'compact';

type TurnstileRenderOptions = {
	sitekey: string;
	callback: (token: string) => void;
	'expired-callback': () => void;
	'error-callback': () => void;
	theme: 'auto' | 'light' | 'dark';
	appearance: 'always' | 'execute' | 'interaction-only';
	language: string;
	size: TurnstileSize;
};

type TurnstileApi = {
	render: (container: HTMLElement, options: TurnstileRenderOptions) => string;
	reset: (widgetId: string) => void;
	remove: (widgetId: string) => void;
};

declare global {
	interface Window {
		turnstile?: TurnstileApi;
		onTurnstileLoad?: () => void;
	}
}

const ONLOAD_CALLBACK = 'onTurnstileLoad';
const SCRIPT_ID = 'cf-turnstile-script';
const NORMAL_WIDTH = 300;
const MIN_HEIGHT: Record<TurnstileSize, string> = {
	normal: 'min-h-[65px]',
	compact: 'min-h-[140px]'
};
const SCRIPT_SRC = `https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=${ONLOAD_CALLBACK}`;

const { VITE_TURNSTILE_SITE_KEY } = publicEnvSchema.parse(import.meta.env);

let loader: Promise<TurnstileApi> | undefined;

function loadTurnstile(): Promise<TurnstileApi> {
	if (loader) return loader;

	const pending = new Promise<TurnstileApi>((resolve, reject) => {
		if (window.turnstile) {
			resolve(window.turnstile);
			return;
		}

		window.onTurnstileLoad = () => {
			if (window.turnstile) {
				resolve(window.turnstile);
				return;
			}

			reject(new Error('Turnstile script loaded without exposing its API.'));
		};

		const script = document.createElement('script');
		script.id = SCRIPT_ID;
		script.src = SCRIPT_SRC;
		script.async = true;
		script.defer = true;
		script.onerror = () => reject(new Error('Failed to load the Turnstile script.'));

		document.head.appendChild(script);
	});

	// A transient failure should not poison every later mount of the widget.
	pending.catch(() => {
		loader = undefined;
	});

	loader = pending;

	return pending;
}

type TurnstileWidgetProps = {
	language: string;
	onExpire: () => void;
	onVerify: (token: string) => void;
	/** Any change to this value clears the spent token and re-runs the challenge. */
	resetSignal: number;
};

export const TurnstileWidget = ({
	language,
	onExpire,
	onVerify,
	resetSignal
}: TurnstileWidgetProps) => {
	const [size, setSize] = useState<TurnstileSize | undefined>(undefined);
	const containerRef = useRef<HTMLDivElement>(null);
	const widgetIdRef = useRef<string | undefined>(undefined);
	const handlersRef = useRef({ onExpire, onVerify });

	useEffect(() => {
		handlersRef.current = { onExpire, onVerify };
	});

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const observer = new ResizeObserver(([entry]) => {
			setSize(entry.contentRect.width < NORMAL_WIDTH ? 'compact' : 'normal');
		});

		observer.observe(container);

		return () => observer.disconnect();
	}, []);

	useEffect(() => {
		if (!size) return;

		const container = containerRef.current;
		let cancelled = false;

		loadTurnstile()
			.then((turnstile) => {
				if (cancelled || !container) return;

				widgetIdRef.current = turnstile.render(container, {
					sitekey: VITE_TURNSTILE_SITE_KEY,
					callback: (token) => handlersRef.current.onVerify(token),
					'expired-callback': () => handlersRef.current.onExpire(),
					'error-callback': () => handlersRef.current.onExpire(),
					theme: 'auto',
					appearance: 'always',
					language,
					size
				});
			})
			.catch((error) => {
				console.error(error);
			});

		return () => {
			cancelled = true;

			const widgetId = widgetIdRef.current;
			if (widgetId && window.turnstile) {
				window.turnstile.remove(widgetId);
				widgetIdRef.current = undefined;
			}
		};
	}, [language, size]);

	useEffect(() => {
		const widgetId = widgetIdRef.current;

		if (resetSignal === 0 || !widgetId || !window.turnstile) return;

		window.turnstile.reset(widgetId);
	}, [resetSignal]);

	return <div ref={containerRef} className={MIN_HEIGHT[size ?? 'normal']} />;
};
