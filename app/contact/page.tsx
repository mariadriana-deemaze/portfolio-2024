import { ContactForm } from '@/components/pages/contact/form';
import { clashDisplay } from '../layout';

export default function Page() {
	return (
		<div className="flex flex-col justify-center items-center mt-20">
			<div className="flex flex-col items-center align-middle self-center max-w-md w-full gap-10">
				<div className="flex flex-col w-full gap-4">
					<h2 className={`${clashDisplay.className} text-xl font-bold`}>Reach out</h2>
					<p className="text-pretty font-mono text-sm text-foreground leading-5">
						I'm always interested in new projects and opportunities. Feel free to get in
						touch with me if you have a project in mind, want to discuss a potential
						collaboration, or simply want to say hello. You can reach me through the
						contact form below.
						<br />I typically respond back to emails within{' '}
						<span className="text-orange-600">1 business day</span>.
					</p>
				</div>
				<ContactForm />
			</div>
		</div>
	);
}
