from crewai import Agent, Task, Crew
from tools.profile_tools import analyze_student_profile, save_student_profile
from tools.job_crawler_tools import fetch_relevant_jobs, save_job_listings
from tools.relevance_tools import calculate_job_relevance, save_relevance_scores
from tools.explainer_tools import generate_match_explanation
from tools.auto_apply_tools import prepare_job_application, save_application
from tools.status_tracker_tools import track_application_status

def create_job_alert_workflow():
    # Profile Understanding Agent
    profile_agent = Agent(
        role='Profile Analyzer',
        goal='Understand student career goals and preferences',
        backstory='Expert at analyzing resumes and extracting career insights',
        tools=[analyze_student_profile, save_student_profile],
        verbose=True
    )
    
    # Job Crawler Agent
    crawler_agent = Agent(
        role='Job Finder',
        goal='Find relevant job opportunities',
        backstory='Specialized in discovering job opportunities that match student profiles',
        tools=[fetch_relevant_jobs, save_job_listings],
        verbose=True
    )
    
    # Relevance Scorer Agent
    scorer_agent = Agent(
        role='Match Evaluator',
        goal='Score job relevance accurately',
        backstory='Expert at evaluating job-candidate compatibility',
        tools=[calculate_job_relevance, save_relevance_scores],
        verbose=True
    )
    
    # Explainer Agent
    explainer_agent = Agent(
        role='Match Explainer',
        goal='Provide clear explanations for job matches',
        backstory='Skilled at translating complex matching logic into understandable explanations',
        tools=[generate_match_explanation],
        verbose=True
    )
    
    # Auto-Apply Agent
    apply_agent = Agent(
        role='Application Assistant',
        goal='Prepare tailored job applications',
        backstory='Expert at creating compelling, customized job applications',
        tools=[prepare_job_application, save_application],
        verbose=True
    )
    
    # Status Tracker Agent
    tracker_agent = Agent(
        role='Status Monitor',
        goal='Track application progress',
        backstory='Specialized in monitoring and updating application statuses',
        tools=[track_application_status],
        verbose=True
    )
    
    return {
        'profile_agent': profile_agent,
        'crawler_agent': crawler_agent,
        'scorer_agent': scorer_agent,
        'explainer_agent': explainer_agent,
        'apply_agent': apply_agent,
        'tracker_agent': tracker_agent
    }

def execute_job_alert_pipeline(student_data: dict):
    """Execute the complete job alert pipeline"""
    agents = create_job_alert_workflow()
    
    # Task 1: Analyze Profile
    profile_task = Task(
        description=f"Analyze student profile: {student_data}",
        agent=agents['profile_agent'],
        expected_output="Structured JSON with career goals and preferences"
    )
    
    # Task 2: Find Jobs
    crawler_task = Task(
        description="Find relevant job opportunities based on analyzed profile",
        agent=agents['crawler_agent'],
        expected_output="List of relevant job listings",
        context=[profile_task]
    )
    
    # Task 3: Score Relevance
    scorer_task = Task(
        description="Calculate relevance scores for found jobs",
        agent=agents['scorer_agent'],
        expected_output="Relevance scores for all jobs",
        context=[profile_task, crawler_task]
    )
    
    # Task 4: Generate Explanations
    explainer_task = Task(
        description="Generate explanations for high-scoring job matches",
        agent=agents['explainer_agent'],
        expected_output="Clear explanations for job relevance",
        context=[profile_task, crawler_task, scorer_task]
    )
    
    # Task 5: Prepare Applications
    apply_task = Task(
        description="Prepare applications for top-scoring jobs",
        agent=agents['apply_agent'],
        expected_output="Tailored application materials",
        context=[profile_task, crawler_task, scorer_task]
    )
    
    # Create and run crew
    crew = Crew(
        agents=list(agents.values()),
        tasks=[profile_task, crawler_task, scorer_task, explainer_task, apply_task],
        verbose=True
    )
    
    result = crew.kickoff()
    return result