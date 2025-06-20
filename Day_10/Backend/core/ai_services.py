import os
import traceback
from typing import List, Dict

from litellm import completion
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_community.vectorstores import FAISS
from langchain.docstore.document import Document
from crewai import Agent, Task, Crew, Process, LLM

from langchain_google_genai import HarmBlockThreshold, HarmCategory

from .config import settings
from models.job import Job
from models.student import StudentProfile

class AIService:
    def __init__(self):
        os.environ["OPENAI_API_KEY"] = "NA" 
        
        if not settings.GEMINI_API_KEY:
            raise ValueError("GEMINI_API_KEY not found in environment variables.")
        
        os.environ["GOOGLE_API_KEY"] = settings.GEMINI_API_KEY

        self.llm = LLM(
            model='gemini/gemini-2.0-flash',
            api_key=settings.GEMINI_API_KEY
        )

        # Change this line:
        self.embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001", google_api_key=settings.GEMINI_API_KEY) 
        # NOT "google/embedding-001"
        self.vector_store = None

    def index_jobs(self, jobs: List[Job]):
        """Creates a FAISS vector store from a list of jobs."""
        documents = []
        for job in jobs:
            content = f"Title: {job.title}\nCompany: {job.company}\nDescription: {job.description}\nRequirements: {', '.join(job.requirements)}"
            doc = Document(page_content=content, metadata={"job_id": job.id})
            documents.append(doc)
        
        if not documents:
            print("No jobs to index.")
            return

        self.vector_store = FAISS.from_documents(documents, self.embeddings)
        print(f"Successfully indexed {len(jobs)} jobs.")

    def match_jobs(self, student_profile: StudentProfile, top_k: int = 5) -> List[Dict]:
        """Finds the best job matches for a student using RAG."""
        if not self.vector_store:
            return []

        profile_summary = (
            f"Student Profile:\n"
            f"- Skills: {', '.join(student_profile.skills)}\n"
            f"- Experience: {student_profile.experience}\n"
            f"- Desired Job Types: {', '.join(student_profile.jobTypes)}"
        )
        
        results = self.vector_store.similarity_search_with_score(profile_summary, k=top_k)

        matched_jobs = []
        for doc, score in results:
            job_id = doc.metadata.get("job_id")
            if job_id:
                match_percentage = round((1 - score) * 100)
                matched_jobs.append({"job_id": job_id, "match_score": max(0, min(100, match_percentage))})
        
        return matched_jobs

    def explain_match(self, student_profile: StudentProfile, job: Job) -> str:
        """Generates a detailed explanation for a job match using CrewAI."""
        
        profile_summary = f"""
        **Student Profile:**
        - Name: {student_profile.name}
        - Major: {student_profile.major}
        - Skills: {', '.join(student_profile.skills)}
        - Experience: {student_profile.experience}
        - Preferred Job Types: {', '.join(student_profile.jobTypes)}
        """

        job_details = f"""
        **Job Details:**
        - Title: {job.title} at {job.company}
        - Description: {job.description}
        - Requirements: {', '.join(job.requirements)}
        """

        profile_analyst = Agent(
            role='Student Profile Analyst',
            goal=f'Analyze the provided student profile and extract key strengths, skills, and career interests.',
            backstory='An expert career coach who excels at understanding a student\'s potential from their profile.',
            verbose=False,
            allow_delegation=False,
            llm=self.llm
        )

        job_scrutinizer = Agent(
            role='Job Description Scrutinizer',
            goal='Dissect the job description to identify the most critical requirements, skills, and company culture hints.',
            backstory='A seasoned recruiter who can read between the lines of any job posting.',
            verbose=False,
            allow_delegation=False,
            llm=self.llm
        )

        match_synthesizer = Agent(
            role='Match Synthesizer & Career Advisor',
            goal='Create a compelling, structured, and encouraging explanation of the match between the student and the job. The output must be in Markdown format.',
            backstory='A persuasive career advisor who helps students see their potential and understand why an opportunity is right for them.',
            verbose=True,
            allow_delegation=False,
            llm=self.llm
        )
        
        task1 = Task(
            description=f'Analyze this student profile and summarize their top 5 key qualifications and career goals.\n\nProfile:\n{profile_summary}',
            agent=profile_analyst,
            expected_output="A bulleted list of the student's top 5 qualifications and career goals."
        )

        task2 = Task(
            description=f'Analyze this job posting and identify the top 5 essential requirements and skills needed for the role.\n\nJob Posting:\n{job_details}',
            agent=job_scrutinizer,
            expected_output="A bulleted list of the job's top 5 requirements."
        )

        task3 = Task(
            description=(
                'Using the analyses from the other agents, synthesize a final match explanation. '
                'The explanation should be structured in Markdown with the following sections:\n'
                '1. **Overall Match Score & Summary:** Give a confident, one-sentence summary of why this is a strong match.\n'
                '2. **Strengths & Synergies:** A bulleted list detailing how the student\'s skills and experience align directly with the job requirements. Be specific.\n'
                '3. **Areas for Growth:** Gently point out 1-2 areas where the student might need to learn more, framing it as an opportunity.\n'
                '4. **Suggested Talking Points for an Interview:** Provide 2-3 specific points the student could mention in an interview to connect their experience to the job.'
            ),
            agent=match_synthesizer,
            context=[task1, task2],
            expected_output="A well-formatted Markdown document with the specified sections."
        )
        
        match_crew = Crew(
            agents=[profile_analyst, job_scrutinizer, match_synthesizer],
            tasks=[task1, task2, task3],
            process=Process.sequential,
            verbose=True
        )

        try:
            result = match_crew.kickoff()
            return result
        except Exception as e:
            print("----------------- DETAILED ERROR TRACEBACK -----------------")
            traceback.print_exc()
            print("-----------------------------------------------------------")
            raise e