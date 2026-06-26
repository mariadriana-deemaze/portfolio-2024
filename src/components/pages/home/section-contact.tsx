import { useLenis } from 'lenis/react';
import { useEffect, useRef, useState } from 'react';
import { LuArrowUpRight } from 'react-icons/lu';

import { data } from '@/data/main';
import { cn } from '@/utils/utils';

export const SectionContact = () => {
	const sectionRef = useRef<HTMLElement>(null);
	const headRef = useRef<HTMLHeadingElement>(null);
	const ctaRef = useRef<HTMLDivElement>(null);
	const [revealed, setRevealed] = useState(false);

	useEffect(() => {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			setRevealed(true);
			return;
		}
		const el = sectionRef.current;
		if (!el) return;
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setRevealed(true);
					observer.disconnect();
				}
			},
			{ threshold: 0.08 }
		);
		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	useLenis(() => {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		const el = sectionRef.current;
		if (!el) return;
		const r = el.getBoundingClientRect();
		const vh = window.innerHeight || 1;
		const p = Math.max(0, Math.min(1, (vh - r.top) / (vh * 0.72)));
		const e = 1 - (1 - p) ** 3;
		if (headRef.current) headRef.current.style.transform = `translateY(${(1 - e) * 70}px)`;
		if (ctaRef.current) ctaRef.current.style.transform = `translateY(${(1 - e) * 40}px)`;
	});

	return (
		<section
			ref={sectionRef}
			className={cn(
				'relative overflow-hidden rounded-[20px] px-[max(28px,5vw)] pt-[clamp(64px,10vh,120px)] pb-[clamp(48px,7vh,88px)]',
				'transition-[opacity,scale,rotate,translate] duration-700 [transition-timing-function:var(--ease-out)]',
				'motion-reduce:transition-none',
				revealed
					? 'opacity-100 scale-100 rotate-0 translate-y-0'
					: 'opacity-0 scale-[0.94] rotate-[4deg] translate-y-[64px]'
			)}
			style={{
				background:
					'linear-gradient(150deg, var(--color-orange-light) 0%, var(--color-orange-primary) 52%, #d8410f 100%)'
			}}
		>
			{/* M·A mark watermark */}
			<div
				className="absolute right-0 bottom-0 w-[88%] max-w-[820px] opacity-50 pointer-events-none select-none motion-reduce:hidden"
				style={{
					maskImage: 'radial-gradient(ellipse 85% 85% at 55% 55%, black 20%, transparent 72%)'
				}}
				aria-hidden="true"
			>
				<svg
					viewBox="0 3 37 18"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					className="w-full h-auto"
				>
					<defs>
						<filter id="ma-outer-glow" x="-30%" y="-30%" width="160%" height="160%">
							<feComponentTransfer in="SourceAlpha" result="boosted">
								<feFuncA type="linear" slope="8" />
							</feComponentTransfer>
							<feGaussianBlur in="boosted" stdDeviation="2.8" result="blur" />
							<feOffset in="blur" dx="1.2" dy="1.6" result="offsetBlur" />
							<feFlood floodColor="#280300" floodOpacity="0.62" result="color" />
							<feComposite in="color" in2="offsetBlur" operator="in" result="coloredBlob" />
							<feComposite in="coloredBlob" in2="boosted" operator="out" result="outerGlow" />
							<feMerge>
								<feMergeNode in="outerGlow" />
								<feMergeNode in="SourceGraphic" />
							</feMerge>
						</filter>
					</defs>
					<g filter="url(#ma-outer-glow)">
						<path
							d="M8.97021 3.15039H16.8042C17.1323 3.1504 17.4299 3.31123 17.6089 3.5752V3.57617L22.9468 11.5566L22.9478 11.5596C23.1375 11.8333 23.1552 12.197 22.9907 12.5068L20.2017 17.7715H20.2007L20.1997 17.7734C19.8743 18.4153 18.9679 18.4634 18.5649 17.8604L18.564 17.8594L14.6899 12.0859C14.1608 11.2775 12.9514 11.3552 12.521 12.2031L8.44189 20.165C8.27773 20.4741 7.94907 20.6805 7.59326 20.6807H1.10205C0.403208 20.6807 -0.056433 19.9471 0.255371 19.3174L0.254395 19.3164L8.12256 3.67871L8.12549 3.67383C8.27157 3.35727 8.6116 3.15043 8.97021 3.15039Z"
							fill="white"
							fillOpacity="0.13"
							stroke="white"
							strokeOpacity="0.42"
							strokeWidth="0.35"
						/>
						<path
							d="M27.2495 4.93567C27.6094 4.25867 28.5934 4.2511 28.9478 4.92102V4.922L36.7476 19.4747C37.0707 20.1011 36.6148 20.8497 35.8804 20.8497H30.0444C29.326 20.8497 28.8718 20.1 29.1948 19.4913L29.1958 19.4894L29.1968 19.4884C29.1971 19.4877 29.1972 19.4866 29.1978 19.4855C29.1992 19.4828 29.2018 19.4791 29.2046 19.4738C29.2101 19.4631 29.2183 19.4466 29.229 19.4259C29.2504 19.3846 29.2819 19.3241 29.3218 19.2472C29.4019 19.0925 29.5163 18.8709 29.6538 18.6056C29.9287 18.075 30.2956 17.3672 30.6636 16.6583C31.0315 15.9495 31.401 15.2399 31.6802 14.7052C31.8197 14.4379 31.9369 14.2143 32.02 14.0568C32.0615 13.9782 32.0937 13.9158 32.1167 13.8732C32.1275 13.8532 32.1352 13.8369 32.1411 13.8263L32.147 13.8214L32.1577 13.7999L32.4995 13.1241L32.5005 13.1251C32.6486 12.8539 32.6268 12.5217 32.4585 12.2726C32.2961 12.0324 32.0279 11.8674 31.7144 11.8673H25.2231C24.5046 11.8673 24.0512 11.1166 24.3745 10.5079L24.3755 10.507L27.2505 4.93665L27.2495 4.93567Z"
							fill="white"
							fillOpacity="0.13"
							stroke="white"
							strokeOpacity="0.42"
							strokeWidth="0.35"
						/>
					</g>
				</svg>
			</div>

			{/* Content */}
			<div className="relative z-10">
				{/* Eyebrow */}
				<div
					className={cn(
						'transition-[opacity,translate] duration-500 delay-200 [transition-timing-function:var(--ease-out)] motion-reduce:transition-none',
						revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[18px]'
					)}
				>
					<div className="flex items-center gap-[10px] font-mono text-[12px] tracking-[0.04em] text-[#5a2a12] mb-[22px]">
						<span className="font-semibold text-[#2e1305]">05</span>
						<span>— get in touch</span>
					</div>
				</div>

				{/* Headline */}
				<div
					className={cn(
						'transition-[opacity,translate] duration-600 delay-[350ms] [transition-timing-function:var(--ease-out)] motion-reduce:transition-none',
						revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[28px]'
					)}
				>
					<h2
						ref={headRef}
						className="m-0 font-clash font-medium text-[clamp(46px,8vw,104px)] leading-[0.95] tracking-[-0.035em] text-[#2e1305] break-words will-change-transform"
					>
						Let's make
						<br />
						<em className="not-italic font-normal italic">something</em> together
					</h2>
				</div>

				{/* CTA row */}
				<div
					className={cn(
						'transition-[opacity,translate] duration-600 delay-500 [transition-timing-function:var(--ease-out)] motion-reduce:transition-none',
						revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[22px]'
					)}
				>
					<div
						ref={ctaRef}
						className="flex items-center justify-between flex-wrap gap-6 mt-[clamp(36px,6vw,64px)] will-change-transform"
					>
						<a
							href={`mailto:${data.contact.email}`}
							className="group inline-flex items-center gap-[18px] font-clash font-medium text-[clamp(22px,4vw,42px)] tracking-[-0.025em] leading-none no-underline text-[#2e1305]"
						>
							<span className="inline-grid place-items-center shrink-0 w-[clamp(44px,7vw,68px)] h-[clamp(44px,7vw,68px)] bg-[#2e1305] rounded-full text-[var(--color-orange-light)] transition-transform duration-500 [transition-timing-function:var(--ease-out)] group-hover:rotate-45 group-hover:scale-105">
								<LuArrowUpRight className="w-1/2 h-1/2" />
							</span>
							<span className="relative after:absolute after:left-0 after:right-full after:bottom-[-2px] after:h-[2px] after:bg-[#2e1305] after:transition-[right] after:duration-500 after:[transition-timing-function:var(--ease-out)] group-hover:after:right-0">
								{data.contact.email}
							</span>
						</a>

						<a
							href="/contact"
							className="group inline-flex items-center gap-[10px] font-mono text-[13px] no-underline text-[#4a2010] border border-[#4a2010]/40 rounded-full px-[18px] py-[10px] transition-[background,color,border-color] duration-300 hover:bg-[#2e1305] hover:text-[var(--color-orange-light)] hover:border-[#2e1305]"
						>
							<span>open contact form</span>
							<LuArrowUpRight className="w-[13px] h-[13px] transition-[translate] duration-300 group-hover:translate-x-[2px] group-hover:-translate-y-[2px]" />
						</a>
					</div>
				</div>
			</div>
		</section>
	);
};
