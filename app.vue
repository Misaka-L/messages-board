<script setup lang="ts">
import { useOsTheme, darkTheme } from 'naive-ui'

const colorMode = useColorMode()
const osIsDark = computed(() => useOsTheme().value === 'dark')
const uiTheme = computed(() => ((colorMode.preference === 'system' && osIsDark) || colorMode.preference === 'dark') ? darkTheme : null)
</script>

<template>
  <Title>Misaka-L's Messages Board</Title>
  <n-config-provider :theme="uiTheme" inline-theme-disabled>
    <n-message-provider>
      <n-layout position="absolute">
        <n-layout position="absolute" :native-scrollbar="false" content-style="padding: 24px;">
          <nuxt-page />
        </n-layout>
      </n-layout>
    </n-message-provider>
  </n-config-provider>
</template>
