# Smart Job Alert Relevance & Autopilot Apply Agent

An AI-powered system that autonomously filters job notifications, explains their relevance to student profiles, and prepares tailored job applications using LangGraph, CrewAI, and Gemini AI.

## 🏗️ System Architecture

```mermaid
graph TB
    subgraph "Frontend Layer"
        UI[Web Interface]
        API_DOCS[FastAPI Docs]
    end
    
    subgraph "API Layer"
        FASTAPI[FastAPI Server]
        ROUTES[Route Handlers]
        BG_TASKS[Background Tasks]
    end
    
    subgraph "Workflow Orchestration"
        CREWAI[CrewAI Orchestrator]
        LANGGRAPH[LangGraph Workflow]
    end
    
    subgraph "AI Agents"
        PROFILE[Profile Agent]
        CRAWLER[Job Crawler Agent]
        SCORER[Relevance Scorer Agent]
        EXPLAINER[Explainer Agent]
        APPLY[Auto-Apply Agent]
        TRACKER[Status Tracker Agent]
    end
    
    subgraph "Tools Layer"
        PROFILE_TOOLS[Profile Tools]
        CRAWLER_TOOLS[Job Crawler Tools]
        RELEVANCE_TOOLS[Relevance Tools]
        EXPLAINER_TOOLS[Explainer Tools]
        APPLY_TOOLS[Auto-Apply Tools]
        TRACKER_TOOLS[Status Tracker Tools]
    end
    
    subgraph "AI Services"
        GEMINI[Gemini AI]
        LLM[Language Models]
    end
    
    subgraph "Data Layer"
        SQLITE[(SQLite Database)]
        PROFILES[Student Profiles]
        JOBS[Job Listings]
        SCORES[Relevance Scores]
        APPLICATIONS[Applications]
    end
    
    subgraph "External Services"
        JOB_APIS[Job APIs<br/>LinkedIn/Indeed]
        EMAIL[Email Service]
    end
    
    %% Connections
    UI --> FASTAPI
    API_DOCS --> FASTAPI
    FASTAPI --> ROUTES
    ROUTES --> BG_TASKS
    BG_TASKS --> CREWAI
    CREWAI --> LANGGRAPH
    
    LANGGRAPH --> PROFILE
    LANGGRAPH --> CRAWLER
    LANGGRAPH --> SCORER
    LANGGRAPH --> EXPLAINER
    LANGGRAPH --> APPLY
    LANGGRAPH --> TRACKER
    
    PROFILE --> PROFILE_TOOLS
    CRAWLER --> CRAWLER_TOOLS
    SCORER --> RELEVANCE_TOOLS
    EXPLAINER --> EXPLAINER_TOOLS
    APPLY --> APPLY_TOOLS
    TRACKER --> TRACKER_TOOLS
    
    PROFILE_TOOLS --> GEMINI
    CRAWLER_TOOLS --> JOB_APIS
    RELEVANCE_TOOLS --> GEMINI
    EXPLAINER_TOOLS --> GEMINI
    APPLY_TOOLS --> GEMINI
    
    PROFILE_TOOLS --> SQLITE
    CRAWLER_TOOLS --> SQLITE
    RELEVANCE_TOOLS --> SQLITE
    APPLY_TOOLS --> SQLITE
    TRACKER_TOOLS --> SQLITE
    
    SQLITE --> PROFILES
    SQLITE --> JOBS
    SQLITE --> SCORES
    SQLITE --> APPLICATIONS
    
    TRACKER_TOOLS --> EMAIL
    
    %% Styling
    classDef agentClass fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    classDef toolClass fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    classDef dataClass fill:#e8f5e8,stroke:#1b5e20,stroke-width:2px
    classDef apiClass fill:#fff3e0,stroke:#e65100,stroke-width:2px
    
    class PROFILE,CRAWLER,SCORER,EXPLAINER,APPLY,TRACKER agentClass
    class PROFILE_TOOLS,CRAWLER_TOOLS,RELEVANCE_TOOLS,EXPLAINER_TOOLS,APPLY_TOOLS,TRACKER_TOOLS toolClass
    class SQLITE,PROFILES,JOBS,SCORES,APPLICATIONS dataClass
    class FASTAPI,ROUTES,BG_TASKS apiClass
```

## 🔄 Process Flow Diagram

