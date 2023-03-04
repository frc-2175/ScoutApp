// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
const functions = require('firebase-functions');
// import { AsyncParser } from '@json2csv/node';

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');
admin.initializeApp({
	storageBucket: "scout-b39c0.appspot.com"
});

exports.pushResult = functions.https.onRequest(async (req, res) => {
	const resultData = JSON.parse(req.query.sessionData);
	let writeResult;
	try {
		writeResult = await admin.firestore().collection(`${resultData["event-id"]}`).add(resultData);
	} catch(err) {
		res.json({result: `Failed to write item to DB, threw err "${err}"`, code: 500});
	}
	res.json({result: `Wrote item to DB with ID ${writeResult.id}`, code: 200});
});



// exports.getCSV = functions.https.onRequest(async (req, res) => {
// 	const event = req.query.event

// 	const opts = {};
// 	const transformOpts = {};
// 	const asyncOpts = {};
// 	const parser = new AsyncParser(opts, transformOpts, asyncOpts);

// 	const csv = await parser.parse(await admin.firestore().collection(`${event}`).get().json).promise();

// 	res.json({data: csv});
// });