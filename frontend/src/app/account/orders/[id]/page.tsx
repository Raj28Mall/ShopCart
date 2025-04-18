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
        const fetchOrderProducts = async () => {
            try {
              if(!order){
                throw new Error("Order not found");
              }
                const response = await getOrderProducts(order.orderId.toString() || "");
                console.log(response);
                setOrderProducts(response);
                console.log(orderProducts);
            } catch (error) {
                console.error("Error fetching order products:", error);
            }
        };
        fetchOrderProducts();
    }
    , []);

  return (
    <>
      <Navbar />
      <div className="container px-4 py-8 md:px-20 md:py-12">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/4">
            <Card className="pb-3">
              <CardHeader>
                <CardTitle className="text-xl">Account</CardTitle>
                <CardDescription className="text-gray-400">
                  Manage your account settings and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="flex flex-col">
                  <Button variant={"ghost"} onClick={() => router.push("/account")} className="justify-start flex gap-2 mx-2 text-sm bg-muted font-medium" >
                    <User className="h-4 w-4" />
                    Account Overview
                  </Button>
                  <Button variant={"ghost"} onClick={() => router.push("/account/orders")} className="flex justify-start gap-2 mx-2 text-sm hover:bg-muted/50 transition-colors" >
                    <Package className="h-4 w-4" />
                    Orders
                  </Button>
                  <Button variant={"ghost"} onClick={() => router.push("/account/settings")} className="flex justify-start gap-2 mx-2 text-sm hover:bg-muted/50 transition-colors" >
                    <Settings className="h-4 w-4" />
                    Settings
                  </Button>
                  <Button variant={"ghost"} onClick={() => router.push("/comingSoon")} className="flex justify-start gap-2 mx-2 text-sm hover:bg-muted/50 transition-colors" >
                    <Heart className="h-4 w-4" />
                    Wishlist
                  </Button>
                  <Button variant={"ghost"} onClick={() => router.push("/comingSoon")} className="flex justify-start gap-2 mx-2 text-sm hover:bg-muted/50 transition-colors" >
                    <CreditCard className="h-4 w-4" />
                    Payment Methods
                  </Button>
                  <Button variant={"ghost"} onClick={() => router.push("/comingSoon")} className="flex justify-start gap-2 mx-2 text-red-500 hover:text-red-600 transition-colors" >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                </nav>
              </CardContent>
            </Card>
          </div>

          <div className="flex-1">
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
                        <span className="text-gray-400">Shipping</span>
                        <span className="">₹20.00</span>
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
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
