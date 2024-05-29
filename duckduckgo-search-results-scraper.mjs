import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized'] 
  });

  const page = await browser.newPage();

  await page.goto('https://duckduckgo.com/');

  await page.type('input[name="q"]', 'puppeteer tutorials');
  await page.keyboard.press('Enter');

  await page.waitForSelector('h2'); // Waiting for the search results to load

  // Function to scroll and load more results
  const scrollAndLoadMore = async (page, scrollCount, scrollDelay) => {
    for (let i = 0; i < scrollCount; i++) {
      await page.evaluate(() => {
        window.scrollBy(0, window.innerHeight);
      });
      await new Promise(resolve => setTimeout(resolve, scrollDelay));    }
  };

  // Scrolling Down and loading more results
  await scrollAndLoadMore(page, 5, 2000);

  // Extracting titles and URLs from Google search results
  const results = await page.evaluate(() => {
    const items = document.querySelectorAll('div.ikg2IXiCD14iVX7AdZo1');   // Main div
    return Array.from(items).map(item => {
      const titleElement = item.querySelector('h2');  // Search title
      const linkElement = item.querySelector('a[href]');  // Site link
      const title = titleElement ? titleElement.textContent : 'No title';
      const link = linkElement ? linkElement.href : 'No link';
      return { title, link };
    });
  });

  // Logging titles and URLs in the console
  results.forEach(result => {
    console.log(`Title: ${result.title}`);
    console.log(`Link: ${result.link}`);
    console.log('-*-'.repeat(10));
  });

  await browser.close();
})();
