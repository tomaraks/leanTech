import { Page, Locator, expect } from "@playwright/test";
import * as data from "../test-data/data.json";

export class LoginPage {
  public page: Page;
  private userName: Locator;
  private passWord: Locator;
  private loginButton: Locator;
  private productPageTitle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.userName = page.getByPlaceholder("Username");
    this.passWord = page.getByPlaceholder("Password");
    this.loginButton = page.locator("#login-button");
    this.productPageTitle = page.locator("span.title");
  }

  async navigate() {
    await this.page.goto(data.url);
  }

  async login(username: string, password: string) {
    await this.userName.fill(username);
    await this.passWord.fill(password);
    await this.loginButton.click();
  }

  async validateLogin() {
    const title = await this.productPageTitle.innerText();
    expect(title).toBe("Products");
  }
}