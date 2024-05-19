<script setup lang="ts">
import type { MessageWithId } from '~/types/message';

const { data: messages } = await useLazyFetch<MessageWithId[]>('/api/messages')

onMounted(() => {
  new EventSource('/api/messages/eventSource').addEventListener('message', (event) => {
    messages.value = JSON.parse(event.data)
  })
})

const route = useRoute()
const router = useRouter()

function copyMessageLink(id: string) {
  router.push({ hash: '#' + id })
  navigator.clipboard.writeText(location.href)
}

const highlightMessageId = ref('')
onMounted(() => tryHighlightMessage())
watch(() => route.hash, () => tryHighlightMessage())

function tryHighlightMessage() {
  highlightMessageId.value = route.hash.substring(route.hash.length, 1)
}
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
      <n-list-item v-for="message in messages" class="border-emerald-600"
        :class="message.id === highlightMessageId ? 'border-[1px]' : ''">
        <n-thing :id="message.id">
          <template #header>
            <div class="space-x-2">
              <span class="font-bold">{{ message.author }}</span>
              <n-text depth="3" class="text-xs">
                <nuxt-time :datetime="message.createdAt" date-style="long" timeStyle="medium" />
              </n-text>
              <n-popover trigger="click">
                <template #trigger>
                  <n-button text type="tertiary" size="tiny" @click="copyMessageLink(message.id)">
                    #{{ message.id }}
                  </n-button>
                </template>
                <span>已复制链接</span>
              </n-popover>
            </div>
          </template>
          <template #description>
            <hr class="w-full mb-2" />
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
        </n-thing>
      </n-list-item>
    </n-list>
  </div>
</template>