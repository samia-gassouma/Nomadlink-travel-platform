# PiCloud - Déploiement OpenStack/Kubernetes

Ce dossier contient les ressources utilisées pour déployer PiCloud sur des machines virtuelles OpenStack et un cluster Kubernetes.

## Mon périmètre

- préparation des nœuds Ubuntu ;
- installation de Docker/containerd ;
- installation de Kubernetes 1.32 ;
- installation de kubeadm, kubelet et kubectl ;
- déploiement du front-end Angular ;
- déploiement du back-end Spring Boot ;
- déploiement de MySQL ;
- configuration du stockage persistant ;
- exposition des services avec MetalLB.

## Architecture

```text
OpenStack
  └── Machines virtuelles Ubuntu
       ├── Contrôle Kubernetes
       ├── Worker(s)
       └── Cluster Kubernetes
            ├── frontend Deployment + LoadBalancer
            ├── backend Deployment + ClusterIP Service
            ├── mysql Deployment + ClusterIP Service
            ├── PersistentVolume/PersistentVolumeClaim
            └── MetalLB IPAddressPool
```

## Ressources

| Fichier | Rôle |
|---|---|
| `ansible-playbook.txt` | préparation des nœuds Kubernetes |
| `frontend.yaml` | Deployment Angular |
| `service-front.yaml` | Service frontend `LoadBalancer` |
| `backend.yaml` | Deployment Spring Boot |
| `service-backend.yaml` | Service backend sur le port 9000 |
| `deploy-mysql.yaml` | MySQL sans stockage persistant |
| `persistent-volume.yaml` | Volume hostPath pour MySQL |
| `mysql-persistentvolumeClaim.yaml` | MySQL avec PV/PVC |
| `metallb-config.yaml` | plage d'adresses MetalLB |

## Préparation avec Ansible

Le playbook installe les dépendances nécessaires puis ajoute :

- les dépôts Kubernetes 1.32 ;
- les clés GPG Kubernetes et Docker ;
- Docker CE ;
- containerd ;
- kubelet, kubeadm et kubectl ;
- la configuration IP forwarding ;
- la désactivation du swap.

Exemple d'utilisation :

```bash
ansible-playbook -i inventory ansible-playbook.txt
```

L'inventaire Ansible doit être adapté aux adresses IP des machines OpenStack.

## Création du cluster

Sur le nœud control plane :

```bash
kubeadm init --pod-network-cidr=10.244.0.0/16
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown "$(id -u):$(id -g)" $HOME/.kube/config
```

Installer ensuite le CNI réseau choisi pour le cluster, puis joindre les workers :

```bash
kubeadm join <CONTROL_PLANE_IP>:6443 --token <TOKEN> --discovery-token-ca-cert-hash sha256:<HASH>
```

## MetalLB

Avant de déployer les Services `LoadBalancer`, installer MetalLB dans le cluster puis appliquer :

```bash
kubectl apply -f metallb-config.yaml
```

La plage déclarée est :

```text
192.168.1.10-192.168.1.60
```

Elle doit correspondre à une plage libre et routable dans le réseau OpenStack.

## Déploiement

Créer le volume puis MySQL :

```bash
kubectl apply -f persistent-volume.yaml
kubectl apply -f mysql-persistentvolumeClaim.yaml
```

Déployer les applications :

```bash
kubectl apply -f backend.yaml
kubectl apply -f service-backend.yaml
kubectl apply -f frontend.yaml
kubectl apply -f service-front.yaml
```

## Images utilisées

| Composant | Image |
|---|---|
| Front-end | `ranimbouzikri/angular:v13` |
| Back-end | `ranimbouzikri/ranim:latest` |
| MySQL | `mysql:latest` ou `mysql:8` |

Dans un environnement réel, remplacer ces références par les propres images, tags immuables et registre du projet.

## Vérification

```bash
kubectl get nodes
kubectl get pods
kubectl get deployments
kubectl get services
kubectl get pvc
kubectl get pv
```

Consulter les journaux :

```bash
kubectl logs deployment/backend
kubectl logs deployment/frontend
kubectl logs deployment/mysql
```

## Persistance MySQL

Le volume est déclaré avec :

- capacité : `1Gi`
- mode : `ReadWriteOnce`
- type : `hostPath`
- chemin : `/mnt/data/mysql`
- politique : `Retain`

Le `hostPath` convient à un démonstrateur, mais un stockage réseau OpenStack Cinder ou un provisionneur dynamique est recommandé en production.

## Points d'attention

- le mot de passe MySQL contenu dans les manifestes doit être externalisé ;
- utiliser `Secrets` Kubernetes pour les secrets JWT, SMTP et Stripe ;
- les adresses success/cancel Stripe doivent pointer vers une URL publique HTTPS ;
- ajouter les probes HTTP, les requests/limits et plusieurs replicas ;
- définir une Ingress/TLS ou un contrôleur cloud adapté selon l'environnement ;
- utiliser des tags immuables plutôt que `latest`.

## Captures d'écran

```md
![Architecture Kubernetes](screenshots/kubernetes-architecture.png)
![Pods du cluster](screenshots/kubernetes-pods.png)
![Services LoadBalancer](screenshots/kubernetes-services.png)
![Dashboard OpenStack](screenshots/openstack-vms.png)
```
