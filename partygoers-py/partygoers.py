import datetime as dt
import time

import requests
import json

requestURL = "https://api.meetup.com/2/open_events?&country=us&state=ma&city=Boston&format=json&limited_events=true&topic=softwaredev&time=0%2C7d&radius=50&page=0&key=6f5057325cd2b5551e4d1d6c681e24"
rawData = requests.get(requestURL)
refinedData = json.loads(rawData.text)
file = open('out.html', 'w+', encoding='utf-8')
for event in refinedData["results"]:
		file.write("<h3>"+ event["name"] + "</h3>")
		if 'venue' in event:
			file.write("<p> Address: " + event["venue"]["address_1"] + "</p>")
			file.write("<p> Place: " + event["venue"]["name"] + "</p>")
		file.write("<p> Start time: " + str(dt.datetime.strptime((time.ctime(event["time"] / 1000)), "%a %b %d %H:%M:%S %Y")) + "</p>")
		if 'description' in event:
			file.write(event["description"])
