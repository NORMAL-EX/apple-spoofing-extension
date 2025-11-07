// Popup控制脚本

document.addEventListener('DOMContentLoaded', () => {
  const enableToggle = document.getElementById('enable-toggle');
  const deviceSelect = document.getElementById('device-type');
  const statusElement = document.getElementById('status');
  const currentDeviceElement = document.getElementById('current-device');
  const statsContent = document.getElementById('stats-content');

  // 加载当前设置
  chrome.runtime.sendMessage({ action: 'getStatus' }, (response) => {
    if (response) {
      enableToggle.checked = response.enabled !== false;
      deviceSelect.value = response.deviceType || 'auto';
      updateDisplay();
    }
  });

  // 获取统计数据
  fetchStats();

  // 更新显示
  function updateDisplay() {
    const enabled = enableToggle.checked;
    const deviceType = deviceSelect.value;

    statusElement.textContent = enabled ? '已启用' : '已禁用';
    statusElement.className = enabled ? 'status-badge status-active' : 'status-badge status-inactive';

    const deviceNames = {
      'auto': '自动',
      'iphone': 'iPhone',
      'ipad': 'iPad',
      'mac': 'Mac'
    };
    currentDeviceElement.textContent = deviceNames[deviceType];
  }

  // 获取反歧视统计数据
  async function fetchStats() {
    try {
      // 获取当前活动标签页
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      if (!tab || !tab.id) {
        showNoStats();
        return;
      }

      // 向content script请求统计数据
      chrome.tabs.sendMessage(tab.id, { action: 'getStats' }, (response) => {
        if (chrome.runtime.lastError) {
          // 没有content script或页面不支持
          showNoStats();
          return;
        }

        if (response && response.stats) {
          displayStats(response.stats);
        } else {
          showNoStats();
        }
      });
    } catch (error) {
      showNoStats();
    }
  }

  // 显示统计数据
  function displayStats(stats) {
    const total = stats.total || 0;

    if (total === 0) {
      statsContent.innerHTML = `
        <div style="text-align: center; font-size: 13px; opacity: 0.9;">
          当前页面暂无检测记录
          <div style="font-size: 11px; margin-top: 4px; opacity: 0.7;">
            刷新页面后重新统计
          </div>
        </div>
      `;
      return;
    }

    const messages = [
      '已成功吊打户晨风式歧视！',
      '设备歧视者已被打脸！',
      '科技面前人人平等！',
      '成功捍卫设备自由权！',
      '反歧视卫士正在保护你！'
    ];

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    statsContent.innerHTML = `
      <div class="stats-total">${total.toLocaleString()}</div>
      <div style="font-size: 13px; margin-bottom: 8px; opacity: 0.95;">
        ${randomMessage}
      </div>
      <div class="stats-detail">
        <div class="stats-item">
          <span>Navigator:</span>
          <span>${stats.navigator || 0}</span>
        </div>
        <div class="stats-item">
          <span>WebGL:</span>
          <span>${stats.webgl || 0}</span>
        </div>
        <div class="stats-item">
          <span>Canvas:</span>
          <span>${stats.canvas || 0}</span>
        </div>
        <div class="stats-item">
          <span>Audio:</span>
          <span>${stats.audio || 0}</span>
        </div>
      </div>
    `;
  }

  // 显示无统计数据
  function showNoStats() {
    statsContent.innerHTML = `
      <div style="text-align: center; font-size: 13px; opacity: 0.9;">
        当前页面暂无统计数据
        <div style="font-size: 11px; margin-top: 4px; opacity: 0.7;">
          访问网页后自动统计拦截次数
        </div>
      </div>
    `;
  }

  // 监听开关变化
  enableToggle.addEventListener('change', () => {
    chrome.runtime.sendMessage({
      action: 'updateSettings',
      settings: {
        enabled: enableToggle.checked,
        deviceType: deviceSelect.value
      }
    }, () => {
      updateDisplay();
    });
  });

  // 监听设备选择变化
  deviceSelect.addEventListener('change', () => {
    chrome.runtime.sendMessage({
      action: 'updateSettings',
      settings: {
        enabled: enableToggle.checked,
        deviceType: deviceSelect.value
      }
    }, () => {
      updateDisplay();
    });
  });

  // 每3秒更新一次统计数据
  setInterval(fetchStats, 3000);
});
