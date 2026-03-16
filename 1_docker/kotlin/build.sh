podman build . -t localhost/task2_kotlin:latest
podman images
podman login docker.io
podman tag localhost/task2_kotlin:latest docker.io/wojcho/task2_kotlin:latest
podman push docker.io/wojcho/task2_kotlin:latest
podman images
