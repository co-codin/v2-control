import config from './configs'

export default {

  ssr: false,

  head: {
    titleTemplate: '%s - nuxt',
    title: 'nuxt',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ...config.icons.map((href) => ({ rel: 'stylesheet', href }))
    ]
  },

  css: [
    '~/assets/scss/theme.scss'
  ],

  plugins: [
    { src: '~/plugins/animate.js' },
    { src: '~/plugins/clipboard.js' },
    { src: '~/plugins/vue-shortkey.js' },
    { src: '~/plugins/confirm.js' },
    { src: '~/plugins/tooltip.js' },
    { src: '~/plugins/snackbar.js' },
    { src: '~/plugins/portal.js' },
    { src: '~/filters/capitalize.js' },
    { src: '~/filters/lowercase.js' },
    { src: '~/filters/uppercase.js' },
    { src: '~/filters/formatCurrency.js' },
    { src: '~/filters/formatDate.js' },
    { src: '~plugins/vue-api-query' },
  ],

  buildModules: [
    '@nuxtjs/vuetify',
    '@nuxtjs/dotenv',
    '@nuxtjs/router',
  ],

  modules: [
    '@nuxtjs/axios',
  ],

  vuetify: {
    customVariables: ['~/assets/scss/vuetify/variables/_index.scss'],
    optionsPath: '~/configs/vuetify.js',
    treeShake: true,
    defaultAssets: {
      font: false
    }
  },

  axios: {},

  publicRuntimeConfig: {
    axios: {
      baseURL: process.env.API_URL,
    },
  },

  build: {
  }
}
