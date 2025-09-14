Intern Evaluation Task: Mini AI App
Builder Portal + User App UI
Objective
Build a basic web portal where:

1. A user describes an app they want (requirement capture).
2. The portal captures the requirements using an AI API.
3. Based on those requirements, generate a very simple mock UI of the app (e.g., forms,
   tables, or buttons).
   (Use React, Node JS Render and Mongo Db) - set up your own free accounts and have live
   site.
   Requirements
4. Requirement Capture Portal

- Input box for app description.
- Button to submit.
- Show extracted App Name, Entities, Roles, Features.

2. Generate Simple User App UI

- For each Entity, create a form with a few input fields.
- Add a menu or tabs for roles/features.
- UI doesn’t need to be functional — just a mock/demo generated from requirements.

3. Frontend

- React
- Keep it clean, simple, and easy to navigate.
  Output Example
  User Input:
  "I want an app to manage student courses and grades. Teachers add courses, students enrol,
  and admins manage reports."
  AI Captured Requirements:
- App Name: Course Manager
- Entities: Student, Course, Grade
- Roles: Teacher, Student, Admin
- Features: Add course, Enrol students, View reports
  Generated UI:
- Menu: Student | Teacher | Admin
- Forms:
- Student → Name, Email, Age
- Course → Title, Code, Credits
- Grade → Student, Course, Grade
  Evaluation Criteria
- Can they structure code clearly?
- Can they integrate AI API for requirement extraction?
- Can they dynamically generate UI components?
- Is the UI clean and somewhat user-friendly?
  Deliverables
- Running app (local or deployed).
- Code repo (GitHub/zip).
- README with setup steps.
