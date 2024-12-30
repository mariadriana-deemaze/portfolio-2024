import { ContactForm } from '@/components/pages/contact/form';
import { Section } from '@/components/ui/section';
import { data } from '@/data/main';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: `${data.name} | ${data.role} :: Contact`,
	description: 'Contact me → ' + data.summary,
	alternates: {
		canonical: 'https://maria-adriana.com/contact'
	}
};

export default function Page() {
	return (
		<>
			<header className="mx-auto w-full max-w-2xl space-y-2 animate-fade-in-left delay-500 mb-20">
				<h1 className="font-clash font-bold text-5xl text-fade-grad">Contact</h1>
				<h4 className="font-clash font-medium text-md text-gray-500">Reach out</h4>
				<p className="pb-10 text-pretty font-mono text-sm text-foreground leading-5">
					I'm always interested in new projects and opportunities. Feel free to get in
					touch with me if you have a project in mind, want to discuss a potential
					collaboration, or simply want to say hello. You can reach me through the contact
					form below.
					<br />
					Typically I respond back to emails within{' '}
					<span className="text-orange-600">1 business day</span>.
				</p>
				<hr />
			</header>
			<Section className="mt-20 animate-fade-in-left delay-700">
				<div className="flex flex-col justify-center items-center mt-20">
					<div className="flex flex-col items-center align-middle self-center max-w-2xl w-full gap-10">
						<div className="flex flex-col w-full gap-4"></div>
						<ContactForm />
					</div>
				</div>
			</Section>
		</>
	);
}
