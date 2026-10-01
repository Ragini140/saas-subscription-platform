# SaaS Subscription & Analytics Platform

A backend mini SaaS platform that handles subscription payments, webhook processing, invoice generation, email notifications, renewal reminders, Redis caching, and MCP-based platform analytics.

## Features

- Razorpay Test Mode subscription checkout
- Razorpay webhook processing
- Idempotent webhook handling
- PostgreSQL database with Sequelize ORM
- Subscription and payment management
- PDF invoice generation
- Invoice access through API
- Email notifications using Mailtrap + Nodemailer
- Scheduled subscription expiry checks
- Redis-backed background jobs using BullMQ
- Redis caching for platform metrics
- MCP server for AI clients such as Claude Desktop
- Docker Compose setup for PostgreSQL and Redis

---

## Tech Stack

### Backend
- Node.js
- Express.js

### Database
- PostgreSQL
- Sequelize ORM

### Payments
- Razorpay Test Mode

### Email
- Nodemailer
- Mailtrap SMTP

### Background Processing
- Redis
- BullMQ
- node-cron

### Invoice
- pdfmake

### AI Integration
- Model Context Protocol (MCP)
- Claude Desktop

### Infrastructure
- Docker
- Docker Compose

---

## Architecture

```text
                    ┌──────────────────┐
                    │  Claude Desktop  │
                    └────────┬─────────┘
                             │ MCP
                             ▼
                    ┌──────────────────┐
                    │   MCP Server     │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Metrics Service  │
                    └───────┬──────────┘
                            │
                    ┌───────┴────────┐
                    ▼                ▼
                 Redis           PostgreSQL
                 Cache            Database


Customer
   │
   ▼
Razorpay Checkout
   │
   ▼
Razorpay Webhook
   │
   ▼
Express API
   │
   ├── User
   ├── Subscription
   ├── Payment
   └── Invoice
          │
          ├── PDF Invoice
          └── Mailtrap Email


Cron Job
   │
   ▼
Find Expiring Subscriptions
   │
   ▼
BullMQ
   │
   ▼
Redis
   │
   ▼
Renewal Worker
   │
   ▼
Mailtrap

```

Prerequisites

Install the following:

Node.js 22+
Docker Desktop
A Razorpay account
A Mailtrap account
Claude Desktop (only required for MCP demonstration)


Installation

Clone the repository:

git clone <YOUR_GITHUB_REPOSITORY_URL>
cd saas-subscription-platform

Install dependencies:

npm install

Start PostgreSQL and Redis

Docker Compose starts both required infrastructure services.

docker-compose up -d

Check the containers:

docker-compose ps

The services are:

PostgreSQL → localhost:5432
Redis      → localhost:6379

Database Setup

Make sure DATABASE_URL in .env points at your running PostgreSQL, then create the
tables by running the Sequelize migrations:

npm run migrate

(To undo the last migration: npm run migrate:undo.)

To inspect the database, use any Postgres client (psql, DBeaver, TablePlus).
Run the Backend

Development mode:

npm run dev

The API runs at:

http://localhost:4000

Razorpay Setup

The application uses Razorpay Test Mode (free).

1. Create a free Razorpay account and switch to Test Mode.
2. From Settings → API Keys, generate test keys and put them in .env:
   RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.
3. Create a Plan (Subscriptions → Plans) and copy its id into RAZORPAY_PLAN_ID.
4. Add a Webhook (Settings → Webhooks) pointing to:
   https://<your-public-url>/api/webhooks/razorpay
   subscribe to the subscription.activated and subscription.charged events,
   set a secret, and put that secret in RAZORPAY_WEBHOOK_SECRET.

For local testing, expose your server with a tunnel (e.g. ngrok) so Razorpay can
reach the webhook URL.

Add the values to:

RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_PLAN_ID=
RAZORPAY_WEBHOOK_SECRET=

Payment Flow
Create Subscription
        ↓
