pipeline {
    agent any
    
    tools {nodejs "nodejs"}
    
    stages {
        
        // stage('Git') {
        //     steps {
        //         git 'https://github.com/fawwazzuhdan/nodejs.git'
        //     }
        // }
            
        stage('Build') {
            steps {
                script {
                    sh 'npm install'
                    echo 'npm install done'
                    app = docker.build("fawwazzuhdan/nodejs")
                    docker.WithRegistry("https://registry.hub.docker.com", "docker-hub") {
                        app.push("latest")
                    }
                    // sh 'docker build -t fawwazzuhdan/nodejs:latest .'
                }
            }
        }

        // stage('Login') {
        //     steps {
        //         sh 'echo $env.PASS_DOCKER | docker login -u $env.USER_DOCKER --password-stdin'
        //     }
        // }

        // stage('Push') {
        //     steps {
        //         sh 'docker push fawwazzuhdan/nodejs:latest'
        //     }
        // }

        // stage('Kubernetes') {
        //     steps{
        //         withKubeConfig([]) {

        //         }
        //     }
        //     sh 'kubectl apply -f kube'
        // }
    }
}