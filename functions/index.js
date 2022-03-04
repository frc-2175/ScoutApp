/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
const { exec } = require("child_process");
const functions = require("firebase-functions");
const {google} = require("googleapis");
const {promisify} = require("util");
const sheetID = "1fdK7eVIVfm9MuBK_5VBX4uxyVcmOcVRfqab9KZUpXKs";

async function getSubSheets() {
	const auth = await google.auth.getClient({scopes: ["https://www.googleapis.com/auth/spreadsheets"]});
	const api = google.sheets({version: "v4", auth});
	const getSheets = promisify(api.spreadsheets.get.bind(api.spreadsheets));
	const sheets = (await getSheets({spreadsheetId: sheetID})).data.sheets;

	return sheets;
}

async function createSubSheet(name) {
	const auth = await google.auth.getClient({scopes: ["https://www.googleapis.com/auth/spreadsheets"]});
	const api = google.sheets({version: "v4", auth});
	const createSheet = promisify(api.spreadsheets.batchUpdate.bind(api.spreadsheets));
	try {
		const response = (await createSheet({spreadsheetId: sheetID, resource: {requests: [
			{
				addSheet: {
					properties: {
						title: String(name),
						gridProperties: {
							rowCount: 20,
							columnCount: 12
						}
					}
				}
			}
		]}}));
		return response;
	}
	catch {
		return `${name} already exists.`;
	}
}

function writeDataToSpreadsheet(range, data, spreadsheet) {
	google.auth.getClient({
		scopes: ["https://www.googleapis.com/auth/spreadsheets"],
	}).then((auth) => {
		const api = google.sheets({version: "v4", auth});
		const getSheets = promisify(api.spreadsheets.values.update.bind(api.spreadsheets.values));
		return getSheets(
			{
				spreadsheetId: spreadsheet,
				range: range,
				valueInputOption: "RAW",
				resource: {values: data}
			}
		);
	}).then(() => { 
		return 1;
	}).catch((err) => {
		return {err};
	});
}

exports.setSpreadsheetData = functions.https.onRequest((req, res) => {
	const teamNumber = req.body.team;
	let teamSubSheetID = null;
	getSubSheets().then(subSheets => {
		const sheetExists = false;
		console.log(createSubSheet(teamNumber));
		setTimeout(() => {
			for (const sheet of subSheets) {
				if (sheet.properties.title === teamNumber) {
					teamSubSheetID = sheet.properties.sheetId;
				}
			}
			res.send(subSheets);
		}, 2000);
	});
});


exports.helloWorld2 = functions.https.onRequest((request, response) => {
	if (request.method === "POST") {
		response.send(`Hello, ${request.body.name}!`);
	} else {
		response.send("Hello!");
		response.status(200);
	}
});
