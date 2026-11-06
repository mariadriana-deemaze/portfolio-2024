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

  A ruled band is marked at both top corners with a brand crosshair: two 1px
  arms centred on the point where its top rule crosses the frame edge.
*/

const FRAME = 'relative mx-auto w-full max-w-[var(--frame-max)] border-x border-border';

const ARM = 'pointer-events-none absolute border-[var(--color-orange-primary)]';

function Crosshairs() {
	return (
		<span aria-hidden="true">
			<span className={cn(ARM, '-left-3 -top-px h-0 w-6 border-t')} />
			<span className={cn(ARM, '-left-px -top-3 h-6 w-0 border-l')} />
			<span className={cn(ARM, '-right-3 -top-px h-0 w-6 border-t')} />
			<span className={cn(ARM, '-right-px -top-3 h-6 w-0 border-l')} />
		</span>
	);
}

interface FrameProps extends HTMLAttributes<HTMLDivElement> {
	/** Draw the rule along the top edge. Off for the first band under the navbar. */
	ruled?: boolean;
	children?: ReactNode;
}

function Frame({ className, ruled = true, children, ...props }: FrameProps) {
	return (
		<div className={cn(FRAME, ruled && 'border-t', className)} {...props}>
			{ruled && <Crosshairs />}
			{children}
		</div>
	);
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

export interface FrameRuleProps {
	className?: string;
	/** Fill the band with diagonal hatching instead of leaving it blank. */
	hatched?: boolean;
}

export function FrameRule({ className, hatched = false }: FrameRuleProps) {
	return (
		<div aria-hidden="true" className="w-full px-[var(--frame-gutter)]">
			<Frame className={cn('h-16 md:h-20', className)}>
				{hatched && <div className="hatch-lines h-full w-full opacity-60" />}
			</Frame>
		</div>
	);
}
