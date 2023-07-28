function filterInput(input, strType) {

	var remove = []

	const DATE_PATTERN = /((0[1-9]|1[0-2]|[1-9])-(0[1-9]|[12][0-9]|3[01])-(18|19|20)\d\d|(0[1-9]|1[0-2]|[1-9])-(18|19|20)\d\d|(18|19|20)\d\d)/;


	switch (strType) {
		case "toString":
			remove = ["scripts", "special", "numbers"];
			break;
		case "toDate":
			remove = ["scripts", "toDate"];
			break;
	}

	for (const r in remove) {
		switch (remove[r]) {
			case "alphabet":
				input = input.replace(/[a-zA-Z]/g, "")
				break;
			case "numbers":
				input = input.replace(/[0-9]/g, "");
				break;
			case "scripts": 
				input = input.replace(/\<(.*?)\>(.*?)\<(.*?)\>|\<(.*?)\>|\((.*?)\)|\[(.*?)\]|\{(.*?)\}/g, "");
				break;
			case "special":
				input = input.replace(/[^a-zA-Z0-9 ]/g, "")
				break;
			case "spaces":
				input = input.replace(/[\s]/g, "");
				break;
			case "toDate":
				input = input.match(DATE_PATTERN)[0];
		}
	}
    console.log(input)
	return input
}

module.exports = filterInput;