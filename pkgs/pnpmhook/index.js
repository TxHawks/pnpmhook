#!/usr/bin/env node

// @flow

const findParentDir = require("find-parent-dir");
const execa = require("execa");
const { join } = require("path");

// environment variables
const { PNPMHOOK_BYPASS = false, PNPMHOOK_DEBUG = false, PNPMHOOK_DRYRUN = false } = process.env;

if (!PNPMHOOK_BYPASS) {
  // find directories
  const currentDir = process.cwd();
  const gitDir = findParentDir.sync(currentDir, ".git");

  // check for lockfiles
  const lockfileSpec = {
    checkfile: "pnpm-lock.yaml",
    lockfile: "pnpm-lock.yaml",
    command: "pnpm",
    version: ">=3",
    arguments: ["install", "--prefer-offline", "--prefer-frozen-lockfile", "--no-optional"]
  };

  if (PNPMHOOK_DEBUG) {
    console.log("currentDir:", currentDir);
    console.log("gitDir:", gitDir);
    console.log("lockfile:", lockfileSpec);
  }

  // get the command, arguments and lockfile path
  const { lockfile, command, arguments } = lockfileSpec;
  const lockfilePath = join(currentDir, lockfile);

  // run a git diff on the lockfile
  const { stdout: output } = execa.sync(
    "git",
    ["diff", "HEAD@{1}..HEAD@{0}", "--", lockfilePath],
    { cwd: gitDir }
  );

  if (PNPMHOOK_DEBUG) {
    console.log(output);
  }

  // if diff exists, update dependencies
  if (output.length > 0) {
    if (PNPMHOOK_DRYRUN) {
      console.log(
        `Changes to lockfile found, you should run \`${command} install\` if you want to have up-to-date dependencies.`
      );
    } else {
      console.log(`Changes to lockfile found, running \`${command} install\``);
      try {
        execa.sync(command, arguments, { stdio: "inherit" });
      } catch (err) {
        console.warn(`Running ${command} ${arguments.join(" ")} failed`);
      }
    }
  }
}
