import Icons from "./public/icons/icons.json"

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
      theme_color: "#63e2b7",
      background_color: "black",
      orientation: "any",
      start_url: "/",
      display: "standalone",
      id: "xyz.misakal.msg",
      ...Icons,
    },
    devOptions: {
      enabled: false,
    },
  },
})
