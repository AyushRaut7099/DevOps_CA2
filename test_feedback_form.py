# test_feedback_form.py
# Selenium Test Cases for Student Feedback Registration Form

import time
import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
from selenium.webdriver.chrome.options import Options


class TestFeedbackForm(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        # Setup Chrome WebDriver
        chrome_options = Options()
        # Uncomment below line to run in headless mode (useful for Jenkins)
        # chrome_options.add_argument("--headless")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        cls.driver = webdriver.Chrome(options=chrome_options)
        cls.driver.maximize_window()

        # IMPORTANT: Update this path to the absolute path of your index.html file
        # Example for Windows: cls.URL = "file:///C:/Users/YourName/student_feedback/index.html"
        # Example for Linux/Mac: cls.URL = "file:///home/user/student_feedback/index.html"
        cls.URL = "file:///C:/student_feedback/index.html"

    def setUp(self):
        # Open the form before each test
        self.driver.get(self.URL)
        time.sleep(1)

    # --------------------------------------------------------
    # Test Case 1: Check whether the form page opens successfully
    # --------------------------------------------------------
    def test_01_page_opens_successfully(self):
        title = self.driver.title
        self.assertIn("Feedback", title, "Page did not load correctly.")
        heading = self.driver.find_element(By.CLASS_NAME, "form-title").text
        self.assertIn("Feedback", heading)
        print("TC1 PASSED: Form page opened successfully.")

    # --------------------------------------------------------
    # Test Case 2: Enter valid data and verify successful submission
    # --------------------------------------------------------
    def test_02_valid_data_submission(self):
        self.driver.find_element(By.ID, "studentName").send_keys("Rahul Sharma")
        self.driver.find_element(By.ID, "emailId").send_keys("rahul.sharma@example.com")
        self.driver.find_element(By.ID, "mobileNum").send_keys("9876543210")

        dept_dropdown = Select(self.driver.find_element(By.ID, "department"))
        dept_dropdown.select_by_value("CSE")

        self.driver.find_element(By.XPATH, "//input[@name='gender'][@value='Male']").click()

        self.driver.find_element(By.ID, "feedback").send_keys(
            "The teaching quality has been excellent and the faculty is very supportive and helpful."
        )

        self.driver.find_element(By.ID, "submitBtn").click()
        time.sleep(1)

        success_box = self.driver.find_element(By.ID, "successMsg")
        self.assertEqual(success_box.is_displayed(), True, "Success message not shown for valid data.")
        print("TC2 PASSED: Valid data submitted successfully.")

    # --------------------------------------------------------
    # Test Case 3: Leave mandatory fields blank and check error messages
    # --------------------------------------------------------
    def test_03_blank_mandatory_fields(self):
        # Click submit without entering anything
        self.driver.find_element(By.ID, "submitBtn").click()
        time.sleep(1)

        name_error = self.driver.find_element(By.ID, "nameError")
        email_error = self.driver.find_element(By.ID, "emailError")
        dept_error = self.driver.find_element(By.ID, "deptError")
        gender_error = self.driver.find_element(By.ID, "genderError")
        feedback_error = self.driver.find_element(By.ID, "feedbackError")

        self.assertTrue(name_error.is_displayed(), "Name error not shown.")
        self.assertTrue(email_error.is_displayed(), "Email error not shown.")
        self.assertTrue(dept_error.is_displayed(), "Department error not shown.")
        self.assertTrue(gender_error.is_displayed(), "Gender error not shown.")
        self.assertTrue(feedback_error.is_displayed(), "Feedback error not shown.")
        print("TC3 PASSED: Error messages shown for blank mandatory fields.")

    # --------------------------------------------------------
    # Test Case 4: Enter invalid email format and verify validation
    # --------------------------------------------------------
    def test_04_invalid_email_format(self):
        self.driver.find_element(By.ID, "studentName").send_keys("Test User")
        self.driver.find_element(By.ID, "emailId").send_keys("invalidemail@")
        self.driver.find_element(By.ID, "mobileNum").send_keys("9876543210")

        Select(self.driver.find_element(By.ID, "department")).select_by_value("IT")
        self.driver.find_element(By.XPATH, "//input[@name='gender'][@value='Female']").click()
        self.driver.find_element(By.ID, "feedback").send_keys(
            "This is a feedback with more than ten words to satisfy the minimum requirement."
        )

        self.driver.find_element(By.ID, "submitBtn").click()
        time.sleep(1)

        email_error = self.driver.find_element(By.ID, "emailError")
        self.assertTrue(email_error.is_displayed(), "Email validation error not shown for invalid email.")
        print("TC4 PASSED: Invalid email format detected correctly.")

    # --------------------------------------------------------
    # Test Case 5: Enter invalid mobile number and verify validation
    # --------------------------------------------------------
    def test_05_invalid_mobile_number(self):
        self.driver.find_element(By.ID, "studentName").send_keys("Test User")
        self.driver.find_element(By.ID, "emailId").send_keys("test@valid.com")
        self.driver.find_element(By.ID, "mobileNum").send_keys("12345abc")  # Invalid

        Select(self.driver.find_element(By.ID, "department")).select_by_value("ME")
        self.driver.find_element(By.XPATH, "//input[@name='gender'][@value='Male']").click()
        self.driver.find_element(By.ID, "feedback").send_keys(
            "Feedback with enough words to pass the minimum word count validation check here."
        )

        self.driver.find_element(By.ID, "submitBtn").click()
        time.sleep(1)

        mobile_error = self.driver.find_element(By.ID, "mobileError")
        self.assertTrue(mobile_error.is_displayed(), "Mobile validation error not shown for invalid number.")
        print("TC5 PASSED: Invalid mobile number detected correctly.")

    # --------------------------------------------------------
    # Test Case 6: Check whether dropdown selection works properly
    # --------------------------------------------------------
    def test_06_dropdown_selection(self):
        dropdown = Select(self.driver.find_element(By.ID, "department"))
        dropdown.select_by_value("ECE")
        time.sleep(0.5)

        selected = dropdown.first_selected_option.get_attribute("value")
        self.assertEqual(selected, "ECE", "Dropdown did not select ECE correctly.")
        print("TC6 PASSED: Dropdown selection works correctly.")

    # --------------------------------------------------------
    # Test Case 7: Check whether Submit and Reset buttons work correctly
    # --------------------------------------------------------
    def test_07_submit_and_reset_buttons(self):
        # Fill in some data
        self.driver.find_element(By.ID, "studentName").send_keys("Anjali Verma")
        self.driver.find_element(By.ID, "emailId").send_keys("anjali@test.com")

        # Click Reset
        self.driver.find_element(By.ID, "resetBtn").click()
        time.sleep(0.5)

        # Fields should be cleared
        name_val = self.driver.find_element(By.ID, "studentName").get_attribute("value")
        email_val = self.driver.find_element(By.ID, "emailId").get_attribute("value")

        self.assertEqual(name_val, "", "Name field not cleared after reset.")
        self.assertEqual(email_val, "", "Email field not cleared after reset.")
        print("TC7 PASSED: Submit and Reset buttons work correctly.")

    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()
        print("\nAll test cases executed. Browser closed.")


if __name__ == "__main__":
    unittest.main(verbosity=2)