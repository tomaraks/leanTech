import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { CheckoutPage } from "../pages/CheckoutPage";
import { ProductPage } from "../pages/ProductPage";
import * as data from "../test-data/data.json";
import { compareMaps } from "../utils/utils";

test.describe("E2E Flow", () => {
  let loginPage: LoginPage;
  let productPage: ProductPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productPage = new ProductPage(page);
    checkoutPage = new CheckoutPage(page);

    await loginPage.navigate();
    await loginPage.login(data.userName, data.passWord);
    await loginPage.validateLogin();
  });

  test("Select three random items and checkout", async () => {
    let randomItems = await productPage.selectRandomItems(3);
    await productPage.navigateToCart();

    const productPageTitle = await productPage.page
      .locator("span.title")
      .innerText();
    expect(productPageTitle).toBe("Your Cart");
    await checkoutPage.clickOnCheckoutButton();
    let checkoutItems = await checkoutPage.fetchTheCheckoutItems();

    // compare if selected items are same as checkout items
    compareMaps(randomItems, checkoutItems);
    await checkoutPage.fillCheckoutForm(
      data.firstName,
      data.lastName,
      data.zip
    );

    let checkoutFinalItems = await checkoutPage.fetchTheCheckoutItems();

    // compare if selected items are same as checkout final page items
    compareMaps(randomItems, checkoutFinalItems);
    await checkoutPage.finishCheckout();
    await checkoutPage.backToProducts();

    const productPageTitleAfter = await productPage.page
      .locator("span.title")
      .innerText();
    expect(productPageTitleAfter).toBe("Products");
  });
});