import { Page, Locator, ElementHandle } from "@playwright/test";

export class ProductPage {
  public page: Page;
  private cartLink: Locator;
  private buttons: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartLink = page.locator("a.shopping_cart_link");
    this.buttons = page.locator(".inventory_list > .inventory_item button");
  }

  async selectRandomItems(count: number = 3) {
    const allElements = await this.page.$$(
      ".inventory_list > .inventory_item"
    );

    // Filter out invalid elements
    const allButtons: ElementHandle<HTMLElement>[] = allElements.filter(
      (el): el is ElementHandle<HTMLElement> => el.asElement() !== null
    );

    const setCount = new Set<number>();
    while (setCount.size < count) {
      const randomIndex = Math.floor(Math.random() * allButtons.length);
      setCount.add(randomIndex);
    }

    const map = new Map();
    for (const index of setCount) {
      let itemName = await allButtons[index]?.$('.inventory_item_label .inventory_item_name');
      let itemNameText = await itemName?.innerText();
      let itemPrice = await allButtons[index]?.$('.inventory_item_price');
      let itemPriceText = await itemPrice?.innerText();
      map.set(itemNameText, itemPriceText?.replaceAll("$", ""));
      let button = await allButtons[index]?.$('button');
      await button?.click();
    }

    return map;
  }

  async navigateToCart() {
    await this.cartLink.click();
  }
}