# 🎓 AI-Based Certification Verifier

This project uses **LangGraph**, **LLMs**, and traditional parsing methods to authenticate student certifications and flag potential credibility risks from resumes or portfolio text. It simulates real-world verification scenarios by checking public APIs, issuer links, and internal databases.

---

## 🚀 Project Goal

To build an AI-powered system that:

- ✅ Extracts certification information from text (resumes, LinkedIn, etc.)
- ✅ Verifies credentials through multiple simulated channels (API, issuer links, databases)
- ✅ Scores the credibility of certifications
- ✅ Flags expired, unverifiable, or suspicious credentials
- ✅ Provides actionable feedback for resume/profile improvement

---

## 🧠 Agents in the System

| Agent Name                     | Function                                                                 |
|-------------------------------|--------------------------------------------------------------------------|
| 📄 Certification Extraction Agent | Parses input text to extract certificates, IDs, issuers, and links       |
| 🔍 Verification Agent (RAG-enabled) | Cross-checks certification validity via simulated APIs, links, and databases |
| 🧮 Credibility Scoring Agent       | Assigns a trust score based on multiple verification methods            |
| 🚩 Flagging & Feedback Agent       | Highlights suspicious/expired/missing verifications and suggests actions |

---

## 🛠️ Technologies Used

- 🧩 **LangGraph** – for defining and managing multi-step agent workflows
- 🧠 **Simulated LLM logic** – placeholder for integration with Gemini/GPT APIs
- 🐍 **Python** – main programming language
- 📄 **PyMuPDF (`fitz`)** – optional for PDF text extraction
- 🌐 **Requests** – mock API and URL verification logic

---

## 📊 Verification Methods Simulated

| Method           | Description                                  | Max Score Weight |
|------------------|----------------------------------------------|------------------|
| API              | Trusted issuer API verification               | 40 pts           |
| Issuer Website   | Official issuer verification pages            | 35 pts           |
| Internal Database| Lookup against known certs                    | 25 pts           |
| Direct Link      | Credential verification URLs                  | 20 pts           |
| Manual Review    | Fallback when others fail                     | 10 pts           |

**Multiple verification methods trigger a 10% bonus.**

---

## ✅ Sample Usage

🚀 Starting Comprehensive Certificate Verification...
Sample Input (Resume Text):

- Google TensorFlow Developer Certification
- Coursera Python for Everybody
- AWS Cloud Practitioner Essentials
- HackerRank Python Basic: https://www.hackerrank.com/certificates/XYZ456
📋 Output Example
Overall Credibility Score: 88.0/100

Flags:

❗ AWS Certificate expired on 2024-06-10 → Suggested to renew

❗ Unstop Bootcamp verification link not working → Suggested to update link

🧩 Workflow Graph
text
Copy
Edit
extract → user_input → verify → score → flag_feedback → END
📎 Future Enhancements
🌐 Integrate real-time RAG using Gemini or OpenAI APIs

📁 Accept PDF resumes as input

📊 Export flagged issues and scores to CSV/JSON

✅ Auto-suggestion of alternative certifications