```mermaid
sequenceDiagram
    participant Student
    participant API as FastAPI Server
    participant BG as Background Task
    participant Crew as CrewAI Orchestrator
    participant PA as Profile Agent
    participant JCA as Job Crawler Agent
    participant RSA as Relevance Scorer Agent
    participant EA as Explainer Agent
    participant AAA as Auto-Apply Agent
    participant STA as Status Tracker Agent
    participant DB as Database
    participant Gemini as Gemini AI
    
    Student->>API: Submit Profile (Resume + Preferences)
    API->>BG: Trigger Background Pipeline
    API-->>Student: Profile Submitted Successfully
    
    BG->>Crew: Execute Job Alert Pipeline
    
    Crew->>PA: Analyze Student Profile
    PA->>Gemini: Extract Career Goals & Preferences
    Gemini-->>PA: Structured Profile Data
    PA->>DB: Save Student Profile
    PA-->>Crew: Profile Analysis Complete
    
    Crew->>JCA: Find Relevant Jobs
    JCA->>JCA: Fetch Jobs Based on Preferences
    JCA->>DB: Save Job Listings
    JCA-->>Crew: Job Listings Retrieved
    
    Crew->>RSA: Score Job Relevance
    loop For Each Job
        RSA->>Gemini: Calculate Relevance Score
        Gemini-->>RSA: Score Breakdown
    end
    RSA->>DB: Save Relevance Scores
    RSA-->>Crew: Scoring Complete
    
    Crew->>EA: Generate Match Explanations
    loop For High-Scoring Jobs
        EA->>Gemini: Generate Match Explanation
        Gemini-->>EA: Human-Readable Explanation
    end
    EA-->>Crew: Explanations Generated
    
    Crew->>AAA: Prepare Job Applications
    loop For Top Jobs
        AAA->>Gemini: Create Tailored Resume & Cover Letter
        Gemini-->>AAA: Application Materials
        AAA->>DB: Save Application
    end
    AAA-->>Crew: Applications Prepared
    
    Crew->>STA: Track Application Status
    STA->>STA: Monitor Application Progress
    STA->>DB: Update Status
    STA-->>Crew: Status Tracking Active
    
    Crew-->>BG: Pipeline Execution Complete
    
    Note over Student,DB: Student can query results via API endpoints
```

## 🌊 Data Flow Architecture

```mermaid
graph LR
    subgraph "Input Data"
        RESUME[Resume PDF/Text]
        PREFS[Job Preferences]
        LINKEDIN[LinkedIn URL]
    end
    
    subgraph "Processing Pipeline"
        EXTRACT[Profile Extraction]
        SEARCH[Job Search]
        MATCH[Relevance Matching]
        EXPLAIN[Match Explanation]
        APPLY[Application Prep]
        TRACK[Status Tracking]
    end
    
    subgraph "AI Processing"
        NLP[Natural Language Processing]
        SCORING[ML Scoring Models]
        GENERATION[Text Generation]
    end
    
    subgraph "Output Data"
        ALERTS[Job Alerts]
        SCORES_OUT[Relevance Scores]
        EXPLANATIONS[Match Explanations]
        APPLICATIONS[Tailored Applications]
        STATUS[Application Status]
    end
    
    subgraph "Storage"
        PROFILE_DB[(Profile Database)]
        JOB_DB[(Job Database)]
        SCORE_DB[(Score Database)]
        APP_DB[(Application Database)]
    end
    
    %% Data Flow
    RESUME --> EXTRACT
    PREFS --> EXTRACT
    LINKEDIN --> EXTRACT
    
    EXTRACT --> NLP
    NLP --> PROFILE_DB
    
    PROFILE_DB --> SEARCH
    SEARCH --> JOB_DB
    
    JOB_DB --> MATCH
    PROFILE_DB --> MATCH
    MATCH --> SCORING
    SCORING --> SCORE_DB
    
    SCORE_DB --> EXPLAIN
    EXPLAIN --> GENERATION
    GENERATION --> EXPLANATIONS
    
    SCORE_DB --> APPLY
    PROFILE_DB --> APPLY
    APPLY --> GENERATION
    GENERATION --> APPLICATIONS
    APPLICATIONS --> APP_DB
    
    APP_DB --> TRACK
    TRACK --> STATUS
    
    JOB_DB --> ALERTS
    SCORE_DB --> SCORES_OUT
    
    %% Styling
    classDef inputClass fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    classDef processClass fill:#f1f8e9,stroke:#388e3c,stroke-width:2px
    classDef aiClass fill:#fce4ec,stroke:#c2185b,stroke-width:2px
    classDef outputClass fill:#fff8e1,stroke:#f57c00,stroke-width:2px
    classDef storageClass fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    
    class RESUME,PREFS,LINKEDIN inputClass
    class EXTRACT,SEARCH,MATCH,EXPLAIN,APPLY,TRACK processClass
    class NLP,SCORING,GENERATION aiClass
    class ALERTS,SCORES_OUT,EXPLANATIONS,APPLICATIONS,STATUS outputClass
    class PROFILE_DB,JOB_DB,SCORE_DB,APP_DB storageClass
```

