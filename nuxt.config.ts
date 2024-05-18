export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/color-mode",
    "@bg-dev/nuxt-naiveui",
    "nuxt-time",
    "nuxt-icon",
    "@nuxtjs/tailwindcss",
  ],
  tailwindcss: {
    exposeConfig: {
      write: true,
    },
  },
})
