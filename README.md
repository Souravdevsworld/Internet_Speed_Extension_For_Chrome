A Chrome extension that continuously monitors and displays real-time internet speed.


*Installation Instructions:

Download all 5 files to a folder named internet-speed-extension
Open Chrome and go to chrome://extensions/
Enable Developer mode (toggle in top-right)
Click Load unpacked
Select the internet-speed-extension folder
Click the extension icon to see your real-time speed!



*How It Works : 

Background Worker: Fetches 250KB from Cloudflare every second, calculates Mbps, saves to chrome.storage
Popup: Reads from storage every second and updates the display
Cache Busting: Adds timestamp to prevent cached results
Keep Alive: Pings background worker to prevent it from sleeping



The extension works completely standalone - no website required, just click the icon anytime to see your current internet speed! 
