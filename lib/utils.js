"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utils = void 0;
const core = __importStar(require("@actions/core"));
const exec_1 = require("@actions/exec");
class Utils {
    static setCliEnv() {
        core.exportVariable("JFROG_CLI_ENV_EXCLUDE", "*password*;*secret*;*key*;*token*;JF_ARTIFACTORY_*");
        core.exportVariable("JFROG_CLI_OFFER_CONFIG", "false");
        let buildNameEnv = core.getInput(Utils.BUILD_NAME);
        if (buildNameEnv) {
            core.exportVariable("JFROG_CLI_BUILD_NAME", buildNameEnv);
        }
        let buildNumberEnv = core.getInput(Utils.BUILD_NUMBER);
        if (buildNumberEnv) {
            core.exportVariable("JFROG_CLI_BUILD_NUMBER", buildNumberEnv);
        }
        let buildProjectEnv = core.getInput(Utils.JFROF_PROJECT);
        if (buildProjectEnv) {
            core.exportVariable("JFROG_CLI_BUILD_PROJECT", buildProjectEnv);
        }
        core.exportVariable("JFROG_CLI_BUILD_URL", process.env.GITHUB_SERVER_URL +
            "/" +
            process.env.GITHUB_REPOSITORY +
            "/actions/runs/" +
            process.env.GITHUB_RUN_ID);
        core.exportVariable("JFROG_CLI_USER_AGENT", Utils.USER_AGENT);
    }
    static run() {
        return __awaiter(this, void 0, void 0, function* () {
            let res = 0;
            let args = [];
            console.log("maven options === " + core.getInput(Utils.MAVEN_OPTIONS));
            if (core.getInput(Utils.BUILD_TYPE) == "maven-build") {
                args = [
                    "rt",
                    "mvnc",
                    "--server-id-resolve=" + core.getInput(Utils.RESOLVE_SERVER_ID),
                    "--repo-resolve-releases=" + core.getInput(Utils.RESOLVE_RELEASE_REPO),
                    "--repo-resolve-snapshots=" +
                        core.getInput(Utils.RESOLVE_SNAPSHOT_REPO),
                ];
                res = yield (0, exec_1.exec)("jfrog", args);
                if (typeof core.getInput(Utils.MAVEN_OPTIONS) != "undefined" &&
                    core.getInput(Utils.MAVEN_OPTIONS)) {
                    args = [
                        "rt",
                        "mvn",
                        core.getInput(Utils.MAVEN_OPTIONS),
                        "clean",
                        "install",
                    ];
                }
                else {
                    args = ["rt", "mvn", "clean", "install"];
                }
                res = yield (0, exec_1.exec)("jfrog", args);
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
                res = yield (0, exec_1.exec)("jfrog", args);
                if (typeof core.getInput(Utils.MAVEN_OPTIONS) != "undefined" &&
                    core.getInput(Utils.MAVEN_OPTIONS)) {
                    args = [
                        "rt",
                        "mvn",
                        core.getInput(Utils.MAVEN_OPTIONS),
                        "clean",
                        "test",
                    ];
                }
                else {
                    args = ["rt", "mvn", "clean", "test"];
                }
                res = yield (0, exec_1.exec)("jfrog", args);
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
                res = yield (0, exec_1.exec)("jfrog", args);
                if (typeof core.getInput(Utils.MAVEN_OPTIONS) != "undefined" &&
                    core.getInput(Utils.MAVEN_OPTIONS)) {
                    args = [
                        "rt",
                        "mvn",
                        core.getInput(Utils.MAVEN_OPTIONS),
                        "clean",
                        "install",
                    ];
                }
                else {
                    args = ["rt", "mvn", "clean", "install"];
                }
                res = yield (0, exec_1.exec)("jfrog", args);
                args = ["rt", "build-collect-env"];
                res = yield (0, exec_1.exec)("jfrog", args);
                args = ["rt", "build-add-git"];
                res = yield (0, exec_1.exec)("jfrog", args);
                args = ["rt", "build-publish"];
                res = yield (0, exec_1.exec)("jfrog", args);
                args = [
                    "rt",
                    "build-scan",
                    "--fail=" + core.getInput(Utils.BUILD_FAIL_ONSCAN),
                ];
                res = yield (0, exec_1.exec)("jfrog", args);
            }
            if (res !== core.ExitCode.Success) {
                throw new Error("JFrog CLI exited with exit code " + res);
            }
        });
    }
}
exports.Utils = Utils;
Utils.USER_AGENT = "setup-jfrog-cli-github-action/" + require("../package.json").version;
Utils.BUILD_NAME = "build-name";
Utils.BUILD_NUMBER = "build-number";
Utils.BUILD_TYPE = "build-type";
Utils.RESOLVE_SERVER_ID = "resolve-server-id";
Utils.DEPLOY_SERVER_ID = "deploy-server-id";
Utils.RESOLVE_SNAPSHOT_REPO = "resolve-snapshot-repository";
Utils.DEPLOY_SNAPSHOT_REPO = "deploy-snapshot-Repository";
Utils.RESOLVE_RELEASE_REPO = "resolve-releases-repository";
Utils.DEPLOY_RELEASE_REPO = "deploy-releases-repository";
Utils.JFROF_PROJECT = "jfrog-project";
Utils.BUILD_FAIL_ONSCAN = "build-fail-onscan";
Utils.MAVEN_OPTIONS = "maven-options";
