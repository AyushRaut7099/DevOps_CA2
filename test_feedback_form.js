// test_feedback_form.js
// Selenium Test Cases for Student Feedback Registration Form
// Run with: node test_feedback_form.js

const { Builder, By, Select } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const path = require("path");

// -------------------------------------------------------
// Auto-setup ChromeDriver using npm chromedriver package
// -------------------------------------------------------
const chromedriver = require("chromedriver");

// Path to chromedriver binary installed via npm
const chromedriverPath = chromedriver.path;

// -------------------------------------------------------
// IMPORTANT: Update this path to point to your index.html
// -------------------------------------------------------
const FORM_URL =
  "file:///" + path.resolve(__dirname, "index.html").replace(/\\/g, "/");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fillField(driver, id, value) {
  const el = await driver.findElement(By.id(id));
  await el.clear();
  await el.sendKeys(value);
}

// ============================================================
// TEST RUNNER
// ============================================================
async function runTests() {
  let passed = 0;
  let failed = 0;

  // Chrome Options
  const options = new chrome.Options();
  options.addArguments("--no-sandbox");
  options.addArguments("--disable-dev-shm-usage");
  options.addArguments("--headless=new"); // Remove this line to see the browser window

  // FIX: use chrome.ServiceBuilder (not imported ServiceBuilder)
  const service = new chrome.ServiceBuilder(chromedriverPath);

  const driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .setChromeService(service)
    .build();

  async function openForm() {
    await driver.get(FORM_URL);
    await sleep(800);
  }

  async function runTest(name, fn) {
    try {
      await openForm();
      await fn(driver);
      console.log(`  PASSED: ${name}`);
      passed++;
    } catch (err) {
      console.log(`  FAILED: ${name}`);
      console.log(`     Reason: ${err.message}`);
      failed++;
    }
  }

  console.log("\n========================================");
  console.log("  Student Feedback Form - Selenium Tests");
  console.log("========================================\n");

  // ----------------------------------------------------------
  // TC1: Form page opens successfully
  // ----------------------------------------------------------
  await runTest("TC1: Form page opens successfully", async (driver) => {
    const title = await driver.getTitle();
    if (!title.includes("Feedback"))
      throw new Error("Page title missing 'Feedback'");

    const heading = await driver.findElement(By.className("form-title"));
    const text = await heading.getText();
    if (!text.includes("Feedback"))
      throw new Error("Heading missing 'Feedback'");
  });

  // ----------------------------------------------------------
  // TC2: Valid data submits successfully
  // ----------------------------------------------------------
  await runTest("TC2: Valid data submits successfully", async (driver) => {
    await fillField(driver, "studentName", "Rahul Sharma");
    await fillField(driver, "emailId", "rahul.sharma@example.com");
    await fillField(driver, "mobileNum", "9876543210");

    const deptEl = await driver.findElement(By.id("department"));
    await new Select(deptEl).selectByValue("CSE");

    await driver
      .findElement(By.xpath("//input[@name='gender'][@value='Male']"))
      .click();

    await fillField(
      driver,
      "feedback",
      "The teaching quality has been excellent and the faculty is very supportive and helpful."
    );

    await driver.findElement(By.id("submitBtn")).click();
    await sleep(1000);

    const successBox = await driver.findElement(By.id("successMsg"));
    if (!(await successBox.isDisplayed()))
      throw new Error("Success message not shown for valid data.");
  });

  // ----------------------------------------------------------
  // TC3: Blank mandatory fields show error messages
  // ----------------------------------------------------------
  await runTest(
    "TC3: Blank mandatory fields show error messages",
    async (driver) => {
      await driver.findElement(By.id("submitBtn")).click();
      await sleep(800);

      const errorIds = [
        "nameError",
        "emailError",
        "deptError",
        "genderError",
        "feedbackError",
      ];
      for (const id of errorIds) {
        const el = await driver.findElement(By.id(id));
        if (!(await el.isDisplayed()))
          throw new Error(`Error "${id}" not displayed`);
      }
    }
  );

  // ----------------------------------------------------------
  // TC4: Invalid email format is detected
  // ----------------------------------------------------------
  await runTest("TC4: Invalid email format is detected", async (driver) => {
    await fillField(driver, "studentName", "Test User");
    await fillField(driver, "emailId", "invalidemail@");
    await fillField(driver, "mobileNum", "9876543210");

    await new Select(
      await driver.findElement(By.id("department"))
    ).selectByValue("IT");

    await driver
      .findElement(By.xpath("//input[@name='gender'][@value='Female']"))
      .click();

    await fillField(
      driver,
      "feedback",
      "This is a feedback with more than ten words to satisfy the minimum requirement here."
    );

    await driver.findElement(By.id("submitBtn")).click();
    await sleep(800);

    const el = await driver.findElement(By.id("emailError"));
    if (!(await el.isDisplayed()))
      throw new Error("Email error not shown for invalid format.");
  });

  // ----------------------------------------------------------
  // TC5: Invalid mobile number is detected
  // ----------------------------------------------------------
  await runTest("TC5: Invalid mobile number is detected", async (driver) => {
    await fillField(driver, "studentName", "Test User");
    await fillField(driver, "emailId", "test@valid.com");
    await fillField(driver, "mobileNum", "12345abc");

    await new Select(
      await driver.findElement(By.id("department"))
    ).selectByValue("ME");

    await driver
      .findElement(By.xpath("//input[@name='gender'][@value='Male']"))
      .click();

    await fillField(
      driver,
      "feedback",
      "Feedback with enough words to pass the minimum word count validation check easily."
    );

    await driver.findElement(By.id("submitBtn")).click();
    await sleep(800);

    const el = await driver.findElement(By.id("mobileError"));
    if (!(await el.isDisplayed()))
      throw new Error("Mobile error not shown for invalid number.");
  });

  // ----------------------------------------------------------
  // TC6: Dropdown selection works correctly
  // ----------------------------------------------------------
  await runTest("TC6: Dropdown selection works correctly", async (driver) => {
    const deptEl = await driver.findElement(By.id("department"));
    const deptSelect = new Select(deptEl);
    await deptSelect.selectByValue("ECE");
    await sleep(500);

    const selected = await deptSelect.getFirstSelectedOption();
    const val = await selected.getAttribute("value");
    if (val !== "ECE") throw new Error(`Expected ECE but got ${val}`);
  });

  // ----------------------------------------------------------
  // TC7: Reset button clears all fields
  // ----------------------------------------------------------
  await runTest("TC7: Reset button clears all fields", async (driver) => {
    await fillField(driver, "studentName", "Anjali Verma");
    await fillField(driver, "emailId", "anjali@test.com");

    await driver.findElement(By.id("resetBtn")).click();
    await sleep(500);

    const nameVal = await driver
      .findElement(By.id("studentName"))
      .getAttribute("value");
    const emailVal = await driver
      .findElement(By.id("emailId"))
      .getAttribute("value");

    if (nameVal !== "") throw new Error("Name field not cleared after reset.");
    if (emailVal !== "") throw new Error("Email field not cleared after reset.");
  });

  // ----------------------------------------------------------
  // SUMMARY
  // ----------------------------------------------------------
  await driver.quit();

  console.log("\n========================================");
  console.log(`  RESULTS: ${passed} passed, ${failed} failed`);
  console.log("========================================\n");

  if (failed > 0) process.exit(1);
}

runTests().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});