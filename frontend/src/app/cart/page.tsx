/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { Navbar } from "@/components/navbar";
import * as React from 'react';
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from "@/components/ui/dialog"
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2, Loader2, Check, Download, Home, Package, } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";
import { Separator } from "@/components/ui/separator";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface CartItem{
  id: number
  name: string
  price: number
  image: string
  category: string
  shortDescription: string
  longDescription: string
  rating: number
  quantity: number
  // reviews: number
  details: string[]
}

export default function Cart(){
    // const cartItems= useCartStore((state)=>state.cartItems); //for when implementing global zustand state
    // const setCartItems= useCartStore((state)=>state.setCartItems);

    const [cartItems, setCartItems] = useState<CartItem[]>([
      {
        id: 1,
        name: "Smart LED Light Strips",
        price: 34.99,
        image: "/products/electronics/led_strips.jpg",
        category: "Electronics",
        rating: 4.3,
        quantity: 3,
        shortDescription: "Customizable LED strips with app control and voice command support.",
        longDescription: "Transform any space with our Smart LED Light Strips that combine sophisticated illumination technology with intuitive controls. Each strip contains individually addressable RGB LEDs capable of displaying 16 million distinct colors, allowing you to precisely match existing décor or create dramatic contrasts. The advanced controller interprets audio input through frequency analysis algorithms, synchronizing light patterns with your music. The modular design allows you to connect multiple strips seamlessly while maintaining perfect color uniformity. The smartphone app provides unprecedented control from simple color selection to complex dynamic scenes simulating natural phenomena like ocean waves or sunrise progressions.",
        details: ["Compatible with Alexa/Google", "16M colors", "Music sync", "App-controlled"]
      },
      {
        id: 2,
        name: "Ergonomic Office Chair",
        price: 249.99,
        image: "/products/kitchen/office_chair.jpg",
        category: "Electronics",
        rating: 4.7,
        quantity: 2,
        shortDescription: "Adjustable office chair designed for comfort during long work hours.",
        longDescription: "Transform your work experience with our Ergonomic Office Chair, developed with orthopedic specialists. The dynamically adaptive lumbar support automatically adjusts to your movements, providing continuous support for proper spinal alignment. The breathable mesh back features varying tension zones mapped to different areas of your back. The waterfall-edge seat cushion utilizes high-resilience foam with temperature-responsive properties, distributing weight evenly to eliminate pressure points. The precision-engineered synchronous tilt mechanism maintains ideal angles between torso and legs throughout different recline positions, allowing posture changes throughout the day to reduce muscle fatigue.",
        details: ["Adjustable height", "Headrest", "And armrests", "Promotes good posture for long work sessions"]
      },
      {
        id: 3,
        name: "Wireless Mechanical Keyboard",
        price: 109.99,
        image: "/products/electronics/wireless_keyboard.jpg",
        category: "Electronics",
        rating: 4.8,
        quantity: 5,
        shortDescription: "Premium wireless keyboard with tactile mechanical switches.",
        longDescription: "Experience typing perfection with our Wireless Mechanical Keyboard. Each key houses an individual German-manufactured switch with gold-plated contact points providing consistent actuation force and satisfying tactile feedback. The keycaps are crafted from double-shot PBT plastic that will never fade even after years of use, with a subtly textured surface for excellent finger positioning. The aircraft-grade aluminum top plate provides exceptional rigidity that eliminates flex and creaking. Advanced Bluetooth implementation features adaptive frequency hopping to avoid interference, while 1000Hz polling rate delivers wired-like responsiveness for demanding gamers.",
        details: ["Customizable keys", "Bluetooth and USB-C connectivity", "Perfect for productivity and gaming"]
      },
  ]);
    const [couponCode, setCouponCode]=useState<string>("");
    const [loading, setLoading]=useState<boolean>(false);
    const [isOpen, setIsOpen]=useState<boolean>(false);
    const [paymentDone, setPaymentDone]= useState<boolean>(false);
    const router=useRouter();
    const orderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const orderDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });  
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal>0 ? 20.00 : 0;
    const tax = subtotal * 0.07;
    const total = subtotal + shipping + tax;
    

    const updateQuantity = (id: number, newQuantity: number) => {
      if (newQuantity < 1) return;
      if (newQuantity > 10){
        toast.error("Maximum quantity is 10");
        return;
      } 
      setCartItems(cartItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
    };
  
    const removeItem = (id: number) => {
      setCartItems(cartItems.filter((item) => item.id !== id))
    };

    const handleSale = async () => {
      if (cartItems.length === 0) {
        toast.error("Your cart is empty");
        return;
      }
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 2000)); //simulate payment processing
      setPaymentDone(true);
      setLoading(false);
      handleOpenChange(true);
      // await new Promise((resolve) => setTimeout(resolve, 1000));    //add this to clear cart once payment is done
      // setCartItems([]); 
    };

    const handleOpenChange = (open: boolean) => {
      setIsOpen(open);
    };

    return(
        <div className="overflow-x-hidden min-h-screen">
            <Navbar/>
            <h1 className='text-3xl font-bold pt-3 my-8 mx-12'>Shopping Cart</h1>
            <div className="flex justify-between items-center mt-6 mb-4 px-10 lg:pl-12 w-[100vw] lg:w-[66vw] ">
                <Link href="/products" className="flex items-center text-sm hover:underline">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Continue Shopping
                </Link>
                <Button variant="outline" onClick={() => setCartItems([])} disabled={cartItems.length<=0} hidden={cartItems.length<=0} className="text-sm">
                  Clear Cart
                </Button>
            </div>
              {cartItems.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-12 mb-20">
                  <div className="lg:col-span-2">
                    <div className="rounded-lg border">
                      <div className="p-4 md:p-6">
                        <div className="hidden md:grid grid-cols-12 gap-4 mb-4 text-sm font-medium text-muted-foreground">
                          <div className="col-span-6 px-2">Product</div>
                          <div className="col-span-2 text-center">Price</div>
                          <div className="col-span-2 text-center">Quantity</div>
                          <div className="col-span-2 text-right pr-12">Subtotal</div>
                        </div>

                        {cartItems.map((item) => (
                          <div key={item.id} className="border p-4">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                              <div className="col-span-1 md:col-span-6">
                                <div className="flex items-center gap-4">
                                  <div className="relative h-20 w-20 rounded-md overflow-hidden border">
                                    <Image
                                      src={item.image || "/placeholder.svg"}
                                      alt={item.name}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                  <div>
                                    <h3 className="font-medium">{item.name}</h3>
                                  </div>
                                </div>
                              </div>

                              <div className="col-span-1 md:col-span-2 md:text-center">
                                <div className="flex items-center justify-between md:justify-center">
                                  <span className="text-sm font-medium md:hidden">Price:</span>
                                  <span>₹{item.price.toFixed(2)}</span>
                                </div>
                              </div>

                              <div className="col-span-1 md:col-span-2 md:text-center">
                                <div className="flex items-center justify-between md:justify-center">
                                  <span className="text-sm font-medium md:hidden ">Quantity:</span>
                                    <div className="flex items-center">
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8 rounded-r-none"
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        disabled={item.quantity <= 1}>
                                          <Minus className="h-3 w-3" />
                                      </Button>
                                      <div className="h-8 w-10 flex items-center justify-center border-y">{item.quantity}</div>
                                        <Button
                                          variant="outline"
                                          size="icon"
                                          className="h-8 w-8 rounded-l-none"
                                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                          disabled={item.quantity >= 10}>
                                            <Plus className="h-3 w-3" />
                                        </Button>
                                    </div>  
                                </div>
                              </div>

                              <div className="col-span-1 md:col-span-2 md:text-right">
                                <div className="flex items-center justify-between md:justify-end">
                                  <span className="text-sm font-medium md:hidden">Subtotal:</span>
                                  <div className="flex flex-row items-center gap-2 ">
                                    <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                                    <Button variant={'ghost'} onClick={() => removeItem(item.id)} className="text-sm text-red-500 hidden md:flex md:items-center md:justify-end">
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {cartItems.indexOf(item) < cartItems.length - 1 && <Separator />}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

            <div className="lg:col-span-1">
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>₹{shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax</span>
                      <span>₹{tax.toFixed(2)}</span>
                    </div>

                    <Separator />

                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>₹{total.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button variant={paymentDone?'ghost':'outline'} className={paymentDone?"w-full mt-6 text-white hover:bg-slate-800" :"w-full mt-6 bg-black text-white hover:bg-slate-800"} size="lg" onClick={handleSale} disabled={loading || paymentDone}>
                  {loading ? <Loader2 className="animate-spin w-5 h-5" /> : paymentDone ? <div className="flex justify-center items-center rounded-full bg-emerald-100 p-3 w-fit"><Check className="!h-6 !w-6 text-center text-green-500 mx-1" size={1} /><span className="text-black">Payment Completed</span></div> : "Buy Now"}
                  </Button>

                  <div className="mt-6 space-y-4" hidden={paymentDone}>
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">or</span>
                      </div>
                    </div>

                    <div className="space-y-2" hidden={paymentDone}>
                      <div className="flex items-center">
                        <Input placeholder="Coupon code" className="rounded-r-none" value={couponCode}
                         onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setCouponCode(e.target.value)}/>
                        <Button variant={'outline'} className="rounded-l-none hover:bg-slate-100" onClick={()=>{if(couponCode.length>4){toast.success("Coupon applied");} else{toast.error("Invalid coupon code");} setCouponCode("");}}>
                          Apply
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-muted p-6 mb-4">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">Looks like you haven&apos;t added anything to your cart yet.</p>
          <Link href="/products">
            <Button variant={'outline'} size="lg">Start Shopping</Button>
          </Link>
        </div>
        )}

        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
          <DialogContent className="sm:max-w-md md:max-w-lg bg-white h-[80vh] overflow-y-scroll">
            <DialogHeader className="flex flex-col items-center text-center">
              <div className="rounded-full bg-emerald-100 p-3 mb-4">
                <Check className="h-8 w-8 text-emerald-600" />
              </div>
              <DialogTitle className="text-2xl">Payment Successful!</DialogTitle>
              <DialogDescription>Your order has been placed and will be processed soon.</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Order Number</p>
                  <p className="font-medium">{orderNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-muted-foreground">Date</p>
                  <p className="font-medium">{orderDate}</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-medium">Order Summary</h4>
                <div className="max-h-[200px] overflow-auto space-y-3 pr-2">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="relative h-14 w-14 rounded-md overflow-hidden border flex-shrink-0">
                        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{item.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.quantity} × ₹{item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <span className="font-medium">Total Amount</span>
                <span className="font-bold text-lg">₹{total.toFixed(2)}</span>
              </div>

              <div className="bg-muted p-3 rounded-lg text-sm">
                <div className="flex items-start gap-2">
                  <Package className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <p>
                    Your order will be processed and shipped within 1-2 days. You will receive a notification once your order is on its way
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" className="sm:flex-1" onClick={() => handleOpenChange(false)} asChild>
                <Link href="/">
                  <Home className="h-4 w-4 mr-2" />
                  Continue Shopping
                </Link>
              </Button>
              <Button variant="outline" className="sm:flex-1" onClick={() => handleOpenChange(false)} asChild>
                {/* Add actual route to accounts/orders */}
                <Link href="/comingSoon">      
                  <Download  className="h-4 w-4 mr-2" />
                  View Order Details
                </Link>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        </div>

        
    );
}