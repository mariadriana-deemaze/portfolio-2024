import { ReactNode } from 'react';

export const metadata = {
	title: 'Blog',
	description: 'Rambles',
	alternates: {
		canonical: 'https://maria-adriana.com/blog'
	}
};

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<section className="mx-auto w-full max-w-2xl space-y-48 md:space-y-32 print:space-y-6 animate-fade-in-left delay-500">
			{children}
		</section>
	);
}
