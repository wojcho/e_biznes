podman build . -t localhost/task1_python_3_10:latest
podman images
podman login docker.io
podman tag localhost/task1_python_3_10:latest docker.io/wojcho/task1_python_3_10:latest
podman push docker.io/wojcho/task1_python_3_10:latest
podman images
