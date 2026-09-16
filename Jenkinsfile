pipeline {
    agent any

    stages {
        stage('SCM') {
            steps {
                // Pulls the source code from the configured repository
                checkout scm
            }
        }
        
        stage('SonarQube Analysis') {
            steps {
                script {
                    // Locates the SonarScanner tool configured in Global Tool Configuration
                    def scannerHome = tool 'sonar-scanner'
                    
                    // Wraps the execution with SonarQube environment details (tokens/URL)
                    withSonarQubeEnv() { 
                        sh "${scannerHome}/bin/sonar-scanner"
                    }
                }
            }
        }
    }
}
