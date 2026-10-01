# Mid-Semester Project Report

## DormFix — Hostel Complaint & Maintenance Management System

---

### Cover Page

**Project Title:** DormFix — Hostel Complaint & Maintenance Management System

**Group Members:**
| Name | Registration Number |
|------|------------------------|
| Prakriti Gupta | 20243209 |
| Paramita Ghosh | 20243197 |
| Naina | 20243172 |
| Nishi Gupta | 20243187 |

**Course Name and Section:** [Software Engineering and Project Management (SEPM), Section D]


---

## 1. Problem Statement and Motivation

Hostel maintenance issues — a broken window, a leaking tap, a
flickering light — are commonly reported through informal channels:
verbal complaints to the warden, WhatsApp messages, or a notice left
at the warden's office. This approach has three recurring problems:

1. **No record of what was reported or when.** If a resident mentions
   an issue in passing, there is nothing to refer back to a week
   later if it isn't fixed.
2. **No visibility for the resident.** Once a complaint is "sent",
   the resident has no way to check whether it has been seen, is
   being worked on, or has been forgotten.
3. **No accountability or prioritization tool for the warden.** With
   many residents and a single warden, there is no structured way to
   see everything outstanding, tell what's overdue, or decide what to
   handle first.

DormFix was chosen as our project because it addresses a genuine,
observable problem with a well-bounded scope — it does not require
external integrations, has a clear two-role user model, and gives us
room to demonstrate real software-engineering practices (requirements
analysis, layered architecture, authorization enforcement, and
testing) without ballooning into an unmanageably large system.

## 2. Project Objectives

1. Provide residents with a simple, reliable way to report and track
   hostel maintenance issues.
2. Give the warden a single, structured dashboard to view, filter,
   sort, and act on all complaints.
3. Enforce accountability through timestamps, a strict status
   workflow, and a server-calculated 48-hour overdue flag.
4. Allow the warden to prioritize complaints manually.
5. Close the feedback loop by letting residents rate how their
   complaint was resolved.
