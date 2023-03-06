// An object defining booleans to check each field
// Yes, I know that this is probably an unsafe way to do this, 
// but at least this puts all of the checks in one place
// and makes them easy to access, understand and edit.

const checkObject = {
	"ids": ["event-id", "match-number", "team-number", "auto-taxi", "auto-high-cone", "auto-high-cube", "auto-mid-cone", "auto-mid-cube", "auto-low-cone", "auto-low-cube", "auto-picked", "auto-charge-station", "auto-path", "teleop-high-cone", "teleop-high-cube", "teleop-mid-cone", "teleop-mid-cube", "teleop-low-cone", "teleop-low-cube", "teleop-picked", "teleop-charge-station"],
	"event-id": "val != 0",
	"match-number": "0 < parseInt(val) && parseInt(val) <= 200",
	"team-number": "0 < parseInt(val) && parseInt(val) <= 9999",
	"auto-taxi": "val == true || val == false",
	"auto-high-cone": "0 <= parseInt(val) && parseInt(val) <= 6",
	"auto-high-cube": "0 <= parseInt(val) && parseInt(val) <= 3",
	"auto-mid-cone":  "0 <= parseInt (val) && parseInt(val) <= 6",
	"auto-mid-cube": "0 <= parseInt(val) && parseInt(val) <= 3",
	"auto-low-cone": "0 <= parseInt(val) && parseInt(val) <= 9",
	"auto-low-cube": "0 <= parseInt(val) && parseInt(val) <= 9",
	"auto-picked": "0 <= parseInt(val) && parseInt(val) <= 27",
	"auto-charge-station": "val == 'docked-engaged' || val == 'docked' || val == 'none'",
	"auto-path": "val != 0",
	"teleop-high-cone": "0 <= parseInt(val) && parseInt(val) <= 6",
	"teleop-high-cube": "0 <= parseInt(val) && parseInt(val) <= 3",
	"teleop-mid-cone": "0 <= parseInt(val) && parseInt(val) <= 6",
	"teleop-mid-cube": "0 <= parseInt(val) && parseInt(val) <= 3",
	"teleop-low-cone": "0 <= parseInt(val) && parseInt(val) <= 9",
	"teleop-low-cube": "0 <= parseInt(val) && parseInt(val) <= 27",
	"teleop-picked": "0 <= parseInt(val) && parseInt(val) <= 27",
	"teleop-charge-station": "val == 'docked-engaged' || val == 'docked' || val == 'parked' || val =='none'"
}

// Get value of given element ID
function getValue(id) {
	const element = document.getElementById(id);

	if (element.type == "checkbox") {
		return document.getElementById(id).checked; 
	} else if (element.type == "tel") {
		return parseInt(element.value);
	} else {
		return element.value;
	}

}

function increment(elementID) {
	let newValue = String(parseInt(getValue(elementID)) + 1);
	if (verifyValue(newValue, elementID)) {
		document.getElementById(elementID).value = newValue;
	} else {
		uiAlert(`Changing value of ${elementID} out of bounds`, "warn")
	}
}

function decrement(elementID) {
	let newValue = String(parseInt(getValue(elementID)) - 1);
	if (verifyValue(newValue, elementID)) {
		document.getElementById(elementID).value = newValue;
	} else {
		uiAlert(`Changing value of ${elementID} out of bounds`, "warn")
	}
}

// Get all fields as a JSON object
async function collectJSON() {
	return {
		"event-id": getValue("event-id"),
		"match-number": getValue("match-number"),
		"team-number": getValue("team-number"),
		"auto-taxi": getValue("auto-taxi"),
		"auto-high-cone": getValue("auto-high-cone"),
		"auto-high-cube": getValue("auto-high-cube"),
		"auto-mid-cone": getValue("auto-mid-cone"),
		"auto-mid-cube": getValue("auto-mid-cube"),
		"auto-low-cone": getValue("auto-low-cone"),
		"auto-low-cube": getValue("auto-low-cube"),
		"auto-picked": getValue("auto-picked"),
		"auto-charge-station": getValue("auto-charge-station"),
		"auto-path": await getAutoPath(),
		"teleop-high-cone": getValue("teleop-high-cone"),
		"teleop-high-cube": getValue("teleop-high-cube"),
		"teleop-mid-cone": getValue("teleop-mid-cone"),
		"teleop-mid-cube": getValue("teleop-mid-cube"),
		"teleop-low-cone": getValue("teleop-low-cone"),
		"teleop-low-cube": getValue("teleop-low-cube"),
		"teleop-picked": getValue("teleop-picked"),
		"teleop-charge-station": getValue("teleop-charge-station")
	};
}

// Verify a single value based on checkObject
function verifyValue(val, id) {
	let verifyResult;
	eval(`verifyResult = ${checkObject[id]}`);
	return verifyResult;
}

