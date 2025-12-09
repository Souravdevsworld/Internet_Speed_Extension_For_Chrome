// Popup script for displaying speed data
const speedValue = document.getElementById('speedValue');
const lastUpdated = document.getElementById('lastUpdated');
const status = document.getElementById('status');

// Update UI with current speed data
function updateUI() {
  chrome.storage.local.get(['speed', 'updatedAt', 'error'], (data) => {
    if (data.speed !== undefined) {
      speedValue.textContent = data.speed;
      
      if (data.updatedAt) {
        const secondsAgo = Math.floor((Date.now() - data.updatedAt) / 1000);
        lastUpdated.textContent = `${secondsAgo} second${secondsAgo !== 1 ? 's' : ''} ago`;
        
        // Update status based on recency
        if (secondsAgo < 3) {
          status.textContent = 'Active';
          status.className = 'status status-active';
        } else if (secondsAgo < 10) {
          status.textContent = 'Updating...';
          status.className = 'status status-updating';
        } else {
          status.textContent = 'Delayed';
          status.className = 'status status-delayed';
        }
      }
      
      if (data.error) {
        status.textContent = 'Error';
        status.className = 'status status-error';
      }
    } else {
      speedValue.textContent = '...';
      lastUpdated.textContent = '...';
      status.textContent = 'Starting...';
      status.className = 'status status-updating';
    }
  });
}

// Ping background to keep it alive
function pingBackground() {
  chrome.runtime.sendMessage({ action: 'ping' }, (response) => {
    if (chrome.runtime.lastError) {
      console.log('Background not responding:', chrome.runtime.lastError);
    }
  });
}

// Initialize
updateUI();
pingBackground();

// Update every second
setInterval(updateUI, 1000);

// Ping background every 10 seconds
setInterval(pingBackground, 10000);