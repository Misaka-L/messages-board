<script setup lang="ts">
import { type FormInst } from 'naive-ui'

const message = useMessage()

const formRef = ref<FormInst | null>(null)

const formContent = ref({
  author: 'guest',
  content: ''
})

const rules = {
  author: {
    required: true,
    message: '请输入昵称',
    trigger: ['input', 'blur']
  },
  content: {
    required: true,
    message: '请输入留言内容',
    trigger: ['input', 'blur']
  }
}

const isLoading = ref(false)
const hasError = ref(false)
const errorMessage = ref<any>(null)

async function submit() {
  formRef.value?.validate(async (errors) => {
    if (errors) {
      return
    }

    const { error, status } = await useLazyFetch('/api/messages', {
      method: 'post', body: formContent.value
    })

    if (status.value === 'success') {
      message.success('留言成功')

      formContent.value = {
        author: 'guest',
        content: ''
      }

      return
    }

    hasError.value = true
    errorMessage.value = error.value
  })
}
</script>

<template>
  <n-form :rules="rules" :model="formContent" ref="formRef" :show-label="false" :show-feedback="false">
    <n-form-item label="昵称" path="author" show-feedback show-label>
      <n-input v-model:value="formContent.author" placeholder="昵称" />
    </n-form-item>
    <n-form-item label="内容" path="content" show-feedback>
      <n-input v-model:value="formContent.content" type="textarea" placeholder="留言内容" />
    </n-form-item>
    <n-form-item>
      <n-button attr-type="button" type="primary" @click="submit()" :loading="isLoading" class="w-full">
        Submit!
      </n-button>
    </n-form-item>
  </n-form>
  <n-alert v-if="hasError" title="提交失败" type="error" class="mt-4">
    {{ errorMessage }}
  </n-alert>
</template>