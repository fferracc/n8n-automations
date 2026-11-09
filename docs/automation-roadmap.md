# Automation Roadmap

A proposal for automating the charity's operations with n8n, Firebase, Google Workspace and PayPal.

## 1. Student lifecycle and learning (Google Classroom)
- **Acceptance and onboarding:** when a student is marked "Accepted" in Firebase, n8n sends a welcome message (WhatsApp or email), creates their Google account and adds them to the right Google Classroom course.
- **Payment linked access:** students are added to Classroom only after a successful PayPal transaction, and removed if a subscription fails or a refund is issued.
- **Attendance and engagement:** a check in message after a set number of missed sessions; reminders one hour before a live session.
- **Certification:** a PDF certificate generated and emailed when a student completes a course.

## 2. Volunteer recruitment and management
- **Application funnel:** a new application in Firebase triggers an acknowledgement email; shortlisted applicants receive an interview booking link.
- **After interview:** on approval, n8n creates the volunteer profile, sends a welcome pack and adds them to the staff calendar.
- **Shifts:** reminders 24 hours before and feedback forms 24 hours after each shift.

## 3. Staff and teacher operations
- **Attendance accountability:** a daily scan; teachers who have not registered attendance for a session get a WhatsApp nudge.
- **Annual leave:** approved leave is blocked on the shared calendar.
- **Payroll prep:** teaching hours aggregated at month end and sent to finance.

## 4. Financial automation (PayPal)
- **Reconciliation:** every PayPal transaction synced to Firebase or a master Google Sheet.
- **Invoicing:** PayPal invoices for custom or premium courses sent from the system.
- **Grant deadlines:** alerts to the team seven days before a funding deadline.

## 5. Social media and marketing
- **Course openings:** a new course in Firebase drafts posts for LinkedIn, X and Facebook.
- **Volunteer spotlights:** a monthly celebratory post.
- **Funding announcements:** a thank you post drafted when a grant is marked "Granted".
- **Cross platform sync:** one news post pushed to every channel and the email newsletter.

## 6. System health and reporting
- **Daily summary:** new applications, payments and interviews sent to the manager each morning.
- **Backups:** weekly export of Firebase data to a secure Google Drive folder.
