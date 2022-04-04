/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyCZaXFdEf3DJaOp5C3m1qp_LZ2RhW5_vBA",
	authDomain: "scout-b39c0.firebaseapp.com",
	databaseURL: "https://scout-b39c0-default-rtdb.firebaseio.com",
	projectId: "scout-b39c0",
	storageBucket: "scout-b39c0.appspot.com",
	messagingSenderId: "709936631965",
	appId: "1:709936631965:web:f5de22c8eb8fc69f354474",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const autoFields = [
	"autoHiGoal",
	"autoLoGoal",
	"autoMissed",
	"autoPicked",
	"taxi",
];

const teleopFields = [
	"teleHiGoal",
	"teleLoGoal",
	"teleMissed",
	"malfunc",
	"defense",
	"defended",
	"climb",
	"climbStart",
	"climbEnd",
	"success",
];

function writeMatchData(matchNumber, teamNumber, teleop, auto, notes, event) {
	const db = getDatabase();
	set(ref(db, `${event}/teams/${teamNumber}/${matchNumber}`), {
		matchNumber,
		teamNumber,
		teleop,
		auto,
		notes,
	});
}

/* eslint-disable no-unused-vars */
const key = "Q8VmErPZQKVkOGqbT76NUCU4FhIurBBNVNhWRvRi2dAce33qRWxnCeMvFJntmFcY";

function getValue(id) {
	const { value, checked } = document.getElementById(id);
	switch (typeof (value)) {
	case "number":
		return parseInt(value);
	case "string":
		console.log(checked !== undefined);
		console.log(value);
		if (checked) {
			return +checked;
		}
		return value;
	default:
	}
	return value;
}

function setValue(id, value) {
	document.getElementById(id).value = value;
}

function increment(id) {
	setValue(id, getValue(id) + 1);
}

function decrement(id) {
	setValue(id, Math.max(getValue(id) - 1, 0));
}

function clearFields() {
	const idList = [
		"matchNumber",
		"teamNumber",
		...teleopFields,
		...autoFields,
	];

	for (const id of idList) {
		setValue(id, "");
	}
}

function verifyMatchData() {
	const errList = [];

	if (getValue("matchNumber") === "") {
		errList.push("No match number set");
	}

	if (getValue("teamNumber") === "") {
		errList.push("No team number set");
	}

	if (Number.isNaN(getValue("teamNumber"))) {
		errList.push("Team number is NaN");
	}

	if (getValue("teamNumber") < 0 || getValue("teamNumber") > 9999) {
		errList.push("Team number too large/small");
	}

	if (document.getElementById("eventDropdown").value === "select-event") {
		errList.push("No event selected");
	}

	return errList;
}

async function getTeam() {
	const url = "https://www.thebluealliance.com/api/v3/team/frc" + getValue("teamNumber");
	const response = await fetch(url, { headers: { "X-TBA-Auth-Key": key } });
	const teamJson = await response.json();
	const teamName = teamJson.nickname;

	document.getElementById("teamName").innerText = teamName;

	const eventDropdown = document.getElementById("eventDropdown");

	const eventOptions = document.querySelectorAll(".eventOption");

	for (const event of eventOptions) {
		event.remove();
	}

	for (const event of (await getEvents())) {
		const newOption = document.createElement("option");
		newOption.innerHTML = event.name;
		newOption.value = event.key;
		newOption.classList.add("eventOption");
		eventDropdown.appendChild(newOption);
	}
}

async function getEvents() {
	const url = `https://www.thebluealliance.com/api/v3/team/frc${getValue("teamNumber")}/events/simple`;
	const currentEvents = await (await fetch(url, { headers: { "X-TBA-Auth-Key": key } })).json();

	return [...currentEvents.slice(-3), { name: "Test Event", key: "test" }];
}

function exportData() {
	const teleop = Object.fromEntries(
		teleopFields.map((name) => [name, getValue(name)]),
	);

	const auto = Object.fromEntries(
		autoFields.map((name) => [name, getValue(name)]),
	);

	const match = getValue("matchNumber");
	const team = getValue("teamNumber");
	const event = document.getElementById("eventDropdown").value;
	const notes = document.getElementById("notes").value;

	let submitError = null;
	const verifyErrs = verifyMatchData();

	if (verifyErrs.length > 0) {
		toasting.create({
			title: "Error!",
			text: `Error(s) in data, check team and match number and try again. (${JSON.stringify(verifyErrs)})`,
			timeout: 5000,
		});
	} else {
		try {
			writeMatchData(match, team, teleop, auto, notes, event);
		} catch (e) {
			submitError = e;
			console.error(e);
		} finally {
			if (submitError !== null) {
				toasting.create({
					title: "Error!",
					text: `Error posting data to DB: "${submitError}"`,
					timeout: 5000,
				});
			} else {
				toasting.create({
					title: "Success!",
					text: "Posted data to DB successfully.",
					timeout: 5000,
				});
				clearFields();
			}
		}
	}
}


function disableTouchScroll() {
	const canvasDom = document.getElementById("defaultCanvas0");
	canvasDom.addEventListener("touchstart", (event) => { event.preventDefault(); });
	canvasDom.addEventListener("touchmove", (event) => { event.preventDefault(); });
	canvasDom.addEventListener("touchend", (event) => { event.preventDefault(); });
	canvasDom.addEventListener("touchcancel", (event) => { event.preventDefault(); });
}

function dataURLtoBlob(dataurl) {
	const arr = dataurl.split(",");
	const mime = arr[0].match(/:(.*?);/)[1];
	const bstr = atob(arr[1]);
	let n = bstr.length;
	const u8arr = new Uint8Array(n);
	while (n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}
	return new Blob([u8arr], { type: mime });
}

window.getTeam = getTeam;
window.exportData = exportData;
window.increment = increment;
window.decrement = decrement;
window.verifyMatchData = verifyMatchData;
window.getValue = getValue;
window.getEvents = getEvents;
window.disableTouchScroll = disableTouchScroll;
window.dataURLtoBlob = dataURLtoBlob;
