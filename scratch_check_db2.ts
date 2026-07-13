import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function check() {
  const { data: accounts } = await supabase.from('accounts').select('id, name');
  if (accounts && accounts.length > 0) {
    const accountId = accounts[0].id;
    console.log("AccountId:", accountId);

    const { data: products } = await supabase
      .from('products')
      .select('*')
      .eq('account_id', accountId);
    
    console.log("Products in DB:", products);
  }
}
check();
