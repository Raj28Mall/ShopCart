"use client";
import { Navbar } from "@/components/navbar";
import * as React from 'react';
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2, Loader2 } from "lucide-react";
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
  description: string
  rating: number
  quantity: number
  // reviews: number
  details: string
}

export default function Cart(){
    // const cartItems= useCartStore((state)=>state.cartItems); //for when implementing global zustand state
    // const setCartItems= useCartStore((state)=>state.setCartItems);

    const [cartItems, setCartItems] = useState<CartItem[]>([
      {
        id: 1,
        name: "Premium Cotton T-Shirt",
        price: 29.99,
        image: "/placeholder.svg?height=250&width=250",
        category: "Clothes",
        rating: 4.4,
        description: "Soft, breathable cotton tee for everyday wear.",
        details: "Made from 100% premium cotton. Machine washable. Available in multiple colors.",
        quantity: 7
      },
      {
        id: 2,
        name: "Wireless Headphones",
        price: 129.99,
        image: "/placeholder.svg?height=250&width=250",
        category: "Electronics",
        rating: 4.6,
        description: "High-fidelity sound with noise isolation.",
        details: "Bluetooth 5.0, 20-hour battery, foldable design, built-in mic for calls.",
        quantity: 3
      },
      {
        id: 3,
        name: "Ceramic Coffee Mug",
        price: 19.99,
        image: "/placeholder.svg?height=250&width=250",
        category: "Kitchen Appliances",
        rating: 4.2,
        description: "Minimalist mug for hot and cold beverages.",
        details: "12oz capacity, microwave and dishwasher safe. Matte ceramic finish.",
        quantity: 9
      },
      {
        id: 4,
        name: "Eco-Friendly Notebook",
        price: 9.99,
        image: "/placeholder.svg?height=250&width=250",
        category: "Electronics",
        rating: 4.1,
        description: "Recyclable notebook with smooth pages.",
        details: "80 ruled pages. Made with recycled paper. A5 size.",
        quantity: 2
      },
      {
        id: 5,
        name: "Bluetooth Speaker",
        price: 49.99,
        image: "/placeholder.svg?height=250&width=250",
        category: "Electronics",
        rating: 4.5,
        description: "Loud, portable sound with deep bass.",
        details: "10W output, water-resistant, 12-hour playtime, supports TWS pairing.",
        quantity: 6
      },
      {
        id: 6,
        name: "Running Shoes",
        price: 89.99,
        image: "/placeholder.svg?height=250&width=250",
        category: "Sports",
        rating: 4.3,
        description: "Lightweight and breathable athletic shoes.",
        details: "Mesh upper, EVA sole, arch support. Ideal for daily runs and training.",
        quantity: 10
      }
    ]);
    const [couponCode, setCouponCode]=useState<string>("");
    const [loading, setLoading]=useState<boolean>(false);
    const router=useRouter();

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
    }
  
    const removeItem = (id: number) => {
      setCartItems(cartItems.filter((item) => item.id !== id))
    }

    const handleSale = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success("Purchase successful");
      setCartItems([]);
      setLoading(false);
      router.push('/');
    }
    return(
        <div className="overflow-x-hidden min-h-screen">
            <Navbar/>
            <h1 className='text-3xl font-bold pt-3 my-8 mx-12'>Shopping Cart</h1>
            <div className="flex justify-between items-center mt-6 mb-4 px-10 lg:pl-12 w-[100vw] lg:w-[66vw] ">
                <Link href="/products" className="flex items-center text-sm hover:underline">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Continue Shopping
                </Link>
                <Button variant="outline" onClick={() => setCartItems([])}>
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

                  <Button variant={'outline'} className="w-full mt-6 bg-black text-white hover:bg-slate-800" size="lg" onClick={handleSale} disabled={loading}>
                  {loading?  <Loader2 className="animate-spin w-5 h-5" /> : "Buy Now"}
                  </Button>

                  <div className="mt-6 space-y-4">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">or</span>
                      </div>
                    </div>

                    <div className="space-y-2">
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
            <Button size="lg">Start Shopping</Button>
          </Link>
        </div>
        )}
        </div>
    );
}