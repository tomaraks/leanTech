import { Page, Locator, expect, ElementHandle } from "@playwright/test";

export class CheckoutPage {
  public page: Page;
  private firstName: Locator;
  private lastName: Locator;
  private zipCode: Locator;
  private continueButton: Locator;
  private finishButton: Locator;
  private header: Locator;
  private completeText: Locator;
  private backHomeButton: Locator;
  private checkoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstName = page.getByPlaceholder("First Name");
    this.lastName = page.getByPlaceholder("Last Name");
    this.zipCode = page.getByPlaceholder("Zip/Postal Code");
    this.continueButton = page.locator("#continue");
    this.finishButton = page.locator("#finish");
    this.header = page.locator("h2.complete-header");
    this.completeText = page.locator("div.complete-text");
    this.backHomeButton = page.locator("#back-to-products");
    this.checkoutButton = page.locator("#checkout");
  }

  async fillCheckoutForm(firstName: string, lastName: string, zipCode: string) {
    await this.firstName.fill(firstName);
    await this.lastName.fill(lastName);
    await this.zipCode.fill(zipCode);
    await this.continueButton.click();
  }

  async finishCheckout() {
    await this.finishButton.click();
    const headerText = await this.header.innerText();
    expect(headerText).toBe("Thank you for your order!");

    const completeText = await this.completeText.innerText();
    expect(completeText).toBe(
      "Your order has been dispatched, and will arrive just as fast as the pony can get there!"
    );
  }

  async backToProducts() {
    await this.backHomeButton.click();
  }

  async clickOnCheckoutButton() {
    await this.checkoutButton.click();
  }

  async fetchTheCheckoutItems() {
     const allElements = await this.page.$$(
          ".cart_list > .cart_item"
        );
    
        // Filter out invalid elements
        const allItems: ElementHandle<HTMLElement>[] = allElements.filter(
          (el): el is ElementHandle<HTMLElement> => el.asElement() !== null
        );

        const map = new Map();
        allItems.forEach(async(checkItems) => {
            let name = await checkItems.$('.inventory_item_name');
            let nameText = await name?.innerText();
            let price = await checkItems.$('.inventory_item_price');
            let priceText = await price?.innerText();
            map.set(nameText, priceText?.replaceAll("$", ""));
        })

        return map;
  }
}