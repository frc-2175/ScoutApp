const compList = ["2023ndgf", "2023wila"];
const key = "Q8VmErPZQKVkOGqbT76NUCU4FhIurBBNVNhWRvRi2dAce33qRWxnCeMvFJntmFcY";
const fs = require("fs");

async function getTeamsAtComp(comp) {
	const url = `https://www.thebluealliance.com/api/v3/event/${comp}/teams`;
	const currentEvents = await (await fetch(url, { headers: { "X-TBA-Auth-Key": key } })).text();
	return currentEvents;
}

async function writeToFile(content) {
	try {
		await fs.writeFile("out.json", content, () => {});
	  } catch (err) {
		console.log(err);
	  }
	  return;
}

for (compIndex in compList) {
	getTeamsAtComp(compList[compIndex])
		.then(comp => { writeToFile(comp) })
}