export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/color-mode",
    "@bg-dev/nuxt-naiveui",
    "nuxt-time",
    "nuxt-icon",
    "@nuxtjs/tailwindcss",
    "@vite-pwa/nuxt",
  ],
  tailwindcss: {
    exposeConfig: {
      write: true,
    },
  },
  colorMode: {
    classSuffix: "",
  },
  pwa: {
    manifest: {
      name: "Misaka 留言板",
      description: "一个普通的留言板 By Misaka-L",
      background_color: "#63e2b7",
      orientation: "any",
      start_url: "/",
      display: "standalone",
    },
    devOptions: {
      enabled: true,
    },
  },
})
