# Project Plan
## HostelFix — Hostel Complaint & Maintenance Management System

**Group Number:** [Group Number]

---

## 1. Project Timeline (Original Plan)

| Phase | Duration | Planned Deliverables |
|-------|----------|------------------------|
| Phase 1: Requirements & Design | Week 1–2 | Problem statement, SRS, use cases, architecture, database design |
| Phase 2: Core Backend Setup | Week 3–4 | Project scaffolding, auth (register/login/JWT), role middleware |
| Phase 3: Complaint Feature | Week 5–6 | Complaint submission, resident dashboard, image upload |
| Phase 4: Warden Features | Week 7–8 | Warden dashboard, filtering/sorting, manual reordering, status updates |
| Phase 5: Feedback & Polish | Week 9 | Feedback system, UI polish, error handling |
| **Mid-Semester Checkpoint** | **Week 9–10** | **This submission** |
| Phase 6: Testing | Week 11 | Full test suite execution, bug fixes |
| Phase 7: Documentation & Demo | Week 12 | Final report, demo video, final packaging |
| Phase 8: Buffer / Contingency | Week 13 | Address any remaining issues found during testing |

## 2. Current Progress Against Plan

As of this mid-semester submission, the group has completed:
- Full requirements and design documentation (Phase 1) ✅
- Authentication and authorization — registration, login, JWT,
  role-based middleware (Phase 2) ✅
- Complaint submission and resident dashboard, including image upload
  (Phase 3) ✅
- Warden dashboard, filtering, sorting, and manual reordering
  (Phase 4) ✅
- Feedback system (Phase 5) ✅

This places the group slightly ahead of the original Phase 4–5
midpoint target, with an end-to-end working system already covering
both user roles.

## 3. Delayed or Pending Tasks

| Task | Status | Reason | Planned Resolution |
|------|--------|--------|----------------------|
| Automated test suite execution against a live test database | Pending | Test scaffolding is written but not yet wired to `mongodb-memory-server` | Complete in Phase 6 |
| UI polish (empty/loading states refinement, responsive edge cases) | In progress | Prioritized core functionality first | Complete in Phase 5–6 |
| [Add any group-specific pending item] | [Status] | [Reason] | [Planned Resolution] |

## 4. Risks and Mitigation Plan

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|-------------|
| Team members unavailable near final deadline | Medium | High | Front-loaded core feature work; buffer week reserved in Phase 8 |
| MongoDB connection/environment issues during demo | Low | Medium | Seed script provided for quick, reproducible demo data; local + Atlas connection strings both tested |
| Scope creep (adding out-of-scope features like notifications) | Medium | Medium | Scope explicitly documented and reaffirmed in SRS Section 5 (MoSCoW prioritization) |
| Merge conflicts from parallel frontend/backend work | Low | Low | Clear module boundaries (routes/controllers/services) reduce overlap |
| [Add any group-specific risk] | [Likelihood] | [Impact] | [Mitigation] |

## 5. Task Allocation (Summary)

A detailed weekly breakdown is provided in `Contribution_Record.md`.
At a high level, work was divided as follows:

| Area | Primary Owner(s) |
|------|--------------------|
| Backend: Auth & Middleware | [Member Name] |
| Backend: Complaint & Feedback Services | [Member Name] |
| Frontend: Auth Pages & Context | [Member Name] |
| Frontend: Resident Dashboard & Complaint Flow | [Member Name] |
| Frontend: Warden Dashboard | [Member Name] |
| Documentation & Testing | [Member Name] |

*(Update the names above and in `Contribution_Record.md` to match your
actual group's task division.)*
