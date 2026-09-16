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
                    def scannerHome = tool 'sonar-scanner'
                    
                    // 2. Wrap the execution inside your specific SonarQube server environment
                    withSonarQubeEnv('SonarQubeServer') {
                        sh """
                        ${scannerHome}/bin/sonar-scanner \
                        -Dsonar.projectKey=horizon-demo-angular \
                        -Dsonar.projectName="horizon-demo-angular" \
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
