import { useLayoutEffect, useRef, useState } from 'react';

type ElementSize = {
	width: number;
	height: number;
};

export default function useElementSize<T extends HTMLElement>() {
	const ref = useRef<T | null>(null);
	const [size, setSize] = useState<ElementSize>({ width: 0, height: 0 });

	useLayoutEffect(() => {
		const element = ref.current;
		if (!element) {
			return;
		}

		const updateSize = () => {
			setSize({
				width: element.clientWidth,
				height: element.clientHeight
			});
		};

		updateSize();

		if (typeof ResizeObserver === 'undefined') {
			return;
		}

		const observer = new ResizeObserver(() => {
			updateSize();
		});

		observer.observe(element);

		return () => {
			observer.disconnect();
		};
	}, []);

	return { ref, size };
}
