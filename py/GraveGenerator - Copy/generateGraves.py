import json
import datetime
import random

file = "EastLawn.json"

# f = open("people.txt", "r")
g = open(file, "w")
graves = {}
gravesArray = [["C", [1, 108]], ["B", [1, 182]], ["A", [1, 104]],  ["2", [1, 100]], ["1", [1, 160]], ["3", [1, 83]], ["4", [1, 83]]]
	
for g in gravesArray:

	row = g[0][0]
	numMin = g[1][0]
	numMax = g[1][1]

	for i in range(numMin, numMax + 1):

		# print(str(row), ":", i)


		if i == 1:

			graves[row] = {

			}

		graves[row][i] = {

		}

		for j in range(1, 7):
			
			graves[row][i][j] = {
				# "plotOwner": "",
				# "plotStatus": "",
				# "surname": "",
				# "fName": "",
				# "mName": "",
				# "lName": "",
				# "burialDate": "",
				# "dateOfBirth": "",
				# "dateOfDeath": "",
				# "graveLink": "",
				# "profilePicture": "",
				# "gravePictures": []
			}

		# 	graves[graveSite][graveID] = {

		# 		"Row": "",
		# 		"Number": "",
		# 		"x": 0,
		# 		"y": 0,
		# 		"People": {}
		# 	}

		# graves[graveSite][graveID]["People"][f"{lName}, {fName}"] = {
		# 	"First Name": fName,
		# 	"Last Name": lName,
		# 	"Birthdate": birthDate,
		# 	"Deathdate": deathDate,
		# 	"Age": age
		# }
		
		
# # print(graves)


# # parsed = json.loads(graves)

# # print(json.dump(graves, indent=2))

# graves.keys()
# print(json.dumps(graves, indent=2))	


with open(file, "w") as output:
	json.dump(graves, output)

print("File created in", file)


