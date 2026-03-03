# Cloudflare Pages 设置指南

**项目:** supabase-vue-vercel
**分支:** migrate-to-cloudflare-pages
**状态:** ✅ 代码已推送，等待连接 Cloudflare Pages

---

## 🚀 快速开始

### 前置条件检查

- ✅ 代码已推送到 GitHub (`migrate-to-cloudflare-pages` 分支)
- ✅ 构建验证成功 (本地测试通过)
- ✅ 所有关键配置文件已创建
  - `public/_redirects` ✅
  - `public/_headers` ✅
  - `wrangler.toml` ✅
  - `.env.example` ✅

---

## 📋 步骤 1: 连接 Cloudflare Pages

### 1.1 访问 Cloudflare Pages

打开浏览器，访问:

**中文站点:** https://www.cloudflare-cn.com/
**或全球站点:** https://dash.cloudflare.com/

### 1.2 登录账户

- 如果已有账户，直接登录
- 如果没有，注册新账户（免费）

### 1.3 进入 Pages

登录后:
1. 点击左侧菜单 **"Pages"**
2. 点击 **"Create a project"** 按钮

---

## 📋 步骤 2: 连接 GitHub

### 2.1 选择 Git 集成

1. 点击 **"Connect to Git"**
2. 选择 **"GitHub"**
3. 点击 **"Connect GitHub"** 按钮

### 2.2 授权 Cloudflare

1. 如果是第一次，会跳转到 GitHub
2. 点击 **"Authorize Cloudflare"** 授予权限
3. 选择要访问的仓库（All repositories 或 Only select repositories）

### 2.3 选择仓库

1. 在仓库列表中找到 **`supabase-vue-vercel`**
2. 所有者: **`Jordan-998`**
3. 点击 **"Begin setup"** 按钮

---

## 📋 步骤 3: 配置构建设置

### 3.1 基本设置

| 设置项 | 值 | 说明 |
|--------|-----|------|
| **Project name** | `supabase-vue-vercel` | 或自定义名称 |
| **Production branch** | `migrate-to-cloudflare-pages` | 先在迁移分支测试 |
| **Preview branches** | `All branches` | 所有 PR 创建预览 |
| **Framework preset** | `Vite` | 自动检测 |
| **Build command** | `npm run build` | 构建脚本 |
| **Build output directory** | `dist` | Vite 默认输出目录 |
| **Root directory** | `/` | 项目根目录 |
| **Node.js version** | `20` | 或 `22` |

**重要提示:**
- ⚠️ **Production branch** 必须设置为 `migrate-to-cloudflare-pages`（先测试分支）
- ⚠️ **Build output directory** 必须是 `dist`（小写）

### 3.2 环境变量配置

在 **"Environment variables"** 部分添加以下变量:

| 变量名 | 值 | 环境 |
|--------|-----|------|
| `VITE_SUPABASE_URL` | `https://ryjpmbelmpluoeolkwzl.supabase.co` | Production + Preview |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | Production + Preview |

**⚠️ 重要提示:**
- 这些值应该从 Vercel 项目设置中复制
- 变量名**必须**以 `VITE_` 开头
- 变量值**必须**完整复制，不要遗漏任何字符

### 3.3 高级设置（可选）

点击 **"Show advanced settings"**:

| 设置项 | 值 | 说明 |
|--------|-----|------|
| **Environment variable** | 可选 | 自定义环境变量 |
| **Build command** | `npm run build` | 已设置 |
| **Output directory** | `dist` | 已设置 |
| **Root directory** | `/` | 已设置 |
| **Headers** | 使用 `public/_headers` | 已配置 ✅ |
| **Redirects** | 使用 `public/_redirects` | 已配置 ✅ |

---

## 📋 步骤 4: 部署

### 4.1 保存并部署

1. 检查所有设置是否正确
2. 点击 **"Save and Deploy"** 按钮
3. Cloudflare 会自动开始构建

### 4.2 观察部署过程

部署日志会显示:

```
✓ Cloning repository
✓ Installing dependencies (npm install)
✓ Building application (npm run build)
✓ Uploading to Cloudflare
✓ Deployed to *.pages.dev
```

**预计时间:** 1-3 分钟

---

## 📋 步骤 5: 验证部署

### 5.1 访问部署 URL

部署成功后，Cloudflare 会提供以下 URL:

```
https://your-project-name.pages.dev
```

例如: `https://supabase-vue-vercel.pages.dev`

### 5.2 功能验证清单

**基础验证:**
- [ ] 页面正常加载
- [ ] 无浏览器控制台错误（按 F12 查看）
- [ ] 看到 "Supabase 客户端已初始化" 日志

**路由验证 (最关键):**
- [ ] 访问 `/` - 主页正常
- [ ] 访问 `/about` - **不返回 404**（测试 _redirects）
- [ ] 在 `/about` 页面刷新 - **仍然在 /about**（测试 SPA 路由）
- [ ] 浏览器前进/后退 - 正常导航

