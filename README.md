# Apple Device Spoofing Extension / 苹果设备伪装插件

[English](./README_en.md) | 中文

<div align="center">
  <h1>Apple Device Spoofing Extension</h1>
  <p>让任何设备都显示为苹果设备的浏览器插件</p>
  <h3>🍎 再也不用被嘲讽"安卓电脑"了！</h3>
  <p><i>"用苹果手机，开苹果汽车，住苹果小区，享苹果人生"</i></p>

  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
  [![Chrome Web Store](https://img.shields.io/badge/Chrome-Extension-green)](https://chrome.google.com)
  [![Edge Add-ons](https://img.shields.io/badge/Edge-Add--on-blue)](https://microsoftedge.microsoft.com)
</div>

## 😎 为什么需要这个插件？

还记得那个把世界分成"苹果"和"安卓"两类的梗吗？当你的Windows电脑被嘲讽为"安卓电脑"，当你的设备被贴上"安卓"标签，是不是感到有些无奈？

现在，**一键伪装，让所有网站都认为你在用苹果设备！**

### 🎯 核心价值
- 🚫 **拒绝设备歧视** - 不再因为设备选择而被贴标签
- 💪 **自信上网冲浪** - 任何设备都能享受"苹果待遇"
- 🎭 **完美伪装** - 从此你也是"苹果人"
- 🏠 **苹果生态全家桶** - 虚拟体验"苹果手机、苹果电脑、苹果生活"

## 🎯 功能特性

- 🔒 **完全伪装** - 修改所有可被检测的浏览器API和属性
- 🎨 **多设备支持** - 可选择伪装成iPhone、iPad或Mac
- 🌓 **深浅色主题** - 自动适配系统主题设置
- ⚡ **实时切换** - 无需重启浏览器，刷新页面即可生效
- 🛡️ **隐私保护** - 所有处理都在本地完成，不收集任何数据
- 🎭 **反"安卓"歧视** - 让"安卓电脑"成为历史

## 📦 安装方法

### 从源码安装（开发者模式）

1. **下载源码**
   ```bash
   git clone https://github.com/NORMAL-EX/apple-spoofing-extension.git
   cd apple-spoofing-extension
   ```

2. **Chrome浏览器**
   - 打开 `chrome://extensions/`
   - 开启右上角的"开发者模式"
   - 点击"加载已解压的扩展程序"
   - 选择项目文件夹

3. **Edge浏览器**
   - 打开 `edge://extensions/`
   - 开启左侧的"开发人员模式"
   - 点击"加载已解压的扩展程序"
   - 选择项目文件夹

## 🚀 使用方法

1. 点击浏览器工具栏中的插件图标
2. 使用开关启用/禁用伪装功能
3. 从下拉菜单选择要伪装的设备类型：
   - **自动检测** - 根据屏幕尺寸自动选择
   - **iPhone** - 伪装成iPhone设备（享受"苹果手机"待遇）
   - **iPad** - 伪装成iPad设备（平板也要是苹果的）
   - **Mac** - 伪装成Mac电脑（告别"安卓电脑"标签）
4. 刷新目标网页使更改生效

### 💡 使用场景
- 当网站检测到你用Windows/Linux时自动降级体验
- 当某些功能只对"苹果用户"开放时
- 当你想体验"苹果人生"但暂时买不起苹果全家桶时
- 当你被某些人嘲讽使用"安卓电脑"时

## 🛠️ 技术实现

### 修改的API和属性

#### Navigator对象
- `userAgent` - 用户代理字符串
- `platform` - 平台标识符
- `vendor` - 浏览器供应商
- `maxTouchPoints` - 最大触摸点数
- `standalone` - iOS PWA独立模式标识

#### Apple专有API
- `ApplePaySession` - Apple Pay支付接口
- `safari.pushNotification` - Safari推送通知
- `DeviceMotionEvent.requestPermission` - iOS设备运动权限

#### WebGL信息
- UNMASKED_VENDOR_WEBGL - 显卡供应商
- UNMASKED_RENDERER_WEBGL - 显卡渲染器

#### CSS特性检测
- `-webkit-touch-callout` - iOS触摸呼出菜单
- `-webkit-overflow-scrolling` - iOS平滑滚动

#### HTTP请求头
- `User-Agent` - 用户代理
- `Sec-CH-UA` - 客户端提示UA
- `Sec-CH-UA-Mobile` - 移动设备标识
- `Sec-CH-UA-Platform` - 平台标识

### 禁用的非Apple API
- NFC相关API（Android特有）
- `navigator.getInstalledRelatedApps`（Android特有）
- Web Serial/HID/USB API（非Mac桌面特有）

## 🔧 开发与构建

### 项目结构
```
apple-spoofing-extension/
├── manifest.json          # 插件配置清单
├── content.js            # 内容脚本（注入页面）
├── background.js         # 后台服务脚本
├── popup.html           # 弹出窗口界面
├── popup.js            # 弹出窗口逻辑
├── rules.json          # 声明式网络请求规则
├── README.md           # 中文文档
└── README_en.md        # 英文文档
```

### 开发环境要求
- Chrome/Edge浏览器（支持Manifest V3）
- 基本的Web开发知识

### 本地开发
1. 修改代码后，在扩展管理页面点击"刷新"按钮
2. 刷新测试网页查看效果

## ⚠️ 注意事项

1. **兼容性**：本插件基于Manifest V3开发，需要Chrome 88+或Edge 88+版本
2. **权限说明**：插件需要修改网页内容和HTTP请求头的权限
3. **隐私保护**：所有伪装处理都在本地完成，不会发送数据到远程服务器
4. **使用限制**：某些高级检测方法可能仍能识别真实设备
5. **娱乐为主**：本插件主要为娱乐和反歧视而生，请理性对待设备选择

## 🎪 彩蛋功能

使用本插件后，你将获得以下"苹果人生"体验：
- 🏠 虚拟"苹果小区"居住证明
- 🚗 模拟"苹果汽车"驾驶体验
- 🛒 享受"苹果超市"购物特权
- 📚 获得"苹果学历"认证标签
- 🐱 连宠物都是"苹果猫"
- 💼 成为互联网精英阶层的一员（虚拟）

## 🤝 贡献指南

欢迎提交Issue和Pull Request！

### 如何贡献
1. Fork本仓库
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个Pull Request

### 代码规范
- 使用2个空格进行缩进
- 保持代码简洁清晰
- 添加必要的注释说明
- 测试您的更改

## 📄 开源协议

本项目采用MIT协议开源 - 查看[LICENSE](LICENSE)文件了解详情

## 🙏 致谢

- 感谢所有贡献者的努力
- 致敬所有被"设备歧视"困扰的用户
- 本项目纯属娱乐，旨在消除设备偏见，促进数字平等

## 📢 免责声明

本插件仅供学习和娱乐使用，不鼓励任何形式的设备歧视或优越感。无论使用什么设备，每个人都值得被平等对待。记住：**设备只是工具，人才是主角。**

## 📮 联系方式

- GitHub Issues: [https://github.com/NORMAL-EX/apple-spoofing-extension/issues](https://github.com/NORMAL-EX/apple-spoofing-extension/issues)
- 项目主页: [https://github.com/NORMAL-EX/apple-spoofing-extension](https://github.com/NORMAL-EX/apple-spoofing-extension)

## 🔄 更新日志

### v1.0.0 (2025-09)
- ✨ 初始版本发布
- 🎯 支持iPhone、iPad、Mac设备伪装
- 🌓 添加深浅色主题支持
- 🔧 覆盖所有主要检测API
- 📝 完整的中英文文档

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/NORMAL-EX">NORMAL-EX</a>
</div>