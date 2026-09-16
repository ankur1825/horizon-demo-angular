pipeline {
    agent any
    stages {
        stage('SonarQube Analysis') {
            steps {
                script {
                    // Must match the tool name defined in Phase 2, Step 4
                    def scannerHome = tool 'sonar-scanner' 
                    
                    withSonarQubeEnv('SonarQubeServer') {
                        sh "${scannerHome}/bin/sonar-scanner \
                        -Dsonar.projectKey=horizon-demo-angular \
                        -Dsonar.sources=."
                    }
                }
            }
        }
    }
}
