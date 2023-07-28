function yearDiff(d1, d2) {

	let date1 = new Date(d1);
	let date2 = new Date(d2);

	let d1Arr = d1.split("-")
	let d2Arr = d2.split("-")

	let d1ArrYear = d1Arr[d1Arr.length - 1]
	let d2ArrYear = d2Arr[d2Arr.length - 1]

	let d2YearVal = Number.isInteger(parseInt(d2ArrYear)) ? parseInt(d2ArrYear) : NaN;
	let d1YearVal = Number.isInteger(parseInt(d1ArrYear)) ? parseInt(d1ArrYear) : NaN;

	let d2Time = date2.getTime();
	let d1Time = date1.getTime();

	let timeYearDiff = Math.floor((d2Time - d1Time) / 31536000000);
	let yearDiff = Math.floor(d2YearVal - d1YearVal)


	if (isNaN(timeYearDiff)) {

		if (isNaN(yearDiff)) { yearDiff = "Unknown" } else if (yearDiff == 0) { yearDiff = "Less than 1 year" }

		return yearDiff

	}

	if (timeYearDiff == 0) { timeYearDiff = "Less than 1 year" }

	return timeYearDiff

}

module.exports = yearDiff;