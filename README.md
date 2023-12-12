![Build Releases](https://github.com/KhiopsML/kv-electron/actions/workflows/release.yml/badge.svg) ![test workflow](https://github.com/KhiopsML/khiops-visualization/actions/workflows/test.yml/badge.svg) [![Latest Stable Version](https://img.shields.io/github/v/release/KhiopsML/kv-electron?label=Latest%20stable%20version)](https://github.com/KhiopsML/kv-electron/releases) 

<table><tr><th>Result</th><th>Passed :white_check_mark:</th><th>Failed :x:</th><th>Pending :hand:</th><th>Skipped :leftwards_arrow_with_hook:</th><th>Duration :clock8:</th></tr><tr><td>Passing :white_check_mark:</td><td>80</td><td>0</td><td>0</td><td>0</td><td>394.137s</td></tr></table>
<a href="">

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

