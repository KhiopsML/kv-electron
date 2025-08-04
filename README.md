# Khiops Visualization Electron

![Build Releases](https://github.com/KhiopsML/kv-electron/actions/workflows/release.yml/badge.svg) ![Test Workflow](https://github.com/KhiopsML/khiops-visualization/actions/workflows/test.yml/badge.svg) [![Latest Stable Version](https://img.shields.io/github/v/release/KhiopsML/kv-electron?label=Latest%20stable%20version)](https://github.com/KhiopsML/kv-electron/releases) [![End-to-end tests](https://github.com/KhiopsML/khiops-visualization/actions/workflows/e2e.yml/badge.svg)](https://github.com/KhiopsML/khiops-visualization/actions/workflows/e2e.yml) ![gitleaks badge](https://img.shields.io/badge/protected%20by-gitleaks-blue)

A cross-platform Electron application that encapsulates Khiops visualization, offering a native user interface for analyzing and visualizing data with Khiops.

## 📋 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Development](#️-development)
- [Build and Distribution](#-build-and-distribution)
- [Project Structure](#-project-structure)
- [Technologies Used](#️-technologies-used)
- [Contributing](#-contributing)
- [License](#-license)

## 🎯 About

This Electron application integrates the [Khiops visualization](https://github.com/KhiopsML/khiops-visualization) into a native desktop interface. It enables users to intuitively and efficiently analyze and visualize machine learning data.

The project is based on the [angular-electron](https://github.com/maximegris/angular-electron) template and uses Angular with TypeScript for the user interface.

## ✨ Features

- 🖥️ **Cross-platform native application** (Windows, macOS, Linux)
- 📊 **Advanced visualization** of Khiops data and models
- 🔄 **Automatic updates** with electron-updater
- 🎨 **Modern interface** built with Angular and Electron
- 🔧 **Development mode** with hot-reload
- 📦 **Automated builds** via GitHub Actions

## 🔧 Prerequisites

- **Node.js** (version 16 or newer)
- **Yarn** package manager
- **Git** for cloning the repository

## 🚀 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/KhiopsML/kv-electron.git
   cd kv-electron
   ```

2. **Install dependencies**

   ```bash
   yarn install
   ```

## 🛠️ Development

### Standard development mode

To start the application in development mode:

```bash
yarn start
```

### Development with local visualization component

To develop with a local version of the visualization component:

```bash
yarn dev
```

This command:

- Replaces the visualization library with the local copy
- Uses scripts from the `../visualization-component/dist/khiops-webcomponent/` directory
- Enables hot-reload for rapid development

## 📦 Build and Distribution

### Local build

```bash
yarn build
```

### Generating installers

Distribution builds are automatically generated via GitHub Actions on release. Artifacts are available in the `release/` folder:

- **Windows**: `khiops visualization Setup [version].exe`
- **macOS**: Support with entitlements and code signing
- **Linux**: AppImage and other formats

## 📁 Project Structure

```text
khiops-visualization-electron/
├── app/                           # Main Electron application
│   ├── main.ts                    # Electron entry point
│   └── package.json               # Electron dependencies
├── src/                           # Angular source code
│   ├── app/                       # Angular modules and components
│   ├── assets/                    # Static resources
│   └── environments/              # Environment configuration
├── build/                         # Build resources
├── scripts/                       # Build and deployment scripts
└── release/                       # Distribution artifacts
```

## 🛠️ Technologies Used

- **Electron** – Framework for cross-platform desktop apps
- **Angular** – Web framework for the UI
- **TypeScript** – Typed programming language
- **Node.js** – JavaScript runtime
- **Yarn** – Package manager
- **electron-updater** – Automatic update system
- **Matomo** – Optional usage analytics

## 🤝 Contributing

Contributions are welcome! Here's how to contribute:

1. **Fork** the project
2. **Create** a branch for your feature (`git checkout -b feature/new-feature`)
3. **Commit** your changes (`git commit -m 'Add new feature'`)
4. **Push** to the branch (`git push origin feature/new-feature`)
5. **Open** a Pull Request

## 📄 License

This project is licensed under the BSD 3-Clause-clear license. See the [LICENSE](LICENSE) file for more details.

## 🔗 Useful Links

- [Khiops Visualization Repository](https://github.com/KhiopsML/khiops-visualization)
- [Releases](https://github.com/KhiopsML/kv-electron/releases)
- [Issues](https://github.com/KhiopsML/kv-electron/issues)
- [Khiops Documentation](https://khiops.org)
- [Boilerplate change log](https://github.com/maximegris/angular-electron/blob/master/CHANGELOG.md)
