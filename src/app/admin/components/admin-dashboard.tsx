'use client';
import { useTransition } from 'react';
import { orders, booksMap } from '@/lib/data';
import type { Order } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from '@/components/ui/button';
import { forwardToShiprocket } from '../actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';


type AdminDashboardProps = {
    initialOrders?: Order[];
}

export function AdminDashboard({ initialOrders }: AdminDashboardProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  // In a real app with a database, you would re-fetch or use a subscription.
  // For this demo, we assume the server will pass updated data on next load.
  const sortedOrders = [...(initialOrders || orders)].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  const handleForward = (orderId: string) => {
    startTransition(async () => {
        const result = await forwardToShiprocket(orderId);
        if(result.success) {
            toast({ title: "Success", description: result.message });
            // In a real app, you would invalidate a cache or re-fetch data here
            // For now, a page refresh is needed to see the status change.
             window.location.reload();
        } else {
            toast({ variant: 'destructive', title: "Error", description: result.message });
        }
    });
  }

  const getStatusBadgeVariant = (status: 'New' | 'Shipped' | 'Delivered' | 'Cancelled') => {
    switch (status) {
      case 'Shipped':
        return 'default'; // Or another color
      case 'Delivered':
        return 'secondary';
      case 'Cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle>All Orders</CardTitle>
        <CardDescription>A list of all orders placed through the system.</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {sortedOrders.map(order => (
            <AccordionItem value={order.id} key={order.id}>
              <AccordionTrigger>
                <div className="flex justify-between items-center w-full pr-4">
                    <div className="text-left">
                        <p className="font-semibold">{order.name}</p>
                        <p className="text-sm text-muted-foreground">{order.mobile} - {order.email}</p>
                    </div>
                    <div className="text-right flex items-center gap-4">
                        <Badge variant={getStatusBadgeVariant(order.status)}>{order.status}</Badge>
                        <div className='flex flex-col items-end'>
                            <p className="font-bold text-lg text-accent">${order.totalAmount.toFixed(2)}</p>
                            <p className="text-sm text-muted-foreground">{order.timestamp.toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="p-4 bg-muted/50 rounded-md">
                    <div className="flex justify-between items-start">
                        <div>
                            <p><strong>Address:</strong> {order.address}</p>
                            {order.referralCode && <p><strong>Referral Code:</strong> {order.referralCode}</p>}
                        </div>
                         {order.status === 'New' && (
                            <Button onClick={() => handleForward(order.id)} disabled={isPending}>
                                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Forward to Shiprocket
                            </Button>
                        )}
                    </div>
                    
                    <h4 className="font-semibold mt-4 mb-2">Items:</h4>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Book Title</TableHead>
                                <TableHead className="text-center">Quantity</TableHead>
                                <TableHead className="text-right">Price</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {order.items.map(item => {
                                const book = booksMap.get(item.bookId);
                                if (!book) return null;
                                return (
                                    <TableRow key={item.bookId}>
                                        <TableCell>{book.title}</TableCell>
                                        <TableCell className="text-center">{item.quantity}</TableCell>
                                        <TableCell className="text-right">${book.price.toFixed(2)}</TableCell>
                                        <TableCell className="text-right">${(item.quantity * book.price).toFixed(2)}</TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                     </Table>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
