#!/bin/bash

ANGULAR_JSON="angular.json"

# Update the angular.json file to replace the script path
sed -i 's/"scripts": \[\]/"scripts": ["..\/visualization-component\/dist\/khiops-webcomponent\/main.js"]/' $ANGULAR_JSON

# Change directory to visualization component and build development webcomponents
cd ../visualization-component
yarn buildDev:webcomponents &

# Start the application
cd ../khiops-visualization-electron
sleep 30
yarn start 

$SHELL