import { clashDisplay } from '@/app/layout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Section } from '@/components/ui/section';
import { data } from '@/data/main';
import { HiOutlineGlobe } from "react-icons/hi";

export const SectionAbout = () => {
	return (
		<>
			<Section className='mt-20'>
				<div className="flex items-center justify-between flex-wrap-reverse sm:flex-nowrap gap-5">
					<div className="flex-1 space-y-5">
						<div className="flex-1">
							<h1
								className={`${clashDisplay.className} relative text-[40px] md:text-[50px] whitespace-nowrap max-w-min font-medium leading-none`}
							>
								{data.name}
								<div className="absolute top-1 md:top-3 -right-14 text-[30px] w-12 align-middle ml-3 animate-hand-wave">👋</div>
							</h1>
							<h6
								className={`${clashDisplay.className} text-lg font-normal text-orange-600`}
							>
								{data.role}
							</h6>
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
									<a href={social.url} target="_blank">
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

					<Avatar className="h-20 w-20 md:h-28 md:w-28">
						<AvatarImage alt={data.name} src="images/avatar.jpeg" />
						<AvatarFallback>{data.initials}</AvatarFallback>
					</Avatar>
				</div>
			</Section>
			<Section>
				<h2 className={`${clashDisplay.className} text-xl font-bold`}>About</h2>
				<p className="text-pretty font-mono text-sm text-foreground">{data.summary}</p>
			</Section>
		</>
	);
};
