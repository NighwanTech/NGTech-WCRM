import { AIPromptService } from './src/lib/services/ai/prompt.service';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function dump() {
  const config = {
    handoff_rules: {
      escalate_when: ["pricing inquiry", "product inquiry", "price/quotation"]
    }
  };
  // The account ID found from previous DB check
  const accountId = "ae12ea11-3a2f-4ff3-9cf7-40b0e5355445";

  const prompt = await AIPromptService.buildSystemPrompt(config as any, "", "price for website development ?", accountId);
  fs.writeFileSync('dumped_prompt.txt', prompt);
  console.log("Dumped to dumped_prompt.txt");
}

dump();
