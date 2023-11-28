// See: https://medium.com/@TwitterArchiveEraser/notarize-electron-apps-7a5f988406db

const fs = require('fs');
const path = require('path');
var electron_notarize = require('electron-notarize');

module.exports = async function (params) {
	console.log("----------------------------------", params);
	var platform = params.packager.platform.name;
	// Only notarize the app on Mac OS only.
	if (platform === 'linux' || platform === 'windows') {
		return;
	}
	console.log('afterSign hook triggered', params);

	// Same appId in electron-builder.
	let appId = 'com.khiops.visualization';

	let appPath = path.join(params.appOutDir, `${params.packager.appInfo.productFilename}.app`);
	if (!fs.existsSync(appPath)) {
		throw new Error(`Cannot find application at: ${appPath}`);
	}

	console.log(`Notarizing ${appId} found at ${appPath}`);

	try {
		await electron_notarize.notarize({
			appBundleId: appId,
			appPath: appPath,
			appleApiKey: process.env.API_KEY_ID,
			appleApiIssuer: process.env.API_KEY_ISSUER_ID
		});
	} catch (error) {
		console.error(error);
	}

	console.log(`Done notarizing ${appId}`);
};
