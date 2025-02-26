#!/bin/bash

# Chemin vers le fichier angular.json (un niveau plus haut)
ANGULAR_JSON="angular.json"

# Update the angular.json file to replace the script path
sed -i 's|"node_modules/khiops-visualization/khiops-webcomponents.bundle.js"|"../visualization-component/dist/khiops-webcomponent/main.js"|g' $ANGULAR_JSON

# Start the application
yarn start 

# Change directory to visualization component and build development webcomponents
cd ../visualization-component
yarn buildDev:webcomponents