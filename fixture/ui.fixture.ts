import { test as base, expect } from "@playwright/test"
import { LoginPage } from "../pages/LoginPage"
import { HomePage } from "../pages/HomePage";


type UIFixture = {
    loginPage: LoginPage;
    homePage: HomePage;
}

const test = base.extend<UIFixture>({
    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await use(loginPage);
    },
    homePage: async ({ page }, use) => {
        const homePage = new HomePage(page);
        await use(homePage);
    }
})

export { test, expect }