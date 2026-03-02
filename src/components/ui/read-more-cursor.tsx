import { useEffect } from 'react';

import useElementSize from '@/hooks/use-element-size';
import useMousePosition from '@/hooks/use-mouse-position';
import { cn } from '@/utils/utils';

type ReadMoreCursorProps = {
	isVisible: boolean;
};

export default function ReadMoreCursor({ isVisible }: ReadMoreCursorProps) {
	const { x, y } = useMousePosition();
	const { ref, size } = useElementSize<HTMLDivElement>();

	useEffect(() => {
		if (!isVisible) {
			return;
		}

		const previousCursor = document.body.style.cursor;
		document.body.style.cursor = 'none';

		return () => {
			document.body.style.cursor = previousCursor;
		};
	}, [isVisible]);

	return (
		<div
			aria-hidden="true"
			ref={ref}
			style={{
				left: `${(x ?? 0) - size.width / 2}px`,
				top: `${(y ?? 0) - size.height / 2}px`
			}}
			className={cn(
				'pointer-events-none fixed h-24 w-24 rounded-full bg-linear-to-r from-orange-500 via-orange-500 to-orange-600 transition-all duration-300 ease-in-out flex flex-col justify-center cursor-none',
				{
					'opacity-100 scale-100 -rotate-0': isVisible,
					'opacity-0 scale-50 -rotate-45': !isVisible
				}
			)}
		>
			<div className="flex flex-row self-center -skew-y-12 leading-4 font-clash font-bold text-white uppercase cursor-none">
				<span className="block w-14 text-wrap">Read more </span>
				<svg
					width="14"
					height="14"
					viewBox="0 0 17 17"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					className="self-center cursor-none"
				>
					<path d="M2 1H16V15" stroke="currentColor" strokeWidth="4"></path>
					<path
						d="M1 16.1953L16.1953 1.00001"
						stroke="currentColor"
						strokeWidth="4"
					></path>
				</svg>
			</div>
		</div>
	);
}
