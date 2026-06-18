import type { ResolvedImage } from '@/lib/sanity-types';

interface RichImageProps {
	value: ResolvedImage;
}

export function RichImage({ value }: RichImageProps) {
	const { url, alt, caption, width, height, lqip } = value;

	if (!url) return null;

	return (
		<figure className="a-figure">
			<div className="a-figure-frame">
				<img
					src={url}
					alt={alt ?? ''}
					width={width}
					height={height}
					loading="lazy"
					decoding="async"
					{...(lqip
						? {
								style: {
									backgroundImage: `url(${lqip})`,
									backgroundSize: 'cover'
								}
							}
						: {})}
				/>
			</div>
			{caption && <figcaption>{caption}</figcaption>}
		</figure>
	);
}
