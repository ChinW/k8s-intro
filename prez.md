# Understanding Kubernetes in 10 minutes

Original document can be found [here](https://gist.github.com/MikeSchuette/b23f88d6c16ce5b6913169685acc662d); written by Mike Schuette.

This document provides a rapid-fire overview of Kubernetes concepts, vocabulary, and operations.  The target audience is anyone who runs applications in a cloud environment today, and who wants to understand the basic mechanics of a Kubernetes cluster.  The goal is that within 10 minutes, managers who read this should be able to listen in on a Kubernetes conversation and follow along at a high level, and engineers should be ready to deploy a sample app to a toy cluster of their own.

This orientation doc was written because the official Kubernetes docs are a great reference, but they present a small cliff to climb for newcomers.

If you want to understand _why_ you should consider running Kubernetes, see the official [Kubernetes conceptual overview document](https://kubernetes.io/docs/concepts/overview/what-is-kubernetes/).  This document is intended to complement that one, but one layer deeper.

For a deep dive, see [Kubernetes concepts](https://kubernetes.io/docs/concepts/).

## Basics

Kubernetes can run on almost any server, whether physical, cloud, or in a virtual machine on your laptop.  Each server in your cluster is called a **Node**.  Nodes are either a **Master Node** or a **Worker Node**.

Kubernetes is declarative, meaning that when you want a piece of infrastructure to exist (like a certain app running in your cluster), you first create a description of that object and store it inside a database provided by the Master Nodes.  Kubernetes constantly compares the objects in the database to the real world, and will create, modify, or destroy real objects until the real world matches the description in the database.

The Kubernetes database is exposed via a JSON API. Applications running on your cluster can talk to the Kubernetes API to query or modify the infrastructure that they're running on, which enables CI/CD, Autoscaling, and other dynamic infrastructure.

The parts of Kubernetes that watch the database for changes and then execute those changes are called **Controllers**.  Some of the core Controllers run at the OS level like traditional daemons, but many of them are hosted inside Kubernetes itself as just another application.  This provides a plugin system which allows you to adapt Kubernetes to any environment.  For example, if you happened to find yourself running a Kubernetes cluster on AWS the day that they announce their new ALB feature, you could write a controller which allows Kubernetes to manage your ALBs, and deploy it like any other application.

### Applications

To run applications on Kubernetes, you must package them as Docker containers.  The Worker Nodes are responsible for running your Docker containers inside an abstraction called a **Pod**.  You can think of a Pod as very similar to a traditional server:
  - Applications inside a Pod can talk to each other on localhost, and must not overlap ports.
  - Applications inside a Pod can communicate over other traditional methods, like shared memory.
  - Each Pod gets its own IP address (internal to the cluster).
  - Pods talk to each other on their IP addresses.
  - You can run multiple copies of each Pod for scaling and high-availability, and you should run separate Pods for each application component.

Kubernetes offers elaborate methods for mapping your Pods onto Nodes, to ensure that your application has the hardware resources and network layout that it needs.  These mappings are named for different types of "Sets", eg "**ReplicaSet**", "**DaemonSet**", etc.  These Sets provide different strategies in how Kubernetes will manage your applications.  For example, running multiple copies of a stateless application requires less coordination than running multiple nodes of a database cluster.

Pods exist inside a **Namespace**.  This is similar to namespaces in code - it's meant to provide isolation and clarity.  For this purpose, think of Namespaces as similar to a VPC or a private network.  Example Namespaces could be different environments (dev / qa / prod), or even different teams or products, all running on the same Kubernetes cluster.

### Configuration

Most objects in the Kubernetes world, like Pods and Nodes, can be assigned tags of your own design.  Tags are called **Labels** in Kubernetes.  Labels can be used to direct many Kubernetes operations, like which Pods run on which Nodes.  For example, you could add some GPU servers to your pool of Worker Nodes, and then Label those Nodes with "gpu=true".  An application which requires a GPU could then request to be run on a Node where "gpu=true".  (This is known as **affinity**.)  Label-based configuration is used extensively.

Kubernetes also provides simple application Configuration Management.  Config files and simple values (integers, booleans, etc) can be uploaded into an object called a **ConfigMap**.  The contents of a ConfigMap can then be mapped into the filesystem of your application, or into environment variables for the Pod where your application runs.

Very similar to a ConfigMap is another configuration object called a **Secret**.  Secrets provide the same features as ConfigMaps, but are encrypted on disk inside the Master Nodes.

### Deploying

To deploy all the pieces of your application, you create a **Deployment** object.  Inside a Deployment, you specify all the objects needed to deploy your app: a Pod definition (known as a "**PodSpec**"); the list of containers that should be running in the Pod; any ConfigMaps or Secrets necessary; how many copies ("**Replicas**") of the Pod should be running in your cluster; and how those Replicas should be distributed across your cluster (eg, with a "ReplicaSet" or perhaps a "DaemonSet").  The Deployment will handle a rolling deploy for you, including an automatic rollback if necessary.  More advanced deploys are possible, like Canary, but are outside the scope of this document.

## Networking

Kubernetes leverages many virtual-networking features of Linux, effectively creating an isolated private network inside the cluster.  For example, Pods are assigned an IP address (called the **Cluster IP**) which is not routable anywhere except within the cluster.  Cluster operators rarely need to know anything about the internal network layout, as Kubernetes handles all of the details.

Pods are ephemeral in Kubernetes.  Meaning, if you deploy a new version of an application, or even just restart it, it is likely that the current Pod where it is running will be destroyed and a new one created in its place with a different IP address.  Therefore, even though Pods could find each other by querying the Pods API and speaking directly to a Pod's Cluster IP, it's not recommended since that list will change very often.

### Services

Instead of using the Pod Cluster IPs directly, you declare a **Service**.  A Service is like a load balancer - it gets allocated a static Cluster IP, and it will distribute incoming traffic across a set of Pods.  A Service will watch the Pods API for you, and select a constantly-updated list of target Pods according to a "**selector**" that you provide, which filters Pods by Labels.

Each Pod that a Service identifies as a target is called an **Endpoint**.  Services can also be defined with manual Endpoints instead of a Pod selector, so that the Service points to some external application.  This allows your application to communicate exclusively with Services, and provides some degree of service discovery.

Services are automatically exposed to your application via internal DNS, so that your application can simply connect to http://mybackend or similar.  Your application containers will also have an environment variable set for each Service, eg MYBACKEND_SERVICE_HOST and MYBACKEND_SERVICE_PORT, but this is only true for containers launched after the Service was defined, so DNS is recommended.

### The outside world

Services are normally accessible only from inside the cluster.  However, a Service can also be exposed externally.  On AWS, Kubernetes will create and configure an ELB for you.  Traffic will get routed to the correct Pod, even if it's not running on whatever Node happened to receive the request from the ELB.

New versions of Kubernetes also introduce a networking object called an **Ingress**.  An Ingress today is primarily responsible for managing your Layer 7 (http/https) concerns.  For example, if you want to have a URL scheme where /service1 and /service2 go to separate Services, an Ingress controller can handle this for you.  Similarly, an Ingress can be responsible for terminating TLS traffic, so that you don't have to configure it in each app.

The resulting traffic map is "public -> ELB (created by Service) -> Ingress -> Service -> Pod (running my app)".  This can be a bit confusing, and Kubernetes is heading towards shifting responsibility for ELBs and similar from Services to Ingresses in a future version.

## Next Steps

Just do it.  [Minikube](https://kubernetes.io/docs/getting-started-guides/minikube/) is a tool to give you a toy cluster, running in a VM on your laptop.  

```bash
brew cask install virtualbox
brew cask install minikube
brew install kubectl
minikube start
minikube dashboard
```
The [guestbook tutorial](https://kubernetes.io/docs/tutorials/stateless-application/guestbook/) will walk you through installing a full sample application.