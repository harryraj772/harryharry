# Prompt Engineering Log – Campus Hub

## 1. Plan (Role + Task + Constraints)
Prompt: "Act as a senior front-end developer. Build a student information portal using HTML, CSS, JavaScript and Bootstrap 5. Frontend only; use sample data and localStorage. Sign up and log in must show 'Successful!' on success and an error message on wrong or missing input."

## 2. Develop (Step-by-step / chain of thought)
1. Auth screen: tabs for Log in and Sign up.
2. Validation: required fields, email format, student ID format, password length, password match, duplicate email.
3. Dashboard: Overview, Grades (search + GWA), Schedule, Profile (editable, saved).
4. Feedback: Bootstrap toasts (green "Successful!", red errors) plus inline error text.

## 3. Evaluate (Checklist prompt)
- [ ] Sign up with valid data -> "Successful!" toast
- [ ] Sign up with bad email / short password / mismatch / duplicate -> error toast
- [ ] Log in with correct data -> "Successful!", dashboard opens
- [ ] Log in with wrong data -> error toast
- [ ] Refresh keeps the session; Log out clears it
- [ ] Layout works at 360px, 768px and 1280px wide
- [ ] Keyboard focus is visible; inputs have labels

## 4. Improve (Iterate)
Follow-up prompts to try: "Add a password show/hide toggle", "Add dark mode", "Add GWA chart", "Make the grade table sortable".
