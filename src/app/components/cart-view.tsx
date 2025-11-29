'use client';

import { useTransition } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { placeOrder } from '@/app/actions';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import type { CartItem } from './order-client-wrapper';
import type { OrderItem } from '@/lib/data';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";


const orderFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  address: z.string().min(10, { message: "Please enter a valid address." }),
  zipCode: z.string().regex(/^\d{6}$/, { message: "Please enter a valid 6-digit zip code." }),
  mobile: z.string().regex(/^\d{10}$/, { message: "Please enter a valid 10-digit mobile number." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  referralCode: z.string().regex(/^\d{10}$/, { message: "Referral code must be a 10-digit mobile number." }).optional().or(z.literal('')),
});

type OrderFormValues = z.infer<typeof orderFormSchema>;

type CartViewProps = {
  cart: Map<string, CartItem>;
  updateQuantity: (bookId: string, newQuantity: number) => void;
  cartItemsForForm: OrderItem[];
  clearCart: () => void;
};

export function CartView({ cart, updateQuantity, cartItemsForForm, clearCart }: CartViewProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      name: "",
      address: "",
      zipCode: "",
      mobile: "",
      email: "",
      referralCode: "",
    },
  });

  const cartArray = Array.from(cart.values());
  const subtotal = cartArray.reduce((acc, item) => acc + item.book.price * item.quantity, 0);

  async function onSubmit(data: OrderFormValues) {
    if (cartItemsForForm.length === 0) {
      toast({
        variant: "destructive",
        title: "Your cart is empty",
        description: "Please add books to your cart before placing an order.",
      });
      return;
    }
    
    startTransition(async () => {
      const result = await placeOrder({ ...data, items: cartItemsForForm });
      if (result.success) {
        toast({
          title: "Order Placed!",
          description: result.message,
        });
        form.reset();
        clearCart();
      } else {
        toast({
          variant: "destructive",
          title: "Order Failed",
          description: result.message || "An unexpected error occurred.",
        });
        if (result.errors) {
            // Set form errors if any
            (Object.keys(result.errors) as Array<keyof OrderFormValues>).forEach((key) => {
                const message = result.errors?.[key]?.[0];
                if(message) form.setError(key, { type: 'server', message });
            });
        }
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline text-2xl">
          <ShoppingCart /> Your Order
        </CardTitle>
        <CardDescription>Review your items and place your order.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {cartArray.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">Your cart is empty.</p>
        ) : (
          <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
            {cartArray.map(({ book, quantity }) => (
              <div key={book.id} className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{book.title}</p>
                    <p className="text-sm text-muted-foreground">₹{book.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(book.id, quantity - 1)}><Minus className="h-3 w-3" /></Button>
                  <span>{quantity}</span>
                  <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(book.id, quantity + 1)}><Plus className="h-3 w-3" /></Button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {cartArray.length > 0 && (
            <>
                <Separator />
                <div className="flex justify-between font-bold">
                    <span>Subtotal</span>
                      <span>₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
            </>
        )}

        <Separator />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem><FormLabel>Name</FormLabel><FormControl><Input placeholder="Your Name" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="address" render={({ field }) => (
              <FormItem><FormLabel>Shipping Address</FormLabel><FormControl><Input placeholder="Your Address" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="zipCode" render={({ field }) => (
              <FormItem><FormLabel>Zip Code</FormLabel><FormControl><Input placeholder="6-digit zip code" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="mobile" render={({ field }) => (
                <FormItem><FormLabel>Mobile Number</FormLabel><FormControl><Input placeholder="10-digit mobile" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="your@email.com" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="referralCode" render={({ field }) => (
                <FormItem><FormLabel>Referral Code (Optional)</FormLabel><FormControl><Input placeholder="Referrer's 10-digit mobile" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
             <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={isPending || cartArray.length === 0}>
              {isPending ? 'Placing Order...' : 'Place Order'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
