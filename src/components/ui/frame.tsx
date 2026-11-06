import type { ElementType, HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/utils/utils';

/*
  Ruled frame layout.

  The page is a single 84rem box centred in the viewport. Its two vertical
  borders run the whole document, so every band has to be the same width and
  carry `border-x` for the rules to line up. --frame-gutter is the margin
  outside the box, applied by the full-bleed wrapper, never padding inside it.

  FrameBand — full-bleed wrapper (background, edge to edge) + the ruled box.
  FrameRule — an empty ruled band. Vertical rhythm with the rules still drawn.
*/

const FRAME = 'mx-auto w-full max-w-[var(--frame-max)] border-x border-border';

interface FrameProps extends HTMLAttributes<HTMLDivElement> {
	/** Draw the rule along the top edge. Off for the first band under the navbar. */
	ruled?: boolean;
}

function Frame({ className, ruled = true, ...props }: FrameProps) {
	return <div className={cn(FRAME, ruled && 'border-t', className)} {...props} />;
}

export interface FrameBandProps extends HTMLAttributes<HTMLElement> {
	/** Element for the full-bleed wrapper. */
	as?: ElementType;
	/** Classes for the ruled box. Section padding belongs here. */
	innerClassName?: string;
	ruled?: boolean;
	children?: ReactNode;
}

export function FrameBand({
	as: Wrapper = 'section',
	className,
	innerClassName,
	ruled = true,
	children,
	...props
}: FrameBandProps) {
	return (
		<Wrapper className={cn('w-full px-[var(--frame-gutter)]', className)} {...props}>
			<Frame ruled={ruled} className={innerClassName}>
				{children}
			</Frame>
		</Wrapper>
	);
}

export function FrameRule({ className }: { className?: string }) {
	return (
		<div aria-hidden="true" className="w-full px-[var(--frame-gutter)]">
			<div className={cn(FRAME, 'border-t h-16 md:h-20', className)} />
		</div>
	);
}
