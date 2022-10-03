pipeline {
    agent any
    
    tools {nodejs "nodejs"}

    environment {
		DOCKERHUB_CREDENTIALS=credentials('docker-hub')
	}
    
    stages {            
        stage('Build') {
            steps {
                    sh 'npm install'
                    echo 'npm install done'
                    sh 'docker build -t fawwazzuhdan/nodejs:latest .'
            }
        }

        stage('Login') {
            steps {
                sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
            }
        }

        stage('Push') {
            steps {
                sh 'docker push fawwazzuhdan/nodejs:latest'
            }
        }

        stage('Deploy') {
            steps {
                sh 'docker stop app-nodejs || true && docker rm app-nodejs || true'
                sh 'docker run --name=app-nodejs --rm -it -d fawwazzuhdan/nodejs:latest'
            }
        }
    }
}