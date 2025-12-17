import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'GamiBot',
  description: 'AI-powered Moodle chat plugin for personalized learning',

  // Clean URLs without .html extension
  cleanUrls: true,

  // Head meta tags for SEO and accessibility
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#6366f1' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }],
    ['html', { lang: 'en' }]
  ],

  // Multi-language configuration
  locales: {
    en: {
      label: 'English',
      lang: 'en-US',
      link: '/en/',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/en/' },
          { text: 'Introduction', link: '/en/introduction/overview' },
          { text: 'Workflows', link: '/en/workflows/data-ingestion' },
          { text: 'Gamification', link: '/en/gamification/overview' },
          { text: 'Integration', link: '/en/integration/moodle-plugin' },
          { text: 'Deployment', link: '/en/deployment/architecture' }
        ],
        sidebar: {
          '/en/': [
            {
              text: 'Introduction',
              collapsed: false,
              items: [
                { text: 'Overview', link: '/en/introduction/overview' },
                { text: 'Technologies', link: '/en/introduction/technologies' }
              ]
            },
            {
              text: 'Workflows',
              collapsed: false,
              items: [
                { text: 'Data Ingestion', link: '/en/workflows/data-ingestion' },
                { text: 'Content Summarization', link: '/en/workflows/summarization' },
                { text: 'Doubt Clarification', link: '/en/workflows/doubt-clarification' },
                { text: 'Quiz Generation', link: '/en/workflows/quiz-generation' }
              ]
            },
            {
              text: 'Gamification',
              collapsed: false,
              items: [
                { text: 'Gami API', link: '/en/gamification/overview' },
                { text: 'Tech Stack', link: '/en/gamification/tech-stack' },
                { text: 'API Reference', link: '/en/gamification/api-reference' }
              ]
            },
            {
              text: 'Integration',
              collapsed: false,
              items: [
                { text: 'Moodle Plugin', link: '/en/integration/moodle-plugin' },
                { text: 'Database Schema', link: '/en/integration/database' },
                { text: 'LangFlow Workflows', link: '/en/integration/langflow' }
              ]
            },
            {
              text: 'Deployment',
              collapsed: false,
              items: [
                { text: 'Architecture', link: '/en/deployment/architecture' },
                { text: 'Security & Privacy', link: '/en/deployment/security' },
                { text: 'Monitoring', link: '/en/deployment/monitoring' }
              ]
            }
          ]
        },
        outline: {
          label: 'On this page'
        },
        docFooter: {
          prev: 'Previous',
          next: 'Next'
        },
        lastUpdated: {
          text: 'Last updated'
        },
        editLink: {
          pattern: 'https://github.com/your-org/gamibot-docs/edit/main/:path',
          text: 'Edit this page on GitHub'
        }
      }
    },
    pt: {
      label: 'Português',
      lang: 'pt-PT',
      link: '/pt/',
      themeConfig: {
        nav: [
          { text: 'Início', link: '/pt/' },
          { text: 'Introdução', link: '/pt/introduction/overview' },
          { text: 'Fluxos de Trabalho', link: '/pt/workflows/data-ingestion' },
          { text: 'Gamificação', link: '/pt/gamification/overview' },
          { text: 'Integração', link: '/pt/integration/moodle-plugin' },
          { text: 'Implantação', link: '/pt/deployment/architecture' }
        ],
        sidebar: {
          '/pt/': [
            {
              text: 'Introdução',
              collapsed: false,
              items: [
                { text: 'Visão Geral', link: '/pt/introduction/overview' },
                { text: 'Tecnologias', link: '/pt/introduction/technologies' }
              ]
            },
            {
              text: 'Fluxos de Trabalho',
              collapsed: false,
              items: [
                { text: 'Ingestão de Dados', link: '/pt/workflows/data-ingestion' },
                { text: 'Sumarização de Conteúdo', link: '/pt/workflows/summarization' },
                { text: 'Esclarecimento de Dúvidas', link: '/pt/workflows/doubt-clarification' },
                { text: 'Geração de Quizzes', link: '/pt/workflows/quiz-generation' }
              ]
            },
            {
              text: 'Gamificação',
              collapsed: false,
              items: [
                { text: 'Gami API', link: '/pt/gamification/overview' },
                { text: 'Stack Tecnológica', link: '/pt/gamification/tech-stack' },
                { text: 'Referência da API', link: '/pt/gamification/api-reference' }
              ]
            },
            {
              text: 'Integração',
              collapsed: false,
              items: [
                { text: 'Plugin Moodle', link: '/pt/integration/moodle-plugin' },
                { text: 'Esquema de Base de Dados', link: '/pt/integration/database' },
                { text: 'Fluxos LangFlow', link: '/pt/integration/langflow' }
              ]
            },
            {
              text: 'Implantação',
              collapsed: false,
              items: [
                { text: 'Arquitetura', link: '/pt/deployment/architecture' },
                { text: 'Segurança e Privacidade', link: '/pt/deployment/security' },
                { text: 'Monitorização', link: '/pt/deployment/monitoring' }
              ]
            }
          ]
        },
        outline: {
          label: 'Nesta página'
        },
        docFooter: {
          prev: 'Anterior',
          next: 'Próximo'
        },
        lastUpdated: {
          text: 'Última atualização'
        },
        editLink: {
          pattern: 'https://github.com/your-org/gamibot-docs/edit/main/:path',
          text: 'Editar esta página no GitHub'
        }
      }
    }
  },

  // Theme configuration (global settings)
  themeConfig: {
    // Logo
    logo: '/logo.svg',
    siteTitle: 'GamiBot',

    // Social links
    socialLinks: [
      { icon: 'github', link: 'https://github.com/your-org/gamibot' }
    ],

    // Search
    search: {
      provider: 'local',
      options: {
        locales: {
          pt: {
            translations: {
              button: {
                buttonText: 'Pesquisar',
                buttonAriaLabel: 'Pesquisar'
              },
              modal: {
                noResultsText: 'Sem resultados para',
                resetButtonTitle: 'Limpar pesquisa',
                footer: {
                  selectText: 'para selecionar',
                  navigateText: 'para navegar',
                  closeText: 'para fechar'
                }
              }
            }
          }
        }
      }
    },

    // Footer
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025 Pedagogical Innovation Center (CIP), Polytechnic of Porto (IPP)'
    }
  },

  // Markdown configuration
  markdown: {
    lineNumbers: true,
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    }
  }
})
