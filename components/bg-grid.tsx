'use client';

import Image from 'next/image';

export function BGGrid({ children }: { children?: React.ReactNode }) {
	return (
		<>
			{children}
			<div
				className="fixed inset-0 z-[-1] bg-transparent h-screen w-screen bg-gradient-to-b from-muted to-background"
				style={{
					backgroundImage: 'linear-gradient(hsl(var(--muted)), hsl(var(--background)))'
				}}
			>
				<div
					className="w-full h-full"
					style={{
						backgroundSize: '50px 50px',
						backgroundImage:
							'linear-gradient(0deg, transparent 24%, hsl(var(--muted)/80%) 25%, hsl(var(--muted)/80%) 26%, transparent 27%, transparent 74%, hsl(var(--muted)/80%) 75%, hsl(var(--muted)/80%) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, hsl(var(--muted)/80%) 25%, hsl(var(--muted)/80%) 26%, transparent 27%, transparent 74%, hsl(var(--muted)/80%) 75%, hsl(var(--muted)/80%) 76%, transparent 77%, transparent)'
					}}
				/>
			</div>
			<Image
				priority={true}
				className="fixed -left-10 top-32 scale-150 fade-in-35 duration-1000 opacity-55 z-[-1]"
				alt="Decorative image element"
				src={'/images/color_grad.webp'}
				height="400"
				width={200}
			/>
			<Image
				priority={true}
				className="fixed -right-10 -top-32 rotate-180 fade-in-35 duration-1000 opacity-15 z-[-1]"
				alt="Decorative image element"
				src={'/images/color_grad.webp'}
				height="400"
				width={200}
			/>
			<div className="h-screen fixed border-l-[1px] border-orange-600 opacity-30 left-[5px] md:left-[10%] top-0 bottom-0" />
			<div className="h-screen fixed border-l-[1px] border-orange-600 opacity-30 right-[5px] md:right-[10%] top-0 bottom-0" />
		</>
	);
}
