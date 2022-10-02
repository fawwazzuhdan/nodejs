pipeline {
    agent any
    
    tools {nodejs "nodejs"}
    
    stages {
        
        stage('Git') {
            steps {
                git 'https://github.com/fawwazzuhdan/nodejs.git'
            }
        }
            
        stage('Build') {
            steps {
                sh 'npm install'
                sh 'pwd'
                echo 'npm install done'
            }
        }  

                
        // stage('Test') {
        //     steps {
        //         sh 'npm test'
        //         echo 'test done'
        //     }
        // }
    }
}