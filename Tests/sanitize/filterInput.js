function filterInput(input, strType) {

	var remove = []

	const DATE_PATTERN = /((0[1-9]|1[0-2]|[1-9])-(0[1-9]|[12][0-9]|3[01])-(18|19|20)\d\d|(0[1-9]|1[0-2]|[1-9])-(18|19|20)\d\d|(18|19|20)\d\d)/;
	const SCRIPT_PATTERN = /\<(.*?)\>(.*?)\<(.*?)\>|\<(.*?)\>|\((.*?)\)|\[(.*?)\]|\{(.*?)\}/g

	switch (strType) {
		case "toStr":
			remove = ["scripts", "toStr"];
			break;
		case "toDate":
			remove = ["scripts", "toDate"];
			break;
		case "toInt":
			remove = ["scripts", "toInt"];
			break;
	}

	for (const r in remove) {
		switch (remove[r]) {
			case "scripts": 
				input = input.replace(SCRIPT_PATTERN, "");
				break;
			case "toStr":
				input = input.replace(/[^a-zA-z ]/g, "");
				break;
			case "toInt":
				input = Number(input.replace(/[^0-9]/g, ""));
				break;
			case "toDate":
				input = input.match(DATE_PATTERN)[0];
				break;
			case "extraSpaces":
				input = input.replace(/[\s]/g, "");
				break;
		}
	}
	return input
}

module.exports = filterInput;