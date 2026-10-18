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

**Course Name and Section:** Software Engineering and Project Management (SEPM), Section D


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

1. To provide residents with a simple and reliable mechanism for reporting hostel maintenance problems.

2. To allow residents to monitor the current status of their complaints.

3. To provide wardens with a centralized dashboard for monitoring and managing hostel complaints.

4. To maintain a structured complaint lifecycle from submission to resolution.

5. To identify complaints that have remained unresolved beyond the defined 48-hour threshold.

6. To allow the warden to manually prioritize complaints according to operational requirements.

7. To provide residents with a mechanism to submit feedback after their complaint has been resolved.

8. To enforce role-based authorization and data ownership at the server level.

9. To maintain reliable and consistent complaint data through server-side validation and controlled state transitions.

10. To provide a maintainable software architecture that can be extended with additional hostel-management capabilities in the future.

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

- ### Functional Requirements

The functional requirements define the operations and services that DormFix shall provide to its users. Each requirement is assigned a unique identifier to support traceability across system design, implementation, and testing.

| ID | Functional Requirement |
|---|---|
| FR-01 | The system shall allow a new resident to register using the required account information. |
| FR-02 | The system shall prevent duplicate registration for an existing resident account. |
| FR-03 | The system shall authenticate registered residents and the authorized warden. |
| FR-04 | The system shall issue an authentication token upon successful login. |
| FR-05 | The system shall restrict access to protected resources to authenticated users. |
| FR-06 | The system shall enforce role-based access control for Resident and Warden operations. |
| FR-07 | The system shall allow an authenticated resident to submit a maintenance complaint. |
| FR-08 | The system shall allow a resident to attach an optional image to a complaint. |
| FR-09 | The system shall validate complaint information and uploaded image type and size. |
| FR-10 | The system shall associate each complaint with the authenticated resident who created it. |
| FR-11 | The system shall allow residents to view their complaint history. |
| FR-12 | The system shall allow authorized users to view complaint details according to their assigned roles. |
| FR-13 | The system shall maintain complaint status according to the defined lifecycle: SUBMITTED, UNDER_PROGRESS, and RESOLVED. |
| FR-14 | The system shall reject invalid complaint status transitions. |
| FR-15 | The system shall determine whether an unresolved complaint has exceeded the defined 48-hour threshold. |
| FR-16 | The system shall allow the warden to filter and sort complaints using supported criteria. |
| FR-17 | The system shall allow the warden to manually reorder complaints according to priority. |
| FR-18 | The system shall provide the warden with aggregated complaint statistics and daily resolution trends. |
| FR-19 | The system shall allow residents to submit a rating and an optional comment for resolved complaints. |
| FR-20 | The system shall prevent multiple feedback submissions for the same complaint. |
| FR-21 | The system shall persist complaint and feedback records in the database. |

- ### Non-Functional Requirements

Non-functional requirements specify the quality attributes and operational constraints that DormFix must satisfy.

#### 1. Security

| ID | Requirement |
|---|---|
| NFR-01 | The system shall store passwords using secure one-way hashing and shall not store passwords in plaintext. |
| NFR-02 | The system shall require valid authentication for access to protected API endpoints. |
| NFR-03 | The system shall enforce role-based authorization on the server for all protected operations. |
| NFR-04 | The system shall prevent residents from accessing complaints belonging to other residents. |
| NFR-05 | The system shall derive resident identity from the authenticated user context rather than trusting client-provided identity information. |

#### 2. Performance

| ID | Requirement |
|---|---|
| NFR-06 | The system shall process common operations, including complaint listing and dashboard retrieval, within an acceptable response time under the expected hostel workload. |

#### 3. Usability

| ID | Requirement |
|---|---|
| NFR-07 | The system shall provide a clear and consistent user interface for complaint submission, status tracking, and complaint management. |
| NFR-08 | The system shall display understandable validation and error messages to help users correct invalid inputs and recover from failed operations. |

#### 4. Maintainability

| ID | Requirement |
|---|---|
| NFR-09 | The backend shall separate business logic from HTTP request handling and presentation logic. |
| NFR-10 | The backend shall follow a modular architecture that allows individual components to be maintained and modified independently. |



## 6. Requirements Model

Full use-case descriptions and user stories with acceptance criteria
are provided in `02_Requirements/Use_Cases_and_User_Stories.md`,
covering 13 use cases across both the Resident and Warden actors,
along with 7 representative user stories.

