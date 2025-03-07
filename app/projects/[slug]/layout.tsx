import { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<section className="project-page mx-auto w-full max-w-2xl animate-fade-in-left delay-500">
			{children}
		</section>
	);
}
