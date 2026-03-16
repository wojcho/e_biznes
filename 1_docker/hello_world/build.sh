podman build . -t localhost/task4_hello_world:latest
podman images
podman login docker.io
podman tag localhost/task4_hello_world:latest docker.io/wojcho/task4_hello_world:latest
podman push docker.io/wojcho/task4_hello_world:latest
podman images
