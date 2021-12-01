## Setting up Jfrogcli in CI process:
We can use existing GitHub action from Jfrog to install Jfrogcli in the CI process.
as part of using the jfrogcli action we need to provide the JF_ARTIFACTORY secret. 
Follow the below steps to create the JF_ARTIFACTORY secret and save as part GitHub secrets.
  1.	Make sure JFrog CLI version 1.29.0 or above is installed on your local machine by running jfrog -v.
  2.	Configure the details of the Artifactory server by running jfrog c add.
  3.	Export the details of the Artifactory server you configured, using the server ID you chose. Do this by running jfrog c export <SERVER ID>.
  4.	Copy the generated token to the clipboard and save it as a secret on GitHub.
  
  example: https://github.com/marketplace/actions/setup-jfrog-cli

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
|build-fail-onscan|if true job is failed if the xray scan has vulnerabilities|


1.	maven-build
with input build-type as maven-build, action creates jfrog maven config and builds the maven artifacts, but artifacts are not published to Jfrog.
Usage:

 <img width="692" alt="Screen Shot 2021-12-01 at 8 45 55 AM" src="https://user-images.githubusercontent.com/31221465/144165687-593ba9e1-609d-4dfe-8a41-2b7ffecb8d72.png">




2.	maven-deploy
with input build-type as maven-deploy, action creates jfrog maven config and builds the maven artifacts, once the maven artifacts are built, collects environment variables for the build, publishes artifacts along with build info to Jfrog along with Jfrog xray scan is triggered.
Usage

 <img width="664" alt="Screen Shot 2021-12-01 at 8 44 06 AM" src="https://user-images.githubusercontent.com/31221465/144165587-8711b14e-19ba-41de-bef3-92e79b8641e2.png">
