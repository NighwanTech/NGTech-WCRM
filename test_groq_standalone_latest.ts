import { groq } from '@ai-sdk/groq';
import { generateText } from 'ai';
import * as dotenv from 'dotenv';
import fs from 'fs';

dotenv.config({ path: '.env.local' });

async function testGroq() {
  const model = groq('llama-3.3-70b-versatile');
  
  const fullContent = fs.readFileSync('debug_last_prompt.txt', 'utf-8');
  let systemPrompt = fullContent.substring(
    fullContent.indexOf('System: You are'), 
    fullContent.indexOf('--- KNOWLEDGE BASE END ---') + '--- KNOWLEDGE BASE END ---'.length
  );

  // Add the text-based handoff instruction
  systemPrompt += "\n\nCRITICAL INSTRUCTION FOR HANDOFF:\nIf you decide to hand off to a human (e.g. for custom pricing, technical architecture, etc), you MUST NOT answer the user. Instead, your ENTIRE output must be exactly in this format: [HANDOFF: reason].\nDO NOT output [HANDOFF] if the user is asking for the price of a standard product listed in the Active Offerings Catalog. Instead, answer them directly.";

  console.log("Sending to Groq...");
  try {
    const { text, finishReason } = await generateText({
      model,
      system: systemPrompt,
      prompt: "website development price ?",
    });

    console.log("Response Text:", text);
    console.log("Finish Reason:", finishReason);
  } catch (err) {
    console.error("Groq Error:", err);
  }
}

testGroq();
