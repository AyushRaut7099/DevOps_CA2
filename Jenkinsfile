// Jenkinsfile
// Jenkins Pipeline to automate Selenium test execution for Student Feedback Form

pipeline {

    agent any

    stages {

        stage('Checkout') {
            steps {
                echo 'Step 1: Checking out project files...'
                // If using GitHub, uncomment and update:
                // git branch: 'main', url: 'https://github.com/your-username/student-feedback-form.git'
                echo 'Project files loaded successfully.'
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Step 2: Installing Python dependencies...'
                bat 'python -m pip install selenium'
                bat 'python -m pip install webdriver-manager'
            }
        }

        stage('Run Selenium Tests') {
            steps {
                echo 'Step 3: Running Selenium test cases...'
                bat 'python test_feedback_form.py'
            }
        }

        stage('Results') {
            steps {
                echo 'Step 4: All test cases completed.'
            }
        }
    }

    post {
        success {
            echo 'BUILD SUCCESSFUL: All Selenium test cases passed!'
        }
        failure {
            echo 'BUILD FAILED: One or more test cases failed. Please check the logs.'
        }
    }
}