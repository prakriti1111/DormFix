# Test Cases
## HostelFix — Hostel Complaint & Maintenance Management System

**Group Number:** [Group Number]

This document lists the test cases executed so far, covering
authentication, authorization, complaint management, and feedback
rules. Actual results and pass/fail status should be filled in after
each test run, with screenshots saved in the `Test_Evidence/` folder
and referenced by test ID (e.g. `TC-01.png`).

---

## 1. Authentication

| Test ID | Description | Input | Expected Result | Actual Result | Status |
|---------|--------------|-------|------------------|----------------|--------|
| TC-01 | Register a new resident with valid details | Valid name, unique reg. no., room, email, password | Account created, JWT returned, redirected to resident dashboard | [Fill in] | [Pass/Fail] |
| TC-02 | Register with a duplicate email | Existing email, otherwise valid data | 409 error, "Email is already registered." | [Fill in] | [Pass/Fail] |
| TC-03 | Register with a duplicate registration number | Existing reg. no., otherwise valid data | 409 error, "Registration number is already in use." | [Fill in] | [Pass/Fail] |
| TC-04 | Register with a password under 6 characters | Password = "123" | 400 error, validation message shown | [Fill in] | [Pass/Fail] |
| TC-05 | Login with correct credentials | Valid email + password | 200 OK, JWT returned | [Fill in] | [Pass/Fail] |
| TC-06 | Login with incorrect password | Valid email, wrong password | 401 error, generic "Invalid email or password" | [Fill in] | [Pass/Fail] |
| TC-07 | Access a protected route with no token | No Authorization header | 401 error, "Not authorized. No token provided." | [Fill in] | [Pass/Fail] |
| TC-08 | Access a protected route with an expired/invalid token | Malformed JWT | 401 error, "Not authorized. Invalid or expired token." | [Fill in] | [Pass/Fail] |
| TC-09 | Logout | Click logout button | Token cleared from localStorage, redirected to login | [Fill in] | [Pass/Fail] |

## 2. Authorization

| Test ID | Description | Input | Expected Result | Actual Result | Status |
|---------|--------------|-------|------------------|----------------|--------|
| TC-10 | Resident attempts to access the warden-only complaint list | GET /api/complaints as resident | 403 Forbidden | [Fill in] | [Pass/Fail] |
| TC-11 | Resident attempts to view another resident's complaint by ID | GET /api/complaints/:id belonging to a different resident | 403 Forbidden | [Fill in] | [Pass/Fail] |
| TC-12 | Resident attempts to update complaint status | PATCH /api/complaints/:id/status as resident | 403 Forbidden | [Fill in] | [Pass/Fail] |
| TC-13 | Resident attempts to reorder complaints | PATCH /api/complaints/reorder as resident | 403 Forbidden | [Fill in] | [Pass/Fail] |
| TC-14 | Warden accesses the full complaint list | GET /api/complaints as warden | 200 OK, all complaints returned | [Fill in] | [Pass/Fail] |

## 3. Complaint Management

| Test ID | Description | Input | Expected Result | Actual Result | Status |
|---------|--------------|-------|------------------|----------------|--------|
| TC-15 | Submit a valid complaint with no image | Description ≥ 5 characters | 201 Created, status = SUBMITTED, complaintId assigned | [Fill in] | [Pass/Fail] |
| TC-16 | Submit a complaint with a valid image | JPG under 5MB | 201 Created, imagePath stored | [Fill in] | [Pass/Fail] |
| TC-17 | Submit a complaint with a description under 5 characters | Description = "Hi" | 400 error, validation message | [Fill in] | [Pass/Fail] |
| TC-18 | Submit a complaint with an oversized image | Image > 5MB | 400 error, "Image file is too large." | [Fill in] | [Pass/Fail] |
| TC-19 | Submit a complaint with an unsupported file type | .pdf file as image | 400 error, "Invalid file type..." | [Fill in] | [Pass/Fail] |
| TC-20 | Resident views their own complaint history | GET /api/complaints/my | 200 OK, only own complaints returned | [Fill in] | [Pass/Fail] |
| TC-21 | Warden updates status SUBMITTED → UNDER_PROGRESS | PATCH status = UNDER_PROGRESS | 200 OK, status updated | [Fill in] | [Pass/Fail] |
| TC-22 | Warden updates status UNDER_PROGRESS → RESOLVED | PATCH status = RESOLVED | 200 OK, status updated, resolvedAt set | [Fill in] | [Pass/Fail] |
| TC-23 | Warden attempts invalid transition RESOLVED → SUBMITTED | PATCH status = SUBMITTED on a resolved complaint | 400 error, "Invalid status transition..." | [Fill in] | [Pass/Fail] |
| TC-24 | Warden manually reorders a complaint upward | PATCH /api/complaints/reorder, direction = "up" | 200 OK, priorityOrder swapped with neighbor | [Fill in] | [Pass/Fail] |

## 4. Overdue Logic

| Test ID | Description | Input | Expected Result | Actual Result | Status |
|---------|--------------|-------|------------------|----------------|--------|
| TC-25 | Complaint created less than 48 hours ago | createdAt = now - 5 hours, status = SUBMITTED | isOverdue = false | [Fill in] | [Pass/Fail] |
| TC-26 | Complaint created more than 48 hours ago and unresolved | createdAt = now - 60 hours, status = UNDER_PROGRESS | isOverdue = true | [Fill in] | [Pass/Fail] |
| TC-27 | Complaint older than 48 hours but already resolved | createdAt = now - 80 hours, status = RESOLVED | isOverdue = false | [Fill in] | [Pass/Fail] |

## 5. Feedback

| Test ID | Description | Input | Expected Result | Actual Result | Status |
|---------|--------------|-------|------------------|----------------|--------|
| TC-28 | Submit feedback on a resolved complaint | rating = 4, comment = "Fixed quickly" | 201 Created, feedback stored | [Fill in] | [Pass/Fail] |
| TC-29 | Submit feedback on an unresolved complaint | Complaint status = SUBMITTED | 400 error, "Feedback can only be submitted after the complaint is resolved." | [Fill in] | [Pass/Fail] |
| TC-30 | Submit feedback a second time on the same complaint | Feedback already exists | 409 error, "Feedback has already been submitted..." | [Fill in] | [Pass/Fail] |
| TC-31 | Submit feedback with an out-of-range rating | rating = 7 | 400 error, "Rating must be between 1 and 5." | [Fill in] | [Pass/Fail] |
| TC-32 | Resident attempts to submit feedback on another resident's complaint | Different residentId | 403 Forbidden | [Fill in] | [Pass/Fail] |

## 6. Testing Notes

- Tests marked `[Fill in]` should be executed manually against the
  running application (or via the example Jest/Supertest files in
  `04_Source_Code/source_files/server/tests/`) before submission, with
  results and screenshots recorded.
- Automated test scaffolding is provided in `server/tests/auth.test.js`
  and `server/tests/complaint.test.js`. Wiring these up to a real test
  database (e.g. `mongodb-memory-server`) is listed as a task for the
  remaining development phase.
- Screenshots of each test's actual result should be saved in
  `05_Testing/Test_Evidence/` using the naming pattern `TC-XX.png`.
