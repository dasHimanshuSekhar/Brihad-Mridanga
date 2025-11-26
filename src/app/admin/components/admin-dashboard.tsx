import { orders, booksMap } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"


export function AdminDashboard() {
  const sortedOrders = [...orders].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

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
                <div className="flex justify-between w-full pr-4">
                    <div className="text-left">
                        <p className="font-semibold">{order.name}</p>
                        <p className="text-sm text-muted-foreground">{order.mobile} - {order.email}</p>
                    </div>
                    <div className="text-right flex flex-col items-end">
                        <p className="font-bold text-lg text-accent">${order.totalAmount.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">{order.timestamp.toLocaleDateString()}</p>
                    </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="p-4 bg-muted/50 rounded-md">
                    <p><strong>Address:</strong> {order.address}</p>
                    {order.referralCode && <p><strong>Referral Code:</strong> {order.referralCode}</p>}
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
