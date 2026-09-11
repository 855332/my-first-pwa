# 朱墙玉碎 · 深宫计分牌（PWA）

**所有文件平铺在根目录，无任何子目录。** 立绘图片也直接放在根目录，与 html/js/css 同级。

## ✨ 功能
- 素素 / 海燕 / 大壮 三人，箭头或 ← → 键切换
- **好感度 → 封号 + 立绘自动联动**（三人均完整）：
  - ≤ -20 冷宫 → ≥20 贵人 → ≥40 嫔 → ≥60 妃 → ≥80 贵妃 → ≥100 皇贵妃
- 初始值：素素(3/70/0·妃)、海燕(5/40/0·嫔)、大壮(9/0/0·无封号)
- 18 件拍卖品，密码 `123` **仅首次解锁**，之后免密
- 数据自动存 localStorage，刷新不丢
- **PWA**：可安装到手机桌面、支持离线运行

## 🖼️ 替换立绘（最重要）
**所有图片都在根目录**，文件名必须严格一致，你**同名覆盖**即可：

| 身份 | 好感度 | 素素 | 海燕 | 大壮 |
|:--:|:--:|:--:|:--:|:--:|
| 冷宫 | ≤ -20 | `susu_lengong.png` | `haiyan_lengong.png` | `dazhuang_lengong.png` |
| 平民/贵人 | -19~19, ≥20 | `susu_pingmin.png` | `haiyan_pingmin.png` | `dazhuang_pingmin.png` |
| 嫔 | ≥ 40 | `susu_pin.png` | `haiyan_pin.png` | `dazhuang_pin.png` |
| 妃 | ≥ 60 | `susu_fei.png` | `haiyan_fei.png` | `dazhuang_fei.png` |
| 贵妃 | ≥ 80 | `susu_guifei.png` | `haiyan_guifei.png` | `dazhuang_guifei.png` |
| 皇贵妃 | ≥ 100 | `susu_huangguifei.png` | `haiyan_huangguifei.png` | `dazhuang_huangguifei.png` |

角色 id：`susu`=素素、`haiyan`=海燕、`dazhuang`=大壮。

> 当前这 18 个 png 是**标注了"素素·妃"等文字的占位图**，直接**上传同名图片覆盖**即可。
> 若用 `.jpg`/`.webp`，修改 `portraits.js` 里的路径后缀。

## 🚀 运行 / 部署
### 本地测试
```bash
cd 朱墙玉碎PWA
python3 -m http.server 8080
# 访问 http://localhost:8080
```
### 部署上线（PWA 需 HTTPS）
上传全部文件到 GitHub Pages / Vercel / 腾讯云 COS 等静态托管，浏览器会出现「安装到桌面」。

## 📁 完整文件清单（全部在根目录，扁平结构）
```
index.html           主页面
style.css            样式
app.js               主逻辑
portraits.js         立绘路径配置（改这里）
manifest.json        PWA 清单
sw.js                Service Worker（离线缓存，含18张立绘）
icon-192.png         桌面图标
icon-512.png
README.md
susu_lengong.png ... dazhuang_huangguifei.png   ← 18张立绘（当前为占位图）
```

## 🔧 自定义
- 初始值：`app.js` 顶部 `INITIAL`
- 封号/换装档位：`portraits.js` 的 `getTitle()` / `getPortraitKey()`
- 拍卖品：`app.js` 顶部 `AUCTION`
- 解锁密码：`app.js` 的 `tryUnlock()` 里 `"123"`
