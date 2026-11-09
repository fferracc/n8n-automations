# n8n Automations

Workflow automation for a charity's student, payment and staff processes, built with n8n, Firebase, Google Workspace and PayPal.

Part of the **SHGH Digital Platform**: [Intranet Portal](https://github.com/fferracc/shgh-intranet-portal) · [Application Forms](https://github.com/fferracc/shgh-application-forms) · [UK Learning App](https://github.com/fferracc/shgh-learning-app-uk) · [Ghana Attendance App](https://github.com/fferracc/shgh-attendance-app-ghana)

## What is here
| Path | What it is |
|---|---|
| `workflows/student-onboarding.json` | Importable n8n workflow: webhook in, Google Workspace account created, student enrolled in Google Classroom, welcome email and WhatsApp message sent |
| `scripts/configure-application-workflow.mjs` | Uses the n8n REST API to configure the robotics enrolment workflow: finds the pending enrolment in Firestore by payer email and marks it paid |
| `scripts/add-paypal-ipn-support.mjs` | Extends the same workflow so it accepts both PayPal IPN and webhook payloads |
| `docs/automation-roadmap.md` | Proposal for automating the wider organisation: student lifecycle, volunteers, staff, finance, social media and reporting |

## Student onboarding flow
```
Webhook (student accepted)
  -> Code: build account details
  -> Google Admin: create Workspace user
  -> HTTP: enrol in Google Classroom course
  -> Gmail: welcome email
  -> Twilio: WhatsApp welcome
```

## Payment confirmation flow
```
PayPal (IPN or webhook)
  -> Firestore: find pending enrolment by payer email
  -> Firestore: set paymentStatus = paid, store transaction ID
```

## Run the scripts
```
cp .env.example .env    # N8N_URL, N8N_API_KEY, N8N_WORKFLOW_ID
node --env-file=.env scripts/configure-application-workflow.mjs
```

## Import the workflow
In n8n: Workflows, Import from file, choose `workflows/student-onboarding.json`, then attach your own Google, Gmail and Twilio credentials.

## Data and privacy
No credentials or personal data are stored here. Keys come from environment variables and credentials live in n8n.

Shown with permission of Sovereign House GH.
