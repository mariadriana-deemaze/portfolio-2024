import { createHighlighter } from 'shiki';
import type { PortableTextBody } from '@/lib/sanity-types';

const THEME = 'github-dark-high-contrast';
const LANGS = ['typescript', 'javascript', 'html', 'css', 'json', 'go', 'bash', 'sql', 'text'];

const highlighterPromise = createHighlighter({ themes: [THEME], langs: LANGS });

export async function highlightCodeBlocks(body: PortableTextBody): Promise<PortableTextBody> {
	const hasCode = body.some((block) => block._type === 'code' && typeof block.code === 'string');
	if (!hasCode) return body;

	const highlighter = await highlighterPromise;

	return body.map((block) => {
		if (block._type !== 'code' || typeof block.code !== 'string') return block;

		const lang = typeof block.language === 'string' ? block.language : 'text';

		try {
			const html = highlighter.codeToHtml(block.code, { lang, theme: THEME });
			const innerMatch = html.match(/<code[^>]*>([\s\S]*)<\/code>/);
			return { ...block, highlightedHtml: innerMatch ? innerMatch[1] : block.code };
		} catch {
			return block;
		}
	});
}
