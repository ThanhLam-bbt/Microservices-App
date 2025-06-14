pipeline {
    agent any

    // Định nghĩa các biến môi trường
    environment {
        DOCKER_IMAGE_NAME = "thanhlam/my-microservice" // THAY THẾ!
        DOCKER_CREDENTIALS_ID = "dockerhub-credentials"
        SONAR_SERVER = "SonarQube Server"
        SONAR_SCANNER = "SonarScanner"
    }

    // Các giai đoạn của pipeline
    stages {
        stage('Checkout SCM') {
            steps {
                git 'https://github.com/ThanhLam-bbt/Microservices-App.git' 
                echo "Checked out code successfully."
            }
        }

        stage('SonarQube Analysis') {
            steps {
                // Sử dụng tool SonarScanner đã cấu hình
                withSonarQubeEnv(SONAR_SERVER) {
                    sh "${tool(SONAR_SCANNER)}/bin/sonar-scanner \
                        -Dsonar.projectKey=my-microservice-project \
                        -Dsonar.sources=."
                }
            }
        }

        stage('SonarQube Quality Gate') {
            steps {
                // Chờ kết quả phân tích và fail pipeline nếu không đạt
                waitForQualityGate abortPipeline: true
                echo "SonarQube Quality Gate passed."
            }
        }

        stage('Build & Push Docker Image') {
            steps {
                script {
                    // Tạo tag cho image bằng số build của Jenkins
                    def dockerImageTag = "${env.BUILD_NUMBER}"
                    // Lấy đối tượng Docker image
                    def dockerImage = docker.build(DOCKER_IMAGE_NAME, "-t ${DOCKER_IMAGE_NAME}:${dockerImageTag} .")
                    
                    // Đăng nhập và đẩy image lên Docker Hub
                    docker.withRegistry('https://registry.hub.docker.com', DOCKER_CREDENTIALS_ID) {
                        dockerImage.push(dockerImageTag)
                        // Đẩy cả tag 'latest'
                        dockerImage.push('latest')
                    }
                    echo "Docker image pushed successfully."
                }
            }
        }

        
        stage('Deploy to Kubernetes') {
            steps {
                script {
                    // Cập nhật manifest để triển khai
                    sh 'kubectl apply -f deployment.yaml'
                    sh 'kubectl apply -f service.yaml'

                    // Cập nhật image cho deployment với tag mới nhất
                    sh "kubectl set image deployment/my-microservice-deployment my-microservice-container=${DOCKER_IMAGE_NAME}:${env.BUILD_NUMBER}"
                    
                    echo "Deployment to Kubernetes initiated."
                    sh 'kubectl rollout status deployment/my-microservice-deployment'
                    echo "Deployment successful."
                }
            }
        }
    }
    
    post {
        always {
            echo 'Pipeline finished.'
            // Xóa các image không cần thiết để dọn dẹp
            sh "docker image prune -af"
        }
    }
}
