# pnpmhook

> A sloppy fork of [yarnhook](https://github.com/frontsideair/yarnhook) which supports pnpm v7 and
> removes support for other package managers

`pnpmhook` keeps your `node_modules` up-to-date when your `pnpm-lock.yaml` changes due to git
operations like `checkout`, `merge`, `rebase`, `pull` etc.

## Installation

This package should be used with [husky](https://www.npmjs.com/package/husky).

```sh
pnpm install --save-dev pnpmhook husky
```

## Configuration

You should let `pnpmhook` handle git hooks that change the dependencies. Example `package.json` is
as follows:

```json
{
  "husky": {
    "hooks": {
      "post-checkout": "pnpmhook",
      "post-merge": "pnpmhook",
      "post-rewrite": "pnpmhook"
    }
  }
}
```

## Flags

Prepend these flags to your git command to use them.

- `PNPMHOOK_BYPASS`: Run git command bypassing pnpnmhook completely
- `PNPMHOOK_DEBUG`: Print debug information
- `PNPMHOOK_DRYRUN`: Don't install dependencies, only notify

An example:

```sh
PNPMHOOK_BYPASS=true git checkout feature-branch
```
