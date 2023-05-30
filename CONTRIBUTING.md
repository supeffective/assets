# Contributing Guide

Thanks for your interest to contribute to this project. Please take a moment and read through this guide:

## Repository

This project is a monorepo using turbo and pnpm workspaces. We use Node v18. The package manager used to install
and link dependencies must be [pnpm v8](https://pnpm.io/). It can be installed as:

```sh
npm install -g pnpm@8
```

Then, use the Quick Start guide found in the [README](README.md) to install dependencies and start the dev server.

## Developing

The main package can be found in `packages/website`. You can quickly test and debug your
changes by running:

```sh
pnpm dev
```

Read the main [README](README.md) for more information about the project structure and the available commands.

## Testing

We use `vitest` to run tests. You can run all tests with:

```sh
pnpm test
```

### Verify data consistency

To validate the data and the assets, run this script:

```sh
pnpm validate
```
