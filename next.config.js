/** @type {import('next').NextConfig} */
const nextConfig = {
	pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
	transpilePackages: ["next-mdx-remote"],
	reactStrictMode: true,
	productionBrowserSourceMaps: true,
};

module.exports = nextConfig;
