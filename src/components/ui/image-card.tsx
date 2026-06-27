import type { ReactNode } from 'react';
import { LuArrowUpRight } from 'react-icons/lu';

import { cn } from '@/utils/utils';

const FEATURED_HEIGHT = 'clamp(340px, 42vw, 520px)';
const DEFAULT_HEIGHT = '300px';

type ImageCardProps = {
	href: string;
	image?: string | null;
	gradient?: string;
	featured?: boolean;
	index?: number;
	eagerImage?: boolean;
	showArrow?: boolean;
	children: ReactNode;
};

export function ImageCard({
	href,
	image,
	gradient,
	featured = false,
	index,
	eagerImage = false,
	showArrow = true,
	children
}: ImageCardProps) {
	return (
		<a
			href={href}
			className={cn(
				'group relative block no-underline text-foreground border border-border rounded-[18px] overflow-hidden',
				'bg-[color-mix(in_srgb,var(--card)_42%,transparent)] shadow-[var(--shadow-card)]',
				'transition-[translate,box-shadow] duration-[550ms] [transition-timing-function:var(--ease-out)] will-change-transform',
				'hover:-translate-y-[6px] hover:shadow-[0_44px_70px_-30px_rgba(0,0,0,0.36)]',
				'motion-reduce:transition-none',
				'animate-[px-in_0.5s_var(--ease-out)_both]',
				featured && 'col-span-full'
			)}
			style={{ animationDelay: index ? `${index * 0.05}s` : undefined }}
		>
			<div
				className="relative overflow-hidden bg-muted"
				style={{ height: featured ? FEATURED_HEIGHT : DEFAULT_HEIGHT }}
			>
				{gradient ? (
					<div
						className="absolute inset-0 transition-transform duration-[1100ms] [transition-timing-function:var(--ease-out)] group-hover:scale-105 motion-reduce:transition-none"
						style={{ background: gradient }}
					/>
				) : (
					<div className="absolute inset-0 bg-gradient-to-br from-muted to-muted/50" />
				)}

				{image && (
					<img
						src={image}
						alt=""
						aria-hidden="true"
						loading={eagerImage ? 'eager' : 'lazy'}
						className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1100ms] [transition-timing-function:var(--ease-out)] group-hover:scale-105 motion-reduce:transition-none"
					/>
				)}

				{/* Hover darkening overlay */}
				<div
					className={cn(
						'absolute inset-0 z-[1] pointer-events-none',
						'transition-opacity duration-[600ms] [transition-timing-function:var(--ease-out)]',
						'opacity-0 group-hover:opacity-100',
						'motion-reduce:hidden'
					)}
					style={{
						background: 'linear-gradient(180deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.18) 100%)'
					}}
					aria-hidden="true"
				/>

				{/* Bottom gradient scrim */}
				<div
					className="absolute inset-0 z-[1] pointer-events-none"
					style={{
						background: 'linear-gradient(180deg, transparent 40%, rgba(10,6,2,0.65) 100%)'
					}}
					aria-hidden="true"
				/>

				{/* Index number */}
				{index != null && (
					<span className="absolute top-[16px] left-[18px] z-[3] font-mono text-[12px] text-white/85">
						{String(index + 1).padStart(2, '0')}
					</span>
				)}

				{/* Arrow button */}
				{showArrow && (
					<span
						className={cn(
							'absolute top-[14px] right-[14px] z-[3] w-[40px] h-[40px] rounded-full grid place-items-center',
							'text-[var(--color-orange-primary)] border border-border backdrop-blur-[6px]',
							'bg-[color-mix(in_srgb,var(--background)_78%,transparent)]',
							'opacity-0 scale-[0.8] -rotate-12',
							'transition-[opacity,scale,rotate,background-color,border-color] duration-[500ms] [transition-timing-function:var(--ease-out)]',
							'group-hover:opacity-100 group-hover:scale-100 group-hover:rotate-0 group-hover:bg-white group-hover:border-white',
							'[@media(hover:none)]:opacity-100 [@media(hover:none)]:scale-100 [@media(hover:none)]:rotate-0',
							'motion-reduce:transition-none'
						)}
						aria-hidden="true"
					>
						<LuArrowUpRight className="w-[18px] h-[18px]" />
					</span>
				)}

				{/* Content overlay */}
				<div className="absolute left-0 right-0 bottom-0 z-[3] p-[clamp(20px,2.6vw,32px)]">
					{children}
				</div>
			</div>
		</a>
	);
}
