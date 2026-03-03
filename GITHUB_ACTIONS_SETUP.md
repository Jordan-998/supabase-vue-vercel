# GitHub Actions 设置指南

**项目:** supabase-vue-vercel
**配置文件:** `.github/workflows/ci.yml` + `deploy.yml`
**状态:** 准备就绪

---

## 目录

- [概述](#概述)
- [功能说明](#功能说明)
- [前置准备](#前置准备)
- [配置步骤](#配置步骤)
- [使用说明](#使用说明)
- [故障排除](#故障排除)
- [最佳实践](#最佳实践)

---

## 概述

本项目使用 GitHub Actions 实现：

- **CI（持续集成）**: 自动检查代码质量、运行测试
- **CD（持续部署）**: 自动部署到 Cloudflare Pages

### Workflow 文件

| 文件 | 触发条件 | 作用 |
|------|----------|------|
| `ci.yml` | Push / PR | 代码检查、测试、构建验证 |
| `deploy.yml` | Push 到 master / PR | 部署到 Cloudflare Pages |

---

## 功能说明

### CI Workflow (`ci.yml`)

每次推送或创建 PR 时，自动执行以下任务：

```
1. Lint (oxlint + ESLint)
   ↓
2. Type Check (vue-tsc)
   ↓
3. Unit Tests (Vitest)
   ↓
4. E2E Tests (Playwright)
   ↓
5. Build (Vite)
```

**并行执行的任务：**
- Lint
- Type Check
- Unit Tests
- E2E Tests

**依赖任务：**
- Build（等待 Lint、Type Check、Unit Tests 通过）

### Deploy Workflow (`deploy.yml`)

| 触发条件 | 部署目标 | 环境 |
|----------|----------|------|
| 推送到 `master` | Production | 生产环境 |
| 创建 Pull Request | Preview | 预览环境 |
| 手动触发 (`workflow_dispatch`) | Production | 生产环境 |

---

## 前置准备

### 检查清单

- [x] GitHub 仓库已创建
- [x] Cloudflare Pages 账户已注册
- [x] Supabase 项目已创建
- [ ] GitHub Secrets 已配置（接下来）

### 所需凭证

| 凭证 | 用途 | 获取位置 |
|------|------|----------|
| Supabase URL | 应用连接 Supabase | Supabase Dashboard → Settings → API |
| Supabase Anon Key | 应用认证 Supabase | Supabase Dashboard → Settings → API |
| Cloudflare API Token | 部署到 Cloudflare Pages | Cloudflare Dashboard → API Tokens |
| Cloudflare Account ID | 部署到 Cloudflare Pages | Cloudflare Dashboard → URL 或 Workers & Pages |

---

## 配置步骤

### 步骤 1: 获取 Supabase 凭证

#### 1.1 访问 Supabase Dashboard

打开 https://supabase.com/dashboard，登录你的账户。

#### 1.2 选择项目

在项目列表中选择你的项目。

#### 1.3 复制 API 凭证

1. 点击左侧菜单 **Settings** → **API**
2. 找到 **Project API keys** 部分
3. 复制以下信息：

```
Project URL: https://xxxxxxxxxxxxx.supabase.co
anon/public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**重要提示：**
- ⚠️ 不要复制 `service_role` key（仅用于后端）
- ✅ 只复制 `anon` `public` key（用于前端）

---

### 步骤 2: 获取 Cloudflare 凭证

#### 2.1 获取 Account ID

**方法 1: 从 URL 获取**

1. 访问 https://dash.cloudflare.com
2. 点击任意域名或 Workers & Pages
3. 查看 URL 中的 ID：

```
https://dash.cloudflare.com/xxxxxxxxxxxxxxxxxxx/pages/view/...
                         ↑ 这是 Account ID
```

**方法 2: 从 Workers & Pages 页面获取**

1. 访问 https://dash.cloudflare.com/ → **Workers & Pages**
2. 在页面右侧找到 **Account ID**
3. 点击复制图标

#### 2.2 创建 API Token

1. 访问 https://dash.cloudflare.com/profile/api-tokens
2. 点击 **Create Token** 按钮
3. 选择 **Edit Cloudflare Workers** 模板（或创建自定义 Token）

**自定义 Token 配置：**

| 设置 | 值 |
|------|-----|
| Token name | `GitHub Actions - supabase-vue-vercel` |
| Permissions | Account > Cloudflare Pages > Edit |
| Account Resources | Include > Your Account |
| TTL (可选) | 根据需要设置 |

4. 点击 **Continue to summary** → **Create Token**
5. **立即复制 Token**（只显示一次！）

**⚠️ 重要提示：**
- Token 只显示一次，请妥善保存
- 如果丢失，需要重新创建
- 建议设置 TTL 以提高安全性

---

### 步骤 3: 配置 GitHub Secrets

#### 3.1 打开 GitHub 仓库设置

1. 访问你的 GitHub 仓库
2. 点击 **Settings** 标签页
3. 左侧菜单选择 **Secrets and variables** → **Actions**

#### 3.2 添加 Secrets

点击 **New repository secret** 按钮，依次添加以下 4 个 Secrets：

##### Secret 1: VITE_SUPABASE_URL

```
Name: VITE_SUPABASE_URL
Value: https://xxxxxxxxxxxxx.supabase.co
```

##### Secret 2: VITE_SUPABASE_ANON_KEY

```
Name: VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

##### Secret 3: CLOUDFLARE_API_TOKEN

```
Name: CLOUDFLARE_API_TOKEN
Value: 你的_Cloudflare_API_Token
```

##### Secret 4: CLOUDFLARE_ACCOUNT_ID

```
Name: CLOUDFLARE_ACCOUNT_ID
Value: 你的_Account_ID
```

#### 3.3 验证配置

完成后，你应该看到 4 个 Secrets：

```
✓ CLOUDFLARE_ACCOUNT_ID    Updated [时间]
✓ CLOUDFLARE_API_TOKEN      Updated [时间]
✓ VITE_SUPABASE_ANON_KEY    Updated [时间]
✓ VITE_SUPABASE_URL         Updated [时间]
```

---

### 步骤 4: 推送配置文件

#### 4.1 提交 workflows 文件

```bash
# 查看创建的文件
git status

# 添加 workflows 文件
git add .github/workflows/

# 提交
git commit -m "feat: 添加 GitHub Actions CI/CD 配置"

# 推送到远程
git push origin migrate-to-cloudflare-pages
```

#### 4.2 查看 Actions 运行

1. 访问 GitHub 仓库
2. 点击 **Actions** 标签页
3. 应该看到新的 workflow run 正在运行

---

## 使用说明

### 自动 CI 工作流

推送代码或创建 PR 时，CI 会自动运行：

```bash
# 任何分支推送都会触发 CI
git push origin any-branch

# 创建 PR 也会触发 CI
gh pr create --title "新功能" --body "描述"
```

### 自动部署工作流

**部署到生产环境：**

```bash
# 合并到 master 分支
git checkout master
git merge migrate-to-cloudflare-pages
git push origin master
```

**部署预览环境：**

```bash
# 创建 PR 即可自动部署预览
gh pr create --title "新功能" --body "描述"
```

### 手动触发部署

1. 访问 GitHub 仓库 → **Actions**
2. 选择 **Deploy** workflow
3. 点击 **Run workflow**
4. 选择分支（`master` 或 `migrate-to-cloudflare-pages`）
5. 点击 **Run workflow**

---

## 故障排除

### 问题 1: CI 失败 - Lint 错误

**症状：**
```
Error: oxlint found issues
```

**解决方案：**
```bash
# 本地运行 lint 查看详细错误
npm run lint

# 自动修复（如果可能）
npm run lint:oxlint
npm run lint:eslint

# 重新提交
git add .
git commit -m "fix: 修复 lint 错误"
git push
```

### 问题 2: CI 失败 - 类型错误

**症状：**
```
error TS2322: Type 'string' is not assignable to type 'number'
```

**解决方案：**
```bash
# 本地运行类型检查
npm run type-check

# 查看详细错误并修复
# 重新提交
git add .
git commit -m "fix: 修复类型错误"
git push
```

### 问题 3: CI 失败 - 测试失败

**症状：**
```
FAIL src/components/__tests__/Example.spec.ts
```

**解决方案：**
```bash
# 本地运行测试
npm run test:unit

# 或运行 E2E 测试
npm run build
npm run test:e2e

# 修复测试或代码后重新提交
```

### 问题 4: 部署失败 - Cloudflare Token 无效

**症状：**
```
Error: invalid API token
```

**解决方案：**
1. 检查 `CLOUDFLARE_API_TOKEN` 是否正确
2. 确认 Token 有 `Cloudflare Pages > Edit` 权限
3. 重新创建 Token 并更新 GitHub Secret

### 问题 5: 部署失败 - Account ID 无效

**症状：**
```
Error: invalid account ID
```

**解决方案：**
1. 检查 `CLOUDFLARE_ACCOUNT_ID` 是否正确
2. 从 Cloudflare Dashboard URL 复制正确的 ID
3. 更新 GitHub Secret

### 问题 6: 部署成功但网站无法访问

**症状：**
部署成功但访问网站时报错

**解决方案：**
1. 检查 Supabase 凭证是否正确
2. 确认 Supabase 项目未暂停
3. 检查浏览器控制台错误信息
4. 查看 Cloudflare Pages 部署日志

### 问题 7: E2E 测试超时

**症状：**
```
Error: Test timeout of 30000ms exceeded
```

**解决方案：**
```bash
# 检查 playwright.config.ts 中的超时设置
# 可能需要增加 timeout 或优化测试
```

---

## 最佳实践

### 1. 分支策略

推荐使用以下分支策略：

```
master (主分支)
  ↓ 稳定代码，自动部署到生产环境
  ↓
migrate-to-cloudflare-pages (开发分支)
  ↓ 开发代码，通过 CI 但不自动部署
  ↓
feature/* (功能分支)
  ↓ 功能开发，通过 CI
  ↓
创建 PR → 部署预览 → 代码审查 → 合并
```

### 2. Commit 消息规范

使用语义化提交消息：

```bash
feat: 添加新功能
fix: 修复 bug
docs: 更新文档
style: 代码格式调整（不影响功能）
refactor: 重构代码
test: 添加或修改测试
chore: 构建配置等
```

### 3. PR 审查流程

在合并前确保：
- [ ] 所有 CI 检查通过
- [ ] 至少一人审查代码
- [ ] 预览部署正常工作
- [ ] 测试覆盖新增功能

### 4. Secrets 管理

**安全建议：**
- ✅ 定期轮换 API Token
- ✅ 使用最小权限原则
- ✅ 不要在代码中硬编码 Secrets
- ✅ 使用环境变量而不是 `.env.local`

### 5. 监控和通知

**启用 GitHub 通知：**
1. Settings → Notifications
2. 选择通知方式（Email、GitHub App、Slack 等）
3. 配置 Workflow 失败通知

**Slack 集成（可选）：**
```yaml
# 在 workflow 中添加 Slack 通知
- name: Notify Slack on failure
  if: failure()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

---

## 进阶配置

### 条件执行

只在特定文件变更时运行测试：

```yaml
jobs:
  test:
    if: contains(github.event.*.*.**.html', 'src/')
```

### 矩阵构建

在多个 Node.js 版本下测试：

```yaml
strategy:
  matrix:
    node-version: [18, 20, 22]
```

### 缓存优化

加速构建：

```yaml
- name: Cache node modules
  uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
```

---

## 验证清单

完成配置后，验证以下项目：

### GitHub Actions
- [ ] CI workflow 成功运行
- [ ] 所有检查通过（Lint、Type Check、Tests、Build）
- [ ] Deploy workflow 成功运行
- [ ] Cloudflare Pages 部署成功

### 功能验证
- [ ] 生产环境可访问
- [ ] PR 预览环境可访问
- [ ] Supabase 连接正常
- [ ] 用户认证功能正常

### 通知和监控
- [ ] 配置了失败通知
- [ ] 定期检查 Actions 运行状态

---

## 相关文档

**官方文档：**
- GitHub Actions: https://docs.github.com/en/actions
- Cloudflare Pages Action: https://github.com/cloudflare/pages-action
- Supabase + Vue: https://supabase.com/docs/guides/getting-started/frameworks/vue

**本项目文档：**
- CLAUDE.md - 项目说明
- CLOUDFLARE_SETUP_GUIDE.md - Cloudflare Pages 设置指南
- GITHUB_ACTIONS_SETUP.md - 本文档

---

## 获取帮助

**遇到问题？**

1. 查看 [故障排除](#故障排除) 部分
2. 检查 GitHub Actions 日志
3. 查看 Cloudflare Pages 部署日志
4. 访问相关文档链接

**社区支持：**
- GitHub Actions Community: https://github.community/
- Cloudflare Community: https://community.cloudflare.com/
- Vue Forum: https://forum.vuejs.org/

---

**文档版本:** 1.0
**最后更新:** 2026-03-03
**状态:** 准备就绪