## 7. System Design

### 7.1 Architecture
Dormfix follows a three-tier client-server architecture: a React
single-page frontend, a layered Express REST API (routes →
middleware → controllers → services → models), and a MongoDB data store. Business logic lives exclusively in the service layer, keeping controllers thin and making rules testable independent of HTTP concerns. Full diagrams are in `03_Design/Architecture_Diagram.md`.

```mermaid
flowchart TB
    A["Resident / Warden"] --> B["React Frontend<br/>User Interface"]
    B --> C["Express REST API<br/>Routes"]
    C --> D["Authentication &<br/>Authorization Middleware"]
    D --> E["Controllers"]
    E --> F["Service Layer<br/><br/>Complaint Ownership<br/>Status Validation<br/>Feedback Eligibility<br/>Overdue Calculation<br/>Priority Management"]
    F --> G["Mongoose Models<br/>Schema & Data Validation"]
    G --> H[("MongoDB<br/>Persistent Data Store")]

    classDef client fill:#DCEBFF,stroke:#3973AC,color:#17365D,stroke-width:1.5px
    classDef backend fill:#E8DDFB,stroke:#7856A6,color:#38245C,stroke-width:1.5px
    classDef service fill:#DDF3E4,stroke:#398257,color:#194D30,stroke-width:1.5px
    classDef database fill:#FFE8CC,stroke:#C47A22,color:#704214,stroke-width:1.5px

    class A,B client
    class C,D,E backend
    class F,G service
    class H database
```


#
The layered architecture separates presentation, request handling, business logic, and data persistence. This separation improves code organization, maintainability, and testability.

The service layer is responsible for enforcing the primary business rules of DormFix, including complaint ownership validation, permitted status transitions, feedback eligibility, overdue calculation, and manual complaint prioritization.

By keeping these rules independent of the frontend and minimizing their dependence on HTTP-specific logic, the system makes it easier to test individual operations, identify defects, and modify functionality without affecting unrelated components.

The architecture also ensures that security-sensitive operations are validated on the backend rather than relying solely on frontend restrictions.


### 7.2 Module Description
DormFix is organized into functional modules, each responsible for a specific set of operations. This modular design improves maintainability, separates responsibilities, and simplifies testing and future enhancements.

| Module | Responsibilities |
|---|---|
| **Authentication Module** | Handles resident registration, login, password hashing, JWT generation, and authentication. |
| **Authorization Module** | Enforces role-based access control and verifies complaint ownership before granting access to protected resources. |
| **Complaint Module** | Manages complaint creation, retrieval, status transitions, manual prioritization, and overdue calculation. |
| **Feedback Module** | Handles rating and comment submission for resolved complaints and prevents duplicate feedback submissions. |
| **Dashboard Module** | Aggregates and presents complaint statistics, complaint status summaries, and daily resolution trends. |
| **Upload Module** | Validates uploaded complaint images and manages their storage in the local file system. |



### 7.3 Database Design
## 12. Database Design

DormFix uses MongoDB as its persistent data store, with Mongoose providing schema definition, data validation, and database interaction.Detailed description of database is documented in `03_Design/Database_Design.md`.The primary collections used in the system are described below :

### 12.1 Users

The Users collection stores resident and warden account information.

Typical fields include:
- User identity
- Authentication credentials
- User role
- Hostel and room information
- Account metadata

### 12.2 Complaints

The Complaints collection stores maintenance complaint information submitted by residents.

Typical fields include:
- Complaint identifier
- Resident reference
- Complaint description
- Resident information required for historical records
- Room information
- Image information
- Current complaint status
- Creation timestamp
- Resolution timestamp
- Priority order

### 12.3 Feedback

The Feedback collection stores resident feedback associated with resolved complaints.

Typical fields include:
- Complaint reference
- Resident reference
- Rating
- Comment
- Feedback submission timestamp

### 12.4 Counters

The Counters collection maintains sequence information required for generating sequential identifiers wherever applicable.

### 12.5 Data Integrity

DormFix enforces several application-level rules to maintain data integrity, consistency, and security:

