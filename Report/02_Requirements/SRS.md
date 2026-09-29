# Software Requirements Specification (SRS)
## HostelFix — Hostel Complaint & Maintenance Management System

**Group Number:** [Group Number]
**Course:** [Course Name and Section]
**Supervisor:** [Supervisor/Instructor Name]
**Date:** [Submission Date]

---

## 1. Introduction

### 1.1 Purpose
This document specifies the functional and non-functional requirements
for HostelFix, a web-based system that lets hostel residents report
maintenance issues and lets a warden track and resolve them. It is
intended for use by the project team during development and by the
evaluator during review.

### 1.2 Intended Audience
- Project group members (developers)
- Course instructor / evaluator
- Any future maintainer of the system

### 1.3 Project Scope
HostelFix replaces informal, untracked complaint reporting (verbal
requests, chat messages) with a structured system that records every
complaint, its status, and its resolution history. The system is
limited to complaint intake and tracking — it does not handle
technician dispatch, payments, or notifications (see Section 4 of the
project report for full scope boundaries).

### 1.4 Definitions and Abbreviations
| Term | Meaning |
|------|---------|
| Resident | A hostel student who submits and tracks complaints |
| Warden | The staff member responsible for reviewing and resolving complaints |
| Complaint | A single reported maintenance issue |
| Overdue | A complaint unresolved for more than 48 hours |
| JWT | JSON Web Token, used for authentication |
| MERN | MongoDB, Express, React, Node.js |

---

## 2. Overall Description

### 2.1 Product Perspective
HostelFix is a standalone web application (not integrated with any
existing college system at this stage). It consists of a React
single-page frontend and a Node.js/Express REST API backend, with
MongoDB as the data store.

### 2.2 User Classes
| User Class | Description |
|------------|--------------|
| Resident | Registers, logs in, submits complaints, tracks status, gives feedback |
| Warden | Logs in (account seeded, not self-registered), views all complaints, updates status, prioritizes manually |

### 2.3 Operating Environment
- Server: Node.js runtime, MongoDB database
- Client: Any modern browser (Chrome, Firefox, Edge) on desktop or mobile
- Development environment: Vite dev server (frontend), Express dev server (backend)

### 2.4 Design and Implementation Constraints
- Must be built using the MERN stack (as specified by the course project brief)
- Passwords must never be stored or transmitted in plaintext
- No third-party paid services (e.g. cloud image storage, SMS gateways) are used in this phase
- Manual prioritization only — no automated or AI-based urgency scoring is permitted

### 2.5 Assumptions and Dependencies
- Each resident belongs to exactly one room and has one active account
- There is a single warden account per hostel block for this version
- A working MongoDB instance is available (local or Atlas)

---

## 3. Functional Requirements

Each requirement is labeled with a unique ID for traceability to test
cases and to the use-case/user-story document.

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-01 | The system shall allow a resident to register with name, registration number, room number, email, and password | High |
| FR-02 | The system shall reject registration if the email or registration number is already in use | High |
| FR-03 | The system shall allow residents and the warden to log in using email and password | High |
| FR-04 | The system shall issue a JWT on successful login for use in subsequent requests | High |
| FR-05 | The system shall allow a resident to submit a complaint with a description and an optional image | High |
| FR-06 | The system shall auto-fill the resident's name, registration number, and room number from their profile, not from client input | High |
| FR-07 | The system shall assign each complaint a unique, sequential ID (e.g. HF-0001) | Medium |
| FR-08 | The system shall set a new complaint's status to SUBMITTED by default | High |
| FR-09 | The system shall allow a resident to view only their own complaints and complaint history | High |
| FR-10 | The system shall allow a resident to view the full details of a single complaint they submitted | High |
| FR-11 | The system shall allow a resident to submit feedback (1–5 rating, optional comment) only after a complaint is marked RESOLVED | High |
| FR-12 | The system shall allow only one feedback submission per complaint | Medium |
| FR-13 | The system shall allow the warden to view all complaints from all residents | High |
| FR-14 | The system shall allow the warden to filter complaints by status, overdue flag, and room number | Medium |
| FR-15 | The system shall allow the warden to sort complaints by newest, oldest, status, resolution date, or overdue-first | Medium |
| FR-16 | The system shall allow the warden to manually move a complaint up or down in priority order | Medium |
| FR-17 | The system shall allow the warden to update a complaint's status following the sequence SUBMITTED → UNDER_PROGRESS → RESOLVED (with a direct SUBMITTED → RESOLVED shortcut permitted) | High |
| FR-18 | The system shall prevent any status change not allowed by the defined transition rules | High |
| FR-19 | The system shall calculate the overdue flag on the server based on creation time, not on a client-supplied value | High |
| FR-20 | The system shall display aggregated statistics (total, submitted, under-progress, resolved, overdue, average resolution time) to the warden | Medium |
| FR-21 | The system shall log the resident out and invalidate their local session on request | Medium |

## 4. Non-Functional Requirements

| ID | Requirement | Category |
|----|-------------|----------|
| NFR-01 | Passwords must be hashed using bcrypt before storage | Security |
| NFR-02 | All complaint and feedback endpoints must verify the requester's identity and role before returning data | Security |
| NFR-03 | A resident must not be able to view or modify another resident's complaint, even by guessing or editing an ID | Security |
| NFR-04 | API responses must never include the password field, even in nested user objects | Security |
| NFR-05 | Uploaded images must be restricted to JPG, PNG, and WEBP and capped at 5MB | Security / Usability |
| NFR-06 | The system should respond to typical API requests within 500ms under normal development load | Performance |
| NFR-07 | The UI must be usable on both desktop and mobile screen widths | Usability |
| NFR-08 | The system must show clear loading, empty, and error states on every page | Usability |
| NFR-09 | The codebase must follow a layered structure (routes/controllers/services/models) to support maintainability | Maintainability |
| NFR-10 | The system must be recoverable to a known demo state via a single seed script | Maintainability |

## 5. Requirement Prioritization

Requirements are grouped using MoSCoW-style prioritization for the
current phase:

- **Must Have (implemented):** FR-01 to FR-11, FR-13, FR-17 to FR-19, NFR-01 to NFR-04
- **Should Have (implemented):** FR-12, FR-14 to FR-16, FR-20, NFR-05 to NFR-08
- **Could Have (planned for later phase):** Drag-and-drop reordering UI, richer analytics charts
- **Won't Have (this phase):** Technician accounts, notifications, payments, AI-based prioritization — see project report Section 4 for the full exclusion list

## 6. Acceptance Criteria (Summary)

Detailed acceptance criteria per requirement are provided in the
companion document `Use_Cases_and_User_Stories.md`. At a high level,
a requirement is considered met when:
1. It is implemented in the codebase.
2. It is covered by at least one manual or automated test case.
3. It behaves correctly for both the "happy path" and at least one
   invalid/unauthorized scenario.

---
*This SRS will be revised in the final submission to reflect any
requirement changes discovered during the remaining development phase.*
