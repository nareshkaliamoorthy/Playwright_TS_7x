import { test as setup, expect } from "../../fixture/ui.fixture"
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const authFile = path.resolve(
    process.cwd(),
    'playwright/.auth/user.json'
);

setup("Authenticate User", async ({ page, loginPage }) => {
    await mkdir(path.dirname(authFile), { recursive: true });
    await loginPage.login("test@playlab.com", "Password123");
    await page.context().storageState({
        path: authFile,
    });

});