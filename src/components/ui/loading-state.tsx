export function LoadingState({ label = 'Loading...' }: { label?: string }) {
	return (
		<div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
			<span className="w-5 h-5 rounded-full border-2 border-current border-t-transparent animate-spin" />
			<span className="font-mono text-xs">{label}</span>
		</div>
	);
}
