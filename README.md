![Build Releases](https://github.com/KhiopsML/kv-electron/actions/workflows/release.yml/badge.svg) ![test workflow](https://github.com/KhiopsML/khiops-visualization/actions/workflows/test.yml/badge.svg) [![Latest Stable Version](https://img.shields.io/github/v/release/KhiopsML/kv-electron?label=Latest%20stable%20version)](https://github.com/KhiopsML/kv-electron/releases) [![End-to-end tests](https://github.com/KhiopsML/khiops-visualization/actions/workflows/e2e.yml/badge.svg)](https://github.com/KhiopsML/khiops-visualization/actions/workflows/e2e.yml) <img alt="gitleaks badge" src="https://img.shields.io/badge/protected%20by-gitleaks-blue">

<a href="">

# Introduction

The Electron application that encapsulates Khiops Visualization from https://github.com/KhiopsML/khiops-visualization

Based on https://github.com/maximegris/angular-electron.git

# Installation

```
# yarn install
```

## Development mode with Electron AND visualization component

Run:

```
# yarn buildDev:webcomponents
```

This will replace visualization-component lib with the current local copy:

```
"scripts": [
  "../visualization-component/dist/khiops-webcomponent/main.js"
],
```

## Boilerplate change log

https://github.com/maximegris/angular-electron/blob/master/CHANGELOG.md
