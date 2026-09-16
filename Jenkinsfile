pipeline {
    agent any

    stages {
        stage('Fetch Code') {
            steps {
                // Pulls the latest code from your repository
                checkout scm
            }
        }

        stage('SonarQube Code Analysis') {
            steps {
                script {
                    // 1. Grab the CLI scanner tool you configured in Jenkins settings
                    def scannerHome = tool 'SonarScannerCLI'
                    
                    // 2. Wrap the execution inside your specific SonarQube server environment
                    withSonarQubeEnv('MySonarServer') {
                        sh """
                        ${scannerHome}/bin/sonar-scanner \
                        -Dsonar.projectKey=my-awesome-app \
                        -Dsonar.projectName="My Awesome App" \
                        -Dsonar.sources=. \
                        -Dsonar.exclusions=**/node_modules/**,**/*.test.js
                        """
                    }
                }
            }
        }

        stage("Quality Gate Check") {
            steps {
                // 3. Pause pipeline until SonarQube reports back a 'PASS' or 'FAIL'
                timeout(time: 10, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }
    }
}
