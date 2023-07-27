const getDate =  require("./getDate.js")


// test("'' -> ", () => { expect(getDate('').year).toEqual()});
describe("Converts Strings to Objects", () => {
	test("Date:str -> Type(Obj)", () => { expect(typeof(getDate('2022'))).toEqual("object")});
	test("'Unknown'-> Type(Obj)", () => { expect(typeof(getDate('Unknown'))).toEqual("object")});
	test("'' -> Type(Obj)", () => { expect(typeof(getDate(''))).toEqual("object")});
});


describe("Get Valid Year", () => {

	// Year Template
	// test("'' -> ", () => { expect(getDate('').year).toEqual()});
	test("10-20-2022 -> 2022", () => { expect(getDate('10-20-2022').year).toEqual(2022)});
	test("1-20-1976 -> 1976", () => { expect(getDate('10-20-1976').year).toEqual(1976)});
	test("10-2011 -> 2011", () => { expect(getDate('10-2011').year).toEqual(2011)});
	test("2-1876 -> 1876", () => { expect(getDate('2-1876').year).toEqual(1876)});
	test("1957 -> 1957", () => { expect(getDate('1957').year).toEqual(1957)});
	test("'' -> 'Unknown'", () => { expect(getDate('').year).toEqual('Unknown')});
	test("'Some Random String' -> 'Unknown'", () => { expect(getDate('Some Random String').year).toEqual('Unknown')});

});


describe("Get Valid Month", () => {


	// Month Template
	// test("'' -> ", () => { expect(getDate('').year).toEqual()});
	test("10-20-2022 -> 2022", () => { expect(getDate('10-20-2022').month).toEqual(10)});
	test("1-20-1976 -> 1976", () => { expect(getDate('1-20-1976').month).toEqual(1)});
	test("10-2011 -> 2011", () => { expect(getDate('10-2011').month).toEqual(10)});
	test("2-1876 -> 1876", () => { expect(getDate('2-1876').month).toEqual(2)});
	test("1957 -> 1957", () => { expect(getDate('1957').month).toEqual(undefined)});
	test("'' -> 'Unknown'", () => { expect(getDate('').month).toEqual(undefined)});
	test("'Some Random String' -> 'Unknown'", () => { expect(getDate('Some Random String').month).toEqual(undefined)});

});


describe("Get Valid Day", () => {


	// Month Template
	// test("'' -> ", () => { expect(getDate('').year).toEqual()});
	test("10-20-2022 -> 2022", () => { expect(getDate('10-20-2022').day).toEqual(20)});
	test("1-20-1976 -> 1976", () => { expect(getDate('1-20-1976').day).toEqual(20)});
	test("10-2011 -> 2011", () => { expect(getDate('10-2011').day).toEqual(undefined)});
	test("2-1876 -> 1876", () => { expect(getDate('2-1876').day).toEqual(undefined)});
	test("1957 -> 1957", () => { expect(getDate('1957').day).toEqual(undefined)});
	test("'' -> 'Unknown'", () => { expect(getDate('').day).toEqual(undefined)});
	test("'Some Random String' -> 'Unknown'", () => { expect(getDate('Some Random String').month).toEqual(undefined)});

});
