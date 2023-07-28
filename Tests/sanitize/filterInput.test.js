const filterInput = require('./filterInput.js')
var script = "<script>console.log('SCRIPT IS WORKING!!!');</script>"
var brackets = "{Testing 123}(Testing 123)[Testing 123]"
var name = "John Smith"
var date = "10-20-2019"
var numbers = 329430294

describe("Filter Name", () => {
    test("Filter Alphabet", () => { expect(filterInput(`${name}`, "toString")).toEqual('John Smith')});
    test("Filter out Scripts", () => { expect(filterInput(`${script}${name}${brackets}${script}{Testing 123}(Testing 123)[Testing 123]`, "toString")).toEqual('John Smith')});
    test("Filter out Dates", () => { expect(filterInput(`${name}${date}`, "toString")).toEqual('John Smith')});
    test("Filter out Numbers", () => { expect(filterInput(`${name}${numbers}`, "toString")).toEqual('John Smith')});
});


describe("Covert to Date", () => {
    test("Filter out Alphabet", () => { expect(filterInput(`${name}${date}`, "toDate")).toEqual(date)});
    test("Filter out Scripts", () => { expect(filterInput(`${script}${date}${script}`, "toDate")).toEqual(date)});
    test("Filter out Scripts and Alphabet", () => { expect(filterInput(`${name}${script}${date}${brackets}`, "toDate")).toEqual(date)});
    
    test("Only get first matching date", () => { expect(filterInput(`${numbers}${date}`, "toDate")).toEqual(date)});
});


// describe("Removes Scripts", () => {
//     test("Test 1", () => { expect(filterInput(`${script}`, ["scripts"])).toEqual('')});
//     test("Test 2", () => { expect(filterInput(`${name}${script}`, ["scripts"])).toEqual(name)});
//     test("Test 3", () => { expect(filterInput(`${date}${script}`, ["scripts"])).toEqual(date)});
//     test("Test 4", () => { expect(filterInput(`${numbers}${script}`, ["scripts"])).toEqual(`${numbers}`)});
// });