Razorpay Checkout (short_url)
        ↓
Customer completes test payment
        ↓
subscription.activated
        ↓
User + Subscription saved
        ↓
subscription.charged
        ↓
Payment saved
        ↓
PDF Invoice generated
        ↓
Invoice saved
        ↓
Confirmation email sent

API Endpoints
Create User
POST /api/users

Example:

{
  "email": "customer@example.com",
  "name": "Customer"
}

Create Checkout Session
POST /api/checkout/:userId

Creates a Razorpay subscription and returns its checkout short_url.

Get User Subscriptions
GET /api/subscriptions/user/:userId

Get Invoice
GET /api/invoices/:invoiceNumber

Returns the generated PDF invoice.

Platform Metrics
GET /api/metrics

Example response:

{
  "activeSubscribers": 6,
  "simulatedRevenue": 29.97
}

The metrics endpoint uses Redis caching with a short TTL to reduce repeated database queries.

Invoice Generation

After a successful payment:

Razorpay sends subscription.charged.
The payment is stored in PostgreSQL.
A PDF invoice is generated using pdfmake.
Invoice metadata is stored in PostgreSQL.
The customer receives a confirmation email through Mailtrap.

Invoices are stored locally under:

storage/invoices/

They can be accessed through:

GET /api/invoices/:invoiceNumber
Email Notifications

Mailtrap is used as an SMTP sandbox.

This allows the application to test emails without sending messages to real customer inboxes.

The application sends:

Payment Confirmation

Contains:

Customer name
Subscription plan
Payment amount
Payment status
Invoice access link
Renewal Reminder

Subscriptions expiring within the configured renewal window are processed by the background worker and an email reminder is sent.

Renewal Reminder System

A scheduled cron job checks for active subscriptions that are approaching their expiry date.

Cron
 ↓
PostgreSQL
 ↓
Find expiring subscriptions
 ↓
BullMQ Queue
 ↓
Redis
 ↓
Renewal Worker
 ↓
Mailtrap

The cron currently runs every minute for demonstration purposes.

The BullMQ job uses a deterministic job ID to avoid repeatedly creating the same renewal job.

Redis Caching

Platform metrics are cached in Redis.

The flow is:

GET /api/metrics
       ↓
Check Redis
       ↓
Cache HIT ─────→ Return cached metrics
       │
       └─ Cache MISS
              ↓
          PostgreSQL
              ↓
          Store in Redis
              ↓
          Return metrics

The current cache TTL is 60 seconds.

MCP Integration

The project includes an MCP server that allows AI clients such as Claude Desktop to retrieve platform metrics.

MCP Tool
get_platform_metrics

The tool returns:

{
  "activeSubscribers": 6,
  "simulatedRevenue": 29.97
}

The MCP server uses the same metrics service as the REST API.

Claude Desktop
      ↓
MCP
      ↓
get_platform_metrics
      ↓
Metrics Service
      ↓
Redis / PostgreSQL

The AI client does not directly access the database.

Claude Desktop Configuration

No build step is required. Configure Claude Desktop's MCP server to run the file
directly with Node:

src/mcp/index.js

Example configuration:

{
  "mcpServers": {
    "saas-platform": {
      "command": "C:\\Program Files\\nodejs\\node.exe",
      "args": [
        "--env-file=D:\\Projects\\saas-subscription-platform\\.env",
        "D:\\Projects\\saas-subscription-platform\\src\\mcp\\index.js"
      ]
    }
  }
}

Update the paths according to the local project location.

Restart Claude Desktop after changing the configuration.

Then ask Claude:

Get the current platform metrics.

Claude can call:

get_platform_metrics
Background Services

When the backend starts, the following services are initialized:

PostgreSQL connection
Redis connection
Express API
Renewal cron
BullMQ renewal worker

The MCP server separately initializes its required PostgreSQL and Redis connections when launched by the AI client.