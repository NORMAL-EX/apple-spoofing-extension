// Popup控制脚本

document.addEventListener('DOMContentLoaded', () => {
  const enableToggle = document.getElementById('enable-toggle');
  const deviceSelect = document.getElementById('device-type');
  const statusElement = document.getElementById('status');
  const currentDeviceElement = document.getElementById('current-device');

  // 加载当前设置
  chrome.runtime.sendMessage({ action: 'getStatus' }, (response) => {
    if (response) {
      enableToggle.checked = response.enabled !== false;
      deviceSelect.value = response.deviceType || 'auto';
      updateDisplay();
    }
  });

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
});