import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { data } from '@/data/main';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: `${data.name} | ${data.role} :: You seem lost`,
	description:
		'The page you’re looking for isn’t here. Navigate back to Maria Adriana’s projects, blog, or contact page — or get in touch to discuss full stack development solutions.',
	alternates: {
		canonical: 'https://maria-adriana.com/'
	}
};

export default function NotFound() {
	return (
		<div className="mx-auto text-center max-w-96 mt-10 flex flex-col items-center justify-center">
			<h2 className="text-fade-grad font-clash text-4xl font-semibold">Not found</h2>
			<p className="mt-4">
				Whatever you were looking for, is simply not here. <br />
				<i>Have you tried looking under the bed?</i>
			</p>
			<Button variant="outline" size="lg" asChild className="mt-10">
				<Link href="/">Feeling lucky ✨</Link>
			</Button>
		</div>
	);
}