6. Demonstrate secure, role-based access control so that data
   ownership boundaries (a resident's own complaints) are enforced on
   the server, not just hidden in the UI.

## 3. Scope of the Project

### 3.1 Features Included
- Resident registration and login; warden login (seeded account)
- Complaint submission with optional image upload
- Resident dashboard with statistics and complaint history
- Complaint details view for both roles
- Feedback system (1–5 rating + comment), restricted to resolved complaints
- Warden dashboard with aggregated statistics and a resolved-per-day chart
- Filtering (status, overdue, room) and sorting (multiple criteria)
- Manual complaint reordering by the warden
- Controlled status transitions (SUBMITTED → UNDER_PROGRESS → RESOLVED)
- Server-side overdue calculation (48-hour threshold)

### 3.2 Features Excluded (Explicitly Out of Scope)
- Technician accounts, login, or assignment workflow
- SMS, WhatsApp, or email notifications
- Push notifications or real-time updates (no WebSockets)
- Payment processing
- AI-based or automatic complaint prioritization/classification
- Mobile application (native)
- GPS or live tracking of maintenance work


### 3.3 Assumptions and Constraints
- Each resident has exactly one hostel room and one account.
- A single warden account exists for the hostel block covered by this
  version of the system.
- The system is built strictly on the MERN stack.
- Local file storage is used for uploaded images in this phase; the
  upload layer is structured so it could later be swapped for cloud
  storage (e.g. Cloudinary) without touching business logic.

## 4. Stakeholder Identification

| Stakeholder | Interest in the System |
|--------------|----------------------------|
| Residents | Need a reliable way to report issues and know their status |
| Warden | Needs visibility over all outstanding issues and a way to prioritize response |
| Hostel administration | Benefits from a documented record of maintenance activity |
| Course instructor / evaluator | Assesses the group's requirements analysis, design, and engineering practice |
| Development team (us) | Responsible for delivering a working, secure, well-documented system |

## 5. Requirements Specification

A complete requirements specification is provided in the SRS
document. In summary:

- **21 functional requirements** covering authentication, complaint
  lifecycle, feedback, and warden operations.
- **10 non-functional requirements** covering security, performance,
  usability, and maintainability.


## 6. Requirements Model

Full use-case descriptions and user stories with acceptance criteria
are provided in `02_Requirements/Use_Cases_and_User_Stories.md`,
covering 13 use cases across both the Resident and Warden actors,
along with 7 representative user stories.

## 7. System Design

### 7.1 Architecture
HostelFix follows a three-tier client-server architecture: a React
single-page frontend, a layered Express REST API (routes →
middleware → controllers → services → models), and a MongoDB data
store. Business logic lives exclusively in the service layer, keeping
controllers thin and making rules testable independent of HTTP
concerns. Full diagrams are in `03_Design/Architecture_Diagram.md`.

### 7.2 Module Description
| Module | Responsibility |
|--------|-----------------|
| Auth | Registration, login, JWT issuance |
| Complaint | Creation, retrieval, status transitions, manual reordering, overdue calculation |
| Feedback | Rating/comment submission tied to resolved complaints |
| Dashboard | Aggregated statistics for the warden |
| Upload | Image validation and storage |

### 7.3 Database Design
MongoDB collections (`users`, `complaints`, `feedbacks`, `counters`)
and their relationships, indexing strategy, and key design trade-offs
(such as denormalizing resident details onto complaint records for
historical accuracy) are documented in `03_Design/Database_Design.md`.

### 7.4 UML Diagrams
A class diagram of the backend domain model, two sequence diagrams
(complaint submission, status update), and two activity diagrams
(complaint lifecycle, authentication flow) are provided in
`03_Design/UML_Diagrams.md`.

## 8. Technology Stack and Justification

| Layer | Technology | Justification |
|-------|-------------|------------------|
| Frontend | React + Vite | Fast dev server, component-based UI suits a multi-page dashboard app, widely taught and supported |
| Routing | React Router | Standard client-side routing with role-based route guarding |
| HTTP Client | Axios | Simple interceptor support for attaching JWTs and handling 401s centrally |
| Backend | Node.js + Express | Matches the required MERN stack; minimal, well-understood REST framework |
| Database | MongoDB + Mongoose | Document model suits the complaint entity well (variable fields like optional image, resolvedAt); Mongoose adds schema validation on top of MongoDB's flexibility |
| Auth | JWT + bcryptjs | Stateless auth suited to a REST API; bcrypt is the standard for password hashing |
| File Upload | Multer | De facto standard Express middleware for multipart form handling |

We deliberately avoided Redis, GraphQL, WebSockets, and containerization
for this project — none were necessary for the defined scope, and
introducing them would have added operational complexity without a
corresponding benefit for a system of this size.

## 9. Implementation Progress

### 9.1 Features Completed
- Resident registration and login with hashed passwords and JWT issuance
- Role-based middleware enforced on every protected route
- Complaint submission with optional image upload (type/size validated)
- Resident dashboard with statistics and complaint history
- Complaint details page (resident and warden views)
- Feedback submission restricted to resolved, not-yet-rated complaints
- Warden dashboard with aggregated statistics and a resolved-per-day chart
- Filtering and sorting of the complaint list
- Manual up/down reordering of complaint priority
- Controlled status transition rules enforced server-side
- Server-calculated overdue flag (48-hour threshold), recalculated on
  every relevant read rather than trusted from the client
- Seed script for reproducible demo data

### 9.2 Features Under Development
- Full automated test suite execution against a live test database
  (scaffolding exists; wiring to `mongodb-memory-server` is in progress)
- UI refinement for edge cases (very long descriptions, empty states
  on first load)

### 9.3 Screenshots of the Working System
*(Insert screenshots here before final submission — recommended set:
login page, resident dashboard, new complaint form, complaint details
with image, warden dashboard with stats and chart, warden complaint
list with filters, status update in action, feedback form.)*

[Screenshot 1: Resident Login]
[Screenshot 2: Resident Dashboard]
[Screenshot 3: New Complaint Form]
[Screenshot 4: Complaint Details]
[Screenshot 5: Warden Dashboard with Statistics]
[Screenshot 6: Warden Complaint List with Filters Applied]
[Screenshot 7: Feedback Form]

### 9.4 Important Implementation Decisions
- **Resident identity fields are read from the authenticated user's
  profile server-side**, not trusted from the request body, when a
  complaint is created — this closes an obvious spoofing vector where
  a malicious client could submit a complaint under someone else's name.
- **The overdue flag is never trusted from the client** and is
  recalculated from the server clock on every read that matters
  (dashboard, complaint list, complaint details).
- **Status transitions are validated against a fixed rule table** on
  the server (e.g. `RESOLVED` cannot go back to `SUBMITTED`), so the
  frontend cannot force an invalid state even if compromised.
- **Manual reordering was chosen over automatic prioritization**
  specifically because the project brief calls for warden judgment,
  not algorithmic urgency scoring — this was a deliberate scope
  decision, not a missing feature.

## 10. Testing Performed

A structured test case table (32 test cases across authentication,
authorization, complaint management, overdue logic, and feedback) is
provided in `05_Testing/Test_Cases.md`, with expected results defined
for each case. Actual results and pass/fail status, along with
supporting screenshots, are being finalized ahead of submission and
stored in `05_Testing/Test_Evidence/`.

Example categories covered:
- Valid and invalid login attempts
- Duplicate registration handling
- Unauthorized access to protected/warden-only endpoints
- Cross-resident data access attempts (ID manipulation)
- Complaint creation validation (description length, image type/size)
- Status transition rule enforcement
- Overdue flag correctness at various time thresholds
- Feedback rules (post-resolution only, one submission per complaint)

## 11. Project-Management Status

### 11.1 Original Project Plan
See `06_Project_Management/Project_Plan.md` for the full 8-phase
timeline (requirements/design → backend → complaint feature → warden
feature → feedback/polish → **mid-semester checkpoint** → testing →
documentation/demo → buffer).

### 11.2 Current Progress
The group has completed Phases 1 through 5 of the original plan —
requirements, design, authentication, the complaint feature, the
warden feature, and the feedback system — placing the project at
approximately **[insert actual %, suggested range 50–60]%** completion
against the full plan, which is within or slightly ahead of the
40–60% target for this checkpoint.

### 11.3 Delayed or Pending Tasks
- Full automated test execution (in progress, see Section 9.2)
- Final UI polish pass

### 11.4 Risks and Mitigation Plan
See `06_Project_Management/Project_Plan.md`, Section 4, for the full
risk register. Key risks include team availability near the final
deadline (mitigated by a reserved buffer week) and demo-environment
reliability (mitigated by the seed script providing reproducible data).

## 12. Individual Contribution Table

A detailed breakdown, including task-level ownership and a signed
declaration from all members, is provided in
`06_Project_Management/Contribution_Record.md`. Summary:

| Member Name | Primary Responsibility | Contribution % |
|--------------|---------------------------|-------------------|
| [Member 1 Name] | [Responsibility] | [%] |
| [Member 2 Name] | [Responsibility] | [%] |
| [Member 3 Name] | [Responsibility] | [%] |
| [Member 4 Name] | [Responsibility] | [%] |

## 13. Challenges Faced and Solutions Attempted

| Challenge | Solution Attempted |
|-----------|------------------------|
| Deciding how to calculate "overdue" reliably without trusting the frontend | Moved the calculation entirely server-side, recalculated on every relevant read, using the server clock against `createdAt` |
| Preventing residents from accessing each other's complaints via direct ID requests | Added an explicit ownership check in the service layer for every complaint/feedback read, independent of what the frontend shows |
| Keeping manual reordering meaningful without letting it become de facto automatic prioritization | Implemented reordering as a simple neighbor-swap on an explicit `priorityOrder` field, only ever changed by an explicit warden action |
| Avoiding scope creep toward features like notifications | Reaffirmed scope boundaries early via the SRS MoSCoW prioritization and referred back to it during sprint planning (see Meeting Log) |
| [Add any additional group-specific challenge] | [Add your group's actual solution] |

## 14. Work Planned for the Remaining Semester

1. Complete and execute the full automated test suite against a real
   test database; record pass/fail results and coverage.
2. UI polish: refine empty/loading states, mobile responsiveness edge
   cases, and accessibility basics (labels, contrast).
3. Expand documentation with a full "Limitations" and "Future Scope"
   discussion tied to actual testing outcomes.
4. Prepare the final demo video and final report.
5. Conduct a final security review pass (rate limiting considerations,
   input sanitization review) before final submission.
6. [Add any additional group-specific remaining work.]

## 15. References

1. Express.js Documentation — https://expressjs.com/
2. Mongoose Documentation — https://mongoosejs.com/docs/
3. React Documentation — https://react.dev/
4. Vite Documentation — https://vitejs.dev/
5. JSON Web Tokens Introduction — https://jwt.io/introduction
6. MDN Web Docs, "Using the Fetch API" / REST concepts — https://developer.mozilla.org/
7. [Add any textbook, lecture slides, or additional resource your group referenced]

---

*Note: This report should be exported to PDF before submission, with
all `[bracketed placeholders]` replaced with your group's actual
details, and the screenshot placeholders in Section 9.3 replaced with
real images of the running application.*
