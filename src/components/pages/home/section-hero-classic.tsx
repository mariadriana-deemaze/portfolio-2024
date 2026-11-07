import {
	AVATAR_SIZE_DESKTOP,
	AVATAR_SIZE_MOBILE,
	AvatarCard
} from '@/components/pages/home/avatar-card';
import { AnimatedMottos } from '@/components/pages/home/motto';
import { Section } from '@/components/ui/section';
import { useLocale } from '@/contexts/locale-context';
import { data } from '@/data/main';

export const SectionHeroClassic = () => {
	const { t, translations } = useLocale();
	const currentWork = data.work.find((w) => w.end === 'Present');

	return (
		<Section className="mt-20 animate-fade-in delay-100">
			<AvatarCard size={AVATAR_SIZE_MOBILE} className="sm:hidden mb-[22px]" />

			<h1 className="font-clash font-medium text-[clamp(64px,20vw,116px)] leading-[0.92] tracking-[-0.035em] m-0">
				<span className="block w-fit pb-[0.04em] bg-[linear-gradient(to_right,var(--color-fg-base)_50%,transparent)] [-webkit-background-clip:text] [background-clip:text] [-webkit-text-fill-color:transparent]">
					maria
				</span>
				<span className="block w-fit pb-[0.04em] bg-[linear-gradient(to_right,var(--color-orange-primary)_50%,transparent)] [-webkit-background-clip:text] [background-clip:text] [-webkit-text-fill-color:transparent]">
					adriana
				</span>
			</h1>

			<div className="flex items-start justify-start gap-7 max-sm:gap-[22px] mt-[34px] flex-wrap">
				<div style={{ flex: '0 1 420px' }}>
					<div className="font-clash text-[19px] font-normal h-[26px] overflow-hidden flex items-center">
						<AnimatedMottos
							data={translations.data.mottos}
							className="text-[var(--color-orange-primary)]"
						/>
					</div>

					<p className="font-mono text-sm leading-[1.7] max-w-[380px] mt-[14px] text-foreground m-0">
						{t('data.about')}
					</p>

					<div className="flex gap-[14px] mt-[26px] print:hidden">
						{data.contact.social.map((social) => (
							<a
								key={social.name}
								href={social.url}
								target="_blank"
								rel="noreferrer"
								aria-label={social.name}
								className="w-[22px] h-[22px] text-muted-foreground grid place-items-center no-underline transition-[translate,color] duration-300 hover:-translate-y-[3px] hover:text-[var(--color-orange-primary)]"
							>
								<social.icon className="w-[18px] h-[18px]" aria-hidden="true" />
							</a>
						))}
					</div>
				</div>

				<div className="flex flex-col gap-5 w-[340px] max-w-full">
					<div className="flex gap-6 items-start justify-between">
						<div className="flex flex-col gap-[14px] min-w-[168px] max-sm:min-w-0">
							<div>
								<div className="font-mono text-[10px] tracking-[0.12em] uppercase text-muted-foreground">
									{t('pages.home.hero.focus')}
								</div>
								<div className="font-mono text-[13px] text-foreground mt-[3px] whitespace-nowrap">
									{data.focus.join(' · ')}
								</div>
							</div>
							{currentWork && (
								<div>
									<div className="font-mono text-[10px] tracking-[0.12em] uppercase text-muted-foreground">
										{t('pages.home.hero.currently')}
									</div>
									<div className="font-mono text-[13px] text-foreground mt-[3px] whitespace-nowrap">
										<a
											href={currentWork.link}
											target="_blank"
											rel="noreferrer"
											className="hover:text-[var(--color-orange-primary)] transition-colors"
										>
											{currentWork.company}
										</a>
									</div>
								</div>
							)}
						</div>

						<AvatarCard size={AVATAR_SIZE_DESKTOP} className="max-sm:hidden" />
					</div>
				</div>
			</div>

			<div
				className="flex items-center gap-[10px] mt-[56px] font-mono text-[11px] tracking-[0.1em] uppercase text-muted-foreground print:hidden"
				aria-hidden="true"
			>
				<span className="relative w-px h-[38px] bg-border overflow-hidden shrink-0 hero-scrollcue-bar" />
				{t('pages.home.hero.scroll-cue')}
			</div>
		</Section>
	);
};
