pipeline {
    agent any
    environment {
      project = 'Globe-FrontEnd'
    }
    options {
        disableConcurrentBuilds()
    }
    stages {
    
        stage('run npm Command') {
            steps {
                sh 'npm install'
                sh 'npm rebuild node-sass'
            }
            }
         stage('creating distributions') {
            steps {
                sh 'node --max-old-space-size=5000 node_modules/@angular/cli/bin/ng build --output-hashing all --prod'
             }
          }
        }
    post {
      failure {
            mail to:"jenkinsvms@esteltelecom.com", 
            subject:"BUILD NOTIFICATION - Jenkins_${currentBuild.fullDisplayName} FAILED", 
            body: "Build ID: ${BUILD_ID} \nJOBNAME: ${currentBuild.fullDisplayName} \nBRANCH: ${GIT_BRANCH} \nSTATUS: failed \nJOB_URL: ${BUILD_URL}"
      }
    } 
}