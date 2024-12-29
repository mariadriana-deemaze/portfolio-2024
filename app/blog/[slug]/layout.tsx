import { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<section className="mx-auto w-full max-w-2xl space-y-48 md:space-y-32 print:space-y-6 animate-fade-in-left delay-500">
			{children}
		</section>
	);
}
