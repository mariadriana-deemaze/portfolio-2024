import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
	return (
		<div className="mx-auto text-center max-w-60 mt-10 flex flex-col items-center justify-center">
			<h2 className="text-fade-grad font-clash text-4xl font-semibold">Not found :'(</h2>
			<p className="mt-4">
				Whatever you were looking for, is simply not here.{' '}
				<i>Have you tried looking for under the bed?</i>
			</p>
			<Button variant="outline" size="lg" asChild className="mt-10">
				<Link href="/">Feeling lucky ✨</Link>
			</Button>
		</div>
	);
}