// Returns an array containing invalid values
async function verifyJSON() {
	let errArray = [];
	let checkData = await collectJSON();
	for (id in checkObject["ids"]) {
		console.log(checkData[checkObject["ids"][id]])
		if (!verifyValue(checkData[checkObject["ids"][id]], checkObject["ids"][id])) {
			errArray.push(checkObject["ids"][id])
		}
	}
	return errArray;
}

// A function to neatly display an alert on screen, use instead of alert()
function uiAlert(contents, type) { 
	if (type === undefined) {
		document.getElementById("alertDiv").style.backgroundColor = "red";
	} else if (type == "error") {
		document.getElementById("alertDiv").style.backgroundColor = "red";
	} else if (type == "warn") {
		document.getElementById("alertDiv").style.backgroundColor = "#e5e100";
	} else if (type == "success") {
		document.getElementById("alertDiv").style.backgroundColor = "#12e000"
	}

	document.getElementById("alertText").innerHTML = contents;
	document.getElementById("alertDiv").classList.add("slide-in");
	document.getElementById("alertDiv").style.visibility = "visible";
	setTimeout(() => {
		document.getElementById("alertDiv").classList.remove("slide-in");
		document.getElementById("alertDiv").classList.add("slide-out");
		setTimeout(() => {
			document.getElementById("alertDiv").classList.remove("slide-out");
			document.getElementById("alertDiv").style.visibility = "hidden";
		}, 500)
	}, 4000);
}

async function getEvents() {
	const url = `https://www.thebluealliance.com/api/v3/team/frc${getValue("team-number")}/events/simple`;
	const currentEvents = await (await fetch(url, { headers: { "X-TBA-Auth-Key": "Q8VmErPZQKVkOGqbT76NUCU4FhIurBBNVNhWRvRi2dAce33qRWxnCeMvFJntmFcY" } })).json();

	return [...currentEvents.slice(-3), { name: "Test Event", key: "test" }];
}

async function getTeam() {
	const url = "https://www.thebluealliance.com/api/v3/team/frc" + getValue("team-number");
	const response = await fetch(url, { headers: { "X-TBA-Auth-Key": "Q8VmErPZQKVkOGqbT76NUCU4FhIurBBNVNhWRvRi2dAce33qRWxnCeMvFJntmFcY"}});
	const teamJson = await response.json();
	const teamName = teamJson.nickname;

	document.getElementById("team-name").innerText = teamName;
	const eventDropdown = document.getElementById("event-id");
	const eventOptions = document.querySelectorAll(".eventOption");

	for (const event of eventOptions) {
		event.remove();
	}

	// Add options to the event dropdown
	for (const event of (await getEvents())) {
		const newOption = document.createElement("option");
		newOption.innerHTML = event.name;
		newOption.value = event.key;
		newOption.classList.add("eventOption");
		eventDropdown.appendChild(newOption);
	}
}

// Jank way to get a resized version of the canvas to convert to an image and store
function getResizedCanvas(canvas,newWidth,newHeight) {
    let tmpCanvas = document.createElement('canvas');
    tmpCanvas.width = newWidth;
    tmpCanvas.height = newHeight;

    let ctx = tmpCanvas.getContext('2d');
    ctx.drawImage(canvas,0,0,canvas.width,canvas.height,0,0,newWidth,newHeight);

    return tmpCanvas;
}

async function getAutoPath() {
	const canvas = getResizedCanvas(document.getElementById("defaultCanvas0"), 638, 357);
	return canvas.toDataURL("image/webp");
}

function showPWAModal(os) {
	document.getElementById(`${os}PwaModal`).style.visibility = "visible";
	document.getElementsByClassName("wrapper")[0].style.opacity = "20%";
}

function ignorePWAModal() {
	try {
		document.getElementById("iosPwaModal").style.visibility = "hidden";
		document.getElementById("androidPwaModal").style.visibility = "hidden";
	} catch(err) {
		console.warn(err);
	}
	document.getElementsByClassName("wrapper")[0].style.opacity = "100%";
}

function isInstalled() {
	// For iOS
	if(window.navigator.standalone) return true;
  
	// For Android
	if(window.matchMedia('(display-mode: standalone)').matches) return true;
  
	// If neither is true, it's not installed
	return null;
}

function getPlatform() {
	let userAgent = navigator.userAgent || navigator.vendor || window.opera;

    if (/android/i.test(userAgent)) {
        return "android";
    }

    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return "ios";
    }

    return "unknown";
}

async function exportData() {
	if ((await verifyJSON()).length == 0) {
		fetch(`https://us-central1-scout-b39c0.cloudfunctions.net/pushResult?sessionData=${JSON.stringify(await collectJSON())}`)
			.then((response) => response.json())
			.then((data) => uiAlert(data, "success"))
			.catch((err) => uiAlert(err, "warn"));
	} else {
		uiAlert(`To push, fix errors in: ${JSON.stringify(await verifyJSON())}`);
	}
}

window.addEventListener("DOMContentLoaded", () => {
	if (!isInstalled() && (getPlatform() == "ios" || getPlatform() == "android")) {
		showPWAModal(getPlatform());
	}
})