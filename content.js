// Apple Device Spoofing - 内容脚本
// 此脚本会覆盖所有可能用于设备检测的JavaScript API

(function() {
  'use strict';

  // 检测是否为移动设备模式（基于屏幕宽度）
  const isMobileMode = window.innerWidth <= 768;

  // 定义苹果设备的User-Agent
  const appleUserAgents = {
    iPhone: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1',
    iPad: 'Mozilla/5.0 (iPad; CPU OS 17_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1',
    Mac: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_2_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  };

  // 选择合适的User-Agent
  const targetUA = isMobileMode ? appleUserAgents.iPhone : appleUserAgents.Mac;
  const targetPlatform = isMobileMode ? 'iPhone' : 'MacIntel';

  // 覆盖navigator对象的属性
  const overrideNavigator = () => {
    // 创建一个新的Navigator原型
    const navigatorProps = {
      userAgent: targetUA,
      platform: targetPlatform,
      vendor: 'Apple Computer, Inc.',
      vendorSub: '',
      maxTouchPoints: isMobileMode ? 5 : 0,
      hardwareConcurrency: 8,
      language: 'zh-CN',
      languages: ['zh-CN', 'zh', 'en'],
      appVersion: targetUA.split('Mozilla/')[1] || '',
      product: 'Gecko',
      productSub: '20030107',
      appCodeName: 'Mozilla',
      appName: 'Netscape',
      onLine: true
    };

    // 使用Object.defineProperty来重写navigator属性
    for (const [key, value] of Object.entries(navigatorProps)) {
      try {
        Object.defineProperty(navigator, key, {
          get: () => value,
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

  // 覆盖WebGL相关
  const overrideWebGL = () => {
    const getContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function(contextType, ...args) {
      const ctx = getContext.call(this, contextType, ...args);

      if (contextType === 'webgl' || contextType === 'experimental-webgl' || contextType === 'webgl2') {
        if (ctx) {
          const getParameter = ctx.getParameter.bind(ctx);
          ctx.getParameter = function(param) {
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
  const applyOverrides = () => {
    overrideNavigator();
    overrideAppleAPIs();
    overrideCSSSupports();
    overrideWebGL();
    overrideScreen();
    overrideMatchMedia();
    disableNonAppleAPIs();
  };

  // 立即执行
  applyOverrides();

  // 监听DOM加载完成，再次执行以确保覆盖成功
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyOverrides);
  }

  // 防止网站通过其他方式检测
  const script = document.createElement('script');
  script.textContent = '(' + applyOverrides.toString() + ')();';
  (document.head || document.documentElement).appendChild(script);
  script.remove();

  console.log('✅ Apple Device Spoofing 已激活');
  console.log(`📱 当前伪装为: ${isMobileMode ? 'iPhone' : 'Mac'}`);
})();