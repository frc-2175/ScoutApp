/* eslint-disable max-len */
const functions = require("firebase-functions");
const {google} = require("googleapis");
const {promisify} = require("util");

exports.helloWorld = functions.https.onRequest((req, res) => {
	google.auth.getClient({
		scopes: ["https://www.googleapis.com/auth/spreadsheets"],
	}).then((auth) => {
		const api = google.sheets({version: "v4", auth});
		const getSheets = promisify(api.spreadsheets.get.bind(api.spreadsheets));
		return getSheets(
			{spreadsheetId: "1fdK7eVIVfm9MuBK_5VBX4uxyVcmOcVRfqab9KZUpXKs"}
		);
	}).then(({data: {sheets}}) => { // This just prints out all Worksheet names as an example
		res.status(200).send({sheets});
	}).catch((err) => {
		res.status(500).send({err});
	});
});

exports.setSpreadsheetData = functions.https.onRequest((req, res) => {
	google.auth.getClient({
		scopes: ["https://www.googleapis.com/auth/spreadsheets"],
	}).then((auth) => {
		const api = google.sheets({version: "v4", auth});
		const getSheets = promisify(api.spreadsheets.values.update.bind(api.spreadsheets.values));
		return getSheets(
			{
				spreadsheetId: "1fdK7eVIVfm9MuBK_5VBX4uxyVcmOcVRfqab9KZUpXKs",
				range: "A2",
				valueInputOption: "RAW",
				resource: {"values": [[req.body.team]]}
		}
		);
	}).then(({data}) => { // This just prints out all Worksheet names as an example
		res.status(200).send({sheets});
	}).catch((err) => {
		res.status(500).send({err});
	});
});


exports.helloWorld2 = functions.https.onRequest((request, response) => {
	if (request.method == "POST") {
		response.send(`Hello, ${request.body.name}!`);
	} else {
		response.send("Hello!");
		response.status(200);
	}
});
