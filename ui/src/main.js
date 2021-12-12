import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'

import App from './App.vue'
import router from './router'

import en from './locales/en.js'

const i18n = createI18n({
  locale: 'en', // set locale
  fallbackLocale: 'en', // set fallback locale
  messages : {
    en
  },
})

const app = createApp(App).use(i18n).use(router)
app.mount('#app')