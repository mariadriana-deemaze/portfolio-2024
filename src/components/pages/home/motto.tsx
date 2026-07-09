import { useEffect, useRef } from 'react';

import { cn } from '@/utils/utils';

const ROTATE_INTERVAL_MS = 5000;

export const AnimatedMottos = ({ data, className }: { data: string[]; className?: string }) => {
	const sliderRef = useRef<HTMLParagraphElement>(null);

	useEffect(() => {
		const slider = sliderRef.current;
		if (!slider) return;

		const words = slider.querySelectorAll<HTMLElement>('.role-slide');
		if (words.length === 0) return;

		for (const word of words) {
			word.querySelectorAll<HTMLElement>('.letter').forEach((letter, i) => {
				letter.style.setProperty('--li', String(i));
			});
		}

		const showWord = (index: number) => {
			const previousIndex = (index + data.length - 1) % data.length;
			words.forEach((word, wordIndex) => {
				const state =
					wordIndex === index ? 'letter in' : wordIndex === previousIndex ? 'letter out' : 'letter';
				for (const letter of word.children) letter.className = state;
			});
		};

		showWord(0);

		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		let currentIndex = 0;
		const interval = window.setInterval(() => {
			currentIndex = (currentIndex + 1) % data.length;
			showWord(currentIndex);
		}, ROTATE_INTERVAL_MS);

		return () => clearInterval(interval);
	}, [data]);

	return (
		<p ref={sliderRef} className="h-5 w-full relative roles-slider font-clash text-lg font-normal">
			{data.map((item, index) => (
				<span className={cn('role-slide', className)} key={`motto_item_${index}`}>
					{item.split('').map((char, letterIndex) => (
						<span className="letter" key={`motto_${index}_letter_${letterIndex}`}>
							{char}
						</span>
					))}
				</span>
			))}
		</p>
	);
};
