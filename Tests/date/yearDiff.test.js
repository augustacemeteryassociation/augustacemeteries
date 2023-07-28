const yearDiff = require("./yearDiff");

var person1 = {
    'dob': '10-14-1973',
    'dod': '2-19-2039'
}

var person2 = {
    'dob': '10-14-1950',
    'dod': '11-2007'
}

var person3 = {
    'dob': '10-25-1937',
    'dod': '10-1997'
}

var person4 = {
    'dob': '02-19-1957',
    'dod': '2-19-2017'
}

var person5 = {
    'dob': '10-1875',
    'dod': '1-1953'
}

describe("Year Difference", () => {

    test("Person 1: Did not make it to their birthday", () => { expect(yearDiff(person1.dob, person1.dod)).toEqual(65)});
    test("Person 2: Made it past their birthday", () => { expect(yearDiff(person2.dob, person2.dod)).toEqual(57)});
    test("Person 3: Died same month as birthday, but day is unknown", () => { expect(yearDiff(person3.dob, person3.dod)).toEqual(60)});
    test("Person 4: Died on their birthday", () => { expect(yearDiff(person4.dob, person4.dod)).toEqual(60)});
    test("Person 5: Only year and day are known", () => { expect(yearDiff(person5.dob, person5.dod)).toEqual(77)});




});