import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

function loadLocaleInfo () {
  const locales = require.context('@/locales', false, /[A-Za-z0-9-_,\s]+\.json$/i)
  const messages: {[key: string]: {}} = {}
  locales.keys().forEach(key => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i)
    if (matched && matched.length > 1) {
      const locale = matched[1]
        console.log(key);
      messages[locale] = locales(key)
    }
  })
  //@ts-ignore
  return { id: locales.id, messages }
}

const { id, messages } = loadLocaleInfo()

const i18n = new VueI18n({
  locale: 'en',
  messages
})

if (module.hot) {
  module.hot.accept(id, () => {
    const { messages } = loadLocaleInfo()
    Object.keys(messages).forEach(locale => {
      i18n.setLocaleMessage(locale, messages[locale])
    })
  })
}

export default i18n