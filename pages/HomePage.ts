import { expect, Locator, Page } from "@playwright/test"

export class HomePage {
    private page: Page;
    private fullNameInputBox: Locator;
    private fullNameError: Locator;
    private passwordInputBox: Locator;
    private registerButton: Locator;
    private dateOfBirth: Locator;
    private country: Locator;
    private gender: Locator;
    private skills: Locator;
    private priorityDropDown: Locator;
    private jobTitleDropDown: Locator;
    private jobTitleDropDownResult: Locator;
    private fileUploadLink: Locator;
    private programmingLangInputBox: Locator;
    private frameworkSelectBox: Locator;
    private planSelectDropDown: Locator;
    private dynamicFruitTable: Locator;
    private dndItem: Locator;
    private dropZone: Locator;
    private hoverMeTooltip: Locator;
    private hoverTooltipButton: Locator;
    private hoverScale: Locator;
    private hoverColor: Locator;
    private boldToggleButton: Locator;
    private notificationSwitch: Locator;


    constructor(page: Page) {
        this.page = page;
        this.fullNameInputBox = page.getByTestId("input-fullname");
        this.fullNameError = page.getByTestId("error-fullname");
        this.passwordInputBox = page.getByTestId("input-password");
        this.dateOfBirth = page.getByTestId("input-dob");
        this.registerButton = page.getByRole("button", { name: "Register" });
        this.country = page.getByTestId("select-country");
        this.gender = page.getByTestId("radio-gender");
        this.skills = page.locator(".checkbox-label")
        this.priorityDropDown = page.getByRole("button", { name: "Choose priority..." });
        this.jobTitleDropDown = page.getByTestId("focus-dropdown-input")
        this.jobTitleDropDownResult = page.getByTestId("focus-dropdown-result");
        this.fileUploadLink = page.getByText("Drag & drop files here or ");
        this.programmingLangInputBox = page.getByTestId("autocomplete-input");
        this.frameworkSelectBox = page.locator(".frameworks-select");
        this.planSelectDropDown = page.getByTestId("disabled-options-select");
        this.dynamicFruitTable = page.locator("table[id='dynamicFruitTable']");
        this.dndItem = page.locator(".dnd-list");
        this.dropZone = page.getByTestId("drop-zone");
        this.hoverMeTooltip = page.getByText("Hover me");
        this.hoverTooltipButton = page.getByRole("button", { name: "Hover for tooltip" });
        this.hoverScale = page.getByTestId("hover-box-2");
        this.hoverColor = page.getByTestId("hover-box-3");
        this.boldToggleButton = page.getByTestId("toggle-bold");
        this.notificationSwitch = page.getByTestId("toggle-notifications");
    }

    async enterFullName(fullName: string) {
        await this.fullNameInputBox.fill(fullName);
    }


    async enterPassword(password: string) {
        await this.passwordInputBox.fill(password);
    }

    async verifyPasswordIsMasked() {
        await expect(this.passwordInputBox).toHaveAttribute("type", "password");
    }

    async verifyFullNameError() {
        await expect(this.fullNameError).toHaveText("Name is required");
    }

    async enterDateOfBirth(dateOfBirth: string) {
        try {
            const [date, month, year]: string[] = dateOfBirth.split("-");
            // const date = dob[0];
            // const month = dob[1];
            // const year = dob[2];
            const formattedDOB = `${year}-${month}-${date}`;
            await this.dateOfBirth.fill(formattedDOB);

        } catch (error) {
            throw new Error(`${error} Enter Date in DD-MM-YYYY format`);
        }
    }

    async enterCountry(country: string) {
        await this.country.scrollIntoViewIfNeeded()
        await this.country.selectOption(country);

    }

    async selectGender(gender: string) {
        await this.gender.getByText(gender).check();

    }

    async selectSkills(skill: string) {
        await this.skills.getByText(skill).check();

    }

    async selectPriority(priority: string) {
        await this.priorityDropDown.click();
        await this.page.getByTestId("custom-dropdown-menu").getByText(priority).click();

    }

    async selectJobTitle(title: string) {
        await this.jobTitleDropDown.click();
        await this.page.getByText(title).click();
        await expect(this.jobTitleDropDownResult.getByText(`Selected: ${title}`)).toBeVisible();

    }

