import * as React from 'react';

import { cn } from '@/utils/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, type, error, ...props }, ref) => {
		return (
			<>
				<input
					type={type}
					className={cn(
						'w-full rounded-[12px] border border-border bg-background px-[15px] py-[13px] font-mono text-[14px] leading-[1.5] text-foreground placeholder:text-muted-foreground/80 outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[var(--color-orange-primary)] focus-visible:shadow-[0_0_0_4px_color-mix(in_srgb,var(--color-orange-primary)_14%,transparent)] transition-[border-color,box-shadow] duration-[250ms] disabled:cursor-not-allowed disabled:opacity-50',
						className
					)}
					ref={ref}
					{...props}
				/>
				{error && <span className="mt-[6px] font-mono text-[11px] text-destructive">{error}</span>}
			</>
		);
	}
);
Input.displayName = 'Input';

export { Input };
