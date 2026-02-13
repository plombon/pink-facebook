// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // Punkt 7: Konfiguracja modułów
  modules: [
    '@nuxtjs/tailwindcss'
  ],

  // Opcjonalnie: konfiguracja deweloperska
  devtools: { enabled: true },

  // Punkt 3: Możesz tu też dodać globalne style SASS w przyszłości
  css: [
    // tu będziemy mogli dodać ścieżkę do plików .scss
  ]
})