import { DetailedHTMLProps, HTMLAttributes, ImgHTMLAttributes } from 'react';
import { MDXComponents } from 'mdx/types';
import { MDXNote } from './mdx-note';
import Image from 'next/image';

export const mdxComponents: MDXComponents = {
	pre: ({
		children,
		...props
	}: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLPreElement>) => {
		return <code {...props}>{children}</code>;
	},
	Image: (props: DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>) => {
		if (!props.src || props.src === '' || typeof props.src !== 'string') {
			return <></>;
		}
		return props.style?.height && props.style?.width ? (
			<Image
				{...props}
				width={Number(props.width)}
				height={Number(props.height)}
				src={props.src}
				alt={props.alt || ''}
			/>
		) : (
			<img {...props} alt={props.alt ?? ''} />
		);
	},
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
	Note: MDXNote
};
