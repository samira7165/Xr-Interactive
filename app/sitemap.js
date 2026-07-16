const siteUrl = 'https://xri.com.bd'

export default function sitemap() {
  const routes = ['', '/about', '/services', '/portfolio', '/blog', '/contact']

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : 0.8,
  }))
}
