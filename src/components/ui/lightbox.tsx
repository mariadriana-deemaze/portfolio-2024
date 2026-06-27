import * as DialogPrimitive from '@radix-ui/react-dialog';
import { useCallback, useEffect, useState } from 'react';
import { LuChevronLeft, LuChevronRight, LuX } from 'react-icons/lu';

import { cn } from '@/utils/utils';

interface LightboxImage {
	url: string;
	alt?: string;
	caption?: string;
	width?: number;
	height?: number;
}

interface LightboxProps {
	images: LightboxImage[];
	initialIndex?: number;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

const LIGHTBOX_BTN =
	'z-10 grid place-items-center rounded-full bg-black/40 text-white/90 backdrop-blur-sm border border-white/15 cursor-pointer transition-[background,scale] duration-200 hover:bg-black/60 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 motion-reduce:transition-none';

function Lightbox({ images, initialIndex = 0, open, onOpenChange }: LightboxProps) {
	const [index, setIndex] = useState(initialIndex);

	useEffect(() => {
		if (open) setIndex(initialIndex);
	}, [open, initialIndex]);

	const hasPrev = index > 0;
	const hasNext = index < images.length - 1;

	const goPrev = useCallback(() => setIndex((i) => Math.max(0, i - 1)), []);
	const goNext = useCallback(
		() => setIndex((i) => Math.min(images.length - 1, i + 1)),
		[images.length]
	);

	useEffect(() => {
		if (!open) return;

		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'ArrowLeft') {
				e.preventDefault();
				goPrev();
			} else if (e.key === 'ArrowRight') {
				e.preventDefault();
				goNext();
			}
		};

		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	}, [open, goPrev, goNext]);

	const current = images[index];
	if (!current) return null;

	return (
		<DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
			<DialogPrimitive.Portal>
				<DialogPrimitive.Overlay
					className={cn(
						'fixed inset-0 z-50 bg-black/90 backdrop-blur-sm',
						'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:duration-200',
						'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:duration-150'
					)}
				/>
				<DialogPrimitive.Content
					aria-describedby={undefined}
					className={cn(
						'fixed inset-0 z-50 flex flex-col items-center justify-center p-[clamp(16px,4vw,48px)] outline-none',
						'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:duration-200',
						'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:duration-150'
					)}
				>
					<DialogPrimitive.Title className="sr-only">
						Image {index + 1} of {images.length}
					</DialogPrimitive.Title>

					<DialogPrimitive.Close
						className={cn(LIGHTBOX_BTN, 'absolute top-[16px] right-[16px] size-[40px]')}
						aria-label="Close lightbox"
					>
						<LuX className="size-[18px]" />
					</DialogPrimitive.Close>

					{images.length > 1 && (
						<>
							<button
								type="button"
								className={cn(
									LIGHTBOX_BTN,
									'absolute top-1/2 -translate-y-1/2 size-[44px] disabled:opacity-30 disabled:pointer-events-none left-[clamp(8px,2vw,24px)]'
								)}
								onClick={goPrev}
								disabled={!hasPrev}
								aria-label="Previous image"
							>
								<LuChevronLeft className="size-[20px]" />
							</button>
							<button
								type="button"
								className={cn(
									LIGHTBOX_BTN,
									'absolute top-1/2 -translate-y-1/2 size-[44px] disabled:opacity-30 disabled:pointer-events-none right-[clamp(8px,2vw,24px)]'
								)}
								onClick={goNext}
								disabled={!hasNext}
								aria-label="Next image"
							>
								<LuChevronRight className="size-[20px]" />
							</button>
						</>
					)}

					<img
						src={current.url}
						alt={current.alt ?? ''}
						width={current.width}
						height={current.height}
						className="max-h-[80vh] max-w-full rounded-lg object-contain select-none"
					/>

					<div className="mt-[14px] flex items-center gap-3 text-center">
						{current.caption && (
							<p className="m-0 font-mono text-[12px] text-white/75">{current.caption}</p>
						)}
						{images.length > 1 && (
							<span className="font-mono text-[11px] text-white/45">
								{index + 1} / {images.length}
							</span>
						)}
					</div>
				</DialogPrimitive.Content>
			</DialogPrimitive.Portal>
		</DialogPrimitive.Root>
	);
}

export type { LightboxImage };
export { Lightbox };
