pipeline {
    agent any
    
    tools {nodejs "nodejs"}

    environment {
		DOCKERHUB_CREDENTIALS=credentials('docker-hub')
	}
    
    stages {
        
        // stage('Git') {
        //     steps {
        //         git 'https://github.com/fawwazzuhdan/nodejs.git'
        //     }
        // }
            
        stage('Build') {
            steps {
                    sh 'npm install'
                    echo 'npm install done'
                    // app = docker.build("fawwazzuhdan/nodejs")
                    // docker.WithRegistry("https://registry.hub.docker.com", "docker-hub") {
                    //     app.push("latest")
                    // }
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

        // stage('Kubernetes') {
        //     steps{
        //         withKubeConfig([]) {

        //         }
        //     }
        //     sh 'kubectl apply -f kube'
        // }
    }
}