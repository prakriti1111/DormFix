# AI Tool Usage Disclosure

## DormFix — Hostel Complaint & Maintenance Management System

In line with the academic integrity requirements of this evaluation,
this document discloses the use of generative AI tools during the
development of this project.

| Field | Details |
|-------|---------|
| **Tool Name** | Claude (Anthropic), Google Gemini, ChatGPT|
| **Purpose of Use** | Assisted in scaffolding boilerplate code for the MERN stack (Express routes/controllers/services, React components/pages), drafting initial versions of documentation (SRS, use cases, UML diagrams, test case tables), and explaining design trade-offs such as denormalization in the database schema. |
| **Nature of Generated Content** | Initial code structure for authentication middleware, complaint/feedback services, and React pages; initial drafts of the SRS, architecture description, database design, UML diagrams, and test case table.|
| **Verification / Modification Performed** |All generated code was reviewed line-by-line by our team, run and manually tested locally, and modified to fit our specific requirements (e.g. room numbering convention, feedback rules). Documentation was reviewed for accuracy against the actual implemented codebase and edited to reflect our group's real meeting history, task allocation, and test results. |

## Statement of Responsibility

We confirm that:
- We understand every part of the code and documentation submitted.
- We are able to explain any design decision, file, or
  section of this submission if asked.
- All AI-assisted content was reviewed, tested, and adapted by the
  group before submission, and is not submitted as-is without
  verification.
- We take full responsibility for the correctness, security, and
  originality of the submitted material.

## Addendum - Testing Artefacts

| Field | Details |
|-------|---------|
| **Tool Name** | Claude (Anthropic) |
| **Purpose of Use** | Writing the automated test suite (Jest/Supertest) in `server/tests/`, the test-case catalogue, the script that generates `Test_Cases.pdf`, and the manual UI test checklist. |
| **Nature of Generated Content** | Test code, test-case tables, a small `server.js` change so the app can be imported by tests without connecting/listening, and report text for the Testing section. |
| **Verification / Modification Performed** | **[Group to complete: e.g. "We ran the suite locally, read every test, confirmed expected results against the SRS, and executed the manual UI cases ourselves."]** |
