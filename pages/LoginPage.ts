import { expect, Locator, Page } from "@playwright/test"

export class LoginPage {
    private page;
    private email: Locator;
    private password: Locator;
    private signInButton: Locator;
    private dashboardButton: Locator;


    constructor(page: Page) {
        this.page = page;
        this.email = page.getByPlaceholder("you@example.com");
        this.password = page.getByPlaceholder("Enter your password");
        this.signInButton = page.getByRole("button", { name: "Sign In" });
        this.dashboardButton = page.getByTestId("go-to-dashboard");
    }

    async login(username: string, password: string) {
        //await this.page.goto("https://playwrightlab.github.io/login.html");
        await this.page.goto("/login.html");
        await this.email.fill(username);
        await this.password.fill(password)
        await this.signInButton.click();
        await expect(this.page.getByText("Signed in as")).toBeVisible();
    }

    async navigateToDashboard() {
        await this.dashboardButton.click();
        await expect(this.page).toHaveURL("https://playwrightlab.github.io/index.html");

    }

} 
