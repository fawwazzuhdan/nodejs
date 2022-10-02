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
                echo 'npm install done'
                app = docker.build("fawwazzuhdan/nodejs")
                docker.WithRegistry("https://registry.hub.docker.com", "dockerhub") {
                    app.push("latest")
                }
            }
        }

        stage('Kubernetes') {
            sh 'kubectl apply -f deployment.yaml'
        }
    }
}