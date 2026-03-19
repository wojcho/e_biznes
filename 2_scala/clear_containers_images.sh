podman rmi $(podman images -qa) -f
podman rm -f -a
