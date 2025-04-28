/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import * as React from 'react';
import { useState, useEffect } from 'react';
import Link from "next/link";
import Image from "next/image";
import {ChevronLeft,Package,Truck,CheckCircle,User,Settings,Heart,CreditCard,LogOut, } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import {Card,CardContent,CardDescription,CardHeader,CardTitle, } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { use } from "react";
import { useOrderStore } from "@/store/orderStore";
import { getOrderProducts } from '@/lib/api';
import AccountSidebar from '@/components/accountSidebar';
import Footer from '@/components/footer';

const SHIPPING_COST="20.00";
interface orderProduct{
    orderId: number
    productId: number;
    productName: string;
    productPrice: number;
    productQuantity: number;
    productImage: string;
}

export default function OrderDetailsPage() {
    const params= useParams();
    const id= params.id;
    const router = useRouter(); 
    const orders= useOrderStore((state) => state.orders);
    const order= orders.find((order) => Number(order.orderId) == Number(id));
    const [orderProducts, setOrderProducts]=useState<orderProduct[]>([]);
    useEffect(() => {
      if (!order) {
        console.log("Order not ready yet");
        return;
      }
      const fetchOrderProducts = async () => {
        try {
          const response = await getOrderProducts(order.orderId.toString());
          setOrderProducts(response);
        } catch (error) {
          console.error("Error fetching order products:", error);
        }
      };
    
      fetchOrderProducts();
    }, [order]); 

  return (
    <>
      <Navbar />
      <div className="container px-4 py-8 md:px-20 md:py-12">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/4">
            <AccountSidebar />
          </div>

          <div className="flex-1">
            {order?
            <Card>
              <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Link href="/account/orders" className="text-xs underline text-muted-foreground hover:text-foreground">
                      <ChevronLeft className="h-4 w-4 inline" />
                      Back to Orders
                    </Link>
                  </div>
                  <CardTitle className="text-xl">Order #{order?.orderId}</CardTitle>
                  <CardDescription className="text-gray-400">
                    Placed on {order?.orderDate ? new Date(order.orderDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : ""}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                <span
                    className={`px-3 py-1 text-sm rounded-full ${
                        order?.orderStatus === "Delivered"
                            ? "bg-green-100 text-green-800"
                            : order?.orderStatus === "Processing"
                            ? "bg-blue-100 text-blue-800"
                            : order?.orderStatus === "Cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"}`}>
                    {order?.orderStatus}
                </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-8">

                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Order Items</h3>
                    <div className="border rounded-md divide-y">
                      {orderProducts.map((item) => (
                        <div key={`${id}-${item.productId}`} className="p-4 flex items-start gap-4">
                          <div className="relative h-20 w-20 rounded-md overflow-hidden border flex-shrink-0">
                            <Image
                              src={item.productImage || "/placeholder.svg"}
                              alt={item.productName}
                              fill
                              className="object-cover"
                            />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{item.productName}</h4>

                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-sm">
                              ₹{Number(item.productPrice).toFixed(2)} × {Number(item.productQuantity)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            ₹{(Number(item.productPrice) * Number(item.productQuantity)).toFixed(2)}
                          </p>
                          <Button variant="link" className="h-auto p-0 text-sm mt-5">
                            Buy Again
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Order Summary</h3>
                  <div className="border rounded-md p-4">
                    <div className="space-y-1">
                      <div className="flex justify-between pb-2 border-b">
                        <span className="text-gray-400">Subtotal</span>
                        <span className="">₹{Number(order?.totalPrice)-Number(SHIPPING_COST)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between pb-2 border-b">
                        <span className="text-gray-400">Shipping</span>
                        <span className="">₹{SHIPPING_COST}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-medium">
                        <span>Total</span>
                        <span className="font-semibold">₹{Number(order?.totalPrice).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

              <div className="px-2 py-6 bg-white space-y-4">
                <h2 className="text-lg font-semibold">Default Address</h2>

                <div className="bg-white border p-4 rounded-md">
                  <p className="font-semibold">Home</p>
                  <p className="text-sm text-muted-foreground">Rambaug, Nahar, Powai</p>
                  <p className="text-sm text-muted-foreground">A-101</p>
                  <p className="text-sm text-muted-foreground">Mumbai - 400076</p>
                  <p className="text-sm text-muted-foreground">India</p>
                </div>
              </div>

                <div className="flex flex-wrap gap-2">
                  <Button variant="outline">Need Help?</Button>
                </div>
              </CardContent>
            </Card>:
            <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-pulse">
              <div className="space-y-2">
                <div className="h-4 w-32 bg-gray-200 rounded" />
                <div className="h-6 w-48 bg-gray-300 rounded" />
                <div className="h-4 w-36 bg-gray-200 rounded" />
              </div>
              <div className="h-6 w-24 bg-gray-200 rounded-full" />
            </CardHeader>
          
            <CardContent className="space-y-8 animate-pulse">
          
              {/* Order Items */}
              <div className="space-y-4">
                <div className="h-5 w-32 bg-gray-300 rounded" />
                <div className="border rounded-md divide-y">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="p-4 flex items-start gap-4">
                      <div className="relative h-20 w-20 bg-gray-200 rounded-md flex-shrink-0 overflow-hidden">
                        <Image
                          src="/placeholder.svg"
                          alt="placeholder"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-2/5 bg-gray-300 rounded" />
                        <div className="h-4 w-1/6 bg-gray-200 rounded" />
                      </div>
                      <div className="space-y-2 text-right">
                        <div className="h-4 w-16 bg-gray-300 rounded ml-auto" />
                        <div className="h-4 w-20 bg-gray-200 rounded ml-auto" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
          
              {/* Order Summary */}
              <div className="space-y-4">
                <div className="h-5 w-32 bg-gray-300 rounded" />
                <div className="border rounded-md p-4 space-y-4">
                  <div className="flex justify-between">
                    <div className="h-4 w-24 bg-gray-200 rounded" />
                    <div className="h-4 w-12 bg-gray-200 rounded" />
                  </div>
                  <div className="flex justify-between">
                    <div className="h-4 w-24 bg-gray-200 rounded" />
                    <div className="h-4 w-12 bg-gray-200 rounded" />
                  </div>
                  <div className="flex justify-between font-medium">
                    <div className="h-4 w-16 bg-gray-300 rounded" />
                    <div className="h-4 w-20 bg-gray-300 rounded" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
