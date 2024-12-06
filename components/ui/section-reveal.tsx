import React, { ReactNode, useRef } from 'react';
import { useLenis } from '@studio-freight/react-lenis';

const ScrollFadeReveal = ({ children }: { children: ReactNode }) => {
	const ref = useRef<HTMLDivElement>(null);

	useLenis(({ scroll, isScrolling }) => {
		if (ref.current) {
			const elementTop = ref.current.offsetTop;
			const elementBottom = elementTop + ref.current.offsetHeight;
			const windowTop = window.scrollY;
			const windowBottom = windowTop + window.innerHeight;

			if (windowBottom > elementTop && windowTop < elementBottom) {
				ref.current.classList.add('scroll-fade-in');
			}

			if (isScrolling) {
				ref.current.classList.add('scroll-skew');
			} else {
				ref.current.classList.remove('scroll-skew');
			}

			//.setProperty('--scroll-skew-percentage', "10deg")
		}
	});

	return (
		<div ref={ref} className="scroll-fade-reveal">
			{children}
		</div>
	);
};

export default ScrollFadeReveal;
