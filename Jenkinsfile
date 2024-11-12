pipeline {
    agent any

    environment {
        DOCKER_IMAGE_OWNER = 'dangdang42'
        DOCKER_BUILD_TAG = "v${env.BUILD_NUMBER}"
        DOCKER_PWD = credentials('dockerhub')
        GIT_CREDENTIALS = credentials('github_access')
        REPO_URL = 'gongbu22/project-parking-CD-yj.git'
        COMMIT_MESSAGE = 'Update README.md via Jenkins Pipeline'
    }

    stages {
        stage('clone from SCM') {
            steps {
                sh '''
                rm -rf project-parking-yj
                git clone https://github.com/gongbu22/project-parking-yj.git
                '''
            }
        }

        stage('Docker Image Building') {
            steps {
                dir('project-parking-yj'){
                sh '''
                docker build -t ${DOCKER_IMAGE_OWNER}/msa-frontend-nginx:latest -t ${DOCKER_IMAGE_OWNER}/msa-frontend-nginx:${DOCKER_BUILD_TAG} -f ./msa-frontend/nginx-Dockerfile ./msa-frontend
                docker tag ${DOCKER_IMAGE_OWNER}/msa-frontend-nginx:latest ${DOCKER_IMAGE_OWNER}/msa-frontend-nginx:${DOCKER_BUILD_TAG}
                docker build -t ${DOCKER_IMAGE_OWNER}/msa-frontend-nodejs:latest -t ${DOCKER_IMAGE_OWNER}/msa-frontend-nodejs:${DOCKER_BUILD_TAG} -f ./msa-frontend/nodejs-Dockerfile ./msa-frontend
                docker tag ${DOCKER_IMAGE_OWNER}/msa-frontend-nodejs:latest ${DOCKER_IMAGE_OWNER}/msa-frontend-nodejs:${DOCKER_BUILD_TAG}
                docker build -t ${DOCKER_IMAGE_OWNER}/msa-parking-service:latest -t ${DOCKER_IMAGE_OWNER}/msa-parking-service:${DOCKER_BUILD_TAG} ./msa-parking-service
                docker tag ${DOCKER_IMAGE_OWNER}/msa-parking-service:latest ${DOCKER_IMAGE_OWNER}/msa-parking-service:${DOCKER_BUILD_TAG}
                docker build -t ${DOCKER_IMAGE_OWNER}/msa-payment-service:latest -t ${DOCKER_IMAGE_OWNER}/msa-payment-service:${DOCKER_BUILD_TAG} ./msa-payment-service
                docker tag ${DOCKER_IMAGE_OWNER}/msa-payment-service:latest ${DOCKER_IMAGE_OWNER}/msa-payment-service:${DOCKER_BUILD_TAG}
                docker build -t ${DOCKER_IMAGE_OWNER}/msa-register-service:latest -t ${DOCKER_IMAGE_OWNER}/msa-register-service:${DOCKER_BUILD_TAG} ./msa-register-service
                docker tag ${DOCKER_IMAGE_OWNER}/msa-register-service:latest ${DOCKER_IMAGE_OWNER}/msa-register-service:${DOCKER_BUILD_TAG}
                docker build -t ${DOCKER_IMAGE_OWNER}/msa-statistics-service:latest -t ${DOCKER_IMAGE_OWNER}/msa-statistics-service:${DOCKER_BUILD_TAG} ./msa-statistics-service
                docker tag ${DOCKER_IMAGE_OWNER}/msa-statistics-service:latest ${DOCKER_IMAGE_OWNER}/msa-statistics-service:${DOCKER_BUILD_TAG}
                '''
                }
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'DOCKER_USR', passwordVariable: 'DOCKER_PWD')]) {
                sh "echo $DOCKER_PWD | docker login -u $DOCKER_USR --password-stdin"}
            }
        }

        stage('Docker Image pushing') {
            steps {
                sh '''
                docker push ${DOCKER_IMAGE_OWNER}/msa-frontend-nginx:${DOCKER_BUILD_TAG}
                docker push ${DOCKER_IMAGE_OWNER}/msa-frontend-nginx:latest
                docker push ${DOCKER_IMAGE_OWNER}/msa-frontend-nodejs:${DOCKER_BUILD_TAG}
                docker push ${DOCKER_IMAGE_OWNER}/msa-frontend-nodejs:latest
                docker push ${DOCKER_IMAGE_OWNER}/msa-parking-service:${DOCKER_BUILD_TAG}
                docker push ${DOCKER_IMAGE_OWNER}/msa-parking-service:latest
                docker push ${DOCKER_IMAGE_OWNER}/msa-payment-service:${DOCKER_BUILD_TAG}
                docker push ${DOCKER_IMAGE_OWNER}/msa-payment-service:latest
                docker push ${DOCKER_IMAGE_OWNER}/msa-register-service:${DOCKER_BUILD_TAG}
                docker push ${DOCKER_IMAGE_OWNER}/msa-register-service:latest
                docker push ${DOCKER_IMAGE_OWNER}/msa-statistics-service:${DOCKER_BUILD_TAG}
                docker push ${DOCKER_IMAGE_OWNER}/msa-statistics-service:latest
                '''
            }
        }

        stage('Docker Logout') {
            steps {
                sh '''
                docker logout
                '''
            }
        }

        stage('Clone Repository') {
            steps {
                sh '''
                rm -rf project-parking-CD-yj
                git clone https://github.com/${REPO_URL}
                '''
            }
        }

        stage('Modify README.md') {
            steps {
                sh """
                    cd project-parking-CD-yj
                    echo "# Updated README" > README.md
                    echo "This README was updated by Jenkins Build #${env.BUILD_NUMBER} on \$(date)" >> README.md
                """
            }
        }

        stage('Commit Changes') {
            steps {
                dir('hello-msa-cd') {
                sh '''
                    git config user.name "gongbu22"
                    git config user.email "pyujin0711@naver.com"
                    git add README.md
                    git commit -m "${COMMIT_MESSAGE}"
                '''
                }
            }
        }

        stage('Push Changes') {
            steps {
                dir('hello-msa-cd') {
                sh '''
                    git push https://${GIT_CREDENTIALS_USR}:${GIT_CREDENTIALS_PSW}@github.com/${REPO_URL} main
                '''
                }
            }
        }
    }
}
