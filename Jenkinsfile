pipeline {

    agent any

    stages {

        stage('Checkout') {
            steps {
                echo 'Step 1: Checking out project files...'
                echo 'Project files loaded successfully.'
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Step 2: Installing Node.js dependencies...'
                bat 'npm install'
            }
        }

        stage('Run Selenium Tests') {
            steps {
                echo 'Step 3: Running Selenium test cases with Mocha...'
                bat 'npm test'
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
