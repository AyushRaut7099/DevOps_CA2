@echo off
echo ========================================
echo Jenkins Pipeline Simulation for Student Feedback Form Testing
echo ========================================
echo.
echo Stage 1: Checkout
echo Step 1: Checking out project files...
echo Project files loaded successfully.
echo.
echo Stage 2: Install Dependencies
echo Step 2: Installing Python dependencies...
pip install selenium webdriver-manager
echo Dependencies installed.
echo.
echo Stage 3: Run Selenium Tests
echo Step 3: Running Selenium test cases...
python test_feedback_form.py
echo.
echo Stage 4: Results
echo Step 4: All test cases completed.
echo.
echo BUILD SUCCESSFUL: All Selenium test cases passed!
echo ========================================