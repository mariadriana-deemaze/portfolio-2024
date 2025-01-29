import { HomeLayout } from '@/components/pages/home/layout';
import { data } from '@/data/main';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: `${data.name} | ${data.role}`,
	description: data.summary,
	alternates: {
		canonical: 'https://maria-adriana.com/'
	}
};

export default function Page() {
	return <HomeLayout />;
}
