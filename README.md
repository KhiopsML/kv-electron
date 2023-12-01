![Build Releases](https://github.com/KhiopsML/kv-electron/actions/workflows/release.yml/badge.svg) ![test workflow](https://github.com/KhiopsML/khiops-visualization/actions/workflows/test.yml/badge.svg)

# Introduction

The Electron application that encapsulates Khiops Visualization
Based on https://github.com/maximegris/angular-electron.git

# Installation

```
# yarn install
```

## Development mode with Electron AND visualization component

First clone and install a local copy of visualization-component
then replace:
```
"scripts": [
  "node_modules/khiops-visualization/khiops-webcomponents.bundle.js"
],
```
with:
```
"scripts": [
  "../visualization-component/dist/khiops-webcomponent/khiops-webcomponents.bundle.js"
],
```
to load local copy of visualization-component

Into visualization-component, run:

```
# yarn start
```

Into electron folder, run:

```
# yarn start
```

**DO NOT CHANGE PORT WHEN PROMPED to debug directly visualization-component into Electron**


## Boilerplate change log

https://github.com/maximegris/angular-electron/blob/master/CHANGELOG.md

