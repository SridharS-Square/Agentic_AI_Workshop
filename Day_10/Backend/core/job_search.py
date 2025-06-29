import os
import requests
from typing import List, Dict
from pydantic import ValidationError

from models.job import Job
from .config import settings

def search_realtime_jobs(query: str, location: str) -> List[Job]:
    """
    Searches for real-time jobs using SerpApi and returns them as a list of Job models.
    """
    if not settings.SERPAPI_API_KEY:
        print("Warning: SERPAPI_API_KEY not found. Returning empty list.")
        return []

    full_query = f"{query} in {location}"
    
    params = {
        "engine": "google_jobs",
        "q": full_query,
        "api_key": settings.SERPAPI_API_KEY,
    }

    print(f"Fetching real-time jobs from SerpApi with query: '{full_query}'")
    
    try:
        response = requests.get("https://serpapi.com/search.json", params=params)
        response.raise_for_status()
        data = response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching data from SerpApi: {e}")
        return []

    if "error" in data:
        print(f"SerpApi returned an error: {data['error']}")
        return []
    
    jobs_list = data.get("jobs_results", [])
    
    parsed_jobs = []
    for i, job_data in enumerate(jobs_list):
        synthetic_description = job_data.get("description", "") 
        if not synthetic_description:
             extensions_str = " | ".join(job_data.get("extensions", []))
             synthetic_description = f"{job_data['title']} at {job_data['company_name']}. Location: {job_data.get('location', 'N/A')}. Details: {extensions_str}"
             
        job_dict = {
            "id": i + 1,
            "title": job_data.get("title"),
            "company": job_data.get("company_name"),
            "location": job_data.get("location"),
            "type": job_data.get("detected_extensions", {}).get("schedule_type", "Not specified"),
            "description": synthetic_description,
            "requirements": job_data.get("job_highlights", []),
            "posted": job_data.get("detected_extensions", {}).get("posted_at", "N/A"),
            "apply_link": job_data.get("apply_options")[0].get("link")
        }
        
        try:
            parsed_jobs.append(Job(**job_dict))
        except ValidationError as e:
            print(f"Skipping a job due to validation error: {e}")

    print(f"Successfully fetched and parsed {len(parsed_jobs)} jobs.")
    return parsed_jobs