**功能验证:**
- [ ] 用户注册功能正常
- [ ] 用户登录功能正常
- [ ] Todo 创建功能正常
- [ ] Todo 更新功能正常
- [ ] Todo 删除功能正常
- [ ] 数据持久化正常（刷新后数据还在）

---

## 📋 步骤 6: 故障排除

### 问题 1: SPA 路由返回 404

**症状:** 访问 `/about` 返回 404 Not Found

**原因:** `public/_redirects` 文件缺失或内容错误

**解决方案:**
```bash
# 检查文件是否存在
ls -la public/_redirects

# 检查文件内容
cat public/_redirects
# 应该显示: /*    /index.html   200

# 如果内容不对，修改后重新提交推送
git add public/_redirects
git commit -m "fix: 修正 _redirects 文件"
git push
```

### 问题 2: Supabase 连接失败

**症状:** 浏览器控制台显示 "Missing Supabase environment variables"

**原因:** 环境变量未配置或配置错误

**解决方案:**
1. 检查 Cloudflare Pages 项目设置
2. 确认环境变量已添加
3. 确认变量名以 `VITE_` 开头
4. 确认变量值完整且正确
5. 重新触发部署

### 问题 3: 构建失败

**症状:** 部署日志显示构建错误

**可能原因:**
- Node.js 版本不匹配
- 依赖安装失败
- TypeScript 类型错误

**解决方案:**
1. 查看部署日志中的错误信息
2. 本地运行 `npm run build` 验证
3. 确保使用相同的 Node.js 版本
4. 修复错误后推送代码触发重新部署

---

## 📋 步骤 7: 下一步操作

### 7.1 合并到主分支

**验证通过后:**

```bash
# 1. 切换到 master 分支
git checkout master

# 2. 合并迁移分支
git merge migrate-to-cloudflare-pages

# 3. 推送到 GitHub
git push origin master
```

### 7.2 更新 Cloudflare Pages 配置

1. 进入 Cloudflare Pages 项目设置
2. 将 **Production branch** 改为 `master`
3. 保存并触发新部署

### 7.3 配置自定义域名（可选）

**如果需要自定义域名:**

1. **添加域名**
   - Cloudflare Pages 项目 → Custom domains → Add
   - 输入域名: `todo.yourdomain.com`
   - 点击 Continue

2. **配置 DNS**
   - 如果域名在 Cloudflare: 自动配置 ✅
   - 如果域名在其他注册商: 添加 CNAME 记录
     ```
     Type: CNAME
     Name: todo
     Target: supabase-vue-vercel.pages.dev
     TTL: 300
     ```

3. **验证域名**
   - 等待 SSL 证书签发（1-5分钟）
   - 访问自定义域名验证
   - 测试所有功能

---

## 📋 步骤 8: 监控和优化

### 8.1 启用 Web Analytics

1. 进入 Cloudflare Pages 项目
2. 点击 **Analytics**
3. 点击 **Enable Web Analytics**
4. 查看实时数据

### 8.2 添加安全头（已配置）

`public/_headers` 文件已包含:
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- 等等...

### 8.3 性能监控

建议使用以下工具:
- **Lighthouse** - 性能评分
- **WebPageTest** - 详细性能分析
- **Cloudflare Analytics** - 真实用户监控

---

## 📋 验证清单

完成所有步骤后，请验证以下项目:

### 部署验证
- [ ] 代码成功推送到 GitHub
- [ ] Cloudflare Pages 项目已创建
- [ ] 首次部署成功
- [ ] 部署 URL 可访问

### 功能验证
- [ ] 主页正常加载
- [ ] `/about` 路由不返回 404
- [ ] 页面刷新状态保持
- [ ] 浏览器前进后退正常
- [ ] Supabase 连接成功
- [ ] 用户注册功能正常
- [ ] 用户登录功能正常
- [ ] Todo CRUD 功能正常
- [ ] 数据持久化正常

### 性能验证
- [ ] 页面加载速度正常
- [ ] Lighthouse Performance ≥ 90
- [ ] 无明显性能下降

---

## 📞 获取帮助

**官方文档:**
- Cloudflare Pages 中文: https://developers.cloudflare.com/pages/
- Vue 指南: https://developers.cloudflare.com/pages/framework-guides/vue
- Vite 指南: https://developers.cloudflare.com/pages/framework-guides/deploy-a-vite3-project/

**社区支持:**
- Cloudflare 社区: https://community.cloudflare.com/
- Vue 论坛: https://forum.vuejs.org/

**本项目文档:**
- FIP.md - 详细实施提案
- MIGRATION_SUMMARY.md - 快速参考
- PRE_CHECKLIST.md - 检查清单

---

## ✅ 完成标志

迁移被认为完成，当:
- ✅ 所有功能在 Cloudflare Pages 正常工作
- ✅ 性能等于或优于 Vercel
- ✅ SPA 路由完全正常
- ✅ 自定义域名（如使用）正常工作
- ✅ 7 天稳定运行，无关键问题

---

**文档版本:** 1.0
**最后更新:** 2026-03-01
**状态:** ✅ 准备就绪，可以开始部署！
