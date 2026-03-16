podman build . -t localhost/task3_jvm:latest
podman images
podman login docker.io
podman tag localhost/task3_jvm:latest docker.io/wojcho/task3_jvm:latest
podman push docker.io/wojcho/task3_jvm:latest
podman images
