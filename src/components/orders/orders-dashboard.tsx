'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Loader2, Package, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import OrderDetailsModal from './order-details-modal';

export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

export interface OrderRow {
  id: string;
  total_price: number;
  currency: string;
  status: OrderStatus;
  created_at: string;
  contact: {
    id: string;
    name: string;
    phone: string;
  };
}

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'bg-yellow-500/20 text-yellow-600 border-yellow-500/50',
  processing: 'bg-blue-500/20 text-blue-600 border-blue-500/50',
  completed: 'bg-emerald-500/20 text-emerald-600 border-emerald-500/50',
  cancelled: 'bg-red-500/20 text-red-600 border-red-500/50',
};

export default function OrdersDashboard() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<OrderRow | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const supabase = createClient();

  const fetchOrders = useCallback(async () => {
    setLoading(true);

    let query = supabase
      .from('whatsapp_orders')
      .select('id, total_price, currency, status, created_at, contact:contacts(id, name, phone)')
      .order('created_at', { ascending: false });

    if (search.trim()) {
      // Basic search on contact name/phone via a hint or direct filter if supported.
      // Since contact is a relation, it's a bit tricky to search via foreign table in postgrest without a view.
      // We'll do it client side for now if it's small, or just fetch all.
      // To keep it simple and robust, we fetch top 100 for now.
    }

    query = query.limit(100);

    const { data, error } = await query;

    if (error) {
      console.error(error);
      toast.error('Failed to load orders');
    } else {
      // Type assertion since postgrest relation typing can be tricky
      setOrders((data as unknown as OrderRow[]) || []);
    }

    setLoading(false);
  }, [supabase, search]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    // Optimistic update
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );

    try {
      const res = await fetch(`/api/orders/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: orderId, status: newStatus }),
      });

      if (!res.ok) {
        throw new Error('Failed to update status');
      }

      toast.success('Order status updated');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update order status');
      // Revert on failure
      fetchOrders();
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (!search) return true;
    const term = search.toLowerCase();
    return (
      o.contact?.name?.toLowerCase().includes(term) ||
      o.contact?.phone?.includes(term) ||
      o.id.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-4">
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by customer name, phone or ID..."
          className="pl-8 bg-card border-border text-foreground placeholder:text-muted-foreground"
        />
      </div>

      <div className="rounded-lg border border-border overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground">Order ID</TableHead>
              <TableHead className="text-muted-foreground">Customer</TableHead>
              <TableHead className="text-muted-foreground">Date</TableHead>
              <TableHead className="text-muted-foreground text-right">Total</TableHead>
              <TableHead className="text-muted-foreground w-48">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow className="border-border">
                <TableCell colSpan={5} className="text-center py-12">
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="size-6 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Loading orders...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredOrders.length === 0 ? (
              <TableRow className="border-border">
                <TableCell colSpan={5} className="text-center py-12">
                  <div className="flex flex-col items-center gap-2">
                    <Package className="size-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">No orders found.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow
                  key={order.id}
                  className="border-border hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => {
                    setSelectedOrder(order);
                    setModalOpen(true);
                  }}
                >
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {order.id.split('-')[0]}...
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">
                        {order.contact?.name || 'Unknown Customer'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {order.contact?.phone}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {format(new Date(order.created_at), 'MMM d, yyyy HH:mm')}
                  </TableCell>
                  <TableCell className="text-right font-medium text-foreground">
                    {order.total_price.toLocaleString(undefined, {
                      style: 'currency',
                      currency: order.currency || 'USD',
                    })}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Select
                      value={order.status}
                      onValueChange={(val) =>
                        val && handleStatusChange(order.id, val as OrderStatus)
                      }
                    >
                      <SelectTrigger
                        className={`h-8 w-[140px] text-xs border ${STATUS_COLORS[order.status]}`}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {selectedOrder && (
        <OrderDetailsModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          order={selectedOrder}
        />
      )}
    </div>
  );
}
