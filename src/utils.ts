import * as core from "@actions/core";
import { exec } from "@actions/exec";

export class Utils {
  public static readonly USER_AGENT: string =
    "setup-jfrog-cli-github-action/" + require("../package.json").version;
  public static readonly BUILD_NAME: string = "build-name";
  public static readonly BUILD_NUMBER: string = "build-number";
  public static readonly BUILD_TYPE: string = "build-type";
  public static readonly RESOLVE_SERVER_ID: string = "resolve-server-id";
  public static readonly DEPLOY_SERVER_ID: string = "deploy-server-id";
  public static readonly RESOLVE_SNAPSHOT_REPO: string =
    "resolve-snapshot-repository";
  public static readonly DEPLOY_SNAPSHOT_REPO: string =
    "deploy-snapshot-Repository";
  public static readonly RESOLVE_RELEASE_REPO: string =
    "resolve-releases-repository";
  public static readonly DEPLOY_RELEASE_REPO: string =
    "deploy-releases-repository";
  public static readonly JFROF_PROJECT: string = "jfrog-project";
  public static readonly BUILD_FAIL_ONSCAN: string = "build-fail-onscan";
  public static readonly MAVEN_OPTIONS: string = "maven-options";

  public static setCliEnv() {
    core.exportVariable(
      "JFROG_CLI_ENV_EXCLUDE",
      "*password*;*secret*;*key*;*token*;JF_ARTIFACTORY_*"
    );
    core.exportVariable("JFROG_CLI_OFFER_CONFIG", "false");
    let buildNameEnv: string = core.getInput(Utils.BUILD_NAME);
    if (buildNameEnv) {
      core.exportVariable("JFROG_CLI_BUILD_NAME", buildNameEnv);
    }
    let buildNumberEnv: string = core.getInput(Utils.BUILD_NUMBER);
    if (buildNumberEnv) {
      core.exportVariable("JFROG_CLI_BUILD_NUMBER", buildNumberEnv);
    }
    let buildProjectEnv: string = core.getInput(Utils.JFROF_PROJECT);
    if (buildProjectEnv) {
      core.exportVariable("JFROG_CLI_BUILD_PROJECT", buildProjectEnv);
    }
    core.exportVariable(
      "JFROG_CLI_BUILD_URL",
      process.env.GITHUB_SERVER_URL +
        "/" +
        process.env.GITHUB_REPOSITORY +
        "/actions/runs/" +
        process.env.GITHUB_RUN_ID
    );
    core.exportVariable("JFROG_CLI_USER_AGENT", Utils.USER_AGENT);
  }

  public static async run() {
    let res: number = 0;
    let args: string[] = [];
    if (core.getInput(Utils.BUILD_TYPE) == "maven-build") {
      args = [
        "rt",
        "mvnc",
        "--server-id-resolve=" + core.getInput(Utils.RESOLVE_SERVER_ID),
        "--repo-resolve-releases=" + core.getInput(Utils.RESOLVE_RELEASE_REPO),
        "--repo-resolve-snapshots=" +
          core.getInput(Utils.RESOLVE_SNAPSHOT_REPO),
      ];
      res = await exec("jfrog", args);
      args = ["rt", "mvn", "clean", "install"];
      let build_args_str = core.getInput(Utils.MAVEN_OPTIONS);
      if (build_args_str != "" || build_args_str.length > 0) {
        let build_args: string[] = build_args_str.split("\n");
        args = args.concat(build_args);
      }
      res = await exec("jfrog", args);
    }
    if (core.getInput(Utils.BUILD_TYPE) == "maven-test") {
      args = [
        "rt",
        "mvnc",
        "--server-id-resolve=" + core.getInput(Utils.RESOLVE_SERVER_ID),
        "--repo-resolve-releases=" + core.getInput(Utils.RESOLVE_RELEASE_REPO),
        "--repo-resolve-snapshots=" +
          core.getInput(Utils.RESOLVE_SNAPSHOT_REPO),
      ];
      res = await exec("jfrog", args);
      args = ["rt", "mvn", "clean", "test"];
      let build_args_str = core.getInput(Utils.MAVEN_OPTIONS);
      if (build_args_str != "" || build_args_str.length > 0) {
        let build_args: string[] = build_args_str.split("\n");
        args = args.concat(build_args);
      }
      res = await exec("jfrog", args);
    }
    if (core.getInput(Utils.BUILD_TYPE) == "custom") {
      args = [
        "rt",
        "mvnc",
        "--server-id-resolve=" + core.getInput(Utils.RESOLVE_SERVER_ID),
        "--repo-resolve-releases=" + core.getInput(Utils.RESOLVE_RELEASE_REPO),
        "--repo-resolve-snapshots=" +
          core.getInput(Utils.RESOLVE_SNAPSHOT_REPO),
      ];
      res = await exec("jfrog", args);
      args = ["rt", "mvn"];
      let build_args_str = core.getInput(Utils.MAVEN_OPTIONS);
      if (build_args_str != "" || build_args_str.length > 0) {
        let build_args: string[] = build_args_str.split("\n");
        args = args.concat(build_args);
      }
      res = await exec("jfrog", args);
    }
    if (core.getInput(Utils.BUILD_TYPE) == "maven-deploy") {
      args = [
        "rt",
        "mvnc",
        "--server-id-resolve=" + core.getInput(Utils.RESOLVE_SERVER_ID),
        "--server-id-deploy=" + core.getInput(Utils.DEPLOY_SERVER_ID),
        "--repo-resolve-releases=" + core.getInput(Utils.RESOLVE_RELEASE_REPO),
        "--repo-resolve-snapshots=" +
          core.getInput(Utils.RESOLVE_SNAPSHOT_REPO),
        "--repo-deploy-releases=" + core.getInput(Utils.DEPLOY_RELEASE_REPO),
        "--repo-deploy-snapshots=" + core.getInput(Utils.DEPLOY_SNAPSHOT_REPO),
      ];
      res = await exec("jfrog", args);
      args = ["rt", "mvn", "clean", "install"];
      let build_args_str = core.getInput(Utils.MAVEN_OPTIONS);
      if (build_args_str != "" || build_args_str.length > 0) {
        let build_args: string[] = build_args_str.split("\n");
        args = args.concat(build_args);
      }
      res = await exec("jfrog", args);

      args = ["rt", "build-collect-env"];
      res = await exec("jfrog", args);

      args = ["rt", "build-add-git"];
      res = await exec("jfrog", args);

      args = ["rt", "build-publish"];
      res = await exec("jfrog", args);

      args = [
        "rt",
        "build-scan",
        "--fail=" + core.getInput(Utils.BUILD_FAIL_ONSCAN),
      ];
      res = await exec("jfrog", args);
      res = await exec("sleep 60");
      args = [
        "rt",
        "build-scan",
        "--fail=" + core.getInput(Utils.BUILD_FAIL_ONSCAN),
      ];
      res = await exec("jfrog", args);
    }
    if (res !== core.ExitCode.Success) {
      throw new Error("JFrog CLI exited with exit code " + res);
    }
  }
}
