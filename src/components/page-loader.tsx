export function PageLoader() {
	return (
		<div
			role="status"
			aria-label="Loading page"
			className="flex items-center justify-center min-h-[50vh]"
		>
			<span className="sr-only">Loading…</span>
			<span
				className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin motion-reduce:animate-none"
				style={{ borderColor: 'var(--color-orange-primary)', borderTopColor: 'transparent' }}
			/>
		</div>
	);
}
