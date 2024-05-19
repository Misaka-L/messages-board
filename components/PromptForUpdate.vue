<script setup lang="ts">
import { NButton } from 'naive-ui'

const { $pwa } = useNuxtApp()

const notification = useNotification()

watch(() => $pwa.offlineReady, offlineReady => {
  if (!offlineReady) {
    return
  }

  notification.success({
    title: '应用已准备好离线运行',
    content: '留言板目前可以离线查看已保存的留言，但是无法离线接收或提交新的留言。'
  })
})

watch(() => $pwa?.needRefresh, needRefresh => {
  if (!needRefresh) {
    return
  }

  notification.create({
    title: '有新的应用更新可用',
    content: "点击刷新按钮来更新应用。",
    action: () =>
      h(
        NButton,
        {
          text: true,
          type: 'primary',
          onClick: () => $pwa.updateServiceWorker()
        },
        {
          default: () => '刷新'
        }
      ),
  })
})
</script>

<template>
</template>