- **Complaint Ownership:** Complaint ownership is determined using the authenticated user's identity.
- **Access Control:** Residents cannot access complaints belonging to other residents.
- **Feedback Association:** Feedback is linked to a specific resolved complaint.
- **Duplicate Feedback Prevention:** A complaint can receive feedback only once.
- **Status Validation:** Complaint status changes must follow the permitted transition rules.
- **Server-Side Overdue Calculation:** Overdue status is calculated by the server rather than being accepted from the client, ensuring consistent and reliable results. 

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
  (scaffolding exists; wiring to mongodb-memory-server is in progress)
- UI refinement for edge cases (very long descriptions, empty states
  on first load)
- Handling of additional interface edge cases
- Final accessibility and responsiveness review

### 9.3 Screenshots of the Working System
## 12. User Interface Screenshots

### 12.1 Resident Login Page

The login page allows registered residents to authenticate and access the DormFix system.

![Screenshot 1: Resident Login](screenshots/login.jpg)

*Figure 2: Resident login page.*

### 12.2 Resident Dashboard

The resident dashboard provides an overview of submitted complaints and their current statuses.

![Screenshot 2: Resident Dashboard](screenshots/hostellerDashboard.jpg)

*Figure 3: Resident dashboard.*

### 12.3 New Complaint Form

The complaint submission form enables residents to report hostel maintenance issues and attach an image when required.

![Screenshot 3: New Complaint Form](screenshots/complaintPage.jpg)

*Figure 4: New complaint submission form.*

### 12.4 Complaint Details

The complaint details page displays the information associated with a selected complaint, including its status and any attached image.

![Screenshot 4: Complaint Details](screenshots/complaintDashboard.jpg)

*Figure 5: Complaint details with image attachment.*

### 12.5 Warden Dashboard

The warden dashboard presents complaint statistics and daily resolution trends to support maintenance monitoring.

![Screenshot 5: Warden Dashboard](screenshots/wardenDashboard.jpg)

![Screenshot 5: Warden Performance Overview](screenshots/performanceOverview.jpg)

*Figure 6: Warden dashboard showing statistics and resolution trends.*

### 12.6 Warden Complaint List

The complaint management interface allows the warden to filter and sort complaints and review their current statuses.

![Screenshot 6: Warden Complaint List with Filters Applied](screenshots/complaintLogs.jpg)

*Figure 7: Warden complaint list with filters applied.*

### 12.7 Feedback Form

The feedback form allows residents to submit a rating and an optional comment after a complaint has been resolved.

![Screenshot 7: Feedback Form](screenshots/feedbackSection.jpg)

*Figure 8: Resident feedback form.*

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

Testing is being performed at multiple levels to verify both functional correctness and security-related behavior.

### 10.1 Authentication Testing

Tests include:

- Valid login
- Invalid credentials
- Duplicate registration
- Protected endpoint access without authentication

### 10.2 Authorization Testing

Tests include:

- Resident accessing resident-only functionality
- Resident attempting to access warden-only endpoints
- Resident attempting to access another resident's complaint
- Invalid or manipulated complaint identifiers

### 10.3 Complaint Testing

Tests include:

- Valid complaint creation
- Missing or invalid complaint information
- Description length validation
- Image type validation
- Image size validation
- Complaint retrieval
- Status transition validation

### 10.4 Overdue Logic Testing

The overdue mechanism is tested around the defined threshold, including complaints:

- Below 48 hours
- At approximately 48 hours
- Beyond 48 hours
- Already resolved complaints

### 10.5 Feedback Testing

Tests include:

- Feedback for resolved complaints
- Feedback for unresolved complaints
- Duplicate feedback submission
- Unauthorized feedback access

A structured test case table (32 test cases across authentication,
authorization, complaint management, overdue logic, and feedback) is
provided in `05_Testing/Test_Cases.md`, with expected results defined
for each case. Actual results and pass/fail status, along with
supporting screenshots, are being finalized ahead of submission and
stored in `05_Testing/Test_Evidence/`.

## 11. Project-Management Status

### 11.1 Original Project Plan
Development is being carried out incrementally, with requirements and design established before implementation of the corresponding modules. This approach allows individual modules to be developed and verified before the final system is integrated.

The project is organized into the following major phases:

1. Requirements Analysis

2. System Design

3. Authentication and Authorization

4. Complaint Management

5. Warden Management

6. Feedback and Dashboard

7. Testing and Verification

8. Documentation and Demonstration

See `06_Project_Management/Project_Plan.md` for the full 8-phase
timeline (requirements/design → backend → complaint feature → warden
feature → feedback/polish → **mid-semester checkpoint** → testing →
documentation/demo → buffer).

