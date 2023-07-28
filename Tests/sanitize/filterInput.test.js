const filterInput = require('./filterInput.js')
var script = "<script>console.log('SCRIPT IS WORKING!!!');</script>"
var brackets = "{Testing 123}(Testing 123)[Testing 123]"
var name = "John Smith"
var date = "10-20-2019"
var numbers = 329430294

describe("Filter Name / String", () => {
    test("Filter Alphabet", () => { expect(filterInput(`${name}`, "toStr")).toEqual(name)});
    test("Filter out Scripts", () => { expect(filterInput(`${script}${name}${brackets}${script}{Testing 123}(Testing 123)[Testing 123]`, "toStr")).toEqual(name)});
    test("Filter out Dates", () => { expect(filterInput(`${name}${date}`, "toStr")).toEqual(name)});
    test("Filter out Numbers", () => { expect(filterInput(`${name}${numbers}`, "toStr")).toEqual(name)});
});


describe("Covert String to Date", () => {
    test("Filter out Alphabet", () => { expect(filterInput(`${name}${date}`, "toDate")).toEqual(date)});
    test("Filter out Scripts", () => { expect(filterInput(`${script}${date}${script}`, "toDate")).toEqual(date)});
    test("Filter out Scripts and Alphabet", () => { expect(filterInput(`${name}${script}${date}${brackets}`, "toDate")).toEqual(date)});
    test("Only get first matching date", () => { expect(filterInput(`${numbers}${date}`, "toDate")).toEqual(date)});
});


describe("Covert String to Number", () => {
    test("Filter out Alphabet", () => { expect(filterInput(`${name}${numbers}`, "toInt")).toEqual(numbers)});
    test("Filter out Scripts", () => { expect(filterInput(`${script}${numbers}${script}`, "toInt")).toEqual(numbers)});
    test("Filter out Scripts and Alphabet", () => { expect(filterInput(`${name}${script}${numbers}${brackets}`, "toInt")).toEqual(numbers)});
    
    test("Filter to only numbers", () => { expect(filterInput(`${numbers}${date}`, "toInt")).toEqual(Number(`${numbers}${filterInput(date, "toInt")}`))});
});
