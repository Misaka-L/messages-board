import { z } from "zod"

export default defineEventHandler(async (event) => {
  const query = await getValidatedQuery(event, (query) =>
    z
      .object({
        limit: z.coerce.number().int().default(100),
        // offset: z.coerce.number().int().default(0),
      })
      .parse(query)
  )

  return await listMessages(query.limit)
})
