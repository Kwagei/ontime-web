import csv

# Define the data as a list of dictionaries
data = [
		{
			"first_name": "Isabella",
			"last_name": "Williams",
			"address": "20 Sunset Ave",
			"msisdn": "231775998321",
			"email": "isawill2@gmail.com"
		},
		{
			"first_name": "Eve",
			"last_name": "Wilson",
			"address": "789 Oak Street",
			"msisdn": "231887224104",
			"email": "eve.wilson0@example.com"
		},
		{
			"first_name": "David",
			"last_name": "Jones",
			"address": "20 Sunset Ave",
			"msisdn": "231886210569",
			"email": "davjon0@gmail.com"
		},
		{
			"first_name": "Alice",
			"last_name": "Rodriguez",
			"address": "20 Sunset Ave",
			"msisdn": "231778880894",
			"email": "alice.rodriguez0@example.com"
		},
		{
			"first_name": "Fiona",
			"last_name": "Moore",
			"address": "456 Elmen St",
			"msisdn": "231778049052",
			"email": "fiona.moore0@example.com"
		},
		{
			"first_name": "David",
			"last_name": "Garcia",
			"address": "10 Sunrise Blvd",
			"msisdn": "231776050253",
			"email": "dgarcia0@gmail.com"
		},
		{
			"first_name": "David",
			"last_name": "Miller",
			"address": "Madison Square Garden",
			"msisdn": "231881098387",
			"email": "davmil0@gmail.com"
		},
		{
			"first_name": "Isabella",
			"last_name": "Williams",
			"address": "123 Main Street",
			"msisdn": "231776242107",
			"email": "isabella.williams0@example.com"
		},
		{
			"first_name": "Bob",
			"last_name": "Davis",
			"address": "456 Elmen Street",
			"msisdn": "231772521042",
			"email": "bobdavis0@example.com"
		},
		{
			"first_name": "Fiona",
			"last_name": "Moore",
			"address": "Bassa Town, Redlight, Paynesille",
			"msisdn": "231779287349",
			"email": "fiomoo0@gmail.com"
		},
		{
			"first_name": "Alice",
			"last_name": "Wilson",
			"address": "20 Sunset Ave",
			"msisdn": "231881374899",
			"email": "aliwil0@gmail.com"
		},
		{
			"first_name": "Eve",
			"last_name": "Rodriguez",
			"address": "123 Main Street",
			"msisdn": "231880478020",
			"email": "everod0@gmail.com"
		}
	]

# Define the CSV file name
filename = "contacts.csv"

# Open the file in write mode with UTF-8 encoding
with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
  # Create a csv writer object
  writer = csv.writer(csvfile)

  # Write the header row
  fieldnames = ["first_name", "last_name", "address", "msisdn", "email"]
  writer.writerow(fieldnames)

  # Write each data row to the CSV file
  for row in data:
    writer.writerow(row.values())

print(f"CSV file created successfully: {filename}")