## 🔧 Agent Interaction Flow

```mermaid
stateDiagram-v2
    [*] --> ProfileSubmitted
    
    ProfileSubmitted --> ProfileAnalysis : CrewAI Triggers
    
    ProfileAnalysis --> JobCrawling : Profile Ready
    ProfileAnalysis --> ProfileAnalysis : Gemini Processing
    
    JobCrawling --> RelevanceScoring : Jobs Retrieved
    JobCrawling --> JobCrawling : RAG Processing
    
    RelevanceScoring --> MatchExplanation : Scores Calculated
    RelevanceScoring --> RelevanceScoring : Gemini Scoring
    
    MatchExplanation --> ApplicationPreparation : Explanations Ready
    MatchExplanation --> MatchExplanation : Gemini Explanation
    
    ApplicationPreparation --> StatusTracking : Applications Prepared
    ApplicationPreparation --> ApplicationPreparation : Gemini Generation
    
    StatusTracking --> Complete : Tracking Active
    StatusTracking --> StatusTracking : Status Updates
    
    Complete --> [*]
    
    note right of ProfileAnalysis
        @tool analyze_student_profile
        @tool save_student_profile
    end note
    
    note right of JobCrawling
        @tool fetch_relevant_jobs
        @tool save_job_listings
    end note
    
    note right of RelevanceScoring
        @tool calculate_job_relevance
        @tool save_relevance_scores
    end note
    
    note right of MatchExplanation
        @tool generate_match_explanation
    end note
    
    note right of ApplicationPreparation
        @tool prepare_job_application
        @tool save_application
    end note
    
    note right of StatusTracking
        @tool track_application_status
    end note
```

## 🗂️ File Structure

```
job_alert_backend/
├── 📁 api/
│   ├── __init__.py
│   └── routes.py              # FastAPI endpoints
├── 📁 config/
│   ├── __init__.py
│   └── settings.py            # Configuration settings
├── 📁 database/
│   ├── __init__.py
│   └── db.py                  # Database models & connection
├── 📁 models/
│   ├── __init__.py
│   └── schemas.py             # Pydantic data models
├── 📁 tools/
│   ├── __init__.py
│   ├── profile_tools.py       # @tool functions for profile analysis
│   ├── job_crawler_tools.py   # @tool functions for job crawling
│   ├── relevance_tools.py     # @tool functions for relevance scoring
│   ├── explainer_tools.py     # @tool functions for explanations
│   ├── auto_apply_tools.py    # @tool functions for applications
│   └── status_tracker_tools.py # @tool functions for status tracking
├── 📁 workflow/
│   ├── __init__.py
│   └── job_alert_workflow.py  # CrewAI workflow orchestration
├── main.py                    # Application entry point
├── requirements.txt           # Python dependencies
├── .env                       # Environment variables
└── README.md                  # This file
```

## 🚀 Key Features

- **Autonomous Operation**: Agents run automatically without manual triggers
- **Multi-Agent Architecture**: 6 specialized agents working in coordination
- **AI-Powered Matching**: Uses Gemini AI for intelligent job relevance scoring
- **Explainable AI**: Provides clear explanations for job recommendations
- **Auto-Application**: Generates tailored resumes and cover letters
- **Real-time Tracking**: Monitors application status and progress
- **Scalable Design**: Built with FastAPI and SQLAlchemy for production use

## 🛠️ Technology Stack

- **Framework**: FastAPI
- **AI Orchestration**: CrewAI + LangGraph
- **Language Model**: Google Gemini AI
- **Database**: SQLite (easily replaceable with PostgreSQL)
- **Tools**: CrewAI Tools with @tool decorators
- **Background Tasks**: FastAPI BackgroundTasks

## 📊 Performance Metrics

- **Profile Analysis**: < 30 seconds
- **Job Retrieval**: < 45 seconds
- **Relevance Scoring**: < 20 seconds per job
- **Match Explanation**: < 15 seconds per job
- **Application Preparation**: < 30 seconds per job
- **Status Tracking**: < 10 seconds per application

## 🔄 Autonomous Workflow

The system operates completely autonomously:

1. **Trigger**: Student submits profile via API
2. **Background Processing**: All agents execute automatically
3. **Sequential Execution**: Agents run in optimal order
4. **Data Persistence**: Results stored in database
5. **Status Updates**: Real-time progress tracking
6. **Completion**: Student receives processed results

No manual intervention required - the system handles the entire pipeline automatically using CrewAI's intelligent task orchestration.
