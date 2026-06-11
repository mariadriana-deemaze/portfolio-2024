import { Section } from '@/components/ui/section';
import { SectionHeading } from '@/components/ui/section-heading';
import { data } from '@/data/main';

export const SectionEducation = () => {
	return (
		<Section>
			<SectionHeading num="03" title="Education" />
			<div className="flex flex-col gap-[14px]">
				{data.education.map(({ school, preview, summary, start, end, degree }) => (
					<div
						key={school}
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
							{preview ? (
								<img
									className="w-[26px] h-[26px] object-contain block"
									src={preview}
									alt={school}
								/>
							) : (
								<span className="font-clash font-semibold text-[17px] text-[var(--color-orange-primary)]">
									{school
										.split(' ')
										.slice(0, 2)
										.map((w) => w[0])
										.join('')}
								</span>
							)}
						</div>

						<div className="min-w-0">
							<h3 className="m-0 font-clash text-[16px] font-semibold leading-none text-foreground">
								{school}
							</h3>
							<p className="m-0 mt-1 font-mono text-[12px] text-muted-foreground">{degree}</p>
						</div>

						<span className="font-mono text-[11px] text-muted-foreground whitespace-nowrap pt-[3px]">
							{start} — {end}
						</span>

						<p className="m-0 mt-3 font-mono text-[12.5px] leading-[1.7] text-foreground/90 text-pretty [grid-column:2_/-1]">
							{summary.trim()}
						</p>
					</div>
				))}
			</div>
		</Section>
	);
};
