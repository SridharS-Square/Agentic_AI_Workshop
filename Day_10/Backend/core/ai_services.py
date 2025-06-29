import os
from typing import List, Dict

from langchain_google_genai import GoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.docstore.document import Document
from langchain.prompts import PromptTemplate

from core.config import settings
from models.job import Job
from models.student import StudentProfileRead


class AIService:
    def __init__(self):
        if not settings.GEMINI_API_KEY:
            raise ValueError("GEMINI_API_KEY not found in environment variables.")
        
        self.llm = GoogleGenerativeAI(
            model='gemini-2.0-flash-lite',
            google_api_key=settings.GEMINI_API_KEY
        )

        self.embeddings = GoogleGenerativeAIEmbeddings(
            model="models/embedding-001", 
            google_api_key=settings.GEMINI_API_KEY
        )

    def create_vector_store_from_jobs(self, jobs: List[Job]) -> FAISS:
        """
        Creates a temporary FAISS vector store from a list of jobs for a single request.
        """
        documents = []
        for job in jobs:
            content = f"Title: {job.title}\nCompany: {job.company}\nDescription: {job.description}\nRequirements: {', '.join(job.requirements)}"
            doc = Document(page_content=content, metadata={"job_id": job.id})
            documents.append(doc)
        
        if not documents:
            return None

        return FAISS.from_documents(documents, self.embeddings)

    def create_profile_summary(self, student_profile: StudentProfileRead) -> str:
        """Generates a keyword-rich summary of a student's profile using LCEL."""
        prompt_template = PromptTemplate(
            input_variables=["profile_data"],
            template="""
            Analyze the following student profile JSON. Pay close attention to 'skills', 'experience', and especially the 'resume_text'.
            Your mission is to generate a comprehensive, single-paragraph summary rich with keywords that a job search engine would find valuable. This summary should weave together their key skills, experiences, and career aspirations.
            Student Profile Data: --- {profile_data} ---
            Rich Summary:
            """
        )
        summary_chain = prompt_template | self.llm
        profile_data_str = student_profile.model_dump_json(indent=2)
        summary = summary_chain.invoke({"profile_data": profile_data_str})
        return summary

    def explain_match(self, student_profile: StudentProfileRead, job: Job) -> str:
        """Generates a detailed explanation for a job match, including a gap analysis."""
        prompt = PromptTemplate(
            input_variables=["profile_data", "job_data"],
            template="""
            You are an expert Career Advisor. Your task is to write a compelling and honest analysis of a job match.
            Analyze the provided student profile and the job details, then generate a response in Markdown format.

            Here is the student's profile:
            ---
            {profile_data}
            ---

            Here are the job details:
            ---
            {job_data}
            ---

            Now, generate the analysis with the following sections:
            1.  **Overall Summary:** A confident, one-sentence summary of the match, acknowledging both strengths and weaknesses.
            2.  **Strengths & Synergies:** A bulleted list detailing how the student's skills and experiences *positively align* with the job requirements. Be specific.
            3.  **Bridging the Gap (The Missing Percentage):** This is the most important section. Analyze the job's core requirements and explicitly list the key skills, technologies, or experience levels that are mentioned in the job description but are *missing* from the student's profile. This section should explain why the match score isn't 100%.
            4.  **Actionable Advice:** Based on the gap analysis, suggest 1-2 concrete steps the student could take to become a stronger candidate for this type of role in the future (e.g., "Learn technology X," "Build a project using Y").
            """
        )
        explanation_chain = prompt | self.llm
        profile_data_str = student_profile.model_dump_json(indent=2)
        job_data_str = job.model_dump_json(indent=2)
        explanation = explanation_chain.invoke({"profile_data": profile_data_str, "job_data": job_data_str})
        return explanation
    