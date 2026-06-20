import { portableTextToMarkdown as toMarkdown } from '@portabletext/markdown';

import type { PortableTextBody } from '@/lib/sanity-types';

function str(val: unknown): string {
	return typeof val === 'string' ? val : '';
}

export function portableTextToMarkdown(body: PortableTextBody): string {
	return toMarkdown(body as Array<{ _type: string; [key: string]: unknown }>, {
		types: {
			code: ({ value }) => {
				const filename = str(value.filename);
				return `\`\`\`${str(value.language)}${filename ? ` ${filename}` : ''}\n${str(value.code)}\n\`\`\``;
			},
			richImage: ({ value }) => {
				const url = str(value.url);
				if (!url) return '';
				const caption = str(value.caption);
				return `![${str(value.alt)}](${url})${caption ? `\n*${caption}*` : ''}`;
			},
			pullQuote: ({ value }) => {
				const text = str(value.text);
				return text ? `> ${text}` : '';
			}
		}
	});
}
