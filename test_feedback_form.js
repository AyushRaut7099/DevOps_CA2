// test_feedback_form.js
// Selenium Test Cases for Student Feedback Registration Form
// Using Node.js + selenium-webdriver + mocha

const { Builder, By, until, Select } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const assert = require("assert");
const path = require("path");

// -------------------------------------------------------
// IMPORTANT: Update this path to your index.html location
// -------------------------------------------------------
const FORM_URL =
  "file:///" + path.resolve(__dirname, "index.html").replace(/\\/g, "/");

let driver;

// Helper: sleep for ms milliseconds
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Helper: clear and fill an input field
async function fillField(id, value) {
  const el = await driver.findElement(By.id(id));
  await el.clear();
  await el.sendKeys(value);
}

// ============================================================
// SETUP & TEARDOWN
// ============================================================

before(async function () {
  this.timeout(30000);

  const options = new chrome.Options();
  options.addArguments("--no-sandbox");
  options.addArguments("--disable-dev-shm-usage");
  // Uncomment below for headless mode (required for Jenkins)
  options.addArguments("--headless=new");

  driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();
});

after(async function () {
  await driver.quit();
  console.log("\nAll test cases executed. Browser closed.");
});

// Open form before each test
beforeEach(async function () {
  await driver.get(FORM_URL);
  await sleep(800);
});

// ============================================================
// TEST CASES
// ============================================================

describe("Student Feedback Form - Selenium Tests", function () {
  this.timeout(20000);

  // ----------------------------------------------------------
  // TC1: Check whether the form page opens successfully
  // ----------------------------------------------------------
  it("TC1: Form page opens successfully", async function () {
    const title = await driver.getTitle();
    assert.ok(title.includes("Feedback"), "Page title does not contain 'Feedback'");

    const heading = await driver.findElement(By.className("form-title"));
    const headingText = await heading.getText();
    assert.ok(headingText.includes("Feedback"), "Heading does not contain 'Feedback'");

    console.log("TC1 PASSED: Form page opened successfully.");
  });

  // ----------------------------------------------------------
  // TC2: Enter valid data and verify successful submission
  // ----------------------------------------------------------
  it("TC2: Valid data submits successfully", async function () {
    await fillField("studentName", "Rahul Sharma");
    await fillField("emailId", "rahul.sharma@example.com");
    await fillField("mobileNum", "9876543210");

    // Select department
    const deptEl = await driver.findElement(By.id("department"));
    const deptSelect = new Select(deptEl);
    await deptSelect.selectByValue("CSE");

    // Select gender
    const maleRadio = await driver.findElement(
      By.xpath("//input[@name='gender'][@value='Male']")
    );
    await maleRadio.click();

    // Fill feedback
    await fillField(
      "feedback",
      "The teaching quality has been excellent and the faculty is very supportive and helpful."
    );

    // Submit
    await driver.findElement(By.id("submitBtn")).click();
    await sleep(1000);

    const successBox = await driver.findElement(By.id("successMsg"));
    const isVisible = await successBox.isDisplayed();
    assert.strictEqual(isVisible, true, "Success message not shown for valid data.");

    console.log("TC2 PASSED: Valid data submitted successfully.");
  });

  // ----------------------------------------------------------
  // TC3: Leave mandatory fields blank and check error messages
  // ----------------------------------------------------------
  it("TC3: Blank mandatory fields show error messages", async function () {
    await driver.findElement(By.id("submitBtn")).click();
    await sleep(800);

    const errors = ["nameError", "emailError", "deptError", "genderError", "feedbackError"];

    for (const errId of errors) {
      const errEl = await driver.findElement(By.id(errId));
      const visible = await errEl.isDisplayed();
      assert.ok(visible, `Error "${errId}" was not displayed.`);
    }

    console.log("TC3 PASSED: Error messages shown for blank mandatory fields.");
  });

  // ----------------------------------------------------------
  // TC4: Enter invalid email format and verify validation
  // ----------------------------------------------------------
  it("TC4: Invalid email format is detected", async function () {
    await fillField("studentName", "Test User");
    await fillField("emailId", "invalidemail@");
    await fillField("mobileNum", "9876543210");

    const deptEl = await driver.findElement(By.id("department"));
    await new Select(deptEl).selectByValue("IT");

    await driver.findElement(
      By.xpath("//input[@name='gender'][@value='Female']")
    ).click();

    await fillField(
      "feedback",
      "This is a feedback with more than ten words to satisfy the minimum requirement here."
    );

    await driver.findElement(By.id("submitBtn")).click();
    await sleep(800);

    const emailError = await driver.findElement(By.id("emailError"));
    assert.ok(await emailError.isDisplayed(), "Email error not shown for invalid format.");

    console.log("TC4 PASSED: Invalid email format detected correctly.");
  });

  // ----------------------------------------------------------
  // TC5: Enter invalid mobile number and verify validation
  // ----------------------------------------------------------
  it("TC5: Invalid mobile number is detected", async function () {
    await fillField("studentName", "Test User");
    await fillField("emailId", "test@valid.com");
    await fillField("mobileNum", "12345abc"); // Invalid

    const deptEl = await driver.findElement(By.id("department"));
    await new Select(deptEl).selectByValue("ME");

    await driver.findElement(
      By.xpath("//input[@name='gender'][@value='Male']")
    ).click();

    await fillField(
      "feedback",
      "Feedback with enough words to pass the minimum word count validation check easily."
    );

    await driver.findElement(By.id("submitBtn")).click();
    await sleep(800);

    const mobileError = await driver.findElement(By.id("mobileError"));
    assert.ok(await mobileError.isDisplayed(), "Mobile error not shown for invalid number.");

    console.log("TC5 PASSED: Invalid mobile number detected correctly.");
  });

  // ----------------------------------------------------------
  // TC6: Check whether dropdown selection works properly
  // ----------------------------------------------------------
  it("TC6: Dropdown selection works correctly", async function () {
    const deptEl = await driver.findElement(By.id("department"));
    const deptSelect = new Select(deptEl);
    await deptSelect.selectByValue("ECE");
    await sleep(500);

    const selectedOption = await deptSelect.getFirstSelectedOption();
    const selectedValue = await selectedOption.getAttribute("value");
    assert.strictEqual(selectedValue, "ECE", "Dropdown did not select ECE.");

    console.log("TC6 PASSED: Dropdown selection works correctly.");
  });

  // ----------------------------------------------------------
  // TC7: Check whether Submit and Reset buttons work correctly
  // ----------------------------------------------------------
  it("TC7: Reset button clears all fields", async function () {
    await fillField("studentName", "Anjali Verma");
    await fillField("emailId", "anjali@test.com");

    await driver.findElement(By.id("resetBtn")).click();
    await sleep(500);

    const nameVal = await driver
      .findElement(By.id("studentName"))
      .getAttribute("value");
    const emailVal = await driver
      .findElement(By.id("emailId"))
      .getAttribute("value");

    assert.strictEqual(nameVal, "", "Name field not cleared after reset.");
    assert.strictEqual(emailVal, "", "Email field not cleared after reset.");

    console.log("TC7 PASSED: Reset button works correctly.");
  });
});
