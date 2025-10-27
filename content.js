// Apple Device Spoofing - 内容脚本
// 此脚本会覆盖所有可能用于设备检测的JavaScript API

(function() {
  'use strict';

  // 定义苹果设备的User-Agent
  const appleUserAgents = {
    iphone: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1',
    ipad: 'Mozilla/5.0 (iPad; CPU OS 17_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1',
    mac: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_2_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15'
  };

  // 反歧视检测计数器
  let detectionCounter = {
    navigator: 0,
    webgl: 0,
    canvas: 0,
    audio: 0,
    total: 0
  };

  // 主要覆盖函数
  function createSpoofing(config) {
    const { deviceType, enabled } = config;

    if (!enabled) {
      console.log('🚫 Apple Device Spoofing 已禁用');
      return;
    }

    // 根据配置决定设备类型
    let actualDeviceType = deviceType;
    if (deviceType === 'auto') {
      actualDeviceType = window.innerWidth <= 768 ? 'iphone' : 'mac';
    }

    const isMobileMode = actualDeviceType === 'iphone' || actualDeviceType === 'ipad';
    const targetUA = appleUserAgents[actualDeviceType];
    const targetPlatform = actualDeviceType === 'iphone' ? 'iPhone' :
                           actualDeviceType === 'ipad' ? 'iPad' : 'MacIntel';

    // 覆盖navigator对象的属性
    const overrideNavigator = () => {
      const navigatorProps = {
        userAgent: targetUA,
        platform: targetPlatform,
        vendor: 'Apple Computer, Inc.',
        vendorSub: '',
        maxTouchPoints: isMobileMode ? 5 : 0,
        hardwareConcurrency: 8,
        language: 'zh-CN',
        languages: ['zh-CN', 'zh', 'en-US', 'en'],
        appVersion: targetUA.split('Mozilla/')[1] || '',
        product: 'Gecko',
        productSub: '20030107',
        appCodeName: 'Mozilla',
        appName: 'Netscape',
        onLine: true
      };

      for (const [key, value] of Object.entries(navigatorProps)) {
        try {
          Object.defineProperty(navigator, key, {
            get: () => {
              detectionCounter.navigator++;
              detectionCounter.total++;
              return value;
            },
            configurable: true
          });
        } catch (e) {
          console.log(`无法覆盖navigator.${key}`);
        }
      }

      // 特殊处理standalone属性（iOS PWA特有）
      if (isMobileMode) {
        Object.defineProperty(navigator, 'standalone', {
          get: () => false,
          configurable: true
        });
      }
    };

    // 覆盖window对象的Apple相关API
    const overrideAppleAPIs = () => {
      // ApplePaySession - Safari独有
      if (!window.ApplePaySession) {
        window.ApplePaySession = class ApplePaySession {
          constructor() {
            this.STATUS_SUCCESS = 0;
            this.STATUS_FAILURE = 1;
          }
          static canMakePayments() { return true; }
          static canMakePaymentsWithActiveCard() { return Promise.resolve(true); }
          static supportsVersion() { return true; }
        };
      }

      // Safari Push Notifications (仅macOS)
      if (!isMobileMode && !window.safari) {
        window.safari = {
          pushNotification: {
            permission: function(websitePushID) {
              return {
                permission: 'granted',
                deviceToken: 'fake-device-token'
              };
            },
            requestPermission: function(websitePushID, webServiceURL, userInfo, callback) {
              setTimeout(() => {
                callback({
                  permission: 'granted',
                  deviceToken: 'fake-device-token'
                });
              }, 100);
            }
          }
        };
      }

      // iOS特有的DeviceMotionEvent权限
      if (isMobileMode && window.DeviceMotionEvent) {
        if (!DeviceMotionEvent.requestPermission) {
          DeviceMotionEvent.requestPermission = function() {
            return Promise.resolve('granted');
          };
        }
      }
    };

    // 覆盖CSS支持检测
    const overrideCSSSupports = () => {
      const originalSupports = CSS.supports;
      CSS.supports = function(property, value) {
        // iOS/iPadOS特有的CSS属性
        if (property === '-webkit-touch-callout' ||
            (property === '-webkit-overflow-scrolling' && value === 'touch')) {
          return isMobileMode;
        }
        return originalSupports.call(this, property, value);
      };
    };

    // 覆盖WebGL相关（反指纹追踪）
    const overrideWebGL = () => {
      const getContext = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function(contextType, ...args) {
        const ctx = getContext.call(this, contextType, ...args);

        if (contextType === 'webgl' || contextType === 'experimental-webgl' || contextType === 'webgl2') {
          if (ctx) {
            const getParameter = ctx.getParameter.bind(ctx);
            ctx.getParameter = function(param) {
              detectionCounter.webgl++;
              detectionCounter.total++;

              // 覆盖WebGL vendor和renderer
              if (param === 0x9245) { // UNMASKED_VENDOR_WEBGL
                return 'Apple Inc.';
              }
              if (param === 0x9246) { // UNMASKED_RENDERER_WEBGL
                return isMobileMode ? 'Apple A17 Pro GPU' : 'Apple M2 Max';
              }
              if (param === ctx.VENDOR) {
                return 'WebKit';
              }
              if (param === ctx.RENDERER) {
                return 'WebKit WebGL';
              }
              return getParameter(param);
            };
          }
        }
        return ctx;
      };
    };

    // 覆盖Canvas指纹（新增！）
    const overrideCanvas = () => {
      const originalToDataURL = HTMLCanvasElement.prototype.toDataURL;
      const originalToBlob = HTMLCanvasElement.prototype.toBlob;
      const originalGetImageData = CanvasRenderingContext2D.prototype.getImageData;

      // 添加轻微噪声来防止Canvas指纹识别
      const addNoise = (canvas, context) => {
        detectionCounter.canvas++;
        detectionCounter.total++;

        const imageData = originalGetImageData.call(context, 0, 0, canvas.width, canvas.height);
        for (let i = 0; i < imageData.data.length; i += 4) {
          // 添加随机噪声（很小的变化，肉眼不可见）
          imageData.data[i] = imageData.data[i] + Math.floor(Math.random() * 3) - 1;
        }
        context.putImageData(imageData, 0, 0);
      };

      HTMLCanvasElement.prototype.toDataURL = function(...args) {
        if (this.width > 16 && this.height > 16) {
          const context = this.getContext('2d');
          if (context) {
            addNoise(this, context);
          }
        }
        return originalToDataURL.apply(this, args);
      };

      HTMLCanvasElement.prototype.toBlob = function(...args) {
        if (this.width > 16 && this.height > 16) {
          const context = this.getContext('2d');
          if (context) {
            addNoise(this, context);
          }
        }
        return originalToBlob.apply(this, args);
      };
    };

    // 覆盖AudioContext指纹（新增！）
    const overrideAudioContext = () => {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        const originalCreateOscillator = AudioContext.prototype.createOscillator;
        AudioContext.prototype.createOscillator = function(...args) {
          detectionCounter.audio++;
          detectionCounter.total++;

          const oscillator = originalCreateOscillator.apply(this, args);
          const originalStart = oscillator.start;
          oscillator.start = function(when) {
            // 添加微小的随机延迟来防止音频指纹识别
            const noise = Math.random() * 0.0001;
            return originalStart.call(this, when + noise);
          };
          return oscillator;
        };
      }
    };

    // 覆盖字体检测（新增！）
    const overrideFonts = () => {
      // 模拟iOS/macOS的系统字体
      const appleFonts = [
        'SF Pro Text', 'SF Pro Display', 'SF Mono',
        'Helvetica Neue', 'Helvetica', 'PingFang SC', 'PingFang TC',
        'Arial', 'Times', 'Times New Roman', 'Courier New',
        'Apple Color Emoji', 'Menlo', 'Monaco'
      ];

      if (document.fonts && document.fonts.check) {
        const originalCheck = document.fonts.check;
        document.fonts.check = function(font, text) {
          // 对Apple字体总是返回true
          for (const appleFont of appleFonts) {
            if (font.includes(appleFont)) {
              return true;
            }
          }
          return originalCheck.call(this, font, text);
        };
      }
    };

    // 覆盖屏幕相关属性
    const overrideScreen = () => {
      const screenProps = isMobileMode ? {
        width: 390,
        height: 844,
        availWidth: 390,
        availHeight: 844,
        colorDepth: 32,
        pixelDepth: 32
      } : {
        width: 1920,
        height: 1080,
        availWidth: 1920,
        availHeight: 1055,
        colorDepth: 30,
        pixelDepth: 30
      };

      for (const [key, value] of Object.entries(screenProps)) {
        try {
          Object.defineProperty(screen, key, {
            get: () => value,
            configurable: true
          });
        } catch (e) {
          console.log(`无法覆盖screen.${key}`);
        }
      }
    };

    // 覆盖媒体查询
    const overrideMatchMedia = () => {
      const originalMatchMedia = window.matchMedia;
      window.matchMedia = function(query) {
        const result = originalMatchMedia.call(window, query);

        // 覆盖pointer和hover查询
        if (query.includes('pointer:coarse')) {
          Object.defineProperty(result, 'matches', {
            get: () => isMobileMode,
            configurable: true
          });
        }
        if (query.includes('pointer:fine')) {
          Object.defineProperty(result, 'matches', {
            get: () => !isMobileMode,
            configurable: true
          });
        }
        if (query.includes('hover:hover')) {
          Object.defineProperty(result, 'matches', {
            get: () => !isMobileMode,
            configurable: true
          });
        }

        return result;
      };
    };

    // 时区和语言本地化（新增！）
    const overrideLocale = () => {
      // 使用中国/美国时区（苹果用户常用）
      Object.defineProperty(Intl.DateTimeFormat.prototype, 'resolvedOptions', {
        value: function() {
          const options = Object.getOwnPropertyDescriptor(Intl.DateTimeFormat.prototype, 'resolvedOptions').value.call(this);
          options.timeZone = 'Asia/Shanghai';
          return options;
        }
      });

      // 覆盖Date的时区偏移
      const originalGetTimezoneOffset = Date.prototype.getTimezoneOffset;
      Date.prototype.getTimezoneOffset = function() {
        return -480; // UTC+8 (中国/新加坡时区)
      };
    };

    // 电池API伪装（新增！）
    const overrideBattery = () => {
      if (navigator.getBattery) {
        const originalGetBattery = navigator.getBattery;
        navigator.getBattery = function() {
          return Promise.resolve({
            charging: Math.random() > 0.5,
            chargingTime: Infinity,
            dischargingTime: Math.random() * 10000 + 10000,
            level: 0.5 + Math.random() * 0.5, // 50-100%
            addEventListener: function() {},
            removeEventListener: function() {},
            dispatchEvent: function() { return true; }
          });
        };
      }
    };

    // 禁用某些Android/Windows特有的API
    const disableNonAppleAPIs = () => {
      // 移除NFC相关API（Android特有）
      delete window.NDEFReader;
      delete navigator.nfc;
      delete window.NFC;

      // 移除getInstalledRelatedApps（Android特有）
      delete navigator.getInstalledRelatedApps;

      // 移除Web Serial/HID/USB API（主要是桌面Chrome）
      if (!targetPlatform.includes('Mac')) {
        delete navigator.serial;
        delete navigator.hid;
        delete navigator.usb;
      }
    };

    // 执行所有覆盖
    const applyAll = () => {
      overrideNavigator();
      overrideAppleAPIs();
      overrideCSSSupports();
      overrideWebGL();
      overrideCanvas();
      overrideAudioContext();
      overrideFonts();
      overrideScreen();
      overrideMatchMedia();
      overrideLocale();
      overrideBattery();
      disableNonAppleAPIs();
    };

    applyAll();

    // 在控制台显示激活信息
    console.log('%c✅ Apple Device Spoofing 已激活', 'color: #00ff00; font-size: 14px; font-weight: bold;');
    console.log(`%c📱 当前伪装: ${actualDeviceType.toUpperCase()}`, 'color: #00aaff; font-size: 12px;');
    console.log(`%c⚙️  设置模式: ${deviceType}`, 'color: #888; font-size: 11px;');
    console.log('%c🛡️  反指纹追踪: 已启用', 'color: #ff9900; font-size: 11px;');

    // 10秒后显示检测统计
    setTimeout(() => {
      if (detectionCounter.total > 0) {
        console.log('%c🚨 反歧视统计报告', 'color: #ff0066; font-size: 14px; font-weight: bold;');
        console.log(`%c总拦截次数: ${detectionCounter.total}`, 'color: #ff0066; font-size: 12px;');
        console.log(`  - Navigator检测: ${detectionCounter.navigator}次`);
        console.log(`  - WebGL指纹: ${detectionCounter.webgl}次`);
        console.log(`  - Canvas指纹: ${detectionCounter.canvas}次`);
        console.log(`  - Audio指纹: ${detectionCounter.audio}次`);
        console.log('%c💪 已成功抵御设备歧视！', 'color: #00ff00; font-size: 12px; font-weight: bold;');
      }
    }, 10000);

    return {
      deviceType: actualDeviceType,
      detectionCounter
    };
  }

  // 初始化：从chrome.storage读取配置
  const initialize = () => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.get(['enabled', 'deviceType'], (data) => {
        const config = {
          enabled: data.enabled !== undefined ? data.enabled : true,
          deviceType: data.deviceType || 'auto'
        };

        const result = createSpoofing(config);

        // 将检测计数器存储到window对象，方便调试
        if (result) {
          window.__appleSpoofingStats = result.detectionCounter;
        }
      });
    } else {
      // 降级：使用默认配置
      createSpoofing({ enabled: true, deviceType: 'auto' });
    }
  };

  // 立即执行
  initialize();

  // DOM加载完成后再次确认
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  }

  // 监听来自popup的消息请求
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getStats') {
      // 返回检测计数器
      sendResponse({
        stats: detectionCounter
      });
      return true;
    }
  });
})();
