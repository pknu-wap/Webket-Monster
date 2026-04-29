const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const extensionPath = path.join(__dirname, 'build', 'chrome-mv3-prod');
  
  console.log('Launching browser with extension at:', extensionPath);
  
  const browser = await puppeteer.launch({
    headless: false, // show the browser
    args: [
      `--disable-extensions-except=${extensionPath}`,
      `--load-extension=${extensionPath}`,
      '--window-size=1280,800'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  
  console.log('Navigating to PKNU main page...');
  await page.goto('https://www.pknu.ac.kr/main', { waitUntil: 'networkidle0' });
  
  console.log('Page loaded. The monster should appear now.');
  
  // Wait for the monster to be injected
  await new Promise(r => setTimeout(r, 2000));
  
  console.log('You should see the monster wandering around. Leaving browser open for 15 seconds...');
  
  await new Promise(r => setTimeout(r, 15000));
  
  console.log('Closing browser...');
  await browser.close();
})();
