FROM ubuntu:24.04

# Java 8, Kotlin
RUN apt-get update && \
  apt-get install -y openjdk-8-jdk kotlin curl unzip

# Gradle 6.9 (https://docs.gradle.org/current/userguide/compatibility.html newest Gradle does not work with Java 8)
RUN curl -sSL https://services.gradle.org/distributions/gradle-8.14-bin.zip -o gradle.zip && \
  unzip gradle.zip -d /opt && \
  ln -s /opt/gradle-8.14/bin/gradle /usr/bin/gradle && \
  rm gradle.zip

# Create user to avoid using root
RUN useradd -m user
USER user
WORKDIR /home/user/app

# Prepare build.gradle file with JDBC SQLite
COPY --chown=user:user build.gradle /home/user/app/

# Run final command
CMD bash -c "gradle -v"