### 11.2 Current Progress
The group has completed Phases 1 through 5 of the original plan —
requirements, design, authentication, the complaint feature, the
warden feature, and the feedback system — placing the project at
approximately **70%** completion
against the full plan.

### 11.3 Delayed or Pending Tasks
- Full automated test execution (in progress, see Section 9.2)
- Final UI polish pass

### 11.4 Risks and Mitigation Plan

| Risk                                              | Potential Impact                    | Mitigation                                                         |
|---------------------------------------------------|-------------------------------------|--------------------------------------------------------------------|
| Limited development time near final submission    | Incomplete testing or documentation | Maintain a final buffer period in the project schedule.            |
| Database/environment failure during demonstration | System may become unavailable       | Maintain reproducible seed data and documented setup instructions. |
| Incomplete automated testing                      | Undetected defects                  | Prioritize security, authorization, lifecycle, and validation tests. |
| Scope expansion                                   | Delay in core functionality         | Maintain explicit in-scope and out-of-scope requirements.          |
| Inconsistent team contributions                   | Delays in dependent modules         | Maintain task ownership and regular progress tracking.             |

See `06_Project_Management/Project_Plan.md`, Section 4, for the full
risk register. 

## 12. Individual Contribution Table

A detailed breakdown, including task-level ownership and a signed
declaration from all members, is provided in
`06_Project_Management/Contribution_Record.md`. Summary:

| Member Name | Primary Responsibility | Contribution % |
|--------------|---------------------------|-------------------|
| Prakriti Gupta | [Responsibility] | [%] |
| Paramita Ghosh | [Responsibility] | [%] |
| Naina | [Responsibility] | [%] |
| Nishi Gupta | [Responsibility] | [%] |

## 13. Challenges Faced and Solutions Attempted

| Challenge | Solution Attempted |
|-----------|------------------------|
| Deciding how to calculate "overdue" reliably without trusting the frontend | Moved the calculation entirely server-side, recalculated on every relevant read, using the server clock against `createdAt` |
| Preventing residents from accessing each other's complaints via direct ID requests | Added an explicit ownership check in the service layer for every complaint/feedback read, independent of what the frontend shows |
| Keeping manual reordering meaningful without letting it become de facto automatic prioritization | Implemented reordering as a simple neighbor-swap on an explicit `priorityOrder` field, only ever changed by an explicit warden action |
| Avoiding scope creep toward features like notifications | Reaffirmed scope boundaries early via the SRS MoSCoW prioritization and referred back to it during sprint planning (see Meeting Log) |
| [Add any additional group-specific challenge] | [Add your group's actual solution] |

## 15. Future Scope

The current architecture provides a foundation for extending DormFix beyond the current release.

Possible future enhancements include:

- Dedicated maintenance technician accounts
- Technician assignment and work tracking
- Email or SMS notifications
- Push notifications
- Real-time complaint updates
- Mobile application
- Maintenance analytics
- Automatic complaint categorization
- Automated priority recommendations
- Hostel-wide maintenance reports
- Integration with institutional authentication systems
- Cloud-based image storage
- Multi-hostel and multi-block support

These features are outside the scope of the current release and would require corresponding changes to the requirements, architecture, security model, and testing strategy.

# 16. Conclusion

DormFix provides a structured digital workflow for managing hostel maintenance complaints.

The system replaces fragmented complaint reporting with a centralized platform through which residents can submit and monitor complaints while wardens can manage, prioritize, and track maintenance activity.

The implementation emphasizes several important software-engineering principles:

- Requirement-driven development
- Separation of concerns
- Layered architecture
- Role-based access control
- Server-side validation
- Data ownership enforcement
- Controlled state transitions
- Persistent data management
- Structured testing
- Explicit scope management

The current implementation establishes the core complaint-management workflow and provides a foundation for future extensions such as technician management, notifications, real-time updates, and multi-hostel support.

## 17. References

1. Express.js Documentation — https://expressjs.com/
2. Mongoose Documentation — https://mongoosejs.com/docs/
3. React Documentation — https://react.dev/
4. Vite Documentation — https://vitejs.dev/
5. JSON Web Tokens Introduction — https://jwt.io/introduction
6. MDN Web Docs, "Using the Fetch API" / REST concepts — https://developer.mozilla.org/
7. [Add any textbook, lecture slides, or additional resource your group referenced]

---

