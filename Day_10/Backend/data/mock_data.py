# data/mock_data.py

from models.job import Job

# Expanded mock data for a richer set of job listings
MOCK_JOBS = [
    # --- Frontend / Full Stack ---
    Job(
        id=1,
        title="Frontend Developer Intern",
        company="TechCorp",
        location="San Francisco, CA",
        type="Internship",
        salary="$35/hour",
        description="Join our dynamic frontend team to build amazing user experiences. You will work with React, TypeScript, and modern CSS frameworks to develop and maintain our web applications.",
        requirements=["React", "TypeScript", "JavaScript", "HTML/CSS", "Git"],
        posted="2 days ago",
    ),
    Job(
        id=2,
        title="Full Stack Developer",
        company="WebSolutions",
        location="New York, NY",
        type="Full-time",
        salary="$90,000 - $120,000",
        description="Work on both frontend and backend development for our client projects. Our stack includes React, Node.js, Python, and PostgreSQL. You must be comfortable working in a fast-paced agile environment.",
        requirements=["React", "Node.js", "MongoDB", "Python", "SQL", "REST APIs"],
        posted="3 days ago",
    ),
    # --- UI/UX ---
    Job(
        id=3,
        title="UI/UX Designer",
        company="Creative Minds",
        location="Remote",
        type="Full-time",
        salary="$70,000 - $90,000",
        description="We are looking for a creative UI/UX Designer to shape the user experience of our mobile and web products. You will be responsible for the entire design process, from user research to high-fidelity mockups.",
        requirements=["Figma", "Sketch", "Adobe XD", "User Research", "Prototyping"],
        posted="1 week ago",
    ),
    # --- Data Science / AI / ML ---
    Job(
        id=4,
        title="Data Science Intern",
        company="DataDriven Inc.",
        location="Remote",
        type="Internship",
        salary="$40/hour",
        description="As a Data Science Intern, you will work with our data team on exciting projects involving machine learning, data analysis, and visualization. You'll use Python, Pandas, and SQL to extract insights from large datasets.",
        requirements=["Python", "Pandas", "NumPy", "SQL", "Machine Learning"],
        posted="5 days ago",
    ),
    Job(
        id=5,
        title="AI/ML Engineer",
        company="InnovateAI",
        location="Austin, TX",
        type="Full-time",
        salary="$110,000 - $140,000",
        description="Develop and deploy machine learning models at scale. You will be working with large language models (LLMs) and deep learning frameworks like TensorFlow and PyTorch.",
        requirements=["Python", "TensorFlow", "PyTorch", "Scikit-learn", "LLMs"],
        posted="1 day ago",
    ),
    # --- Backend ---
    Job(
        id=6,
        title="Backend Developer (Java)",
        company="Enterprise Systems",
        location="Chicago, IL",
        type="Full-time",
        salary="$95,000 - $125,000",
        description="Design, build, and maintain scalable backend services using Java and the Spring Framework. You will be responsible for API design, database management, and ensuring high performance.",
        requirements=["Java", "Spring Boot", "SQL", "Microservices", "REST APIs"],
        posted="4 days ago",
    ),
    # --- Cloud / DevOps ---
    Job(
        id=7,
        title="Cloud Engineer Intern",
        company="CloudSphere",
        location="Seattle, WA",
        type="Internship",
        salary="$38/hour",
        description="Learn to manage and automate cloud infrastructure on AWS. This role involves working with Infrastructure as Code (Terraform), CI/CD pipelines, and containerization technologies like Docker.",
        requirements=["AWS", "Docker", "CI/CD", "Terraform", "Linux"],
        posted="6 days ago",
    ),
    Job(
        id=8,
        title="DevOps Engineer",
        company="AgileFlow",
        location="Remote",
        type="Contract",
        salary="$75/hour",
        description="Automate and streamline our operations and processes. Build and maintain tools for deployment, monitoring, and operations. Troubleshoot and resolve issues in our dev, test, and production environments.",
        requirements=["Kubernetes", "Docker", "AWS", "Jenkins", "Python", "Bash"],
        posted="8 days ago",
    ),
    # --- Cybersecurity ---
    Job(
        id=9,
        title="Cybersecurity Analyst Intern",
        company="CyberGuard",
        location="Washington, D.C.",
        type="Internship",
        salary="$35/hour",
        description="Assist our security team in monitoring for security threats, analyzing vulnerabilities, and responding to incidents. A great opportunity to gain hands-on experience in the field of cybersecurity.",
        requirements=["Cybersecurity", "Networking", "Linux", "Security Monitoring"],
        posted="10 days ago",
    ),
    # --- C++ / Systems ---
    Job(
        id=10,
        title="Software Engineer (C++)",
        company="Quantum Computing Inc.",
        location="Boston, MA",
        type="Full-time",
        salary="$120,000 - $150,000",
        description="Join our core systems team to develop high-performance simulation software. This role requires strong C++ skills and a deep understanding of algorithms and data structures.",
        requirements=["C++", "Algorithms", "Data Structures", "Linux", "GDB"],
        posted="2 weeks ago",
    ),
]