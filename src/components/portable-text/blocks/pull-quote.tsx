interface PullQuoteProps {
	value: {
		text: string;
		attribution?: string;
	};
}

export function PullQuote({ value }: PullQuoteProps) {
	const { text, attribution } = value;

	return (
		<blockquote className="a-pullquote">
			<p>{text}</p>
			{attribution && <cite>{attribution}</cite>}
		</blockquote>
	);
}
