import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
	const links = [
		{
			url: 'https://www.maria-adriana.com/'
		}
	];

	return links;
}
