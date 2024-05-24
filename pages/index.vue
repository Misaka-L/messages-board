<script setup lang="ts">
import type { MessageWithId } from '~/types/message';
import localforage from 'localforage'

// fetch data
const { data: messages, error, status } = await useLazyFetch<MessageWithId[]>('/api/messages')

// Localforage
onMounted(async () => {
  watch(status, async () => await updateLocalforage())

  await updateLocalforage()
})

async function updateLocalforage() {
  if (status.value === 'success') {
    await saveDataToLocalforage()
  }

  if (status.value === 'error') {
    await getDataFromLocalforage()
  }
}

async function saveDataToLocalforage() {
  await localforage.setItem('messages', JSON.stringify(messages.value))
}

async function getDataFromLocalforage() {
  const data = await localforage.getItem<string>('messages')

  if (!data) {
    return
  }

  messages.value = await JSON.parse(data) as MessageWithId[]
}

// event source
const isEventSourceOpened = ref(false)
const isEventSourceErrored = ref(false)

const eventSource = ref<EventSource | undefined>()

onMounted(() => {
  eventSource.value = new EventSource('/api/messages/eventSource')

  eventSource.value.addEventListener('message', async (event) => {
    messages.value = JSON.parse(event.data)
    await saveDataToLocalforage()
  })

  eventSource.value.addEventListener('open', () => {
    isEventSourceOpened.value = false
    isEventSourceOpened.value = true
  })

  eventSource.value.addEventListener('error', () => {
    isEventSourceOpened.value = false
    isEventSourceErrored.value = true
  })
})

// highlight message
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
    <n-alert v-if="status === 'error' && !isEventSourceOpened" title="我们无法获取最新的留言消息" type="error" class="mb-4">
      目前展示的留言为最后一次成功获取的留言消息。
    </n-alert>
    <n-alert v-if="isEventSourceErrored" title="与服务器的连接中断" type="error" class="mb-4">
      留言将不会实时更新。
    </n-alert>
    <n-alert v-if="!isEventSourceOpened && !isEventSourceErrored" title="正在与服务器建立连接" type="info" class="mb-4">
      建立连接后，留言将会实时更新。
    </n-alert>
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