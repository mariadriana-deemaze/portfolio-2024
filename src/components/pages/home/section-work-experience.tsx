import type { ReactElement } from 'react';

import { Chip } from '@/components/ui/chip';
import { Section } from '@/components/ui/section';
import { SectionHeading } from '@/components/ui/section-heading';
import { data } from '@/data/main';

export const SectionWorkExperience = () => {
	return (
		<Section>
			<SectionHeading num="02" title="Work Experience" count={`${data.work.length} roles`} />
			<div className="flex flex-col gap-[14px]">
				{data.work.map(({ company, title, description, link, preview, stack, start, end }) => (
					<div
						key={company}
						className="entry-card spotlight-border grid grid-cols-[48px_1fr_auto] gap-[18px] p-[22px_22px_22px_20px] border border-border rounded-xl shadow-card"
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
						<div className="w-11 h-11 rounded-[9px] border border-border bg-background grid place-items-center overflow-hidden shrink-0">
							{preview && (
								<img
									className="w-[26px] h-[26px] object-contain block"
									src={preview}
									alt={company}
								/>
							)}
						</div>

						<div className="min-w-0">
							<h3 className="m-0 font-clash text-[16px] font-semibold leading-none">
								{link ? (
									<a
										href={link}
										target="_blank"
										rel="noreferrer"
										className="text-foreground no-underline hover:underline hover:[text-decoration-color:var(--color-orange-primary)] [text-underline-offset:3px]"
									>
										{company}
									</a>
								) : (
									company
								)}
							</h3>
							<p className="m-0 mt-1 font-mono text-[12px] text-muted-foreground">{title}</p>
						</div>

						<span className="font-mono text-[11px] text-muted-foreground whitespace-nowrap pt-[3px]">
							{start} — {end}
						</span>

						<p className="m-0 mt-3 font-mono text-[12.5px] leading-[1.7] text-foreground/90 text-pretty [grid-column:2_/-1]">
							{description.trim()}
						</p>

						{stack.length > 0 && (
							<div className="mt-[14px] flex flex-wrap gap-[5px] [grid-column:2_/-1]">
								{stack.map((st) => {
									const { label, icon } = st as { label: string; icon: ReactElement };
									return (
										<Chip key={label} interactive className="gap-[5px]">
											{icon}
											{label}
										</Chip>
									);
								})}
							</div>
						)}
					</div>
				))}
			</div>
		</Section>
	);
};
