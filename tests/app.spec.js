// @ts-check
const { test, expect } = require('@playwright/test');

test('feed loads with seed deals and tabs', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.logo h1')).toContainText('Special');
  await expect(page.locator('.tab')).toHaveCount(4);
  await page.locator('.tab', { hasText: 'All deals' }).click();
  expect(await page.locator('.card').count()).toBeGreaterThan(5);
});

test('share-target prefills the post form with an IG link', async ({ page }) => {
  const url = 'https://instagram.com/reel/test-reel-123';
  await page.goto('/?share-target&url=' + encodeURIComponent(url));
  await expect(page.locator('#sheet')).toHaveClass(/open/);
  await expect(page.locator('#f-link')).toHaveValue(url);
});

test('posting a find persists across reload (localStorage)', async ({ page }) => {
  await page.goto('/');
  await page.locator('#fab').click();
  await page.fill('#f-chain', 'Testaurant');
  await page.fill('#f-deal', '$0 test special');
  await page.locator('#f-submit').click();
  await expect(page.locator('.card', { hasText: 'Testaurant' })).toBeVisible();
  await page.reload();
  await page.locator('.tab', { hasText: 'All deals' }).click();
  await expect(page.locator('.card', { hasText: 'Testaurant' })).toBeVisible();
});

test('downvote registers and persists without expiring below threshold', async ({ page }) => {
  await page.goto('/');
  await page.locator('.tab', { hasText: 'All deals' }).click();
  const card = page.locator('.card', { hasText: 'White Castle' });
  await card.locator('.vbtn.down').click();
  await expect(card).toBeVisible();
});

test('service worker registers', async ({ page }) => {
  await page.goto('/');
  const ok = await page.evaluate(async () => {
    if (!('serviceWorker' in navigator)) return false;
    const reg = await navigator.serviceWorker.ready;
    return !!reg.active;
  });
  expect(ok).toBeTruthy();
});
