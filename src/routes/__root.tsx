import { createRootRoute, HeadContent, Link, Scripts } from '@tanstack/react-router';
import type { ReactNode } from 'react';

import Layout from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';
import { getCommandLinksFn } from '@/server-fns/content';
import { getThemeInitScript } from '@/utils/theme';

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: 'utf-8' as const },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1.0' }
		],
		links: [{ rel: 'icon', type: 'image/x-icon', href: '/images/favicon.ico' }]
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
				<Layout commandLinks={commandLinks}>{children}</Layout>
				<Toaster />
				<Scripts />
			</body>
		</html>
	);
}

function NotFoundRoute() {
	return (
		<div className="mx-auto text-center max-w-[450px] mt-10 flex flex-col items-center justify-center">
			<h2 className="text-fade-grad font-clash text-4xl font-semibold">Not found</h2>
			<p className="mt-4 text-pretty font-mono text-sm text-foreground">
				Whatever you were looking for, is simply not here. <br />
				<i>Have you tried looking under the bed?</i>
			</p>
			<Button variant="outline" size="lg" className="mt-10" asChild>
				<Link to="/">Feeling lucky</Link>
			</Button>
		</div>
	);
}
