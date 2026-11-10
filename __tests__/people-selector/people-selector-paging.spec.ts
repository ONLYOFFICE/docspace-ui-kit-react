import { expect, test } from "@playwright/test";

// Title: "Components/Selectors/PeopleSelector" -> "components-selectors-peopleselector"
const STORY = "components-selectors-peopleselector--large-room";

// The demo room DEMO_LARGE_ROOM_ID answers `people/room/{id}` with 327 people,
// 100 a page: { count: 100, total: 327 } for the first one, as nct2 did.
const PAGE_SIZE = 100;

test.describe("PeopleSelector paging", () => {
  test("loads the people past the first page of 100", async ({ page }) => {
    await page.goto(`/iframe.html?id=${STORY}&viewMode=story`);
    await expect(page.locator("body")).not.toHaveClass(/sb-show-errordisplay/);

    const firstRow = page.getByTestId("selector-item-0");
    await expect(firstRow).toBeVisible({ timeout: 30000 });
    await expect(firstRow).toContainText("Member 001");

    // Scroll the virtual list down until the first person of the second page
    // is rendered. With the envelope's `count` read as the total, the list
    // ends at 100 rows and the second page is never asked for.
    const lastOfFirstPage = page.getByTestId(`selector-item-${PAGE_SIZE - 1}`);
    const firstOfSecondPage = page.getByTestId(`selector-item-${PAGE_SIZE}`);
    await firstRow.hover();
    for (let i = 0; i < 60; i += 1) {
      if (await firstOfSecondPage.count()) break;
      await page.mouse.wheel(0, 600);
      await page.waitForTimeout(100);
    }

    // The whole first page was scrolled through: the next row can only come
    // from the second page.
    await expect(lastOfFirstPage).toBeAttached();
    await expect(
      firstOfSecondPage,
      "the selector must load the second page",
    ).toBeAttached();
    await firstOfSecondPage.scrollIntoViewIfNeeded();
    await expect(firstOfSecondPage).toBeVisible();
    await expect(firstOfSecondPage).toContainText("Member 101");
  });
});
