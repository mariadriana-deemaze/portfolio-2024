import React, { ReactNode, useEffect, useRef } from 'react';
import { useLenis } from '@studio-freight/react-lenis';

const ScrollFadeReveal = ({ children }: { children: ReactNode }) => {
	const ref = useRef<HTMLDivElement>(null);

	// @ts-expect-error
	useLenis(({ isScrolling, velocity }) => {
		if (ref.current) {
			const elementTop = ref.current.offsetTop;
			const elementBottom = elementTop + ref.current.offsetHeight;
			const windowTop = window.scrollY;
			const windowBottom = windowTop + window.innerHeight;

			const handleScroll = () => {
				if (ref.current) {
					if (windowBottom > elementTop && windowTop < elementBottom) {
						ref.current.classList.add('scroll-fade-in');

						if (isScrolling) {
							let skewX = 0;
							let skewY = Math.max(-5, Math.min(5, velocity * 2));

							console.log('skew ->', skewX, skewY);

							ref.current.style.transform = `translateY(0) skewX(0deg) skewY(${skewY}deg)`;
						} else {
							ref.current.style.transform = `translateY(0) skewX(0deg) skewY(0deg)`;
						}
					} else {
						ref.current.classList.remove('scroll-fade-in');
						ref.current.style.transform = `translateY(0) skewX(0deg) skewY(0deg)`;
					}
				}
			};

			window.addEventListener('scroll', handleScroll);
			window.addEventListener('touchmove', handleScroll);

			return () => {
				window.removeEventListener('scroll', handleScroll);
				window.removeEventListener('touchmove', handleScroll);
			};
		}
	});

	return (
		<div ref={ref} className="scroll-fade-reveal">
			{children}
		</div>
	);
};

export default ScrollFadeReveal;
