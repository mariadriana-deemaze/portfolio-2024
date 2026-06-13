import { useEffect, useRef, useState } from 'react';
import { LuCheck, LuClock, LuEye, LuLink2, LuLinkedin, LuX } from 'react-icons/lu';

import { BASE_URL } from '@/data/main';
import { cn } from '@/utils/utils';

interface MetaBarProps {
	slug: string;
	title: string;
	readingTime?: number;
	views?: number;
}

const COUNTUP_DURATION = 1100;

function useCountUp(target: number, run: boolean) {
	const [n, setN] = useState(0);

	useEffect(() => {
		if (!run) return;
		let raf: number;
		let start: number | undefined;

		const tick = (t: number) => {
			if (!start) start = t;
			const p = Math.min(1, (t - start) / COUNTUP_DURATION);
			const eased = 1 - (1 - p) ** 3;
			setN(Math.round(target * eased));
			if (p < 1) raf = requestAnimationFrame(tick);
		};

		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	}, [run, target]);

	return n;
}

const STAT_ICON = 'size-[15px] text-[var(--color-orange-primary)]';
const STAT =
	'inline-flex items-center gap-[7px] font-mono text-muted-foreground whitespace-nowrap text-[12.5px]';
const STAT_B = 'font-semibold text-[var(--color-orange-primary)]';
const SHARE_BTN =
	'inline-flex size-[34px] cursor-pointer items-center justify-center rounded-[9px] border border-border no-underline transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--color-orange-primary)] hover:bg-[var(--color-orange-primary)] hover:text-white [&>svg]:size-[15px]';

export function MetaBar({ slug, title, readingTime = 0, views = 0 }: MetaBarProps) {
	const [seen, setSeen] = useState(false);
	const [copied, setCopied] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	const animatedViews = useCountUp(views, seen);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;

		const io = new IntersectionObserver(
			(entries) => {
				entries.forEach((e) => {
					if (e.isIntersecting) {
						setSeen(true);
						io.disconnect();
					}
				});
			},
			{ threshold: 0.5 }
		);

		io.observe(el);
		return () => io.disconnect();
	}, []);

	const copy = async () => {
		try {
			await navigator.clipboard.writeText(`${BASE_URL}/blog/${slug}`);
		} catch (err) {
			console.error('Failed to copy:', err);
		}
		setCopied(true);
		setTimeout(() => setCopied(false), 1800);
	};

	const postUrl = `${BASE_URL}/blog/${slug}`;
	const encodedUrl = encodeURIComponent(postUrl);
	const encodedTitle = encodeURIComponent(title);

	return (
		<div
			ref={ref}
			className="animate-fade-in-left delay-500 mt-9 flex flex-wrap items-center gap-3.5 border-t border-b border-border py-[18px]"
		>
			<div className="flex items-center gap-4">
				<div className={STAT}>
					<LuEye className={STAT_ICON} />
					<span>
						<b className={STAT_B}>{animatedViews.toLocaleString()}</b> views
					</span>
				</div>

				<div className="h-3.5 w-px bg-border" />

				<div className={STAT}>
					<LuClock className={STAT_ICON} />
					<span>
						<b className={STAT_B}>{readingTime}</b> min read
					</span>
				</div>
			</div>

			<div className="flex-1" />

			<div className="relative flex items-center gap-[7px]">
				<span className="mr-1 font-mono text-[11px] uppercase tracking-[0.06em] text-muted-foreground">
					Share
				</span>

				<a
					href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
					target="_blank"
					rel="noopener noreferrer"
					className={cn(
						SHARE_BTN,
						'text-foreground bg-[color-mix(in_srgb,var(--card)_50%,transparent)]'
					)}
					title="Share on X"
					aria-label="Share on X"
				>
					<LuX />
				</a>

				<a
					href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
					target="_blank"
					rel="noopener noreferrer"
					className={cn(
						SHARE_BTN,
						'text-foreground bg-[color-mix(in_srgb,var(--card)_50%,transparent)]'
					)}
					title="Share on LinkedIn"
					aria-label="Share on LinkedIn"
				>
					<LuLinkedin />
				</a>

				<div className="relative">
					<button
						onClick={copy}
						className={cn(
							SHARE_BTN,
							'text-foreground bg-[color-mix(in_srgb,var(--card)_50%,transparent)]',
							copied && 'border-emerald-600 bg-emerald-600 text-white'
						)}
						title="Copy link to clipboard"
						aria-label="Copy link to clipboard"
					>
						{copied ? <LuCheck /> : <LuLink2 />}
					</button>

					{copied && (
						<div className="pointer-events-none absolute right-0 top-[-34px] rounded bg-emerald-600 px-2.5 py-1 font-mono text-xs whitespace-nowrap text-white">
							Link copied
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
