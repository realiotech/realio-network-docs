// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const {themes} = require('prism-react-renderer');
const lightCodeTheme = themes.github;
const darkCodeTheme = themes.dracula;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Realio Network Documentation',
  tagline: 'Realio Network official documentation for developers and validators',
  url: 'https://docs.realio.network',
  baseUrl: '/',
  onBrokenLinks: 'warn',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },
  favicon: 'img/favicon.png',
  organizationName: 'realiotech', // Usually your GitHub org/user name.
  projectName: 'realio-network-docs', // Usually your repo name.
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  scripts: [
    // bump ?v= whenever chatbot-widget.js changes, to bust browser caches
    { src: '/js/chatbot-widget.js?v=4', defer: true },
  ],
  stylesheets: [
    '/css/chatbot-widget.css?v=3',
  ],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
          sidebarCollapsible: true,
          editUrl: 'https://github.com/realiotech/realio-network-docs/tree/v1.7.0/',
          showLastUpdateTime: true,
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themes: [
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        indexBlog: false,
        docsRouteBasePath: '/',
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Uncomment and edit when there's a network upgrade or migration to
      // announce. Bump `id` each time so users who dismissed the previous
      // announcement see the new one.
      // announcementBar: {
      //   id: 'upgrade-v1-7-0',
      //   content:
      //     'Mainnet upgrade v1.7.0 is scheduled — <a href="/mainnet/overview">see the upgrade guide</a>.',
      //   backgroundColor: '#25c2a0',
      //   textColor: '#04342c',
      //   isCloseable: true,
      // },
      image: 'img/realio_logo.png',
      metadata: [
        {
          name: 'description',
          content:
            'Realio Network documentation: run a full node, become a validator, delegate, and build on a multi-chain layer 1 for real-world assets.',
        },
        {name: 'keywords', content: 'realio, blockchain, validator, cosmos, RWA, EVM, staking'},
        {name: 'twitter:card', content: 'summary_large_image'},
      ],
      colorMode: {
        defaultMode: 'dark',
        respectPrefersColorScheme: true,
      },
      backToTopButton: true,
      docs: {
        sidebar: {
          hideable: false,
          autoCollapseCategories: true,
        },
      },
      tableOfContents: {
        minHeadingLevel: 2,
        maxHeadingLevel: 4,
      },
      navbar: {
        title: '',
        hideOnScroll: false,
        logo: {
          alt: 'Realio Network Logo',
          src: 'img/realio_logo_light.png',
          srcDark: 'img/realio_logo.png'
        },
        items: [
          {
            type: 'doc',
            docId: 'intro',
            position: 'left',
            label: 'Documentation',
          },
          {
            href: 'https://github.com/realiotech/realio-network-docs',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer:  {
        style: 'dark',
        links: [
          {
            title: null,
            items: [
              {
                html:
                  '<a href="https://www.realio.network" style="display:inline-block"><img src="/img/realio_logo.png" alt="Realio Network" style="height:36px" /></a>',
              },
            ],
          },
          {
            title: 'Related docs',
            items: [
              {
                label: 'Cosmos SDK',
                href: 'https://docs.cosmos.network',
              }
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Twitter',
                href: 'https://twitter.com/Realio_Network',
              },
              {
                label: 'Discord',
                href: 'https://discord.gg/Nv9EUbRnKb',
              },
              {
                label: 'Telegram',
                href: 'https://t.me/realio_fund',
              },
              {
                label: 'Medium',
                href: 'https://medium.com/@Realio_Network',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Website',
                to: 'https://www.realio.network',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/realiotech/realio-network-docs',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Realio Network`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ['bash', 'json', 'yaml', 'toml', 'go', 'solidity', 'docker'],
      },
    }),
};

module.exports = config;
