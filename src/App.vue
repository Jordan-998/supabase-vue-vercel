<template>
  <div id="app" style="max-width: 600px; margin: 50px auto; padding: 20px;">
    <h1>Vue + Supabase + Vercel 示例</h1>

    <!-- 未登录显示登录/注册 -->
    <div v-if="!session">
      <div>
        <input 
          v-model="email" 
          placeholder="邮箱" 
          type="email" 
          style="width: 100%; padding: 8px; margin: 5px 0;"
        >
        <input 
          v-model="password" 
          placeholder="密码" 
          type="password" 
          style="width: 100%; padding: 8px; margin: 5px 0;"
        >
        <button 
          @click="signUp" 
          style="width: 100%; padding: 8px; margin: 5px 0; background: #42b983; color: white; border: none; border-radius: 4px;"
        >
          注册
        </button>
        <button 
          @click="signIn" 
          style="width: 100%; padding: 8px; margin: 5px 0; background: #2c3e50; color: white; border: none; border-radius: 4px;"
        >
          登录
        </button>
      </div>
    </div>

    <!-- 已登录显示用户信息 -->
    <div v-else>
      <h3>你好！{{ session.user.email }}</h3>
      <p>登录成功 ✅ 数据来自 Supabase</p>
      <button 
        @click="signOut" 
        style="padding: 8px 16px; background: #e74c3c; color: white; border: none; border-radius: 4px;"
      >
        退出登录
      </button>
    </div>

    <!-- 提示信息 -->
    <p style="color: red; margin-top: 20px;">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { createClient } from '@supabase/supabase-js'

// 初始化 Supabase（替换成你的密钥！）
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ypgvicuekjtfkmcyhvjj.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwZ3ZpY3Vla2p0ZmttY3lodmpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwMzEwNTAsImV4cCI6MjA4NzYwNzA1MH0.OZ3-t-jMN-9-cv2RK9NXzY7wPm9Hl7lLWqZza7Z-i2o'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 响应式数据
const session = ref(null)
const email = ref('')
const password = ref('')
const errorMessage = ref('')

// 检查登录状态
async function checkSession() {
  const { data: { session: currentSession } } = await supabase.auth.getSession()
  session.value = currentSession
}

// 注册
async function signUp() {
  errorMessage.value = ''
  const { error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value
  })
  if (error) {
    errorMessage.value = error.message
  } else {
    alert('注册成功！请查收邮箱验证～')
  }
}

// 登录
async function signIn() {
  errorMessage.value = ''
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value
  })
  if (error) {
    errorMessage.value = error.message
  } else {
    session.value = data.session
  }
}

// 退出登录
async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (!error) {
    session.value = null
    email.value = ''
    password.value = ''
  }
}

// 页面加载时检查登录状态
onMounted(() => {
  checkSession()
  // 监听登录状态变化
  supabase.auth.onAuthStateChange((_event, newSession) => {
    session.value = newSession
  })
})
</script>