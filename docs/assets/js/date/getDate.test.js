import { getDate } from "./getDate";

test('Converts Date:str to Date:obj', () => {

	expect(getDate('2022')).toBe({'year': 2022})

});