import { Message } from "~/types/message"
import { v4 as uuidv4 } from "uuid"

export async function listMessages(limit: number = 100, offset: number = 0) {
  const kv = await useKv()

  const messageIterator = await kv.list({ prefix: ["messages"] }, { limit })
  const messages: Message[] = []

  for await (const message of messageIterator)
    messages.push(message.value as Message)

  return messages.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

export async function createMessage(content: string, author: string) {
  const id = uuidv4()

  const kv = await useKv()

  const operation = kv.atomic()

  operation.set(["messages", id], {
    content,
    author,
    createdAt: new Date(),
  } as Message)
  operation.set(["messages_updated"], true)

  await operation.commit()
}

export async function getMessageReader() {
  const kv = await useKv()

  return kv.watch([["messages_updated"]]).getReader()
}
