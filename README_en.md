# Apple Device Spoofing Extension

[中文](./README.md) | English

<div align="center">
  <h1>Apple Device Spoofing Extension</h1>
  <p>A browser extension that makes any device appear as an Apple device</p>
  <h3>🍎 Never be mocked for having an "Android Computer" again!</h3>
  <p><i>"Use Apple phone, drive Apple car, live in Apple community, enjoy Apple life"</i></p>

  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
  [![Chrome Web Store](https://img.shields.io/badge/Chrome-Extension-green)](https://chrome.google.com)
  [![Edge Add-ons](https://img.shields.io/badge/Edge-Add--on-blue)](https://microsoftedge.microsoft.com)
</div>

## 😎 Why Do You Need This Extension?

Remember the meme that divides the world into "Apple" and "Android" categories? When your Windows computer gets mocked as an "Android computer", when your device gets labeled as "Android", don't you feel a bit frustrated?

Now, **with one click, make all websites think you're using Apple devices!**

### 🎯 Core Values
- 🚫 **Reject Device Discrimination** - No more labels based on device choice
- 💪 **Surf with Confidence** - Any device can enjoy the "Apple treatment"
- 🎭 **Perfect Disguise** - You're now an "Apple person" too
- 🏠 **Apple Ecosystem Experience** - Virtual "Apple phone, Apple computer, Apple life"

## 🎯 Features

- 🔒 **Complete Spoofing** - Modifies all detectable browser APIs and properties
- 🎨 **Multi-device Support** - Choose to spoof as iPhone, iPad, or Mac
- 🌓 **Dark/Light Theme** - Automatically adapts to system theme settings
- ⚡ **Real-time Switching** - No browser restart needed, just refresh the page
- 🛡️ **Privacy Protection** - All processing done locally, no data collection
- 🎭 **Anti-"Android" Discrimination** - Make "Android Computer" a thing of the past

## 📦 Installation

### Install from Source (Developer Mode)

1. **Clone the repository**
   ```bash
   git clone https://github.com/NORMAL-EX/apple-spoofing-extension.git
   cd apple-spoofing-extension
   ```

2. **Chrome Browser**
   - Open `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked"
   - Select the project folder

3. **Edge Browser**
   - Open `edge://extensions/`
   - Enable "Developer mode" on the left side
   - Click "Load unpacked"
   - Select the project folder

## 🚀 Usage

1. Click the extension icon in your browser toolbar
2. Use the toggle switch to enable/disable spoofing
3. Select the device type from the dropdown:
   - **Auto Detect** - Automatically choose based on screen size
   - **iPhone** - Spoof as iPhone device (enjoy "Apple phone" treatment)
   - **iPad** - Spoof as iPad device (tablets should be Apple too)
   - **Mac** - Spoof as Mac computer (say goodbye to "Android computer" label)
4. Refresh the target webpage to apply changes

### 💡 Use Cases
- When websites downgrade experience after detecting Windows/Linux
- When certain features are only available to "Apple users"
- When you want to experience "Apple life" but can't afford Apple products yet
- When someone mocks you for using an "Android computer"

## 🛠️ Technical Implementation

### Modified APIs and Properties

#### Navigator Object
- `userAgent` - User agent string
- `platform` - Platform identifier
- `vendor` - Browser vendor
- `maxTouchPoints` - Maximum touch points
- `standalone` - iOS PWA standalone mode indicator

#### Apple-specific APIs
- `ApplePaySession` - Apple Pay payment interface
- `safari.pushNotification` - Safari push notifications
- `DeviceMotionEvent.requestPermission` - iOS device motion permissions

#### WebGL Information
- UNMASKED_VENDOR_WEBGL - Graphics vendor
- UNMASKED_RENDERER_WEBGL - Graphics renderer

#### CSS Feature Detection
- `-webkit-touch-callout` - iOS touch callout menu
- `-webkit-overflow-scrolling` - iOS smooth scrolling

#### HTTP Request Headers
- `User-Agent` - User agent
- `Sec-CH-UA` - Client hints UA
- `Sec-CH-UA-Mobile` - Mobile device indicator
- `Sec-CH-UA-Platform` - Platform indicator

### Disabled Non-Apple APIs
- NFC-related APIs (Android-specific)
- `navigator.getInstalledRelatedApps` (Android-specific)
- Web Serial/HID/USB APIs (Non-Mac desktop specific)

## 🔧 Development & Build

### Project Structure
```
apple-spoofing-extension/
├── manifest.json          # Extension manifest
├── content.js            # Content script (page injection)
├── background.js         # Background service worker
├── popup.html           # Popup interface
├── popup.js            # Popup logic
├── rules.json          # Declarative net request rules
├── README.md           # Chinese documentation
└── README_en.md        # English documentation
```

### Development Requirements
- Chrome/Edge browser (Manifest V3 support)
- Basic web development knowledge

### Local Development
1. After modifying code, click "Refresh" on the extensions page
2. Refresh test webpage to see changes

## ⚠️ Important Notes

1. **Compatibility**: Built with Manifest V3, requires Chrome 88+ or Edge 88+
2. **Permissions**: Extension requires permissions to modify web content and HTTP headers
3. **Privacy**: All spoofing is done locally, no data is sent to remote servers
4. **Limitations**: Some advanced detection methods may still identify the real device
5. **For Entertainment**: This extension is mainly for entertainment and anti-discrimination purposes, please be rational about device choices

## 🎪 Easter Eggs

After using this extension, you'll get the following "Apple Life" experiences:
- 🏠 Virtual "Apple Community" residence certificate
- 🚗 Simulated "Apple Car" driving experience
- 🛒 Enjoy "Apple Supermarket" shopping privileges
- 📚 Get "Apple Education" certification label
- 🐱 Even pets become "Apple Cats"
- 💼 Become a member of the internet elite class (virtually)

## 🤝 Contributing

Issues and Pull Requests are welcome!

### How to Contribute
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Standards
- Use 2 spaces for indentation
- Keep code clean and clear
- Add necessary comments
- Test your changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## 🙏 Acknowledgments

- Thanks to all contributors
- Tribute to all users troubled by "device discrimination"
- This project is purely for entertainment, aimed at eliminating device prejudice and promoting digital equality

## 📢 Disclaimer

This extension is for learning and entertainment purposes only. We do not encourage any form of device discrimination or superiority. Everyone deserves equal treatment regardless of the device they use. Remember: **Devices are just tools, people are what matters.**

## 📮 Contact

- GitHub Issues: [https://github.com/NORMAL-EX/apple-spoofing-extension/issues](https://github.com/NORMAL-EX/apple-spoofing-extension/issues)
- Project Homepage: [https://github.com/NORMAL-EX/apple-spoofing-extension](https://github.com/NORMAL-EX/apple-spoofing-extension)

## 🔄 Changelog

### v1.0.0 (2025-09)
- ✨ Initial release
- 🎯 Support for iPhone, iPad, Mac device spoofing
- 🌓 Added dark/light theme support
- 🔧 Covers all major detection APIs
- 📝 Complete bilingual documentation

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/NORMAL-EX">NORMAL-EX</a>
</div>