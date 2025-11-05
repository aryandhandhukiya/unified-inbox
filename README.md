# 📬 Unified Inbox

Unified Inbox is a full-stack communication platform that brings together messages from multiple channels — **Gmail, WhatsApp, SMS (Twilio), Telegram, and Discord** — into one unified dashboard.  
It provides businesses and teams a single place to view, respond to, and analyze customer conversations efficiently.

> Built using **Next.js 14 (App Router)**, **Prisma ORM**, **NextAuth**, **PostgreSQL (Supabase)**, **React Query**, and **Tailwind CSS**.

---

## 🌐 Live Demo

🔗 **Deployed App:** [https://unified-inbox-sigma.vercel.app](https://unified-inbox-sigma.vercel.app)

## 🎥 **Demo Video:**  

▶️ [Click to watch the demo video](https://github.com/aryandhandhukiya/unified-inbox/releases/tag/V1.0.0/unified-demo.2.mp4)

## 🚀 Features

✅ **Multi-Channel Messaging**
- Gmail integration for email sync and reply  
- WhatsApp (Twilio) integration for two-way chat  
- Telegram bot integration  
- Discord webhook support  
- SMS communication via Twilio

✅ **Analytics Dashboard**
- Channel usage metrics  
- Message delivery status tracking  
- Contact activity insights  

✅ **Authentication**
- Secure sign-in via **Google OAuth** and **Email/Password**  
- Protected routes using **NextAuth Middleware**

✅ **Modern UI**
- Fully responsive **Tailwind CSS** layout  
- Real-time chat interface built with **React Query**  
- Smooth transitions and dark mode ready  

✅ **Scalable Backend**
- **Prisma ORM** for database management  
- **Supabase PostgreSQL** for cloud-hosted data  
- **Serverless API routes** hosted on Vercel  

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | Next.js 14, React Query, Tailwind CSS |
| **Backend** | Next.js API Routes, Prisma ORM |
| **Database** | PostgreSQL (Supabase Cloud) |
| **Authentication** | NextAuth.js (Google + Credentials) |
| **Messaging APIs** | Twilio (SMS & WhatsApp), Telegram Bot, Discord Webhook |
| **Email** | Gmail API (OAuth Playground Integration) |
| **Deployment** | Vercel |
| **Realtime Sync** | ngrok (for local webhooks) |

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory and include the following:

```env
# PostgreSQL (Supabase)
DATABASE_URL=postgresql://postgres.USER:PASSWORD@HOST:5432/postgres?sslmode=require

# NextAuth
NEXTAUTH_URL=https://unified-inbox-sigma.vercel.app
NEXTAUTH_SECRET=YOUR_STRONG_SECRET

# Google OAuth
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET

# Gmail Integration
GMAIL_REDIRECT_URI=https://developers.google.com/oauthplayground
GMAIL_REFRESH_TOKEN=YOUR_REFRESH_TOKEN
GMAIL_USER=youremail@gmail.com

# Twilio (SMS + WhatsApp)
TWILIO_ACCOUNT_SID=YOUR_TWILIO_ACCOUNT_SID
TWILIO_AUTH_TOKEN=YOUR_TWILIO_AUTH_TOKEN
TWILIO_SMS_NUMBER=+1234567890
TWILIO_WHATSAPP_NUMBER=+14155238886

# Telegram
TELEGRAM_BOT_TOKEN=YOUR_TELEGRAM_BOT_TOKEN

# Discord
DISCORD_WEBHOOK_URL=YOUR_DISCORD_WEBHOOK_URL

# Email SMTP (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=youremail@gmail.com
SMTP_PASS=your_app_password
EMAIL_FROM="Unified Inbox <youremail@gmail.com>"

# ngrok (for local testing)
NEXT_PUBLIC_BASE_URL=https://YOUR_NGROK_URL.ngrok-free.app
