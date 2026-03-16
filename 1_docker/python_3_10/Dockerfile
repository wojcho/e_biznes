FROM ubuntu:latest

RUN apt-get update && \
  apt-get install -y software-properties-common && \
  add-apt-repository -y ppa:deadsnakes/ppa && \
  apt-get update && \
  apt-get remove -y python3 && \
  apt-get install -y python3.10 && \
  update-alternatives --install /usr/bin/python python /usr/bin/python3.10 1 && \
  update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.10 1

RUN useradd -m user
USER user
WORKDIR /home/user/app

CMD python --version
