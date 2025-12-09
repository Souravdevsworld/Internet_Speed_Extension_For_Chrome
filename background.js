// Background service worker for continuous speed monitoring
const TEST_URL = 'https://speed.cloudflare.com/__down?bytes=250000';
const MEASURE_INTERVAL = 1000; // 1 second

let intervalId = null;

// Measure internet speed
async function measureSpeed() {
  try {
    const startTime = performance.now();
    
    // Add cache-busting parameter
    const url = `${TEST_URL}&t=${Date.now()}`;
    
    const response = await fetch(url, {
      method: 'GET',
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const blob = await response.blob();
    const endTime = performance.now();
    
    const durationSeconds = (endTime - startTime) / 1000;
    const fileSizeBytes = blob.size;
    const fileSizeMegabits = (fileSizeBytes * 8) / 1000000;
    const speedMbps = fileSizeMegabits / durationSeconds;
    
    // Save to storage
    await chrome.storage.local.set({
      speed: speedMbps.toFixed(2),
      updatedAt: Date.now()
    });
    
    console.log(`Speed: ${speedMbps.toFixed(2)} Mbps`);
    
  } catch (error) {
    console.error('Speed measurement error:', error);
    
    // Save error state
    await chrome.storage.local.set({
      speed: 0,
      updatedAt: Date.now(),
      error: error.message
    });
  }
}

// Start monitoring
function startMonitoring() {
  if (intervalId) {
    clearInterval(intervalId);
  }
  
  // Measure immediately
  measureSpeed();
  
  // Then measure every second
  intervalId = setInterval(measureSpeed, MEASURE_INTERVAL);
}

// Stop monitoring
function stopMonitoring() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

// Start when extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
  console.log('Internet Speed Monitor installed');
  startMonitoring();
});

// Start when service worker starts
chrome.runtime.onStartup.addListener(() => {
  console.log('Internet Speed Monitor started');
  startMonitoring();
});

// Keep service worker alive
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'ping') {
    sendResponse({ status: 'alive' });
  }
  return true;
});

// Initialize on load
startMonitoring();