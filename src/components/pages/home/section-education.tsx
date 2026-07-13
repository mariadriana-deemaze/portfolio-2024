import { EntryCard } from '@/components/ui/entry-card';
import { Section } from '@/components/ui/section';
import { SectionHeading } from '@/components/ui/section-heading';
import { useLocale } from '@/contexts/locale-context';
import { data } from '@/data/main';

export const SectionEducation = () => {
	const { t, translations } = useLocale();
	return (
		<Section>
			<SectionHeading num="03" title={t('pages.home.education.heading')} />
			<div className="flex flex-col gap-[14px]">
				{data.education.map(({ school, preview, summary, start, end, degree }, i) => (
					<EntryCard key={school}>
						<div className="w-11 h-11 rounded-[9px] border border-border bg-background grid place-items-center overflow-hidden shrink-0">
							{preview ? (
								<img
									className="w-[26px] h-[26px] object-contain block"
									src={preview}
									alt={school}
									width={26}
									height={26}
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
							<p className="m-0 mt-1 font-mono text-[12px] text-muted-foreground">
								{translations.data.education[i]?.degree ?? degree}
							</p>
						</div>

						<span className="font-mono text-[11px] text-muted-foreground whitespace-nowrap pt-[3px]">
							{start} — {end}
						</span>

						<p className="m-0 mt-3 font-mono text-[12.5px] leading-[1.7] text-foreground/90 text-pretty [grid-column:1_/-1] sm:[grid-column:2_/-1]">
							{(translations.data.education[i]?.summary ?? summary).trim()}
						</p>
					</EntryCard>
				))}
			</div>
		</Section>
	);
};
