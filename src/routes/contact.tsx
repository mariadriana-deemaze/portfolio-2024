import { createFileRoute } from '@tanstack/react-router';
import { ReactLenis } from 'lenis/react';
import { type JSX, useEffect, useState } from 'react';
import { ContactForm } from '@/components/pages/contact/form';
import { SectionHeading } from '@/components/ui/section-heading';
import { ScrollFadeReveal } from '@/components/ui/section-reveal';
import { StaggerText } from '@/components/ui/stagger-text';
import { BASE_URL, data } from '@/data/main';
import { createSeoHead } from '@/lib/head';
import { ROUTES } from '@/utils/routes';

export const Route = createFileRoute('/contact')({
	head: () =>
		createSeoHead({
			title: `${data.name} | ${data.role} :: Contact`,
			description:
				'Get in touch with Maria Adriana to discuss full stack development projects, consulting work, or collaboration opportunities.',
			alternates: {
				canonical: `${BASE_URL}${ROUTES.contact}`
			}
		}),
	component: ContactRoute
});

const LINE2_DELAY = 0.08 + 10 * 0.028;
const EM_END_DELAY = LINE2_DELAY + 9 * 0.028;

function ContactRoute(): JSX.Element {
	const [revealed, setRevealed] = useState(false);

	useEffect(() => {
		setRevealed(true);
	}, []);

	return (
		<ReactLenis root options={{ syncTouch: true }}>
			<div className="mx-auto w-full max-w-[1100px] animate-fade-in-left delay-500">
				<header className="pt-8 pb-[clamp(56px,9vw,104px)]">
					<h1 className="m-0 font-clash font-medium text-[clamp(52px,9.5vw,112px)] leading-[0.92] tracking-[-0.038em]">
						<StaggerText
							text="Let's make"
							revealed={revealed}
							baseDelay={0.08}
							letterDelay={0.028}
						/>
						<br />
						<em className="font-normal text-[var(--color-orange-primary)]">
							<StaggerText
								text="something"
								revealed={revealed}
								baseDelay={LINE2_DELAY}
								letterDelay={0.028}
							/>
						</em>
						<br />
						<StaggerText
							text="together"
							revealed={revealed}
							baseDelay={EM_END_DELAY}
							letterDelay={0.028}
						/>
					</h1>

					<p className="m-0 mt-7 font-clash font-normal text-[clamp(18px,2.4vw,26px)] leading-[1.4] tracking-[-0.01em] max-w-[560px] text-pretty">
						Have a project in mind, a question, or just want to say hi? Drop me a line — I read
						everything.
					</p>
				</header>

				<div className="grid grid-cols-1 min-[880px]:grid-cols-[0.82fr_1.18fr] gap-[clamp(32px,6vw,88px)] items-start">
					<div className="flex flex-col gap-8">
						<div>
							<p className="m-0 mb-3 font-mono text-[11px] tracking-[0.12em] uppercase text-muted-foreground">
								Email
							</p>
							<a
								href={`mailto:${data.contact.email}`}
								className="group font-clash font-medium text-[clamp(18px,2.2vw,28px)] tracking-[-0.02em] text-foreground hover:text-[var(--color-orange-primary)] no-underline inline-flex items-center leading-[1.1] transition-colors duration-300"
							>
								<span className="[background-image:linear-gradient(var(--color-orange-primary),var(--color-orange-primary))] bg-no-repeat [background-position:0_100%] [background-size:0%_2px] group-hover:[background-size:100%_2px] transition-[background-size] duration-[450ms] [transition-timing-function:var(--ease-out)] pb-[3px]">
									{data.contact.email}
								</span>
							</a>
						</div>

						<div>
							<p className="m-0 mb-3 font-mono text-[11px] tracking-[0.12em] uppercase text-muted-foreground">
								Based in
							</p>
							<p className="m-0 font-mono text-[14px] text-foreground leading-[1.6]">
								{data.location} · WET (UTC+1)
							</p>
						</div>

						<div>
							<p className="m-0 mb-3 font-mono text-[11px] tracking-[0.12em] uppercase text-muted-foreground">
								Response time
							</p>
							<p className="m-0 font-mono text-[14px] text-foreground leading-[1.6]">
								Usually within a day or two.
							</p>
						</div>

						<div>
							<p className="m-0 mb-3 font-mono text-[11px] tracking-[0.12em] uppercase text-muted-foreground">
								Elsewhere
							</p>
							<div className="flex gap-[14px]">
								{data.contact.social.map((s) => (
									<a
										key={s.name}
										href={s.url}
										target="_blank"
										rel="noopener noreferrer"
										aria-label={s.name}
										className="w-[22px] h-[22px] text-foreground grid place-items-center no-underline transition-[translate,color] duration-300 hover:-translate-y-[3px] hover:text-[var(--color-orange-primary)]"
									>
										<s.icon className="w-[18px] h-[18px]" aria-hidden="true" />
									</a>
								))}
							</div>
						</div>
					</div>

					<div
						className="relative entry-card spotlight-border border border-border rounded-[22px] overflow-hidden shadow-card p-[clamp(26px,3.6vw,46px)]"
						onMouseMove={(e) => {
							const r = e.currentTarget.getBoundingClientRect();
							e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - r.left}px`);
							e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - r.top}px`);
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.setProperty('--mouse-x', '-999px');
							e.currentTarget.style.setProperty('--mouse-y', '-999px');
						}}
					>
						<ContactForm />
					</div>
				</div>

				<ScrollFadeReveal className="mt-[clamp(80px,12vw,140px)]">
					<section>
						<div className="flex items-center gap-3 mb-[26px]">
							<span
								className="w-10 h-px bg-[var(--color-orange-primary)] opacity-50"
								aria-hidden="true"
							/>
							<span className="font-mono text-[12px] tracking-[0.06em] uppercase text-[var(--color-orange-primary)]">
								Good to know
							</span>
						</div>
						<SectionHeading title="A few quick answers" />
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-[18px] mb-10 lg:mb-20">
							{data.contact.faq.map((item) => (
								<div key={item.q} className="entry-card border border-border rounded-[14px] p-6">
									<h4 className="m-0 mb-[10px] font-clash font-medium text-[18px] tracking-[-0.01em]">
										{item.q}
									</h4>
									<p className="m-0 font-mono text-[12.5px] leading-[1.65] text-muted-foreground">
										{item.a}
									</p>
								</div>
							))}
						</div>
					</section>
				</ScrollFadeReveal>
			</div>
		</ReactLenis>
	);
}
