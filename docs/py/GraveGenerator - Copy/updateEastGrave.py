import json
from selenium import webdriver

PATH = "C:\chromedriver.exe"
letters = "ABCDEF"


eFile = open("EastLawn.json", "r")
data = json.load(eFile)
eFile.close()


while True:

	try:	

		block = input("Block Number : ").upper()
		lotNum = input("Lot Number : ")
		gravePlotNum = input("Grave Lot Number (1-6) : ")
		

		tmp = data[block][lotNum][gravePlotNum]
		print(json.dumps(tmp, indent=2, sort_keys=False))


		numPeople = int(input("How many people are burried on this spot? : "))
		# print(numPeople)

		for k in range (0, numPeople):


			a = letters[k]
			tmp[a] = {}

			

			print(f"\nBlock {block}, Lot {lotNum} - {gravePlotNum}:{a}\n")


			plotOwner = input("Plot Owner : ")
			plotStatus = input("Plot Status : ")
			surname = input("Surname : ")
			fName = input("First Name : ")
			mName = input("Middle Name : ")
			lName = input("Last Name : ")
			otherInfo = input("Any other information (Infant of ... , Civil War, etc.) : ")


			driver = webdriver.Chrome(PATH)
			driver.set_window_position(2000, 0)
			driver.maximize_window()
			driver.get(f"https://www.findagrave.com/memorial/search?firstname={fName}&middlename=&lastname={lName}&birthyear=&birthyearfilter=&deathyear=&deathyearfilter=&location=Augusta%2C+Eau+Claire+County%2C+Wisconsin%2C+United+States+of+America&locationId=city_160342&memorialid=&mcid=&linkedToName=&datefilter=&orderby=")

			burialDate = input("Burial Date (YYYY-MM-DD or MM-YYYY or YYYY) : ")
			birthDate = input("Date of Brith (YYYY-MM-DD or MM-YYYY or YYYY) : ")
			deathDate = input("Death Date (YYYY-MM-DD or MM-YYYY or YYYY) : ")
			findGraveLink = input("Find a Grave Website Link : ")
			profilePicture = input("Profile Picture : ")


			gravePictures = []
			gravePicture = input("Grave Site Picture() : ")

			if gravePicture != "":
				gravePictures.append(gravePicture)
				while gravePicture != "":
					gravePicture = input("Grave Site Picture() : ")

					if gravePicture != "":
						gravePictures.append(gravePicture)
			
			driver.close()

			tmp[a]["plotOwner"] = plotOwner
			tmp[a]["plotStatus"] = plotStatus
			tmp[a]["surname"] = surname
			tmp[a]["fName"] = fName
			tmp[a]["mName"] = mName
			tmp[a]["lName"] = lName
			tmp[a]["burialDate"] = burialDate
			tmp[a]["dateOfBirth"] = birthDate
			tmp[a]["dateOfDeath"] = deathDate
			tmp[a]["otherInfo"] = otherInfo
			tmp[a]["graveLink"] = findGraveLink
			tmp[a]["profilePicture"] = profilePicture
			tmp[a]["gravePictures"] = gravePictures

		# print(json.dumps(tmp, indent=2, sort_keys=False))

		data[block][lotNum][gravePlotNum][a] = tmp[a]

		# print(json.dumps(data, indent=2, sort_keys=False))
			

		print(f"Added {fName} {lName} to JSON file.\n\n")





	except Exception as e:
		print(e)


	f = open("EastLawn.json", "w")
	json.dump(data, f)
	f.close()





