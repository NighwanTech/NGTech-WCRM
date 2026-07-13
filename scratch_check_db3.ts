import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function check() {
  const accountId = 'ae12ea11-3a2f-4ff3-9cf7-40b0e5355445';
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('account_id', accountId);
  console.log("Products for user account:", products);
}
check();
