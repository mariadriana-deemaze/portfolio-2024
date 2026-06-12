import * as DialogPrimitive from '@radix-ui/react-dialog';
import { type DialogProps } from '@radix-ui/react-dialog';
import { Command as CommandPrimitive } from 'cmdk';
import * as React from 'react';
import { LuSearch } from 'react-icons/lu';

import { DialogOverlay, DialogPortal } from '@/components/ui/dialog';
import { cn } from '@/utils/utils';

const Command = React.forwardRef<
	React.ElementRef<typeof CommandPrimitive>,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
	<CommandPrimitive
		ref={ref}
		className={cn('flex h-full w-full flex-col overflow-hidden', className)}
		{...props}
	/>
));
Command.displayName = CommandPrimitive.displayName;

interface CommandDialogProps extends DialogProps {}

const CommandDialog = ({ children, ...props }: CommandDialogProps) => {
	return (
		<DialogPrimitive.Root {...props}>
			<DialogPortal>
				<DialogOverlay className="bg-foreground/[0.22] backdrop-blur-[4px]" />
				<DialogPrimitive.Content
					className={cn(
						'fixed left-[50%] top-[14vh] z-50 w-[min(540px,92vw)] translate-x-[-50%]',
						'rounded-[14px] border border-border overflow-hidden',
						'bg-[color-mix(in_srgb,hsl(var(--card))_96%,transparent)]',
						'shadow-[0_40px_80px_-20px_rgba(0,0,0,0.45)]',
						'data-[state=open]:animate-in data-[state=closed]:animate-out',
						'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
						'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
						'data-[state=open]:slide-in-from-top-2'
					)}
				>
					<Command>{children}</Command>
				</DialogPrimitive.Content>
			</DialogPortal>
		</DialogPrimitive.Root>
	);
};

const CommandInput = React.forwardRef<
	React.ElementRef<typeof CommandPrimitive.Input>,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
	<div
		className="flex items-center gap-[10px] px-4 py-[15px] border-b border-border"
		cmdk-input-wrapper=""
	>
		<LuSearch className="w-4 h-4 shrink-0 text-muted-foreground" />
		<CommandPrimitive.Input
			ref={ref}
			className={cn(
				'flex flex-1 bg-transparent font-mono text-[14px] text-foreground outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
				className
			)}
			{...props}
		/>
		<span className="font-mono text-[10px] border border-border rounded-[5px] px-[6px] py-[3px] text-muted-foreground shrink-0 leading-none">
			esc
		</span>
	</div>
));

CommandInput.displayName = CommandPrimitive.Input.displayName;

const CommandList = React.forwardRef<
	React.ElementRef<typeof CommandPrimitive.List>,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
	<CommandPrimitive.List
		ref={ref}
		className={cn('max-h-[320px] overflow-y-auto overflow-x-hidden p-2', className)}
		{...props}
	/>
));

CommandList.displayName = CommandPrimitive.List.displayName;

const CommandEmpty = React.forwardRef<
	React.ElementRef<typeof CommandPrimitive.Empty>,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
	<CommandPrimitive.Empty
		ref={ref}
		className="py-6 text-center font-mono text-[12px] text-muted-foreground"
		{...props}
	/>
));

CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

const CommandGroup = React.forwardRef<
	React.ElementRef<typeof CommandPrimitive.Group>,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
	<CommandPrimitive.Group
		ref={ref}
		className={cn(
			'overflow-hidden text-foreground',
			'[&_[cmdk-group-heading]]:px-[10px] [&_[cmdk-group-heading]]:pt-2 [&_[cmdk-group-heading]]:pb-1',
			'[&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[10px]',
			'[&_[cmdk-group-heading]]:tracking-[0.1em] [&_[cmdk-group-heading]]:uppercase',
			'[&_[cmdk-group-heading]]:text-muted-foreground',
			className
		)}
		{...props}
	/>
));

CommandGroup.displayName = CommandPrimitive.Group.displayName;

const CommandSeparator = React.forwardRef<
	React.ElementRef<typeof CommandPrimitive.Separator>,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
	<CommandPrimitive.Separator
		ref={ref}
		className={cn('-mx-1 h-px bg-border', className)}
		{...props}
	/>
));
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

const CommandItem = React.forwardRef<
	React.ElementRef<typeof CommandPrimitive.Item>,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
	<CommandPrimitive.Item
		ref={ref}
		className={cn(
			'relative flex cursor-default select-none items-center gap-3 rounded-[9px] px-3 py-[10px]',
			'font-mono text-[13px] text-foreground outline-none',
			'aria-selected:bg-[color-mix(in_srgb,var(--color-orange-primary)_14%,transparent)]',
			'data-disabled:pointer-events-none data-disabled:opacity-50',
			className
		)}
		{...props}
	/>
));

CommandItem.displayName = CommandPrimitive.Item.displayName;

export {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator
};
