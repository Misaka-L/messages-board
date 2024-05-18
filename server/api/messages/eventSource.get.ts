import { getMessageReader } from "~/server/utils/messages"

export default defineEventHandler(async (event) => {
  if (getHeader(event, "accept") !== "text/event-stream") {
    throw createError({
      status: 400,
      statusCode: 400,
      statusMessage: "invalid request",
      statusText: "invalid request",
    })
  }

  setHeader(event, "content-type", "text/event-stream")

  const stream = await getMessageReader()
  const body = new ReadableStream({
    async start(controller) {
      while (true) {
        try {
          if ((await stream.read()).done) {
            return
          }

          const messages = await listMessages()
          const chunk = `data: ${JSON.stringify(messages)}\n\n`
          controller.enqueue(new TextEncoder().encode(chunk))
        } catch (e) {
          console.error(`Error refreshing messages`, e)
        }
      }
    },
    cancel() {
      stream.cancel()
    },
  })

  return sendStream(event, body)
})
