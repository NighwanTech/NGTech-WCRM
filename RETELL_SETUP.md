# Retell AI Setup Guide

This guide explains how to configure Retell AI to enable one-click outbound AI voice calling directly from the CRM.

## Step 1: Get Your API Key
1. Go to [Retell AI](https://www.retellai.com/) and create an account.
2. In the left sidebar, click on **API Keys**.
3. Copy the API key marked for **webhook authentication**. Retell uses that
   key to sign webhook requests, so using another key will cause the CRM to
   reject call updates.
4. Keep the key private. The CRM stores it encrypted and never shows it again
   after saving.

## Step 2: Buy a Phone Number
1. In the Retell dashboard, click on **Phone Numbers**.
2. Click **Buy Number** (or import a Twilio number if you already have one).
3. Copy the phone number you just purchased in E.164 format (e.g., `+1234567890`). (You will paste this into the `From Phone Number` field in your CRM Settings).

## Step 3: Create your AI Agent
1. In the Retell dashboard, click on **Agents**.
2. Click **Create Agent**.
3. Configure your agent:
   - **LLM:** Choose your brain (e.g., GPT-4o, Claude 3.5 Sonnet).
   - **Voice:** Pick a voice you like (ElevenLabs or OpenAI voices).
   - **System Prompt:** Tell the AI how to act (e.g., "You are a sales rep for NG Tech. Your goal is to qualify the customer..."). 
   - *Note: The CRM API passes a dynamic variable called `customer_name`. You can use `{{customer_name}}` in your Retell prompt so the AI knows who it is talking to!*
4. Once created, copy the **Agent ID** (it usually starts with `agent_...`). (You will paste this into the `Default Agent ID` field in your CRM Settings).

## Step 4: Link the Phone Number to the Agent
1. Go back to the **Phone Numbers** tab in Retell.
2. Click on the phone number you bought.
3. Under the "Inbound Agent" dropdown setting, select the Agent you just created. This ensures that if a customer calls the number *back*, your specific AI agent answers.

## Step 5: Setup the Webhook (For CRM Transcripts)
To ensure that call summaries show up on the Customer 360 Timeline in your CRM, you must tell Retell where to send the data when a call finishes.
1. In the Retell dashboard, go to **Webhooks**.
2. Click **Add Webhook**.
3. Set the Webhook URL to your live CRM domain: `https://your-domain.com/api/retell/webhook`
4. Make sure it is set to trigger on the `call_analyzed` event.
5. Retell must send its `X-Retell-Signature` header. The CRM verifies the
   signature against the raw payload before it stores a transcript.

## Step 6: Save in your CRM
1. Go to your CRM dashboard.
2. Navigate to **Settings** -> **AI Voice Calling**.
3. Paste the following details:
   - API Key
   - Default Agent ID
   - From Phone Number
4. Click **Save Configuration**.

## Testing
Go to any Contact Profile and click the **AI Call** button (the purple microphone icon) in the Quick Actions bar. Your phone should ring within 3 seconds, and once the call ends, the transcript will appear on the timeline!
