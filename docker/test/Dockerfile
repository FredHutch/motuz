# Build as
# docker build --no-cache=true -t motuz_test:latest -f docker/test/Dockerfile .
# docker run -v /etc:/etc:ro -v /efs:/efs -it --net='host' motuz_test:latest


FROM ubuntu:16.04

RUN apt-get update -y
RUN apt-get install -y curl net-tools netcat nmap sudo

CMD /bin/bash

