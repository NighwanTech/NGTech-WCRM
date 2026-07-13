import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import OrdersDashboard from '@/components/orders/orders-dashboard';

export const metadata = {
  title: 'Orders | WACRM',
  description: 'Manage WhatsApp Commerce orders.',
};

export default async function OrdersPage() {
  const supabase = await createClient();

  // Basic auth check
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Profile check (to ensure they are an account member)
  const { data: profile } = await supabase
    .from('profiles')
    .select('account_id')
    .eq('user_id', user.id)
    .single();

  if (!profile || !profile.account_id) {
    redirect('/join');
  }

  return (
    <div className="flex h-full flex-col p-4 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Orders</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage incoming WhatsApp shopping cart orders.
          </p>
        </div>
      </div>
      <OrdersDashboard />
    </div>
  );
}
