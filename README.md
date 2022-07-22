# Platform


The 'os-like' [front-end application of YouWol](https://platform.youwol.com/applications/@youwol/platform/latest).

Documentation, coverage and bundle's analysis can be found 
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

Tests require [py-youwol](https://platform.youwol.com/applications/@youwol/stories/latest?id=fa525fef-cb28-40fb-94d0-c45c2b464571&document=68f12394-6ad4-46ee-affe-19e929cb4fed&mode=reader)
to run on port 2001 using the configuration defined [here](https://github.com/youwol/integration-tests-conf).

```shell
yarn test
```

To start the 'dev-server':
- add `CdnOverride(packageName="@youwol/platform", port=3004)` in your 
[YouWol configuration file](https://platform.youwol.com/applications/@youwol/stories/latest?id=fa525fef-cb28-40fb-94d0-c45c2b464571&document=012d520b-8734-48c8-b4d1-5f6ec8a109a4&mode=reader)
  (in the `dispatches` list).
- run [py-youwol](https://platform.youwol.com/applications/@youwol/stories/latest?id=fa525fef-cb28-40fb-94d0-c45c2b464571&document=68f12394-6ad4-46ee-affe-19e929cb4fed&mode=reader)
- then execute
```shell
yarn start
```

To generate code documentation:

```shell
yarn doc
```
