import { getProject, getProjects } from '@/data/projects';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import remarkFrontmatter from 'remark-frontmatter';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import remarkToc from 'remark-toc';
import { mdxComponents } from '@/components/mdx/components';
import { ArrowLeftIcon, CalendarIcon, GitHubLogoIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { data } from '@/data/main';
import rehypePrettyCode from 'rehype-pretty-code';
import { ReactElement } from 'react';
import { Badge } from '@/components/ui/badge';

export async function generateMetadata(props: {
	params: Promise<{
		slug: string;
	}>;
}) {
	const params = await props.params;
	const project = await getProject(params.slug);
	return {
		title: `${data.name} | ${data.role} :: ${project?.title}`,
		description: project?.description + ' ' + data.summary,
		alternates: {
			canonical: `https://maria-adriana.com/projects/${project?.slug}`
		}
	};
}

export async function generateStaticParams() {
	const projects = await getProjects();
	return projects.map((project) => ({ slug: project.slug }));
}

export default async function ProjectPage(props: {
	params: Promise<{
		slug: string;
	}>;
}) {
	const params = await props.params;

	const project = await getProject(params.slug);

	if (!project) {
		return notFound();
	}

	const { title, description, year, content, technologies } = project;

	return (
		<>
			<header>
				<Link
					href="/projects"
					className="flex flex-row gap-2 font-mono text-sm text-gray-500 dark:text-white/60 mb-8 items-center hover:underline hover:text-orange-500 hover:opacity-75 duration-200"
				>
					<span className="flex border border-gray-300 dark:border-white/20 bg-card rounded-full h-7 w-7 items-center justify-center">
						<ArrowLeftIcon className="text-gray-500 dark:text-white/80" />
					</span>
					Go back
				</Link>
				<h1 className="font-clash">{title}</h1>
				<p className="font-mono text-sm text-foreground line-clamp-3">{description}</p>
				{/* <time className="flex flex-row gap-2 items-center text-pretty font-mono text-xs text-foreground text-gray-500 dark:text-gray-300">
					<CalendarIcon />
					{date}
				</time> */}
				{/* <hr className="mt-4" /> */}
				<div className="mt-6 flex flex-wrap gap-1">
					{technologies.map(({ label, icon }) => {
						return (
							<Badge
								className="py-1 px-3 gap-2 text-[10px] hover:mix-blend-luminosity cursor-default"
								variant="outline"
								key={label}
							>
								{icon}
								<span>{label}</span>
							</Badge>
						);
					})}
				</div>
				<hr className="mt-2" />
			</header>
			<article className="flex flex-col gap-2 mt-4">
				<section className="summary">
					<Link className='flex flex-row gap-2' href={data.github + '/' + project.repo}>
						<GitHubLogoIcon /> Visit repo
					</Link>
					<time className="flex flex-row gap-2 items-center text-pretty font-mono text-xs text-foreground text-gray-500 dark:text-gray-300">
						<CalendarIcon />
						{year}
					</time>
				</section>

				<div className="content">
					<MDXRemote
						source={content}
						options={{
							mdxOptions: {
								remarkPlugins: [
									remarkGfm,
									remarkFrontmatter,
									[
										remarkToc,
										{
											tight: true,
											maxDepth: 5
										}
									]
								],
								rehypePlugins: [
									rehypeSlug,
									rehypeAutolinkHeadings,
									rehypePrettyCode
								]
							}
						}}
						components={mdxComponents}
					/>
				</div>
			</article>
		</>
	);
}
