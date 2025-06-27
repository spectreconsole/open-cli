import { themes as prismThemes} from 'prism-react-renderer'

// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'OpenCLI',
  url: 'https://spectreconsole.github.io',
  baseUrl: '/open-cli',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',

  // GitHub pages deployment config.
  organizationName: 'spectreconsole', // Usually your GitHub org/user name.
  projectName: 'open-cli', // Usually your repo name.
  trailingSlash: false,

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  markdown: {
    mermaid: true,
  },

  themes: ['@docusaurus/theme-mermaid'],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
          sidebarCollapsed: false,
          // editUrl:
          //   'https://github.com/spectre-console/open-cli/tree/main/',
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
      autoCollapseSidebar: true,
      navbar: {
        title: 'OpenCLI',
        logo: {
          alt: 'OpenCLI',
          src: 'img/logo.png',
          className: 'logo',
        },
        items: [
          {
            type: 'doc',
            docId: 'spec',
            position: 'left',
            label: 'Specification',
          },
          /* {
             to: '/blog', label: 'Blog', position: 'left'
          }, */
          {
            href: 'https://github.com/spectre-console/open-cli',
            className: "header-github-link",
            position: 'right',
            "aria-label": "GitHub repository",
          },
        ],
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['json'],
      },
      mermaid: {
        theme: { light: 'neutral', dark: 'forest' },
      }
    }),
};

module.exports = config;
