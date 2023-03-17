// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Realio Network Documentation',
  tagline: 'Realio Network official documentation for developers and validators',
  url: 'https://docs.realio.network',
  baseUrl: '/',
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.png',
  organizationName: 'realiotech', // Usually your GitHub org/user name.
  projectName: 'realio-network-docs', // Usually your repo name.

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
          sidebarCollapsible: true,
          editUrl: 'https://github.com/realiotech/realio-network-docs',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        defaultMode: 'dark',
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: '',
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
        logo: {
          alt: 'Realio Network',
          src: 'img/realio_logo.png',
          href: 'https://www.realio.network',
        },
        copyright: `Copyright © ${new Date().getFullYear()} Realio Network`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
