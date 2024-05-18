import { Kv } from "@deno/kv"

export const useKv = async () : Promise<Kv> => {
  // @ts-ignore
  if (globalThis.Deno) {
    // @ts-ignore
    return globalThis.Deno.openKv()
  }
  if (process.dev) {
    
    const OpenKV = () => import("@deno/kv")
    const { openKv } = await OpenKV()
    return openKv("kv.db")
  }
  throw createError({
    statusCode: 500,
    message:
      "Could not find a Deno KV for production, make sure to deploy on Deno Deploy.",
  })
}
