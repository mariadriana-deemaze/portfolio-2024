import { PortableText, type PortableTextComponents } from '@portabletext/react';
import type { PortableTextBody } from '@/lib/sanity-types';
import { CodeBlock } from './blocks/code-block';
import { PullQuote } from './blocks/pull-quote';
import { RichImage } from './blocks/rich-image';

const components: PortableTextComponents = {
	block: {
		h2: ({ children }) => <h2>{children}</h2>,
		h3: ({ children }) => <h3>{children}</h3>,
		h4: ({ children }) => <h4>{children}</h4>,
		blockquote: ({ children }) => (
			<blockquote>
				<p>{children}</p>
			</blockquote>
		),
		normal: ({ children }) => <p>{children}</p>
	},
	list: {
		bullet: ({ children }) => <ul>{children}</ul>,
		number: ({ children }) => <ol>{children}</ol>
	},
	listItem: {
		bullet: ({ children }) => <li>{children}</li>,
		number: ({ children }) => <li>{children}</li>
	},
	marks: {
		strong: ({ children }) => <strong>{children}</strong>,
		em: ({ children }) => <em>{children}</em>,
		code: ({ children }) => <code className="a-inline-code">{children}</code>,
		link: ({ children, value }) => {
			const href = value?.href ?? '#';
			const isExternal = href.startsWith('http');
			return (
				<a href={href} {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
					{children}
				</a>
			);
		}
	},
	types: {
		richImage: ({ value }) => <RichImage value={value} />,
		code: ({ value }) => <CodeBlock value={value} />,
		pullQuote: ({ value }) => <PullQuote value={value} />
	}
};

interface PortableTextRendererProps {
	body: PortableTextBody;
	className?: string;
}

export function PortableTextRenderer({ body, className }: PortableTextRendererProps) {
	return (
		<div className={className}>
			<PortableText value={body} components={components} />
		</div>
	);
}
