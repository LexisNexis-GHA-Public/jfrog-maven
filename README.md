## Setting up Jfrogcli in CI process:
We can use existing GitHub action from Jfrog to install Jfrogcli in the CI process.
as part of using the jfrogcli action we need to provide the JF_ARTIFACTORY secret. 
Follow the below steps to create the JF_ARTIFACTORY secret and save as part GitHub secrets.
  1.	Make sure JFrog CLI version 1.29.0 or above is installed on your local machine by running jfrog -v.
  2.	Configure the details of the Artifactory server by running jfrog c add.
  3.	Export the details of the Artifactory server you configured, using the server ID you chose. Do this by running jfrog c export <SERVER ID>.
  4.	Copy the generated token to the clipboard and save it as a secret on GitHub.
  
  ![image](https://user-images.githubusercontent.com/31221465/140869714-d93af146-943a-4be4-88b3-b936ed8accda.png)

Once the secret is saved, we can use the jfrogcli action as below.
  
  ![image](https://user-images.githubusercontent.com/31221465/140869758-5c21b69b-0ed9-4cfd-8979-1254c503604f.png)


## Jfrog push action Usage:
Action supports following 
# Action Input:
|name|description|
|--------|----------|
|version|Version of Jfrogcli|
|build-name|name of the build|
|build-number|build number|
|build-type|build type of the build|
|resolve-server-id|serverId for resolving the maven dependency|
|deploy-server-id|serverId for deploying  the maven artifacts|
|resolve-snapshot-repository|repository for resolving the maven snapshot dependency|
|deploy-snapshot-repository|repository for deploying the maven snapshot artifacts|
|resolve-releases-repository|repository for resolving the maven release dependency|
|deploy-releases-repository|repository for deploying the maven release artifacts|
|jfrog-project|Jfrog project where the artifacts are uploaded|
|docker-repo|Jfrog docker repository|
|docker-image|image name|
|docker-image-tag|image tag|
|build-fail-onscan|if true job is failed if the xray scan has vulnerabilities|
|helm-repo|Jfrog helm repository|


1.	maven-build
with input build-type as maven-build, action creates jfrog maven config and builds the maven artifacts, but artifacts are not published to Jfrog.
Usage:

 ![image](https://user-images.githubusercontent.com/31221465/140873613-14dce430-c53a-4c5b-affc-6843ac91f8ca.png)




2.	maven-deploy
with input build-type as maven-deploy, action creates jfrog maven config and builds the maven artifacts, once the maven artifacts are built, collects environment variables for the build, publishes artifacts along with build info to Jfrog along with Jfrog xray scan is triggered.
Usage

 ![image](https://user-images.githubusercontent.com/31221465/140873648-b4d8e61e-2309-46ef-9053-3ebbfa03f9fe.png)


3.	docker-build
with input build-type as docker-build, action collects environment variables for the build, publishes image along with build info to Jfrog along with Jfrog xray scan is triggered.

Usage

  ![image](https://user-images.githubusercontent.com/31221465/140873674-890398f4-be52-46e9-bc6a-5fa13688889f.png)


4.	helm-build
with input build-type as helm-build, action collects environment variables for the build, publishes helm package along with build info along with Jfrog xray scan is triggered.

Usage

  ![image](https://user-images.githubusercontent.com/31221465/140873709-2e3b69a6-be71-4e92-b8d6-b4100b61c388.png)

