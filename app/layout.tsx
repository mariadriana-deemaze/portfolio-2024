import localFont from 'next/font/local';
import { CommandMenu } from '@/components/command-menu';
import { Navbar } from '@/components/navbar';
import { ThemeProvider } from '@/components/theme-provider';
import { BGGrid } from '@/components/bg-grid';
import '@/styles/globals.css';
import { data } from '@/data/main';
import Script from 'next/script';
import ProgressIndicator from '@/components/progress-indicator';
import { getPosts } from '@/data/blog';
import { getProjects } from '@/data/projects';

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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	const postsLinks = await getPosts().then((posts) => {
		return posts.map((post) => {
			return {
				url: `/blog/${post.slug}`,
				title: post.title,
				type: 'blog'
			};
		});
	});
	const projectsLinks = await getProjects().then((projects) => {
		return projects.map((project) => {
			return {
				url: `/projects/${project.slug}`,
				title: project.title,
				type: 'projects'
			};
		});
	});
	return (
		<html lang="en" className="max-w-full overflow-y-scroll overflow-x-hidden no-scrollbar">
			<body className="antialiased mb-10 lg:mx-auto">
				<Script
					strategy="afterInteractive"
					src={'https://www.googletagmanager.com/gtag/js?id=G-ZSZBWDZK9T'}
				/>
				<Script
					id="google-analytics"
					strategy="afterInteractive"
					dangerouslySetInnerHTML={{
						__html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-ZSZBWDZK9T', {
            page_path: window.location.pathname,
          });`
					}}
				/>
				<ThemeProvider attribute="class" defaultTheme="dark">
					<Navbar />
					<ProgressIndicator />
					<main className="container relative mx-auto mt-28 overflow-auto print:p-12 overflow-y-scroll overflow-x-hidden no-scrollbar">
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
								...postsLinks,
								...projectsLinks,
								...data.contact.social.map((socialMediaLink) => ({
									url: socialMediaLink.url,
									title: socialMediaLink.name,
									type: 'social'
								}))
							]}
						/>
					</main>
				</ThemeProvider>
			</body>
		</html>
	);
}
