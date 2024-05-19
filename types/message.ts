export interface Message {
  author: string
  content: string
  createdAt: Date
}

export interface MessageWithId extends Message {
  id: string
}
