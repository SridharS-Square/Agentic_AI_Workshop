# scraper.py

import json
from requests_html import HTMLSession
from data.store import db  # We import this just to get the model structure
from models.job import Job

# The URL we will scrape
# You can change 'Python+Developer' to another role or 'USA' to another location
URL = "https://www.indeed.com/jobs?q=Python+Developer&l=USA"

print("Starting the job scraping process...")

session = HTMLSession()
response = session.get(URL)

# This renders the JavaScript on the page, which is often needed to see the content
response.html.render(sleep=1, timeout=20)

job_listings = []
job_id_counter = 1

# Find all job card elements on the page
# The selector '.jobsearch-ResultsList li' targets list items in the results list
job_cards = response.html.find('.jobsearch-ResultsList > li')

print(f"Found {len(job_cards)} potential job cards.")

for card in job_cards:
    try:
        # Extract data using CSS selectors
        title = card.find('h2.jobTitle > a > span', first=True).text
        company = card.find('span.companyName', first=True).text
        location = card.find('div.companyLocation', first=True).text
        
        # The description is usually a summary on the results page
        description = card.find('div.job-snippet', first=True).text.strip().replace('\n', ' ')
        
        # We'll use a placeholder for salary and requirements as they are not always on the card
        job_data = {
            "id": job_id_counter,
            "title": title,
            "company": company,
            "location": location,
            "type": "Full-time",  # Placeholder
            "salary": "Competitive", # Placeholder
            "description": description,
            "requirements": ["Python", "Software Development"], # Placeholder
            "posted": "Recently" # Placeholder
        }

        # Validate the data with our Pydantic model
        job_listings.append(Job(**job_data).model_dump())
        job_id_counter += 1

    except AttributeError:
        # This handles cases where a card is an ad or has a different structure
        print("Skipping a card that couldn't be parsed (likely an ad).")
        continue

print(f"Successfully scraped {len(job_listings)} jobs.")

# Save the data to a JSON file
with open('scraped_jobs.json', 'w') as f:
    json.dump(job_listings, f, indent=4)

print("Scraped job data saved to scraped_jobs.json")