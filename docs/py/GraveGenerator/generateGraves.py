import json
import datetime
import random


def randNum(min, max):
	return random.randint(min, max)

def randDate(yearMin, yearMax):

	day = random.randint(1,28)
	month = random.randint(1,12)
	year = random.randint(yearMin, yearMax)

	date = f"{month}-{day}-{year}"

	return date


f = open("people.txt", "r")
g = open("graves.json", "w")

grave_id = 1

graves = {}

for p in f.readlines():

	a = p.strip().split(";")

	if len(a) > 1:

		
		# print(p)
		# print(a)

		fName = a[0]
		lName = a[1]
		graveSite = a[2]
		graveRow = a[3]
		graveNumber = a[4]
		graveID = f'{graveRow}-{graveNumber}'
		# birthDate = a[5]
		# deathDate = a[6]


		### Random Dates
		birthDate = randDate(1960, 2010)
		deathDate = randDate(2011, 2020)


		i = birthDate.split("-")
		j = deathDate.split("-")

		birth_month = int(i[0])
		birth_day = int(i[1])
		birth_year = int(i[2])

		death_month = int(j[0])
		death_day = int(j[1])
		death_year = int(j[2])


		birthInfo = datetime.datetime(birth_year, birth_month, birth_day)
		deathInfo = datetime.datetime(death_year, death_month, death_day)

		age = deathInfo.year - birthInfo.year



		
		graveSiteStatus = graves.get(graveSite)

		if graveSiteStatus == None:
			graves[graveSite] = {}

		graveSiteStatus = graves.get(graveSite)

		graveStatus = graves[graveSite].get(graveID)
		# print(f"Grave Status: {graveStatus}, GraveSiteStatus: {graveSiteStatus}")


		


		# print(graves)
		if graveStatus == None:

			graves[graveSite][graveID] = {

				"Row": graveRow,
				"Number": graveNumber,
				"x": 0,
				"y": 0,
				"People": {}
			}

		graves[graveSite][graveID]["People"][f"{lName}, {fName}"] = {
			"First Name": fName,
			"Last Name": lName,
			"Birthdate": birthDate,
			"Deathdate": deathDate,
			"Age": age
		}
		
		
# print(graves)


# parsed = json.loads(graves)

# print(json.dump(graves, indent=2))

graves.keys()
print(json.dumps(graves, indent=2))	

# print(graves)
with open("graves.json", "w") as output:
	json.dump(graves, output)


