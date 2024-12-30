import NextImage from 'next/image';
import { DetailedHTMLProps, ImgHTMLAttributes } from 'react';

export function MDXImage({
	src,
	alt
}: DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> & {
	src: string;
	alt: string;
}) {
	let widthFromSrc, heightFromSrc;
	const url = new URL(src, 'https://maria-adriana.com');
	const widthParam = url.searchParams.get('w') || url.searchParams.get('width');
	const heightParam = url.searchParams.get('h') || url.searchParams.get('height');
	if (widthParam) {
		widthFromSrc = parseInt(widthParam);
	}
	if (heightParam) {
		heightFromSrc = parseInt(heightParam);
	}

	const imageProps = {
		src,
		alt,
		height: heightFromSrc || 450,
		width: widthFromSrc || 550
	};

	return <NextImage {...imageProps} />;
}
