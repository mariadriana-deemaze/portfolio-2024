import { data } from '@/data/main';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: `${data.name} | ${data.about}`,
	description: data.summary
};

export default function Page() {
	return (
		<section className="mx-auto w-full max-w-2xl space-y-12 print:space-y-6 h-96 border border-red-600 mt-64">
			<h1>Soon...</h1>
		</section>
	);
}
