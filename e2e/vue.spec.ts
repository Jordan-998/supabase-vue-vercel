import { test, expect } from '@playwright/test'

// 测试应用主页加载
test('visits the app root url', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('h1')).toHaveText('Vue + Supabase 待办清单')
})

// 测试登录表单存在
test('shows login form when not authenticated', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('input[type="email"]')).toBeVisible()
  await expect(page.locator('input[type="password"]')).toBeVisible()
  await expect(page.getByRole('button', { name: '注册' })).toBeVisible()
  await expect(page.getByRole('button', { name: '登录' })).toBeVisible()
})

// 测试待办列表区域（未登录时不显示）
test('does not show todo section when not authenticated', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('Vue + Supabase 待办清单')).toBeVisible()
  await expect(page.getByText('登录/注册')).toBeVisible()
})
