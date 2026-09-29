# UML Diagrams
## HostelFix — Hostel Complaint & Maintenance Management System

**Group Number:** [Group Number]

All diagrams below are written in Mermaid syntax. Paste any block into
mermaid.live (or a Mermaid-enabled editor) to render and export as an
image for the report if your submission requires static images.

---

## 1. Class Diagram (Backend Domain Model)

```mermaid
classDiagram
    class User {
        +ObjectId _id
        +String fullName
        +String email
        -String password
        +String role
        +String registrationNumber
        +String roomNumber
        +comparePassword(candidate) Boolean
        +toSafeObject() Object
    }

    class Complaint {
        +ObjectId _id
        +String complaintId
        +ObjectId residentId
        +String residentName
        +String registrationNumber
        +String roomNumber
        +String description
        +String imagePath
        +String status
        +Boolean isOverdue
        +Number priorityOrder
        +Date resolvedAt
        +Boolean feedbackSubmitted
    }

    class Feedback {
        +ObjectId _id
        +ObjectId complaintId
        +ObjectId residentId
        +Number rating
        +String comment
    }

    class Counter {
        +String _id
        +Number seq
    }

    User "1" --> "0..*" Complaint : submits
    Complaint "1" --> "0..1" Feedback : has
    User "1" --> "0..*" Feedback : writes
```

## 2. Sequence Diagram — Submit Complaint

```mermaid
sequenceDiagram
    actor Resident
    participant UI as React UI
    participant API as Express API
    participant MW as Auth/Role Middleware
    participant SVC as Complaint Service
    participant DB as MongoDB

    Resident->>UI: Fill complaint form + optional image
    UI->>API: POST /api/complaints (multipart, JWT)
    API->>MW: Verify JWT and role = resident
    MW-->>API: Authorized, user attached
    API->>SVC: createComplaint(user, description, image)
    SVC->>SVC: Validate description length
    SVC->>DB: Generate next complaintId (Counter)
    SVC->>DB: Insert new Complaint document
    DB-->>SVC: Saved complaint
    SVC-->>API: Complaint object
    API-->>UI: 201 Created + complaint data
    UI-->>Resident: Redirect to complaint details page
```

## 3. Sequence Diagram — Warden Updates Status

```mermaid
sequenceDiagram
    actor Warden
    participant UI as React UI
    participant API as Express API
    participant MW as Auth/Role Middleware
    participant SVC as Complaint Service
    participant DB as MongoDB

    Warden->>UI: Click "Mark as Resolved"
    UI->>API: PATCH /api/complaints/:id/status
    API->>MW: Verify JWT and role = warden
    MW-->>API: Authorized
    API->>SVC: updateStatus(complaintId, "RESOLVED")
    SVC->>DB: Fetch complaint by id
    DB-->>SVC: Complaint document
    SVC->>SVC: Check allowed transition (current -> RESOLVED)
    alt Transition allowed
        SVC->>DB: Save updated status + resolvedAt
        DB-->>SVC: Confirmation
        SVC-->>API: Updated complaint
        API-->>UI: 200 OK
    else Transition not allowed
        SVC-->>API: 400 Bad Request
        API-->>UI: Error message
    end
```

## 4. Activity Diagram — Complaint Lifecycle

```mermaid
flowchart TD
    Start([Resident submits complaint]) --> Submitted[Status: SUBMITTED]
    Submitted --> WardenReview{Warden reviews}
    WardenReview -->|Starts work| UnderProgress[Status: UNDER_PROGRESS]
    WardenReview -->|Already fixed| Resolved[Status: RESOLVED]
    UnderProgress --> WardenFinishes{Work completed?}
    WardenFinishes -->|Yes| Resolved
    WardenFinishes -->|No, still pending| CheckOverdue{More than 48 hrs since submission?}
    CheckOverdue -->|Yes| Overdue[isOverdue = true, highlighted on dashboard]
    CheckOverdue -->|No| UnderProgress
    Overdue --> UnderProgress
    Resolved --> FeedbackPrompt[Resident prompted for feedback]
    FeedbackPrompt --> End([Complaint closed])
```

## 5. Activity Diagram — Authentication Flow

```mermaid
flowchart TD
    Start([User opens app]) --> HasToken{Token in localStorage?}
    HasToken -->|No| LoginPage[Show Login/Register page]
    HasToken -->|Yes| VerifyToken[Call GET /api/auth/me]
    VerifyToken --> Valid{Token valid?}
    Valid -->|Yes| RoleCheck{Role?}
    Valid -->|No| ClearToken[Clear stored token] --> LoginPage
    RoleCheck -->|Resident| ResidentDash[Resident Dashboard]
    RoleCheck -->|Warden| WardenDash[Warden Dashboard]
    LoginPage --> Submit[Submit credentials]
    Submit --> ServerCheck{Valid credentials?}
    ServerCheck -->|Yes| IssueToken[Issue JWT, store locally] --> RoleCheck
    ServerCheck -->|No| ShowError[Show error message] --> LoginPage
```
