import { LogoMA } from '@/components/logo-ma';
import { AnimatedMottos } from '@/components/pages/home/motto';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Section } from '@/components/ui/section';
import { data } from '@/data/main';
import { HiOutlineGlobe } from 'react-icons/hi';

export const SectionHero = () => {
	return (
		<Section className="mt-20 animate-fade-in delay-100">
			<div className="flex items-center justify-between flex-wrap-reverse sm:flex-nowrap gap-5">
				<div className="flex-1 space-y-5">
					<div className="flex-1 group">
						<div className="relative w-min">
							<h1 className="relative w-min leading-none">
								<LogoMA />
							</h1>
							<div className="-mt-5 pl-[calc(38.8%-4px)]">
								<AnimatedMottos
									data={[...data.mottos]}
									className="text-[#F15A24] from-[#F18B3E] bg-linear-to-r to-[#F15A24] bg-clip-text"
								/>
							</div>
						</div>
					</div>
					<p className="max-w-md text-pretty font-mono text-sm text-foreground">
						{data.about}
					</p>
					<p className="max-w-md items-center text-pretty font-mono text-xs text-gray-500">
						<a
							className="inline-flex gap-x-1.5 align-baseline leading-none hover:underline"
							href={data.locationLink}
							target="_blank"
							rel="noreferrer"
						>
							<HiOutlineGlobe className="h-3 w-3" />
							{data.location}
						</a>
					</p>
					<div className="flex gap-x-1 pt-1 font-mono text-sm text-foreground print:hidden">
						{data.contact.social.map((social) => (
							<Button
								key={social.name}
								className="h-8 w-8 bg-card text-card-foreground"
								variant="outline"
								size="icon"
								asChild
							>
								<a href={social.url} target="_blank" rel="noreferrer">
									<social.icon className="h-4 w-4" />
								</a>
							</Button>
						))}
					</div>
					<div className="hidden flex-col gap-x-1 font-mono text-sm text-muted-foreground print:flex">
						{data.contact.email ? (
							<a href={`mailto:${data.contact.email}`}>
								<span className="underline">{data.contact.email}</span>
							</a>
						) : null}
					</div>
				</div>

				<div className="relative">
					<Avatar className="h-20 w-20 md:h-28 md:w-28">
						<AvatarImage alt={data.name} src="images/avatar.jpeg" />
						<AvatarFallback>
							{data.name.split(' ').map((part) => part[0].toUpperCase())}
						</AvatarFallback>
					</Avatar>
					<div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full p-4 border border-input bg-card text-card-foreground text-[18px]">
						{'\u{1F44B}'}
					</div>
				</div>
			</div>
		</Section>
	);
};
