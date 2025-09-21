// Apple Device Spoofing - 背景脚本
// 用于修改HTTP请求头中的User-Agent

chrome.runtime.onInstalled.addListener(() => {
  console.log('Apple Device Spoofing Extension 已安装');

  // 设置默认配置
  chrome.storage.local.set({
    enabled: true,
    deviceType: 'auto' // auto, iphone, ipad, mac
  });
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
    chrome.storage.local.set(request.settings, () => {
      sendResponse({ success: true });
      // 重新加载所有标签页以应用新设置
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach(tab => {
          if (tab.url && !tab.url.startsWith('chrome://')) {
            chrome.tabs.reload(tab.id);
          }
        });
      });
    });
    return true;
  }
});

// 获取合适的User-Agent
function getAppleUserAgent(url) {
  const userAgents = {
    iphone: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1',
    ipad: 'Mozilla/5.0 (iPad; CPU OS 17_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1',
    mac: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_2_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15'
  };

  // 这里可以根据URL或其他条件来决定使用哪个User-Agent
  // 暂时默认使用iPhone
  return userAgents.iphone;
}