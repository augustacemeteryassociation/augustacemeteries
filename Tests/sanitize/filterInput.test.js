const filterInput = require('./filterInput.js')
var script = "<script>console.log('SCRIPT IS WORKING!!!');</script>"
var name = "John Smith"
var date = "10-20-2019"
var numbers = 329430294

describe("Removes Alphabet", () => {
    test("Test 1", () => { expect(filterInput(`${name}`, ["alphabet"])).toEqual(' ')});
    test("Test 2", () => { expect(filterInput(`${name}${script}`, ["alphabet"])).toEqual(" <>.('  !!!');</>")});
    test("Test 3", () => { expect(filterInput(`${name}${date}`, ["alphabet"])).toEqual(` ${date}`)});
    test("Test 4", () => { expect(filterInput(`${name}${numbers}`, ["alphabet"])).toEqual(` ${numbers}`)});
});


describe("Removes Scripts", () => {
    test("Test 1", () => { expect(filterInput(`${script}`, ["scripts"])).toEqual('')});
    test("Test 2", () => { expect(filterInput(`${name}${script}`, ["scripts"])).toEqual(name)});
    test("Test 3", () => { expect(filterInput(`${date}${script}`, ["scripts"])).toEqual(date)});
    test("Test 4", () => { expect(filterInput(`${numbers}${script}`, ["scripts"])).toEqual(`${numbers}`)});
});