# Kubernetes guide

At the moment, Motuz supports two ways of managing your deployment: kubernetes and docker-compose. Going forward, docker-compose will be deprecated and the deployment will be done solely on kubernetes.


## Installing Kubernetes

```bash
sudo apt-get update && sudo apt-get install -y apt-transport-https
curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -
echo "deb http://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee -a /etc/apt/sources.list.d/kubernetes.list

sudo apt-get update
sudo apt-get install -y kubelet kubeadm kubectl kubernetes-cni
```

Check that it works

```bash
sudo kubeadm version
```


Start kubeadm

```bash
sudo kubeadm init --ignore-preflight-errors=NumCPU
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

[Optional] Stop kubeadm

```bash
sudo kubeadm reset
```

## Installing Helm

TODO


## Installing docker app

```bash
export DOCKER_CLI_EXPERIMENTAL=enabled
export OSTYPE="$(uname | tr A-Z a-z)"
curl -fsSL --output "/tmp/docker-app-${OSTYPE}.tar.gz" "https://github.com/docker/app/releases/download/v0.8.0/docker-app-${OSTYPE}.tar.gz"
tar xf "/tmp/docker-app-${OSTYPE}.tar.gz" -C /tmp/
mkdir -p ~/.docker/cli-plugins && cp "/tmp/docker-app-plugin-${OSTYPE}" ~/.docker/cli-plugins/docker-app

```