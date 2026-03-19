sbt clean assembly
podman build . -t localhost/scala:latest
