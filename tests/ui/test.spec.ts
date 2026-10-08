import { test, expect } from "../../fixture/ui.fixture"
import { LoginPage } from "../../pages/LoginPage";
import { envConfig } from "../../playwright.config";

import fs from "fs";

const env = envConfig.name

const jsonPath = `./test-data/${env}/user.json`;
const loginUserData = JSON.parse(fs.readFileSync(jsonPath, "utf-8"))

test.describe("Login Functionality", () => {
    test("Verify Valid Login", { tag: ["@ui"] }, async ({ loginPage, homePage }) => {
        await loginPage.login("test@playlab.com", "Password123");
        await loginPage.navigateToDashboard();
        //await homePage.enterFullName("Naresh K");
        await homePage.enterPassword("NkNkNK");
        await homePage.verifyPasswordIsMasked();
        await homePage.clickOnRegisterButton();
        await homePage.verifyFullNameError();
        await homePage.enterDateOfBirth("26-10-2026");
        await homePage.enterCountry("India");
        await homePage.selectGender("Female");
        await homePage.selectSkills("Python");
        await homePage.selectPriority("Low");
        await homePage.selectJobTitle("Scrum Master");
        await homePage.uploadFiles(["C:/Users/DELL/Naresh_K/QA/Profiles/Naresh_K_Resume.pdf", "C:/Users/DELL/Naresh_K/QA/Profiles/Naresh_K_AAM-wo_cambAI.pdf"]);
        await homePage.enterProgrammingLanguage("Java");
        await homePage.selectFrameworks(["React", "Angular"]);
        await homePage.selectPlan("Starter — $9/mo");
        await homePage.verifyDisabledPlans("Free");
        await homePage.getFruitData("Banana", "STOCK");
        //await homePage.removeDraggableItems("Write code");
        //await homePage.verifyHoverToolTipButton();
        await homePage.verifyHoverScaleSize();
        await homePage.verifyHoverColor();
        await homePage.clickOnToggleBold();
        //await homePage.enableNotifications();

    });

    for (const user of loginUserData) {
        test(`Login validate-${user.id}`, { tag: ["@parallel"] }, async ({ loginPage }) => {
            await loginPage.login(user.username, user.password)
        })
    }

})