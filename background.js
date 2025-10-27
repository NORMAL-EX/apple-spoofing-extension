// Apple Device Spoofing - 背景脚本
// 用于动态修改HTTP请求头中的User-Agent

// User-Agent配置
const userAgents = {
  iphone: {
    ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1',
    platform: 'iOS',
    mobile: '?1'
  },
  ipad: {
    ua: 'Mozilla/5.0 (iPad; CPU OS 17_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1',
    platform: 'iOS',
    mobile: '?1'
  },
  mac: {
    ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_2_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15',
    platform: 'macOS',
    mobile: '?0'
  }
};

// 更新动态规则
async function updateDynamicRules(deviceType, enabled) {
  if (!enabled) {
    // 禁用时，移除所有动态规则
    const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
    const ruleIds = existingRules.map(rule => rule.id);

    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: ruleIds
    });

    console.log('🚫 HTTP请求头伪装已禁用');
    return;
  }

  // 根据设备类型选择User-Agent
  let selectedDevice = deviceType;
  if (deviceType === 'auto') {
    // auto模式默认使用iPhone（服务器端无法检测屏幕尺寸）
    selectedDevice = 'iphone';
  }

  const config = userAgents[selectedDevice];

  // 创建新规则
  const newRule = {
    id: 1,
    priority: 1,
    action: {
      type: 'modifyHeaders',
      requestHeaders: [
        {
          header: 'User-Agent',
          operation: 'set',
          value: config.ua
        },
        {
          header: 'Sec-CH-UA',
          operation: 'set',
          value: '"Safari";v="17", "WebKit";v="605"'
        },
        {
          header: 'Sec-CH-UA-Mobile',
          operation: 'set',
          value: config.mobile
        },
        {
          header: 'Sec-CH-UA-Platform',
          operation: 'set',
          value: `"${config.platform}"`
        }
      ]
    },
    condition: {
      urlFilter: '*',
      resourceTypes: [
        'main_frame',
        'sub_frame',
        'stylesheet',
        'script',
        'image',
        'font',
        'object',
        'xmlhttprequest',
        'ping',
        'csp_report',
        'media',
        'websocket',
        'webbundle',
        'other'
      ]
    }
  };

  // 先移除旧规则，再添加新规则
  const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
  const ruleIds = existingRules.map(rule => rule.id);

  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: ruleIds,
    addRules: [newRule]
  });

  console.log(`✅ HTTP请求头已更新为: ${selectedDevice.toUpperCase()}`);
}

// 扩展安装时初始化
chrome.runtime.onInstalled.addListener(async () => {
  console.log('✅ Apple Device Spoofing Extension 已安装');

  // 设置默认配置
  await chrome.storage.local.set({
    enabled: true,
    deviceType: 'auto'
  });

  // 应用默认规则
  await updateDynamicRules('auto', true);
});

// 扩展启动时应用规则
chrome.runtime.onStartup.addListener(async () => {
  const data = await chrome.storage.local.get(['enabled', 'deviceType']);
  await updateDynamicRules(data.deviceType || 'auto', data.enabled !== false);
});

// 监听来自popup的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getStatus') {
    chrome.storage.local.get(['enabled', 'deviceType'], (data) => {
      sendResponse(data);
    });
    return true;
  }

  if (request.action === 'updateSettings') {
    const { enabled, deviceType } = request.settings;

    chrome.storage.local.set(request.settings, async () => {
      // 更新动态规则
      await updateDynamicRules(deviceType, enabled);

      sendResponse({ success: true });

      // 重新加载所有标签页以应用新设置
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach(tab => {
          if (tab.url && !tab.url.startsWith('chrome://') && !tab.url.startsWith('edge://')) {
            chrome.tabs.reload(tab.id).catch(() => {
              // 忽略无法重新加载的标签页（如chrome://、edge://等）
            });
          }
        });
      });
    });
    return true;
  }
});

// 监听storage变化（用于多窗口同步）
chrome.storage.onChanged.addListener(async (changes, namespace) => {
  if (namespace === 'local') {
    if (changes.enabled || changes.deviceType) {
      const data = await chrome.storage.local.get(['enabled', 'deviceType']);
      await updateDynamicRules(data.deviceType || 'auto', data.enabled !== false);
    }
  }
});
