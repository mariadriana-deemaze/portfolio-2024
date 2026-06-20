export interface Seo {
	title: string;
	description: string;
	image?: string;
	url?: string;
	type?: 'website' | 'article';
	alternates?: {
		canonical?: string;
	};
}
