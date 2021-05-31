FROM phusion/baseimage:focal-1.0.0
LABEL maintainer="Anton Vink <anton@b2it.nl>"

CMD ["/sbin/my_init"]

ENV LC_ALL "en_US.UTF-8"
ENV LANGUAGE "en_US.UTF-8"
ENV LANG "en_US.UTF-8"

ENV VERSION_SDK_TOOLS "4333796"
ENV VERSION_BUILD_TOOLS "29.0.2"
ENV VERSION_TARGET_SDK "28"
ENV VERSION_GRADLE "6.5"

ENV ANDROID_HOME "/sdk"

ENV PATH "$PATH:${ANDROID_HOME}/tools:${ANDROID_HOME}/tools/bin:${ANDROID_HOME}/platform-tools"
ENV DEBIAN_FRONTEND noninteractive

ENV HOME "/root"

RUN apt-add-repository ppa:brightbox/ruby-ng
RUN apt-get update
RUN apt-get -y install --no-install-recommends \
    curl \
    openjdk-8-jdk \
    unzip \
    zip \
    git \
    ruby2.5 \
    ruby2.5-dev \
    build-essential \
    file \
    ssh

ADD https://dl.google.com/android/repository/sdk-tools-linux-${VERSION_SDK_TOOLS}.zip /tools.zip
RUN unzip /tools.zip -d /sdk && rm -rf /tools.zip

RUN yes | ${ANDROID_HOME}/tools/bin/sdkmanager --licenses

RUN mkdir -p $HOME/.android && touch $HOME/.android/repositories.cfg
RUN ${ANDROID_HOME}/tools/bin/sdkmanager "platform-tools" "tools" "platforms;android-${VERSION_TARGET_SDK}" "build-tools;${VERSION_BUILD_TOOLS}"
RUN ${ANDROID_HOME}/tools/bin/sdkmanager "extras;android;m2repository" "extras;google;google_play_services" "extras;google;m2repository"

RUN gem install fastlane

#ADD id_rsa $HOME/.ssh/id_rsa
#ADD id_rsa.pub $HOME/.ssh/id_rsa.pub
#ADD adbkey $HOME/.android/adbkey
#ADD adbkey.pub $HOME/.android/adbkey.pub

ADD https://services.gradle.org/distributions/gradle-${VERSION_GRADLE}-bin.zip /gradle.zip
RUN unzip /gradle.zip -d /opt/gradle && rm -rf /gradle.zip
ENV GRADLE_HOME=/opt/gradle/gradle-${VERSION_GRADLE}
ENV PATH=${PATH}:${GRADLE_HOME}/bin

RUN apt-get update
RUN apt-get -y install curl gnupg
RUN curl -sL https://deb.nodesource.com/setup_10.x  | bash -
RUN apt-get -y install nodejs

RUN npm install @vue/cli -g
RUN npm install cordova -g
RUN npm install cordova-set-version -g

RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*
