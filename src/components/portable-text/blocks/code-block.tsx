interface CodeBlockProps {
	value: {
		language?: string;
		filename?: string;
		code: string;
		highlightedHtml?: string;
	};
}

export function CodeBlock({ value }: CodeBlockProps) {
	const { language, filename, code, highlightedHtml } = value;

	return (
		<pre className={filename ? 'has-bar' : ''}>
			{filename && (
				<div className="a-code-bar">
					<span className="a-code-bar-dot" style={{ background: '#ff5f57' }} />
					<span className="a-code-bar-dot" style={{ background: '#febc2e' }} />
					<span className="a-code-bar-dot" style={{ background: '#28c840' }} />
					<span className="a-code-bar-name">{filename}</span>
				</div>
			)}
			{highlightedHtml ? (
				<code
					className={language ? `language-${language}` : ''}
					dangerouslySetInnerHTML={{ __html: highlightedHtml }}
				/>
			) : (
				<code className={language ? `language-${language}` : ''}>{code}</code>
			)}
		</pre>
	);
}
