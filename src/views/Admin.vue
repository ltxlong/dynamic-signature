<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="!isAuthenticated" class="max-w-md mx-auto">
      <h2 class="text-2xl font-bold mb-4">管理员登录</h2>
      <input 
        type="password" 
        v-model="password"
        @keyup.enter="login"
        class="w-full p-2 border rounded mb-4"
        placeholder="请输入密码"
      >
      <button 
        @click="login"
        class="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        登录
      </button>
    </div>

    <div v-else>
      <h1 class="text-3xl font-bold mb-8">链接管理</h1>
      
      <!-- 添加链接表单 -->
      <div class="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 class="text-xl font-bold mb-4">添加新链接</h2>
        <div class="space-y-4">
          <input 
            v-model="newLink.url" 
            class="w-full p-2 border rounded"
            placeholder="链接地址"
          >
          <input 
            v-model="newLink.description" 
            class="w-full p-2 border rounded"
            placeholder="备注说明"
          >
          <input 
            v-model="newLink.weight" 
            type="number"
            class="w-full p-2 border rounded"
            placeholder="随机权重"
          >
          <div class="flex gap-4">
            <input 
              v-model="newLink.monthTag" 
              class="flex-1 p-2 border rounded"
              placeholder="月标签 (1-12)"
            >
            <input 
              v-model="newLink.weekTag" 
              class="flex-1 p-2 border rounded"
              placeholder="周标签 (1-7)"
            >
            <input 
              v-model="newLink.holidayTag" 
              class="flex-1 p-2 border rounded"
              placeholder="节日标签"
            >
          </div>
          <button 
            @click="addLink"
            class="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
          >
            添加链接
          </button>
        </div>
      </div>

      <!-- 显示模式设置 -->
      <div class="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 class="text-xl font-bold mb-4">显示模式设置</h2>
        <select 
          v-model="displayMode"
          @change="updateMode"
          class="w-full p-2 border rounded"
        >
          <option value="1">随机模式</option>
          <option value="2">按月模式</option>
          <option value="3">按周模式</option>
          <option value="4">按节日模式</option>
        </select>
      </div>

      <!-- 链接列表 -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-xl font-bold mb-4">现有链接</h2>
        <div class="space-y-4">
          <div v-for="link in links" :key="link.id" class="border p-4 rounded">
            <div class="flex justify-between items-start">
              <div>
                <p class="font-bold">{{ link.url }}</p>
                <p class="text-gray-600">{{ link.description }}</p>
                <p class="text-sm text-gray-500">
                  权重: {{ link.weight }} | 
                  月标签: {{ link.monthTag }} | 
                  周标签: {{ link.weekTag }} | 
                  节日标签: {{ link.holidayTag }}
                </p>
              </div>
              <button 
                @click="deleteLink(link.id)"
                class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                删除
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useLinkStore } from '../stores/linkStore'

const store = useLinkStore()
const isAuthenticated = ref(false)
const password = ref('')
const displayMode = ref('1')
const newLink = ref({
  url: '',
  description: '',
  weight: 1,
  monthTag: '',
  weekTag: '',
  holidayTag: ''
})

async function login() {
  const response = await fetch('/api/auth', {
    method: 'POST',
    body: JSON.stringify({ password: password.value })
  })
  if (response.ok) {
    isAuthenticated.value = true
  }
}

async function addLink() {
  await store.addLink(newLink.value)
  newLink.value = {
    url: '',
    description: '',
    weight: 1,
    monthTag: '',
    weekTag: '',
    holidayTag: ''
  }
}

async function updateMode() {
  await store.updateDisplayMode(Number(displayMode.value))
}

async function deleteLink(id) {
  await store.deleteLink(id)
}
</script> 