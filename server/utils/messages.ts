import { Message, MessageWithId } from "~/types/message"
import { v4 as uuidv4 } from "uuid"

export async function listMessages(
  limit: number | undefined = undefined,
  offset: number = 0
) {
  const kv = await useKv()

  const messageIterator = await kv.list<Message>(
    { prefix: ["messages"] },
    { limit }
  )
  const messages: MessageWithId[] = []

  for await (const message of messageIterator) {
    const messageValue = message.value
    const id = message.key[1].toString()

    messages.push({ id, ...messageValue })
  }

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
