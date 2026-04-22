# podman rmi $(podman images -qa) -f
# podman rm -f -a
npm run build
podman build . -t localhost/shop-frontend:latest
