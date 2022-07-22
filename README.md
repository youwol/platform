# Platform


The 'os-like' [front-end application of YouWol](https://platform.youwol.com/applications/@youwol/platform/latest).

User guide can be found [here](https://platform.youwol.com/documentation/@youwol/platform).

Developer's documentation, coverage and bundle's analysis can be found 
[here](https://platform.youwol.com/applications/@youwol/cdn-explorer/latest?package=@youwol/platform).

## Installation, Build & Test

To install the required dependencies:

```shell
yarn
```

To build for development:

```shell
yarn build:dev
```

To build for production:

```shell
yarn build:prod
```

Tests require [py-youwol](https://platform.youwol.com/documentation/py-youwol)
to run on port 2001 using the configuration defined [here](https://github.com/youwol/integration-tests-conf).

```shell
yarn test
```

To start the 'dev-server':
- add `CdnOverride(packageName="@youwol/platform", port=3004)` in your 
[YouWol configuration file](https://platform.youwol.com/documentation/py-youwol/configuration)
  (in the `dispatches` list).
- run [py-youwol](https://platform.youwol.com/documentation/py-youwol)
- then execute
  ```shell
  yarn start
  ```

To generate code documentation:

```shell
yarn doc
```
