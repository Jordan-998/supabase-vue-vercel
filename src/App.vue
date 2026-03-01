<template>
  <div id="app" style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
    <h1 style="text-align: center; color: #333;">Vue + Supabase 待办清单</h1>

    <!-- 登录/注册区域 -->
    <div v-if="!session" class="auth-section" style="margin-bottom: 30px; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
      <h3 style="color: #42b983;">登录/注册</h3>
      <input 
        v-model="email" 
        type="email" 
        placeholder="请输入邮箱" 
        style="width: 100%; padding: 10px; margin: 8px 0; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;"
      >
      <input 
        v-model="password" 
        type="password" 
        placeholder="请输入密码" 
        style="width: 100%; padding: 10px; margin: 8px 0; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;"
      >
      <button 
        @click="signUp" 
        style="width: 48%; padding: 10px; margin: 8px 1%; background: #42b983; color: white; border: none; border-radius: 4px; cursor: pointer;"
      >
        注册
      </button>
      <button 
        @click="signIn" 
        style="width: 48%; padding: 10px; margin: 8px 1%; background: #2c3e50; color: white; border: none; border-radius: 4px; cursor: pointer;"
      >
        登录
      </button>
      <p style="color: red; font-size: 14px; margin: 10px 0 0 0;">{{ errorMsg }}</p>
    </div>

    <!-- 待办区域（登录后显示） -->
    <div v-else class="todo-section">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h3>你好，{{ session.user.email }}</h3>
        <button 
          @click="signOut" 
          style="padding: 8px 16px; background: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer;"
        >
          退出登录
        </button>
      </div>

      <!-- 添加待办 -->
      <div style="display: flex; gap: 8px; margin-bottom: 20px;">
        <input 
          v-model="newTodoTitle" 
          placeholder="输入新待办..." 
          style="flex: 1; padding: 10px; border: 1px solid #ddd; border-radius: 4px;"
          @keyup.enter="addTodo"
        >
        <button 
          @click="addTodo" 
          style="padding: 10px 20px; background: #42b983; color: white; border: none; border-radius: 4px; cursor: pointer;"
        >
          添加
        </button>
      </div>

      <!-- 待办列表 -->
      <div class="todo-list">
        <div 
          v-for="todo in todos" 
          :key="todo.id" 
          style="display: flex; align-items: center; padding: 12px; margin: 8px 0; border: 1px solid #eee; border-radius: 4px; background: #f9f9f9;"
        >
          <input 
            type="checkbox" 
            v-model="todo.is_completed" 
            @change="updateTodoStatus(todo)"
            style="width: 18px; height: 18px; margin-right: 10px;"
          >
          <span :style="{ textDecoration: todo.is_completed ? 'line-through' : 'none', color: todo.is_completed ? '#999' : '#333' }" style="flex: 1;">
            {{ todo.title }}
          </span>
          <button 
            @click="deleteTodo(todo.id)" 
            style="padding: 6px 10px; background: #ff6b6b; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;"
          >
            删除
          </button>
        </div>
      </div>

      <p v-if="todos.length === 0" style="text-align: center; color: #999; margin-top: 20px;">
        暂无待办，添加一个开始吧！
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { createClient } from '@supabase/supabase-js'

// 初始化 Supabase（从环境变量读取密钥）
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 响应式数据
const session = ref(null)
const email = ref('')
const password = ref('')
const errorMsg = ref('')
const newTodoTitle = ref('')
const todos = ref([])

// 检查登录状态
async function checkSession() {
  const { data: { session: currentSession } } = await supabase.auth.getSession()
  session.value = currentSession
  // 登录后加载待办
  if (currentSession) {
    await fetchTodos()
  }
}

// 注册
async function signUp() {
  errorMsg.value = ''
  const { error } = await supabase.auth.signUp({
    email: email.value.trim(),
    password: password.value.trim()
  })
  if (error) {
    errorMsg.value = error.message
  } else {
    alert('注册成功！请查收邮箱验证～')
    email.value = ''
    password.value = ''
  }
}

// 登录
async function signIn() {
  errorMsg.value = ''
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.value.trim(),
    password: password.value.trim()
  })
  if (error) {
    errorMsg.value = error.message
  } else {
    session.value = data.session
    email.value = ''
    password.value = ''
  }
}

// 退出登录
async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (!error) {
    session.value = null
    todos.value = []
  }
}

// 获取当前用户的待办列表
async function fetchTodos() {
  const { data, error } = await supabase
    .from('todos')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('获取待办列表失败:', error)
    todos.value = []
  } else {
    todos.value = data || []
  }
}

// 添加待办
async function addTodo() {
  if (!newTodoTitle.value.trim()) {
    alert('请输入待办内容！')
    return
  }

  const { data, error } = await supabase
    .from('todos')
    .insert([{
      title: newTodoTitle.value.trim(),
      user_id: session.value.user.id
    }])
    .select()

  if (error) {
    alert('添加失败：' + error.message)
    console.error('添加待办失败:', error)
  } else {
    newTodoTitle.value = ''
    await fetchTodos() // 重新加载列表
  }
}

// 更新待办状态（完成/未完成）
async function updateTodoStatus(todo) {
  const { error } = await supabase
    .from('todos')
    .update({ is_completed: todo.is_completed })
    .eq('id', todo.id)

  if (error) {
    // 出错回滚状态
    todo.is_completed = !todo.is_completed
    alert('更新失败：' + error.message)
  }
}

// 删除待办
async function deleteTodo(todoId) {
  if (!confirm('确定删除这个待办吗？')) return

  const { error } = await supabase
    .from('todos')
    .delete()
    .eq('id', todoId)

  if (!error) {
    await fetchTodos() // 重新加载列表
  }
}

// 页面加载时检查登录状态
onMounted(() => {
  checkSession()
  // 监听登录状态变化
  supabase.auth.onAuthStateChange((_event, newSession) => {
    session.value = newSession
    if (newSession) {
      fetchTodos()
    } else {
      todos.value = []
    }
  })
})
</script>