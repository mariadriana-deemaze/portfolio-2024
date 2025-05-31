import { Button } from '@/components/ui/button';
import { Section } from '@/components/ui/section';
import { data } from '@/data/main';
import { AnimatedMottos } from './motto';
import Image from 'next/image';

export const SectionHero = () => {
	return (
		<Section className="animate-fade-in delay-100">
			<div className="flex md:items-center justify-between flex-nowrap flex-col md:flex-row gap-14 md:-translate-x-54">
				<Image
					width={400}
					height={300}
					src="/images/avatar_mb.png"
					alt="Hero Background"
					className="flex md:hidden w-full mt-4"
				/>
				<Image
					width={460}
					height={1000}
					src="/images/avatar.png"
					alt="Hero Background"
					className="hidden md:flex w-40"
				/>
				<div className="w-full flex-1 space-y-5">
					<div className="flex flex-row gap-6 items-center">
						<Image
							width={200}
							height={60}
							src="/images/logo.svg"
							alt="logo"
							className="w-20 my-4"
						/>
						<hr className="border border-[#F15A24] h-8" />
						<div className="flex-1 group">
							<div className="relative w-min">
								<h1 className="font-clash relative text-[24px] md:text-[50px] whitespace-nowrap max-w-min font-medium leading-none text-fade-grad">
									{data.name}
								</h1>
							</div>
							<AnimatedMottos
								data={[...data.mottos]}
								className="text-[#F15A24] from-[#F18B3E] bg-linear-to-r to-[#F15A24] bg-clip-text text-[16px]"
							/>
						</div>
					</div>
					<div className="flex gap-x-1 pt-1 font-mono text-sm text-foreground print:hidden">
						<Button
							className="h-8 text-white bg-[#F15A24] hover:bg-[#f1593e] hover:text-card border-orange-400 drop-shadow-xl shadow-[#f15b244e] shadow-lg"
							variant="outline"
							asChild
						>
							<a href={'/contact'} target="_blank" rel="noreferrer">
								Contact me
							</a>
						</Button>

						<div className="flex flex-row gap-2 ml-6">
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
					</div>
					<div className="hidden flex-col gap-x-1 font-mono text-sm text-muted-foreground print:flex">
						{data.contact.email ? (
							<a href={`mailto:${data.contact.email}`}>
								<span className="underline">{data.contact.email}</span>
							</a>
						) : null}
					</div>
				</div>

				{/* <Avatar className="h-20 w-20 md:h-28 md:w-28">
					<AvatarImage alt={data.name} src="images/avatar.jpeg" />
					<AvatarFallback>
						{data.name.split(' ').map((part) => part[0].toUpperCase())}
					</AvatarFallback>
				</Avatar> */}
			</div>
		</Section>
	);
};
