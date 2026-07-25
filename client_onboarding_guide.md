# Complete Meta WhatsApp Cloud API Client Onboarding Guide

A step-by-step SOP for onboarding new client WhatsApp Business accounts onto **WCRM**.

---

## 📋 Table of Contents
1. [Prerequisites](#1-prerequisites)
2. [Phase 1: Meta Developer Portal & App Setup](#phase-1-meta-developer-portal--app-setup)
3. [Phase 2: Meta Business Manager & System User Creation](#phase-2-meta-business-manager--system-user-creation)
4. [Phase 3: Permanent Access Token Generation](#phase-3-permanent-access-token-generation)
5. [Phase 4: Phone Number Registration & Display Name Approval](#phase-4-phone-number-registration--display-name-approval)
6. [Phase 5: WCRM Integration & Webhook Configuration](#phase-5-wcrm-integration--webhook-configuration)
7. [Phase 6: Executed Terminal Commands (Start to End)](#phase-6-executed-terminal-commands-start-to-end)
8. [Phase 7: How to Create Meta WhatsApp Templates in WCRM](#phase-7-how-to-create-meta-whatsapp-templates-in-wcrm)
9. [Phase 8: Multi-Provider AI Integration, Key Cryptography & Usage Dashboard](#phase-8-multi-provider-ai-integration-key-cryptography--usage-dashboard)
10. [Troubleshooting & Meta Error Codes](#troubleshooting--meta-error-codes)

---

## 1. Prerequisites

Before starting, ensure you have:
* A **Facebook Account** with Admin access to the client's **Meta Business Portfolio**.
* A phone number dedicated to WhatsApp Business (must be able to receive an SMS or phone call for 1-time verification if adding a new number).
* Access to your **WCRM Dashboard** (`Settings -> WhatsApp -> Manual Setup`).

---

## Phase 1: Meta Developer Portal & App Setup

1. Go to [developers.facebook.com/apps](https://developers.facebook.com/apps).
2. Click **Create App** (top right).
3. Select **Other** → **Business** (or select *WhatsApp* if prompted).
4. Enter an **App Name** (e.g., `ClientName WCRM`).
5. Select the client's **Business Portfolio** from the dropdown menu.
6. Click **Create App**.
7. On the App Dashboard, scroll to **WhatsApp** and click **Set up**.
8. Select or create the **WhatsApp Business Account (WABA)** and note down:
   * **Phone Number ID** (e.g., `1221636884366269`)
   * **WhatsApp Business Account ID** (e.g., `1350017013348785`)

---

## Phase 2: Meta Business Manager & System User Creation

To prevent token expiration (since temporary tokens expire in 24 hours), create an **Admin System User**:

1. Go to [Meta Business Settings](https://business.facebook.com/settings).
2. On the left sidebar under **Users**, click **System Users**.
3. Click **Add** (Create System User).
4. Enter a name (e.g., `WCRM System User`) and set Role to **Admin**. Click **Save**.
5. Select the System User and click **Add Assets**:
   * **Apps**: Select the Meta App created in Phase 1 → Toggle **Full Control / Manage App**.
   * **WhatsApp Accounts**: Select the client's WhatsApp Account → Toggle **Full Control / Manage Account**.
6. Click **Save Changes**.

---

## Phase 3: Permanent Access Token Generation

1. On the same **System Users** page, select the System User and click **Generate Token**.
2. Select your **App** from the dropdown menu.
3. Set **Token Expiration** to **Never** (or maximum allowable).
4. Check the following permissions:
   * `whatsapp_business_messaging`
   * `whatsapp_business_management`
   * `business_management`
5. Click **Generate Token**.
6. **Copy the token immediately** (`EAAG...`). *Save it in a secure password manager.*

---

## Phase 4: Phone Number Registration & Display Name Approval

1. Go to **Meta Business Manager → WhatsApp Accounts → Phone Numbers**.
2. Check the **Status** of the phone number:
   * **Pending**: Meta is reviewing the Display Name (e.g., `BPTPIA`). Review usually takes 5–30 minutes.
   * **Approved / Connected**: Display name is approved.
3. Set up **Two-step verification**:
   * Click **Settings ⚙️ → Two-step verification**.
   * Click **Enable** and set a **6-digit PIN** (e.g., `123456`). Note this PIN down.

---

## Phase 5: WCRM Integration & Webhook Configuration

### Step A: Configure WCRM Manual Setup
1. Log into **WCRM Dashboard** → Go to `Settings -> WhatsApp -> Manual Setup`.
2. Fill in the credentials:
   * **Phone Number ID**: Paste the Phone Number ID from Phase 1.
   * **WhatsApp Business Account ID**: Paste the WABA ID from Phase 1.
   * **Permanent Access Token**: Paste the `EAAG...` token from Phase 3.
   * **Webhook Verify Token**: Create a custom secret string (e.g., `wcrm_client_secret_token`).
   * **Two-step verification PIN**: Enter the 6-digit PIN set in Phase 4.
3. Click **Save Configuration**.

### Step B: Configure Meta Inbound Webhooks
1. Return to [developers.facebook.com/apps](https://developers.facebook.com/apps) → Select your App → **WhatsApp → Configuration**.
2. Click **Edit Webhook**:
   * **Callback URL**: `https://yourdomain.com/api/whatsapp/webhook`
   * **Verify Token**: Enter the exact `Webhook Verify Token` set in WCRM.
3. Click **Verify and Save**.
4. Under **Webhook Fields**, click **Manage** and subscribe to:
   * ☑️ `messages`

---

## Phase 6: Executed Terminal Commands (Start to End)

Here are the exact terminal `curl` commands executed step-by-step to inspect, verify, subscribe, register, and test the phone number on Meta Cloud API:

### Step 1: Inspect & Debug the Access Token
```bash
# Verify that the access token is valid, permanent (expires_at: 0), and has correct scopes
TOKEN="YOUR_PERMANENT_ACCESS_TOKEN"

curl -s "https://graph.facebook.com/v21.0/debug_token?input_token=${TOKEN}&access_token=${TOKEN}"
```
* **Purpose**: Verifies that `is_valid` is `true`, `type` is `SYSTEM_USER`, and `expires_at` is `0` (Permanent token).

---

### Step 2: Fetch Phone Number Metadata & Verification Status
```bash
# Query the Phone Number ID to inspect display name, phone number, and current registration status
PHONE_NUMBER_ID="1221636884366269"

curl -s "https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}?access_token=${TOKEN}"
```
* **Purpose**: Retrieves phone metadata (`display_phone_number`, `verified_name: BPTPIA`, `code_verification_status`).

---

### Step 3: Subscribe the WhatsApp Business Account (WABA) to the App
```bash
# Connects the WABA to your Meta App so Meta routes inbound messages to your webhook
WABA_ID="1350017013348785"

curl -s -X POST "https://graph.facebook.com/v21.0/${WABA_ID}/subscribed_apps" \
  -H "Authorization: Bearer ${TOKEN}"
```
* **Purpose**: Subscribes the WABA to your app.
* **Expected Output**: `{"success": true}`

---

### Step 4: Register the Phone Number on Meta Cloud API using 6-Digit PIN
```bash
# Registers and initialises the production phone number on Meta Cloud API with 2FA PIN
# Fixes Meta Error: (#133010) Account not registered
PIN="123456"

curl -s -X POST "https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/register" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{\"messaging_product\":\"whatsapp\",\"pin\":\"${PIN}\"}"
```
* **Purpose**: Registers the phone number on Cloud API.
* **Expected Output**: `{"success": true}`

---

### Step 5: Verify Live Connection Status
```bash
# Confirm that the status changed from Pending to CONNECTED and VERIFIED
curl -s "https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}?fields=id,display_phone_number,verified_name,status,code_verification_status&access_token=${TOKEN}"
```
* **Expected Output**: `{"id":"1221636884366269","display_phone_number":"+91 99340 05543","verified_name":"BPTPIA","status":"CONNECTED","code_verification_status":"VERIFIED"}`

---

### Step 6: Fetch Approved Message Templates
```bash
# Retrieve all Meta-approved templates for this WABA
curl -s "https://graph.facebook.com/v21.0/${WABA_ID}/message_templates?access_token=${TOKEN}"
```
* **Purpose**: Confirms approved templates (e.g., `test_1st` status `APPROVED`).

---

### Step 7: Submit a Template to Meta API via Terminal
```bash
# Submit template directly to Meta API
curl -s -X POST "https://graph.facebook.com/v21.0/${WABA_ID}/message_templates" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "bptpia_cet_admission_2026",
    "category": "MARKETING",
    "language": "en_US",
    "components": [
      {
        "type": "HEADER",
        "format": "TEXT",
        "text": "BPTPIA CET 2026 एडमिशन अपडेट"
      },
      {
        "type": "BODY",
        "text": "नमस्ते {{1}},\n\nक्या आप अभी तक B.Tech या Polytechnic में एडमिशन नहीं ले पाए हैं?",
        "example": { "body_text": [["Rahul Kumar"]] }
      },
      { "type": "FOOTER", "text": "BPTPIA Official Admission Helpline" },
      {
        "type": "BUTTONS",
        "buttons": [
          { "type": "URL", "text": "Apply Now", "url": "https://bihartechassociation.com/admission" }
        ]
      }
    ]
  }'
```

---

## Phase 7: How to Create Meta WhatsApp Templates in WCRM

Follow these **4 essential rules** when creating templates in WCRM to avoid `Invalid parameter` errors:

### Rule 1: Variable Syntax in Body Text
* Always format variables as `{{1}}`, `{{2}}`, `{{3}}` in sequential order.
* Example: `Namaste {{1}}, welcome to {{2}}!`
* ❌ *Avoid*: `{1}`, `[name]`, `$1`, or skipping numbers (`{{1}} {{3}}`).

### Rule 2: Sample Values Must Match Variables Exactly
* **If your body text contains `{{1}}`**: You **MUST** enter a sample value in the `{1}` box (e.g., `Rahul Kumar`).
* **If your body text has NO `{{1}}`**: Leave Sample values completely **empty**.

### Rule 3: URL Button Formatting
* **Type**: Select `URL`.
* **Button Text**: Keep under 25 characters (e.g., `Apply Now`).
* **URL**: Must start with full protocol: `https://bihartechassociation.com/admission`.

### Rule 4: Template Naming Rules
* Use **only lowercase letters, numbers, and underscores** (e.g., `bptpia_admission_2026`).
* ❌ *Avoid*: Capital letters, spaces, or hyphen symbols.

---

## Phase 8: Multi-Provider AI Integration, Key Cryptography & Usage Dashboard

### 1. Supported AI Providers & Models
Clients can configure their preferred AI engine under `AI Assistant -> General Settings`:
* **OpenAI**: `gpt-4o`, `gpt-4o-mini`, `o1-mini`, `o3-mini`, `gpt-4-turbo`, or custom fine-tuned model IDs.
* **Google Gemini**: `gemini-1.5-pro`, `gemini-1.5-flash`, `gemini-2.0-flash`.
* **Anthropic Claude**: `claude-3-5-sonnet`, `claude-3-5-haiku`, `claude-3-opus`.
* **Groq**: `llama-3.3-70b`, `llama-3.1-8b`, `mixtral-8x7b`, `deepseek-r1-distill`.
* **DeepSeek**: `deepseek-chat`, `deepseek-reasoner`.
* **Custom / Ollama**: Custom API Base URL (e.g. self-hosted LLM or local Ollama) + API Key + Model Name.

### 2. Cryptographic Security & Zero-Exposure Architecture
* **AES-256-GCM Encryption**: Client API keys (`sk-proj-...`) are encrypted on the server before being saved in PostgreSQL using 256-bit AES-GCM cipher with random 12-byte IVs and 16-byte NIST authentication tags.
* **Zero Client Exposure**: API keys are **NEVER** returned in plaintext to the browser. GET responses return masked keys (`••••••••••••••••`). Inspect Element or DevTools cannot extract raw API keys.
* **Server-Side Execution**: All AI model calls execute strictly on isolated backend server endpoints.

### 3. Tenant Isolation & Misuse Prevention
* **Supabase Row-Level Security (RLS)**: Policies (`is_account_member(account_id)`) guarantee that Client A can only view and manage their own API keys and token metrics. Client B cannot see or access Client A's credentials or usage history under any circumstance.
* **Connection Testing**: `POST /api/ai-assistant/keys/test` validates keys before saving.

### 4. Real-Time AI Usage Dashboard
Every account includes an interactive analytics card tracking:
* **Total Tokens Used** (Prompt input vs Completion output tokens).
* **Real-time Estimated Cost ($USD)** based on official provider model token pricing.
* **Total AI Request Volume & Latency**.
* **Model & Provider Breakdown Tables**.

---

## Troubleshooting & Meta Error Codes

| Meta Error Code / Message | Root Cause | Solution |
| :--- | :--- | :--- |
| **`"Invalid parameter"` (on Template Submission)** | Sample value supplied for a variable that does not exist in Body Text (or missing `{{1}}` in body). | Make sure `{{1}}` is present in the Body Text, or clear the Sample Values box if no variable is used. |
| **`"In order to generate a system user access token, an app must be part of this business portfolio."`** | The Meta App is not linked to the Business Account. | Go to `developers.facebook.com -> App Settings -> Basic -> Business Manager Verification` and link the Business Portfolio. |
| **`"(#133010) Account not registered"`** | The phone number has not been registered on Cloud API using `/register` + PIN. | Run the `/register` API call with the 6-digit PIN or enter the 6-digit PIN in WCRM and click Save Configuration. |
| **`"(#100) The parameter pin is required"`** | Calling `/register` without providing the 6-digit 2FA PIN. | Enable Two-step verification in Meta WhatsApp Manager first, then pass the 6-digit PIN. |
| **`"The app ID is invalid. You can only request access to an app owned by another business or yourself."`** | Attempting to claim an app while logged in as a *Tester* rather than *Owner/Admin*. | Log in with the Facebook account that created the App, or link the App via `App Settings -> Basic`. |
| **`"Pending"` Display Name Status** | Meta is conducting a routine review of the business display name. | Wait 5–30 minutes for Meta to auto-approve. Once approved, status changes to `CONNECTED`. |
