import { DetailedHTMLProps, HTMLAttributes } from 'react';
import NextImage from 'next/image';
import { MDXComponents } from 'mdx/types';
import { MDXNote } from './mdx-note';
import { MDXImage } from './mdx-image';
import { HomeIcon, InfoCircledIcon } from '@radix-ui/react-icons';

export const mdxComponents: MDXComponents = {
	pre: ({
		children,
		...props
	}: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLPreElement>) => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return <code {...props}>{children as any}</code>;
	},
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	img: MDXImage as any,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	Image: NextImage as any,
	Details: ({
		children,
		summary,
		...props
	}: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLDetailsElement> & {
		summary: string;
	}) => (
		<details {...props}>
			{summary && <summary>{summary}</summary>}
			{children}
		</details>
	),
	Note: MDXNote,
	InfoIcon: InfoCircledIcon,
	HomeIcon: HomeIcon
};
