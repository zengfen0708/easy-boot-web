import defaultSettings from '@/settings'

const title = defaultSettings.title || 'simple-web'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
