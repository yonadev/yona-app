pipeline {
  agent {
    dockerfile {
      filename 'Dockerfile'
      label 'yona'
    }
  }
  stages {
    stage('Build') {
      when {
        not { changelog '.*\\[ci skip\\].*' }
      }
      environment {
		GITHUB_APP = credentials('github-app')
      }
      steps {
        checkout scm

        slackSend color: 'good', channel: '#dev', message: "<${currentBuild.absoluteUrl}|Android app build ${env.BUILD_NUMBER}> on branch ${BRANCH_NAME} is awaiting release notes input to start the build"
        script {
          def enReleaseNotes = input message: 'User input required',
              submitter: 'authenticated',
              parameters: [[$class: 'TextParameterDefinition', defaultValue: '', description: 'Paste the English release notes', name: 'English']]
          enReleaseNotes.length() >= 500 && error("Release notes can be at most 500 characters")
          def nlReleaseNotes = input message: 'User input required',
              submitter: 'authenticated',
              parameters: [[$class: 'TextParameterDefinition', defaultValue: '', description: 'Paste the Dutch release notes', name: 'Dutch']]
          nlReleaseNotes.length() >= 500 && error("Release notes can be at most 500 characters")
          echo "English release notes: ${enReleaseNotes}"
          echo "Dutch release notes: ${nlReleaseNotes}"
          incrementVersion()
          writeFile file: "src-cordova/fastlane/metadata/android/nl-NL/changelogs/${env.VERSION_CODE}.txt", text: "${nlReleaseNotes}"
          writeFile file: "src-cordova/fastlane/metadata/android/en-US/changelogs/${env.VERSION_CODE}.txt", text: "${enReleaseNotes}"
        }

        sh "rm -rf node_modules"
        sh "cd src-cordova && rm -rf plugins && rm -rf node_modules && rm -rf platforms && cd .."
        sh "npm install"

        withCredentials(bindings: [
            string(credentialsId: 'AndroidKeystorePassword', variable: 'YONA_KEYSTORE_PASSWORD'),
            string(credentialsId: 'AndroidKeyPassword', variable: 'YONA_KEY_PASSWORD'),
            file(credentialsId: 'AndroidKeystore', variable: 'YONA_KEYSTORE_PATH'),
            file(credentialsId: 'FirebaseAppConfig', variable: 'ANDDROID_FIREBASE_CONFIG')
        ]) {
            sh "cp ${ANDDROID_FIREBASE_CONFIG} src-cordova/google-services.json"
            sh "cd src-cordova && cordova-set-version --v=\"${env.VERSION_NAME}\" --b=${env.VERSION_CODE} && cd .."
            sh "npm run cordova-prepare"
            sh "cd src-cordova && bundle update --verbose fastlane && cd .."
            sh "cd src-cordova && cordova build android --release -- --keystore=${YONA_KEYSTORE_PATH} --storePassword=${YONA_KEYSTORE_PASSWORD} --alias=Yona --password=${YONA_KEY_PASSWORD} && cd .."
            sh 'rm src-cordova/platforms/android/google-services.json'
            sh 'rm src-cordova/google-services.json'
        }

        sh 'git config --global user.email build@yona.nu'
        sh 'git config --global user.name yonabuild'
        sh 'git add src-cordova/version.properties'
        sh "git add src-cordova/fastlane/metadata/android/nl-NL/changelogs/${env.VERSION_CODE}.txt"
        sh "git add src-cordova/fastlane/metadata/android/en-US/changelogs/${env.VERSION_CODE}.txt"
        sh "git add src-cordova/Gemfile.lock"
        sh 'git commit -m "Build $BUILD_NUMBER updated versionCode to $VERSION_CODE [ci skip]"'
        sh 'git push https://$x-access-token:${GITHUB_APP_PSW}@github.com/yonadev/yona-app.git HEAD:$BRANCH_NAME'
        sh 'git tag -a $BRANCH_NAME-build-$BUILD_NUMBER -m "Jenkins"'
        sh 'git push https://$x-access-token:${GITHUB_APP_PSW}@github.com/yonadev/yona-app.git --tags'
        archiveArtifacts 'src-cordova/platforms/android/app/build/outputs/apk/**/*.apk'
        script {
          env.BUILD_NUMBER_TO_DEPLOY = env.BUILD_NUMBER
        }
      }
      post {
        success {
          slackSend color: 'good', channel: '#dev', message: "<${currentBuild.absoluteUrl}|Android app build ${env.BUILD_NUMBER}> on branch ${BRANCH_NAME} completed successfully"
        }
        failure {
          slackSend color: 'danger', channel: '#dev', message: "<${currentBuild.absoluteUrl}|Android app build ${env.BUILD_NUMBER}> on branch ${BRANCH_NAME} failed"
        }
      }
    }
    stage('Upload to Google Play') {
      when {
        allOf {
          not { changelog '.*\\[ci skip\\].*' }
          anyOf {
            branch 'develop'
            branch 'master'
          }
        }
      }
      steps {
        sh 'cd src-cordova && bundle install'
        withCredentials(bindings: [string(credentialsId: 'GoogleJsonKeyData', variable: 'SUPPLY_JSON_KEY_DATA')]) {
          sh 'cd src-cordova && bundle exec fastlane --verbose alpha'
        }
      }
      post {
        success {
          slackSend color: 'good', channel: '#dev', message: "<${currentBuild.absoluteUrl}|Android app build ${env.BUILD_NUMBER_TO_DEPLOY}> on branch ${BRANCH_NAME} successfully uploaded to Google Play"
        }
        failure {
          slackSend color: 'danger', channel: '#dev', message: "<${currentBuild.absoluteUrl}|Android app build ${env.BUILD_NUMBER_TO_DEPLOY}> on branch ${BRANCH_NAME} failed to upload to Google Play"
        }
      }
    }
    stage('Decide release to beta') {
      when {
        allOf {
          not { changelog '.*\\[ci skip\\].*' }
          anyOf {
            branch 'master'
          }
        }
      }
      steps {
        slackSend color: 'good', channel: '#dev', message: "<${currentBuild.absoluteUrl}|Android app build ${env.BUILD_NUMBER}> on branch ${BRANCH_NAME} is awaiting approval for release to Beta"
        script {
          env.RELEASE_TO_BETA = input message: 'User input required',
              submitter: 'authenticated',
              parameters: [choice(name: 'Release to beta on Google Play', choices: 'no\nyes', description: 'Choose "yes" if you want to release this build to beta on Google Play')]
          if (env.RELEASE_TO_BETA == 'no') {
            slackSend color: 'warning', channel: '#dev', message: "<${currentBuild.absoluteUrl}|Android app build ${env.BUILD_NUMBER} skips all further steps"
          }
        }
      }
    }
    stage('Release to beta') {
      when {
        environment name: 'RELEASE_TO_BETA', value: 'yes'
      }
      steps {
        sh 'cd src-cordova && bundle install'
        withCredentials(bindings: [string(credentialsId: 'GoogleJsonKeyData', variable: 'SUPPLY_JSON_KEY_DATA')]) {
          sh 'cd src-cordova && bundle exec fastlane --verbose beta'
        }
      }
      post {
        success {
          slackSend color: 'good', channel: '#dev', message: "<${currentBuild.absoluteUrl}|Android app build ${env.BUILD_NUMBER_TO_DEPLOY}> on branch ${BRANCH_NAME} successfully released to beta on Google Play"
        }
        failure {
          slackSend color: 'danger', channel: '#dev', message: "<${currentBuild.absoluteUrl}|Android app build ${env.BUILD_NUMBER_TO_DEPLOY}> on branch ${BRANCH_NAME} failed to release to beta on Google Play"
        }
      }
    }
    stage('Decide release to production') {
      when {
        allOf {
          not { changelog '.*\\[ci skip\\].*' }
          environment name: 'RELEASE_TO_BETA', value: 'yes'
          anyOf {
            branch 'master'
          }
        }
      }
      steps {
        slackSend color: 'good', channel: '#dev', message: "<${currentBuild.absoluteUrl}|Android app build ${env.BUILD_NUMBER}> on branch ${BRANCH_NAME} is awaiting approval for release to Production"
        script {
          env.RELEASE_TO_PRODUCTION = input message: 'User input required',
              submitter: 'authenticated',
              parameters: [choice(name: 'Release to production on Google Play', choices: 'no\nyes', description: 'Choose "yes" if you want to release this build to production on Google Play')]
          if (env.RELEASE_TO_PRODUCTION == 'no') {
            slackSend color: 'warning', channel: '#dev', message: "<${currentBuild.absoluteUrl}|Android app build ${env.BUILD_NUMBER} skips all further steps"
          }
        }
      }
    }
    stage('Release to production') {
      when {
        environment name: 'RELEASE_TO_PRODUCTION', value: 'yes'
      }
      steps {
        sh 'cd src-cordova && bundle install'
        withCredentials(bindings: [string(credentialsId: 'GoogleJsonKeyData', variable: 'SUPPLY_JSON_KEY_DATA')]) {
          sh 'cd src-cordova && bundle exec fastlane --verbose production'
        }
      }
      post {
        success {
          slackSend color: 'good', channel: '#dev', message: "<${currentBuild.absoluteUrl}|Android app build ${env.BUILD_NUMBER_TO_DEPLOY}> on branch ${BRANCH_NAME} successfully released to production on Google Play"
        }
        failure {
          slackSend color: 'danger', channel: '#dev', message: "<${currentBuild.absoluteUrl}|Android app build ${env.BUILD_NUMBER_TO_DEPLOY}> on branch ${BRANCH_NAME} failed to release to production on Google Play"
        }
      }
    }
  }
}

def incrementVersion() {
    def versionPropsFileName = "src-cordova/version.properties"
    def versionProps = readProperties file: versionPropsFileName
    env.VERSION_CODE = versionProps['VERSION_CODE'].toInteger() + 1
    versionProps['VERSION_CODE']=env.VERSION_CODE
    def versionPropsString = "#" + new Date() + "\n";
    def toKeyValue = {
        it.collect { "$it.key=$it.value" } join "\n"
    }
    versionPropsString += toKeyValue(versionProps)
    writeFile file: versionPropsFileName, text: versionPropsString

    def versionNameBase = "2.0"
    def versionName = versionNameBase + " build ${BUILD_NUMBER}"

    if (BRANCH_NAME != "master") {
        versionName = versionName + " (${BRANCH_NAME})"
    }

    env.VERSION_NAME = versionName
}
