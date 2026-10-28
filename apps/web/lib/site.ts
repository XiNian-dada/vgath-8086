const isGithubActions = typeof process !== 'undefined' && !!process.env.GITHUB_ACTIONS;
let repo = '';
if (typeof process !== 'undefined' && process.env.GITHUB_REPOSITORY) {
  repo = process.env.GITHUB_REPOSITORY.split('/')[1] || '';
}
const isUserOrOrgPage = repo.endsWith('.github.io');
const repoOwner = (typeof process !== 'undefined' && process.env.GITHUB_REPOSITORY?.split('/')[0]) || 'vgath-8086';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 
  (isGithubActions && repo && !isUserOrOrgPage
    ? `https://${repoOwner.toLowerCase()}.github.io/${repo}`
    : 'https://vgath-8086.github.io');
