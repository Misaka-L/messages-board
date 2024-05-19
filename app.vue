<script setup lang="ts">
import { useOsTheme, darkTheme } from 'naive-ui'

const colorMode = useColorMode()
const osIsDark = computed(() => useOsTheme().value === 'dark')
const uiTheme = computed(() => ((colorMode.preference === 'system' && osIsDark) || colorMode.preference === 'dark') ? darkTheme : null)
</script>

<template>
  <Title>Misaka-L's Messages Board</Title>
  <NuxtPwaAssets />
  <n-config-provider :theme="uiTheme" inline-theme-disabled>
    <n-notification-provider>
      <n-message-provider>
        <client-only>
          <prompt-for-update />
        </client-only>
        <n-layout position="absolute">
          <n-layout position="absolute" :native-scrollbar="false" content-style="padding: 24px;">
            <nuxt-page />
          </n-layout>
        </n-layout>
      </n-message-provider>
    </n-notification-provider>
  </n-config-provider>
</template>
