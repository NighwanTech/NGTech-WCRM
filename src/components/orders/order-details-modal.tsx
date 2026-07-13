'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { OrderRow } from './orders-dashboard';
import { Loader2, PackageOpen } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface OrderItem {
  id: string;
  product_retailer_id: string;
  quantity: number;
  item_price: number;
  currency: string;
}

interface OrderDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: OrderRow;
}

export default function OrderDetailsModal({
  open,
  onOpenChange,
  order,
}: OrderDetailsModalProps) {
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (!open) return;
    setLoading(true);

    const fetchItems = async () => {
      const { data, error } = await supabase
        .from('whatsapp_order_items')
        .select('*')
        .eq('order_id', order.id);

      if (error) {
        console.error('Failed to fetch order items:', error);
      } else {
        setItems(data || []);
      }
      setLoading(false);
    };

    fetchItems();
  }, [open, order.id, supabase]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-card border-border text-foreground">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <PackageOpen className="size-5 text-primary" />
            Order Details
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Order ID: {order.id}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Customer Name</p>
              <p className="text-sm text-foreground">{order.contact?.name || 'N/A'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Phone Number</p>
              <p className="text-sm text-foreground">{order.contact?.phone}</p>
            </div>
          </div>

          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 border-border">
                  <TableHead className="text-muted-foreground">Product SKU</TableHead>
                  <TableHead className="text-right text-muted-foreground">Qty</TableHead>
                  <TableHead className="text-right text-muted-foreground">Price</TableHead>
                  <TableHead className="text-right text-muted-foreground">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      <Loader2 className="size-5 animate-spin mx-auto text-primary" />
                    </TableCell>
                  </TableRow>
                ) : items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground text-sm">
                      No items found.
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((item) => (
                    <TableRow key={item.id} className="border-border">
                      <TableCell className="font-medium text-foreground">
                        {item.product_retailer_id}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {item.quantity}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {item.item_price.toLocaleString(undefined, {
                          style: 'currency',
                          currency: item.currency || 'USD',
                        })}
                      </TableCell>
                      <TableCell className="text-right font-medium text-foreground">
                        {(item.item_price * item.quantity).toLocaleString(undefined, {
                          style: 'currency',
                          currency: item.currency || 'USD',
                        })}
                      </TableCell>
                    </TableRow>
                  ))
                )}
                {!loading && items.length > 0 && (
                  <TableRow className="border-t border-border bg-muted/20">
                    <TableCell colSpan={3} className="text-right font-semibold text-foreground">
                      Grand Total
                    </TableCell>
                    <TableCell className="text-right font-bold text-foreground">
                      {order.total_price.toLocaleString(undefined, {
                        style: 'currency',
                        currency: order.currency || 'USD',
                      })}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
