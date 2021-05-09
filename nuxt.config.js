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
    { src: '~/plugins/animate.js', mode: 'client' },
    { src: '~/plugins/clipboard.js', mode: 'client' },
    { src: '~/plugins/vue-shortkey.js', mode: 'client' },
    { src: '~/plugins/confirm.js', mode: 'client' },
    { src: '~/plugins/tooltip.js', mode: 'client' },
    { src: '~/plugins/snackbar.js', mode: 'client' },
    { src: '~/plugins/portal.js', mode: 'client' },

    { src: '~/filters/capitalize.js' },
    { src: '~/filters/lowercase.js' },
    { src: '~/filters/uppercase.js' },
    { src: '~/filters/formatCurrency.js' },
    { src: '~/filters/formatDate.js' }
  ],

  // components: true,

  buildModules: [
    '@nuxtjs/vuetify',
    '@nuxt/typescript-build',
    '@nuxtjs/dotenv',
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
