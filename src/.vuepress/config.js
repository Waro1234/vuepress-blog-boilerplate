const currentDateUTC = new Date().toUTCString()

module.exports = {
	title: 'My Daily draft',
	dest: './public',
	themeConfig: {
		sidebar: false,
		// nav: [
		// 	{ text: 'Home', link: '/' }
		// ],
		navbar: false,
		logo: '/vuepress-blog-logo.png',
		docsDir: 'src',
		startPage: 0,
		pageSize: 100,
		lastUpdated: 'Last updated',
		searchPlaceholder: "Search title"
	},
	plugins: [
		[
			'@vuepress/google-analytics',
			{
				ga: '' // UA-00000000-0
			}
		],
		[
			'vuepress-plugin-rss',
			{
				base_url: '/',
				site_url: 'https://vuepressblog.org',
				filter: frontmatter => frontmatter.date <= new Date(currentDateUTC),
				count: 20
			}
		],
		[
			'@vuepress/plugin-search',
			{
				locales: {
					'/': {
						placeholder: 'Search title',
					},
				},
			}
		],
		'vuepress-plugin-reading-time',
		'vuepress-plugin-janitor'
	],
	head: [
		['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1' }],
		['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-icon.png' }],
		['link', { rel: 'icon', sizes: '32x32', href: '/favicon-32x32.png' }],
		['link', { rel: 'icon', sizes: '16x16', href: '/favicon-16x16.png' }],
		['link', { rel: 'manifest', href: '/site.webmanifest' }],
		['link', { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#5bbad5' }],
		['meta', { name: 'msapplication-TileColor', content: '#da532c' }],
		['meta', { name: 'theme-color', content: '#ffffff' }]
	],
}
