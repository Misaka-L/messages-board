import { z } from "zod"

export default defineEventHandler(async (event) => {
  const message = await readValidatedBody(
    event,
    z.object({
      content: z.string().min(1),
      author: z.string().min(1),
    }).parse
  )

  await createMessage(message.content, message.author)
})
