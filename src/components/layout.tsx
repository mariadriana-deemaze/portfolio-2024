import type { ReactNode } from 'react';

import { BGGrid } from '@/components/bg-grid';
import { CommandMenu } from '@/components/command-menu';
import { Footer } from '@/components/footer';
import { GoogleAnalytics } from '@/components/google-analytics';
import { Navbar } from '@/components/navbar';
import ProgressIndicator from '@/components/progress-indicator';

import '../styles/globals.css';

export type CommandLink = {
	url: string;
	title: string;
	type: 'internal' | 'blog' | 'projects' | 'social';
};

export interface LayoutProps {
	children: ReactNode;
	commandLinks?: CommandLink[];
}

export default function Layout({ children, commandLinks = [] }: LayoutProps): ReactNode {
	return (
		<div className="flex min-h-svh flex-col max-w-full overflow-y-scroll overflow-x-clip no-scrollbar antialiased lg:mx-auto">
			<GoogleAnalytics />
			<Navbar />
			<ProgressIndicator />
			<main className="container relative mx-auto mt-28 flex flex-1 flex-col print:p-12 no-scrollbar">
				<BGGrid>{children}</BGGrid>
				<CommandMenu links={commandLinks} />
			</main>
			<Footer />
		</div>
	);
}
