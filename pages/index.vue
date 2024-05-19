<script setup lang="ts">
import type { Message } from '~/types/message';

const { data: messages } = await useLazyFetch<Message[]>('/api/messages')

onMounted(() => {
  new EventSource('/api/messages/eventSource').addEventListener('message', (event) => {
    messages.value = JSON.parse(event.data)
  })
})
</script>

<template>
  <div class="flex flex-col md:w-4/6 mx-auto pt-24">
    <n-text class="text-center mb-8 select-none">
      <n-h1>Misaka-L's Message Boards</n-h1>
    </n-text>
    <n-card class="mb-4">
      <SubmitForm />
    </n-card>
    <n-list hoverable>
      <n-list-item v-for="message in messages">
        <n-thing>
          <template #header>
            <p class="font-bold">{{ message.author }}</p>
          </template>
          <template #description>
            <markdown-preview class="prose dark:prose-invert prose-sm prose-code:text-base max-w-none"
              :value="message.content" />
          </template>
          <template #avatar>
            <n-avatar>
              <n-icon>
                <Icon name="mdi:cat" />
              </n-icon>
            </n-avatar>
          </template>
          <template #footer>
            <n-text depth="3" class="text-xs">
              <nuxt-time :datetime="message.createdAt" date-style="long" timeStyle="medium" />
            </n-text>
          </template>
        </n-thing>
      </n-list-item>
    </n-list>
  </div>
</template>