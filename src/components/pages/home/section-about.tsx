import { Section } from '@/components/ui/section';
import { SectionHeading } from '@/components/ui/section-heading';
import { useLocale } from '@/contexts/locale-context';

export const SectionAbout = () => {
	const { t } = useLocale();
	const paragraphs = t('data.summary')
		.split('\n')
		.filter((p) => p.trim() !== '');

	const HIGHLIGHT = t('pages.home.about.highlight');

	return (
		<Section>
			<SectionHeading num="01" title={t('pages.home.about.heading')} />
			<div className="flex flex-col gap-4">
				{paragraphs.map((paragraph, index) => {
					if (index === 0) {
						const parts = paragraph.split(HIGHLIGHT);
						return (
							<p
								key={`section_about_paragraph_${index}`}
								className="m-0 font-clash text-[22px] font-normal leading-[1.45] tracking-[-0.01em] text-foreground text-pretty"
							>
								{parts[0]}
								{parts.length > 1 && (
									<span className="text-[var(--color-orange-primary)]">{HIGHLIGHT}</span>
								)}
								{parts[1]}
							</p>
						);
					}
					return (
						<p
							key={`section_about_paragraph_${index}`}
							className="m-0 font-mono text-[13px] leading-[1.8] text-foreground text-pretty"
						>
							{paragraph}
						</p>
					);
				})}
			</div>
		</Section>
	);
};
