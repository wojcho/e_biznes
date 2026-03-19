FROM docker.io/kprzystalski/ebiznes-scala:latest

# COPY --chown=student:student . .

# RUN sbt package

# ENV JETTY_VERSION=12.1.7
# ENV JETTY_HOME=/home/student/jetty
# ENV JETTY_BASE=/home/student/jetty-base

# RUN mkdir -p "$JETTY_HOME" && \
#   curl -o /tmp/jetty.zip "https://repo1.maven.org/maven2/org/eclipse/jetty/jetty-home/$JETTY_VERSION/jetty-home-$JETTY_VERSION.zip" && \
#   unzip /tmp/jetty.zip -d "$JETTY_HOME" && \
#   mv "$JETTY_HOME/jetty-home-$JETTY_VERSION"/* "$JETTY_HOME"/ && \
#   rm -rf "$JETTY_HOME/jetty-home-$JETTY_VERSION" /tmp/jetty.zip

# RUN mkdir -p "$JETTY_BASE/webapps"

# COPY ./target/scala-3.3.3/crud-shop_3-0.1.0-SNAPSHOT.war "$JETTY_BASE/webapps/ROOT.war"

# RUN java -jar "$JETTY_HOME/start.jar" --add-modules=server,http,ee10-deploy


# COPY --chown=student:student . .

# RUN sbt clean compile
# CMD sbt warStart


COPY --chown=student:student . .

RUN sbt clean assembly

CMD java -jar "./target/scala-3.3.3/CRUD Shop-assembly-0.1.0-SNAPSHOT.jar"
