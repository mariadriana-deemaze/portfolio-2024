import { Button } from '@/components/ui/button';
import { data } from '@/data/main';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
	title: `${data.name} | ${data.about}`,
	description: data.summary
};

export default function Page() {
	return (
		<div className="flex flex-col justify-center items-center h-80">
			<h2 className="text-4xl font-semibold">Coming soon.</h2>
			<p className="mt-4">🚧 Page under construction 🚧</p>
			<div className="flex flex-col mx-auto mt-10 gap-9">
				<Button variant="outline" size="lg" asChild>
					<Link href="/">Return Home</Link>
				</Button>
			</div>
		</div>
	);
}
