# 极低成本二维码云端展示 - 使用说明（LastSeen）

## 已交付内容

1. `qr/index.html` — 唯一需要部署的静态页面
2. `qr/README.md` — 部署与对接说明
3. Go 侧新增两个导出函数（已加入 whatsapp.go）：
   - `StartQRPairing()`
   - `GetQRPairingStatus(sessionID)`

## 完整流程（极低成本）

1. Android 调用 `Whatsapp.startQRPairing()` → 得到 `session_id`
2. 定时调用 `Whatsapp.getQRPairingStatus(session_id)`
3. 当返回 `"qr_code"` 非空 且 `state == "active"` 时：
   - 构造云端链接：`https://你的域名/qr/# + encode(qr_code)`
   - 把这个链接展示给用户（大按钮 + 可复制）
4. 用户在任意浏览器打开该链接 → 自动渲染大二维码
5. 用户用主 WhatsApp 手机「链接设备」摄像头扫码
6. 扫码成功后，`GetQRPairingStatus` 会返回 `device_key`，走原有持久化流程

## 部署后必须告诉 Android 的地址

部署完成后，把最终可访问的地址写死或做成配置，例如：

```kotlin
const val QR_CLOUD_BASE = "https://你的用户名.github.io/lastseen/qr/"
```

## 当前状态

- Go 桥接已支持（已编译验证通过）
- 静态页面已就绪
- Android 侧仍需少量对接代码（调用上面两个方法 + 构造链接 + 展示 UI）

需要我继续写 Android 侧的调用封装和 UI 组件吗？
