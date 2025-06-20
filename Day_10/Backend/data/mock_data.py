from models.job import Job

# Mock data for job listings
MOCK_JOBS = [
    Job(
        id=1,
        title="Frontend Developer Intern",
        company="TechCorp",
        location="San Francisco, CA",
        type="Internship",
        salary="$25/hour",
        description="Join our dynamic frontend team to build amazing user experiences. You will work with React, TypeScript, and modern CSS frameworks to develop and maintain our web applications. This is a great opportunity to learn from senior engineers.",
        requirements=["React", "JavaScript", "HTML/CSS", "Git"],
        posted="2 days ago",
    ),
    Job(
        id=2,
        title="UI/UX Designer",
        company="StartupXYZ",
        location="Remote",
        type="Full-time",
        salary="$60,000 - $80,000",
        description="We are looking for a creative UI/UX Designer to shape the user experience of our mobile and web products. You will be responsible for the entire design process, from user research to high-fidelity mockups and prototyping.",
        requirements=["Figma", "Sketch", "Adobe XD", "User Research", "Prototyping"],
        posted="1 week ago",
    ),
    Job(
        id=3,
        title="Full Stack Developer",
        company="WebSolutions",
        location="New York, NY",
        type="Contract",
        salary="$50/hour",
        description="Work on both frontend and backend development for our client projects. Our stack includes React, Node.js, Python, and PostgreSQL. You must be comfortable working in a fast-paced agile environment.",
        requirements=["React", "Node.js", "MongoDB", "Python", "SQL"],
        posted="3 days ago",
    ),
    Job(
        id=4,
        title="Data Science Intern",
        company="DataDriven Inc.",
        location="Remote",
        type="Internship",
        salary="$30/hour",
        description="As a Data Science Intern, you will work with our data team on exciting projects involving machine learning, data analysis, and visualization. You'll use Python, Pandas, Scikit-learn, and SQL to extract insights from large datasets.",
        requirements=["Python", "Pandas", "NumPy", "SQL", "Machine Learning"],
        posted="5 days ago",
    ),
]