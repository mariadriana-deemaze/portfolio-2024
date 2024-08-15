import { Metadata } from 'next';
import localFont from 'next/font/local';
import { CommandMenu } from '@/components/command-menu';
import { Navbar } from '@/components/navbar';
import { ThemeProvider } from '@/components/theme-provider';
import { data } from '@/data/main';
import { BGGrid } from '@/components/bg-grid';
import '@/styles/globals.css';

export const clashDisplay = localFont({
	src: [
		{
			path: '../public/fonts/ClashDisplay-Bold.ttf',
			weight: '800',
			style: 'normal'
		},
		{
			path: '../public/fonts/ClashDisplay-Semibold.ttf',
			weight: '700',
			style: 'normal'
		},
		{
			path: '../public/fonts/ClashDisplay-Medium.ttf',
			weight: '500',
			style: 'normal'
		},
		{
			path: '../public/fonts/ClashDisplay-Regular.ttf',
			weight: '400',
			style: 'normal'
		},
		{
			path: '../public/fonts/ClashDisplay-Light.ttf',
			weight: '300',
			style: 'normal'
		},
		{
			path: '../public/fonts/ClashDisplay-Extralight.ttf',
			weight: '200',
			style: 'normal'
		}
	]
});

export const metadata: Metadata = {
	title: `${data.name} | ${data.role}`,
	description: data.summary
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<ThemeProvider attribute="class" defaultTheme="dark">
				<body className="antialiased mb-10 lg:mx-auto">
					<Navbar />
					<main className="container relative mx-auto mt-28 overflow-auto print:p-12">
						<BGGrid>{children}</BGGrid>
						<CommandMenu
							links={[
								{
									url: '/blog',
									title: 'Blog',
									type: 'internal'
								},
								{
									url: '/contact',
									title: 'Contact',
									type: 'internal'
								},
								...data.contact.social.map((socialMediaLink) => ({
									url: socialMediaLink.url,
									title: socialMediaLink.name,
									type: 'social'
								}))
							]}
						/>
					</main>
				</body>
			</ThemeProvider>
		</html>
	);
}
