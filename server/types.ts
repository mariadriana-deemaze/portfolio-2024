export interface Seo {
	title: string;
	description: string;
	image?: string;
	alternates?: {
		canonical?: string;
	};
}
