# Project Plan
## DormFix — Hostel Complaint & Maintenance Management System



## 1. Project Timeline (Original Plan)

| Phase | Planned Duration | Planned Deliverables | Final Status |
|---|---|---|---|
| Phase 1: Requirements & Design | Week 1 | Problem statement, SRS, use cases, architecture, and database design | Completed |
| Phase 2: Core Backend Setup | Week 1 | Project scaffolding, registration, login, JWT authentication, and role-based middleware | Completed |
| Phase 3: Complaint Feature | Week 2 | Complaint submission, resident dashboard, and image upload | Completed |
| Phase 4: Warden Features | Week 2 | Warden dashboard, filtering, sorting, manual reordering, and status updates | Completed |
| Phase 5: Feedback & UI Polish | Week 3 | Feedback system, interface refinement, and error handling | Completed |
| Phase 6: Testing | Week 4 | Test case execution, validation, and bug fixing | Completed |
| Phase 7: Documentation & Demo | Week 5 | Project report, demo video, and final packaging | Completed |
| Phase 8: Buffer / Contingency | Week 5 | Review and resolution of remaining issues | Completed |



---

## 2. Final Progress Against Plan

The team has completed all planned project phases, covering requirements analysis, system design, backend and frontend development, testing, documentation, and demonstration preparation.

The completed deliverables include:

- **Requirements and design:** Problem statement, Software Requirements Specification (SRS), use cases, architecture, database design, and UML diagrams.
- **Authentication and authorization:** Resident registration and login, password hashing, JWT-based authentication, protected routes, and role-based access control.
- **Complaint management:** Complaint submission, optional image attachments, complaint history, status tracking, and complaint ownership validation.
- **Warden functionality:** Dashboard statistics, complaint filtering and sorting, manual prioritization, status management, and daily resolution trends.
- **Feedback management:** Ratings from 1 to 5, optional comments for resolved complaints, and duplicate-feedback prevention.
- **Testing and validation:** Test case preparation, execution, defect identification, and verification of the implemented workflows.
- **Documentation and demonstration:** Project report, project management records, contribution details, Git evidence, screenshots, and demo video preparation.
- **Final review:** Review of the application, documentation, and submission package.

The project has reached completion of its planned scope, with the implemented system supporting the principal workflows for both residents and wardens.

---

## 3. Risks and Mitigation Plan

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Team members unavailable near the final deadline | Medium | High | Distributed responsibilities and coordinated development helped complete the planned work. |
| MongoDB connection or environment issues during demonstration | Low | Medium | Database configuration and connection settings were reviewed, and the application environment was checked. |
| Scope creep from additional features | Medium | Medium | The documented project scope was followed, and out-of-scope features were excluded from the implementation. |
| Merge conflicts during parallel frontend and backend development | Low | Medium | Modular development and defined responsibilities helped reduce conflicts between components. |
| Invalid access to another resident's complaints | Medium | High | Authentication, role-based authorization, and complaint ownership checks were incorporated into the application. |
| Invalid complaint status transitions or duplicate feedback | Medium | Medium | Server-side validation and eligibility checks were implemented to enforce workflow rules. |

---

## 4. Task Allocation Summary

The project responsibilities were distributed among the four team members according to their assigned implementation and documentation work.

| Area | Primary Owner | Responsibilities |
|---|---|---|
| Backend: Authentication and Complaint Services | Prakriti Gupta | Authentication implementation, complaint backend, and SRS preparation |
| Authorization and Frontend Interfaces | Paramita Ghosh | Role-based authorization, resident complaint interface, warden interface, project report, and project management documentation |
| Feedback and Testing | Naina | Feedback-related work, test case preparation, and testing activities |
| UML and System Modelling | Nishi Gupta | UML diagrams and supporting system design documentation |

---

## 6. Project Completion Summary

DormFix has completed the planned requirements, design, implementation, testing, and documentation activities. The system provides a centralized workflow for residents to register and track hostel complaints and for wardens to manage complaint status, prioritize work, review dashboard statistics, and receive feedback on resolved complaints.

The project follows a modular client-server architecture using the MERN stack, with authentication, authorization, server-side validation, and persistent database storage supporting the main workflows.

The original project plan provided a structured basis for task allocation and progress monitoring. Completion of the planned phases represents the delivery of the intended project scope.

