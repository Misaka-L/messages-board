<script setup lang="ts">
import markdownit from 'markdown-it'

const md = markdownit({
    html: true,
    linkify: true,
    typographer: true
})

const props = defineProps<{
    value: string
}>()

const markdownResult = computed(() => {
    return md.render(props.value)
})
</script>

<template>
    <div v-html="markdownResult"></div>
</template>