import { createRootRoute, HeadContent, Scripts } from '@tanstack/react-router';
import type { ReactNode } from 'react';

import { AppLoaderDismiss, AppLoaderShell } from '@/components/app-loader';
import Layout from '@/components/layout';
import { NotFoundPage } from '@/components/ui/not-found-page';
import { Toaster } from '@/components/ui/sonner';
import { WebMcpRegistration } from '@/components/webmcp';
import { LocaleProvider, useLocale } from '@/contexts/locale-context';
import { getCommandLinksFn } from '@/server-fns/content';
import { ROUTES } from '@/utils/routes';
import { getThemeInitScript } from '@/utils/theme';

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: 'utf-8' as const },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1.0' }
		],
		links: [
			{ rel: 'icon', type: 'image/x-icon', href: '/images/favicon.ico' },
			{ rel: 'preconnect', href: 'https://fonts.googleapis.com' },
			{ rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
			{
				rel: 'stylesheet',
				href: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,400;0,500;0,600;1,400&display=swap'
			}
		]
	}),
	loader: async () => {
		const commandLinks = await getCommandLinksFn();

		return {
			commandLinks
		};
	},
	shellComponent: RootDocument,
	notFoundComponent: NotFoundRoute
});

function RootDocument({ children }: { children: ReactNode }) {
	const { commandLinks } = Route.useLoaderData();

	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<script dangerouslySetInnerHTML={{ __html: getThemeInitScript() }} />
				<HeadContent />
			</head>
			<body>
				<AppLoaderShell />
				<LocaleProvider>
					<Layout commandLinks={commandLinks}>{children}</Layout>
				</LocaleProvider>
				<WebMcpRegistration />
				<Toaster />
				<AppLoaderDismiss />
				<Scripts />
			</body>
		</html>
	);
}

function NotFoundRoute() {
	const { t } = useLocale();
	return (
		<NotFoundPage
			title={t('pages.not-found.title')}
			description={t('pages.not-found.description')}
			backTo={ROUTES.home}
			backLabel={t('pages.not-found.back-home')}
		/>
	);
}
