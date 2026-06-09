import { cn } from '@/utils/utils';

interface EmptyStateProps {
	message?: string;
	className?: string;
}

export function EmptyState({ message = 'Nothing here yet.', className }: EmptyStateProps) {
	return (
		<div className={cn('flex flex-col items-center justify-center gap-2 py-16', className)}>
			<p className="font-mono text-sm text-muted-foreground">{message}</p>
		</div>
	);
}
