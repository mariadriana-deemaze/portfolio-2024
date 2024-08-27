import { data } from '@/data/main';

export interface Meta {
	description?: string;
	author?: string;
	siteName?: string;
	coverImage?: string;
	coverImageAlt?: string;
	ogImage?: string;
	ogImageAlt?: string;
	type?: string;
}

type Props = {
	title: string;
	url?: string;
};

const AppHead: React.FC<Props> = ({ title, url = `${process.env.NEXT_PUBLIC_URL}/blog` }) => {
	let type = 'article';
	let coverImage: string | undefined;
	let coverImageAlt: string | undefined;
	let ogImage: string | undefined;
	let ogImageAlt: string | undefined;
	let appOgImage = `${process.env.NEXT_PUBLIC_URL}/images/og-preview.png`;
	let appOgImageAlt = `${data.name}'s Website`;

	if (ogImage) {
		appOgImage = ogImage;
	} else if (!ogImage && coverImage) {
		appOgImage = coverImage;
	}

	if (ogImageAlt) {
		appOgImageAlt = ogImageAlt;
	} else if (!ogImageAlt && coverImageAlt) {
		appOgImageAlt = coverImageAlt;
	}

	return (
		<>
			<title>{title}</title>
			<meta name="author" content={data.name} />
			<meta name="description" content={data.summary} />
			<meta property="og:title" content={title} />
			<meta property="og:description" content={data.summary} />
			<meta property="og:image" content={appOgImage} />
			<meta property="og:image:alt" content={appOgImageAlt} />
			<meta property="og:url" content={url} />
			<meta property="og:site_name" content={`${data.name} | ${data.role}`} />
			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:image:alt" content={appOgImageAlt} />
			<meta property="og:type" content={type} />
		</>
	);
};

export default AppHead;
