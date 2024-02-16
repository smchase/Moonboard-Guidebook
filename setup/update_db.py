import requests, json
from mb_types import mb_types
import secret
import smtplib
from email.mime.text import MIMEText

URL = "https://moonboard.simonchase.com"

grade_map = {
	0: "5+ (V1)",
	1: "6A (V2)",
	2: "6A+ (V3)",
	3: "6B (V4)",
	4: "6B+ (V4)",
	5: "6C (V5)",
	6: "6C+ (V5)",
	7: "7A (V6)",
	8: "7A+ (V7)",
	9: "7B (V8)",
	10: "7B+ (V8)",
	11: "7C (V9)",
	12: "7C+ (V10)",
	13: "8A (V11)",
	14: "8A+ (V12)",
	15: "8B (V13)",
	16: "8B+ (V14)",
}

def send_email(subject, body, sender_email, sender_name, recipients, password):
    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = "{0} <{1}>".format(sender_name, sender_email)
    msg["To"] = ", ".join(recipients)
    smtp_server = smtplib.SMTP_SSL("smtp.gmail.com", 465)
    smtp_server.login(sender_email, password)
    smtp_server.sendmail(sender_email, recipients, msg.as_string())
    smtp_server.quit()

for mb in mb_types:
	print(f"Updating {mb} benchmarks")
	new = []
	try:
		with open(f"data/processed_{mb}.json", "r") as rfile:
			benchmarks = json.load(rfile)
			for climb in benchmarks:
				id = climb["id"]
				response = requests.get(f"{URL}/benchmarks/id/{id}").json()
				if len(response) == 0:
					# new benchmark
					requests.post(f"{URL}/benchmarks", json=climb)
					print("NEW:", climb["name"])
					new.append(climb)
				else:
					for field in climb:
						if climb[field] != response[0][field] and field != "date_created":
							# update benchmark
							requests.put(f"{URL}/benchmarks/id/{id}", json={field: climb[field]})
	except Exception as e:
		print(e)
		print("Terminated updates early")

	if len(new) > 0:
		try:
			with open(f"data/emails.json", "r") as rfile:
				emails = json.load(rfile)
				if len(emails[mb]) > 0:
					message = ""
					subject = f"{len(new)} New Benchmark{'s' if len(new) > 1 else ''}"
					for climb in new:
						message += f"Name: {climb['name']}\n"
						message += f"Grade: {grade_map[climb['grade']]}\n"
						message += f"Setter: {climb['setter']}\n"
						message += "\n"
					message += f"Check out the new benchmark{'s' if len(new) > 1 else ''} at {URL}."
					send_email(subject, message, secret.gmail_email, "Moonboard Guidebook", emails[mb], secret.gmail_password)
					print("Email sent")
		except Exception as e:
			print(e)
			print("Email failed to send")
			print("Climbs that should have been in email:", new)
