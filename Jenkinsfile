// Hàm để build, test, và deploy một microservice
def buildAndDeployService(serviceName, dockerhubUsername) {
    stage("Checkout: ${serviceName}") {
        dir(serviceName) {
            sh "pwd && ls -la"
        }
    }

    stage("Code Quality: ${serviceName}") {
        // Chạy SonarQube analysis
        withSonarQubeEnv('SonarQube') {
            dir(serviceName) {
                // Tạo file sonar-project.properties động
                writeFile file: 'sonar-project.properties', text: """
                    sonar.projectKey=${serviceName}
                    sonar.projectName=${serviceName}
                    sonar.projectVersion=1.0.${env.BUILD_NUMBER}
                    sonar.sources=.
                    sonar.javascript.lcov.reportPaths=coverage/lcov.info
                """
                sh "${tool('SonarScanner')}/bin/sonar-scanner"
            }
        }
    }

    stage("Quality Gate: ${serviceName}") {
        // Chờ kết quả phân tích từ SonarQube
        // Timeout sau 2 phút, nếu không đạt Quality Gate sẽ fail
        timeout(time: 2, unit: 'MINUTES') {
            waitForQualityGate abortPipeline: true
        }
    }

    stage("Build & Push Docker Image: ${serviceName}") {
        dir(serviceName) {
            script {
                def imageName = "${dockerhubUsername}/${serviceName}"
                def imageTag = "latest" // hoặc "1.0.${env.BUILD_NUMBER}"
                def customImage = docker.build(imageName, ".")

                // Đăng nhập và đẩy image lên Docker Hub
                docker.withRegistry('https://registry.hub.docker.com', 'dockerhub-credentials') {
                    customImage.push(imageTag)
                }
            }
        }
    }
}

pipeline {
    agent any

    environment {
        DOCKERHUB_USERNAME = 'lamlambbt123' // THAY THẾ BẰNG USERNAME CỦA BẠN
    }

    stages {
        stage('Build User Service') {
            steps {
                script {
                    buildAndDeployService('user-service', env.DOCKERHUB_USERNAME)
                }
            }
        }

        stage('Build Greeting Service') {
            steps {
                script {
                    buildAndDeployService('greeting-service', env.DOCKERHUB_USERNAME)
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                
                withCredentials([file(credentialsId: 'kubeconfig-text', variable: 'KUBECONFIG_PATH')]) {
                    sh """
                        export KUBECONFIG=${KUBECONFIG_PATH}

                        echo "Updating deployment file with DockerHub username: ${env.DOCKERHUB_USERNAME}"
                        sed -i 's|<DOCKERHUB_USERNAME>|${env.DOCKERHUB_USERNAME}|g' k8s-deployment.yaml

                        echo "Applying K8s manifests..."
                        kubectl apply -f k8s-deployment.yaml
                        kubectl apply -f k8s-service.yaml

                        echo "Waiting for deployments to roll out..."
                        kubectl rollout status deployment/user-service-deployment
                        kubectl rollout status deployment/greeting-service-deployment

                        echo "Deployment successful!"
                    """
                }
            }
        }
    }

    post {
        always {
            echo 'Pipeline finished.'
            // Clean up workspace
            cleanWs()
        }
    }
}