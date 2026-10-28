import type { NextConfig } from 'next';

const isGithubActions = !!process.env.GITHUB_ACTIONS;
let repo = '';
if (process.env.GITHUB_REPOSITORY) {
  repo = process.env.GITHUB_REPOSITORY.split('/')[1] || '';
}
const isUserOrOrgPage = repo.endsWith('.github.io');
const basePath = isGithubActions && repo && !isUserOrOrgPage ? `/${repo}` : '';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: basePath || undefined,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  transpilePackages: ['@emu8086/react'],
  turbopack: {
    root: '../../',
  },
};

export default nextConfig;
