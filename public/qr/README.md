# LastSeen WhatsApp 二维码云端展示（极低成本方案）

## 目标
把 Go 侧拿到的 WhatsApp 登录二维码 payload，通过**极低成本**的方式展示在云端，供主 WhatsApp 手机摄像头扫码。

**核心约束满足**：
- 零后端、无数据库、无持久化
- 零鉴权
- 所有敏感数据只存在于用户自己打开的 URL 中
- 客户自己对链接安全负责

## 原理（最低成本）
1. Go 模块返回的是一个**长文本字符串**（payload），格式类似：
   `https://wa.me/settings/linked_devices#xxxx,yyyy,zzzz...`
2. Android 把这个字符串通过 **URL Hash（#）** 拼成完整链接：
   `https://你的域名/qr/#payload这里`
3. 用户在任意设备/浏览器打开这个链接
4. 页面用极小的 JS 在浏览器本地渲染出二维码图片
5. Fragment（#后面内容）**不会发送到服务器**，天然无日志、无存储

## 部署方式（任选其一，全部免费）

### 推荐：GitHub Pages（最简单）
1. 把整个 `qr/` 文件夹推到 GitHub
2. 仓库设置 → Pages → Source 选 `Deploy from a branch`
3. Branch 选 `main`，Folder 选 `/qr`
4. 保存后得到地址，例如：
   `https://你的用户名.github.io/lastseen/qr/`

### 其他零成本托管
- Cloudflare Pages（推荐，速度快）
- Vercel（免费）
- Netlify（免费）
- 甚至直接用 GitHub Gist 的 raw 链接（临时测试）

部署后把最终域名记录下来，后面给 Android 用。

## Android 端最小对接代码（伪代码）

```kotlin
// 拿到 Go 返回的 qrPayload 后
val qrPayload = result["qr_code"] as String   // 来自 GetQRPairingStatus

// 你的静态页面地址（部署后替换）
val base = "https://你的用户名.github.io/lastseen/qr/"

// 构造最终链接（用 # 传 payload）
val cloudUrl = base + "#" + URLEncoder.encode(qrPayload, "UTF-8")

// 展示给用户（可做成大按钮 + 可复制）
showCloudQRLink(cloudUrl)

// 用户点击后用系统浏览器打开即可
```

当 Go 侧返回新的二维码（轮换）时，重新构造新 `cloudUrl` 并提示用户“请复制新链接并刷新页面”。

## 注意事项

- **安全性**：payload 包含 WhatsApp 配对密钥。链接只能自己用，绝不要发给别人。
- **时效**：二维码通常 20~60 秒刷新一次。建议 App 每次拿到新 code 就生成新链接。
- **轮换处理**：用户必须复制 App 里的**最新链接**后刷新页面。
- **同设备使用**：同一台手机也可以打开链接（Chrome），然后用 WhatsApp 摄像头扫自己屏幕上的二维码（部分用户可行）。
- **无需维护**：这个页面没有任何服务器逻辑，部署一次后基本不用管。

## 文件说明
- `index.html`：唯一需要部署的文件，已自包含样式 + 通过 CDN 加载轻量 qrcode.js
- 本目录下除此之外无需其他文件

---

**这就是目前能做到的真正“极低成本”方案**。  
如果以后需要更丝滑的体验（自动刷新等），再考虑引入轻量后端。
