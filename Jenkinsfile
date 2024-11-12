pipeline {
    agent any

    environment {
        DOCKER_IMAGE_OWNER = 'ashashrain'
        DOCKER_BUILD_TAG = "v${env.BUILD_NUMBER}"
        DOCKER_PWD = credentials('dockerhub')
        GIT_CREDENTIALS = credentials('github_token')
        REPO_URL = 'https://github.com/nowashrain/parking-CI.git'
        COMMIT_MESSAGE = 'Update README.md via Jenkins Pipeline'
    }

    stages {
        stage('clone from SCM') {
            steps {
                sh '''
                rm -rf parking-CI
                git clone https://github.com/nowashrain/parking-CI.git
                '''
            }
        }

        stage('Docker Image Building') {
            steps {
                dir('parking-CI')
                {
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
                rm -rf parking-CI
                git clone ${REPO_URL}
                '''
            }
        }

        stage('Modify README.md') {
            steps {
                sh """
                    cd parking-CI
                    echo "# Updated README" > README.md
                    echo "This README was updated by Jenkins Build #${env.BUILD_NUMBER} on \$(date)" >> README.md
                """
            }
        }

        stage('Commit Changes') {
            steps {
                dir('parking-CI') {
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
                dir('parking-CI') {
                    withCredentials([usernamePassword(credentialsId: 'github_token', usernameVariable: 'GIT_CREDENTIALS_USR', passwordVariable: 'GIT_CREDENTIALS_PSW')]) {
                        sh '''
                            git push https://${GIT_CREDENTIALS_USR}:${GIT_CREDENTIALS_PSW}@github.com/${REPO_URL} main
                        '''
                    }
                }
            }
        }
    }
}