    async uploadFiles(filePaths: string[]) {
        await this.fileUploadLink.getByText("browse").first().setInputFiles(filePaths);
        await expect(this.page.locator(".file-item")).toHaveCount(filePaths.length);

    }

    async enterProgrammingLanguage(language: string) {
        await this.programmingLangInputBox.fill(language);
        const languageList: string[] = (await this.page.getByTestId("autocomplete-list").innerText()).split("\n");
        console.log(languageList);

    }

    async selectFrameworks(frameworks: string[]) {

        await this.frameworkSelectBox.selectOption(frameworks);

    }

    async selectPlan(plan: string) {
        await this.planSelectDropDown.selectOption(plan);

    }

    async verifyDisabledPlans(plan: string) {
        await this.planSelectDropDown.selectOption(plan);
        const selectedPlan = await this.planSelectDropDown.locator('option:checked').innerText();
        expect(selectedPlan).toBe(plan);
        // await this.page.waitForTimeout(5000);
    }

    async getFruitTableData(): Promise<Record<string, string>[]> {
        try {
            const fruitTableData: Record<string, string>[] = [];

            const tblHeaders = await this.dynamicFruitTable.locator("thead tr th").allInnerTexts();

            //console.log(tblHeaders.length);

            const tblRows = this.dynamicFruitTable.locator("tbody tr")

            for (let i = 0; i < await tblRows.count(); i++) {
                const fruitTbl: Record<string, string> = {};
                const cells = tblRows.nth(i).locator("td");
                for (let j = 0; j < await cells.count(); j++) {
                    fruitTbl[tblHeaders[j]] = await cells.nth(j).innerText();
                }
                fruitTableData.push(fruitTbl);
            }
            return fruitTableData;
        } catch (error) {
            throw new Error(`Failed to get Fruit Data: ${error}`);
        }
    }

    async getFruitData(fruit: string, header: string) {
        const fruitData: Record<string, string>[] = await this.getFruitTableData();
        for (const data of fruitData) {
            if (data["FRUIT"] === fruit) {
                console.log(data[header]);
                console.log(data)
            }
        }
    }

    async removeDraggableItems(item: string) {
        const sourceItem = this.dndItem.getByText(item.trim(), { exact: true });
        await expect(sourceItem).toBeVisible();
        const targetItem = this.dropZone;
        await sourceItem.dragTo(targetItem);




    }

    async verifyHoverToolTipButton() {
        await this.hoverTooltipButton.hover();
        await expect(this.page.getByText(`This is a custom tooltip with HTML content!`)).toBeVisible();

        await this.page.waitForTimeout(5000);
    }

    async verifyHoverMeToolTip() {
        await this.hoverMeTooltip.hover();
        await expect(this.page.getByText(`tooltip!`)).toBeVisible();

        await this.page.waitForTimeout(5000);
    }

    async verifyHoverScaleSize() {
        const beforeHover = await this.hoverScale.boundingBox();
        console.log("BEFORE:", beforeHover);
        await this.hoverScale.hover();
        await expect.poll(async () => {
            const box = await this.hoverScale.boundingBox();
            return (
                box!.width > beforeHover!.width &&
                box!.height > beforeHover!.height
            );
        }).toBe(true);
        const afterHover = await this.hoverScale.boundingBox();
        console.log("AFTER:", afterHover);
        await this.page.waitForTimeout(2000);
    }

    async verifyHoverColor() {
        const beforeColor = await this.hoverScale.evaluate(el =>
            getComputedStyle(el).transform);

        console.log("BEFORE COLOR:", beforeColor);
        await this.hoverColor.hover();
        await this.page.waitForTimeout(1000);
        await expect.poll(async () => {
            return await this.hoverColor.evaluate(el =>
                getComputedStyle(el).transform
            )
        }).not.toBe(beforeColor);
        const afterColor = await this.hoverColor.evaluate(el =>
            getComputedStyle(el).transform
        );
        console.log("AFTER COLOR:", afterColor);
        expect(beforeColor).not.toBe(afterColor);
    }

    async clickOnToggleBold() {
        await this.boldToggleButton.click()
        await expect(this.boldToggleButton).toHaveClass(/active/);
    }

    async enableNotifications() {
        await this.notificationSwitch.check();
        await expect(this.page.getByTestId("notif-status")).toHaveText("OFF");
    }
    async clickOnRegisterButton() {
        await this.registerButton.click();

    }
}
