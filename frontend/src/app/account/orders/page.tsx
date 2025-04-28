"use client";

import * as React from 'react';
import { useState, useEffect } from 'react';
import Link from "next/link"
import { User, Package, Settings, Heart, CreditCard, LogOut, Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Navbar } from "@/components/navbar";
import { getOrderHistory } from "@/lib/api";
import { useOrderStore } from '@/store/orderStore';
import AccountSidebar from '@/components/accountSidebar';
import Footer from '@/components/footer';

export default function OrdersPage() {
    const router= useRouter();
  
    const orders= useOrderStore((state)=>state.orders);
    const setOrders= useOrderStore((state)=>state.setOrders);

    useEffect(() => {
      const fetchOrders = async () => {
        try {
          const response = await getOrderHistory();
          setOrders(response);
        } catch (error) {
          console.error("Error fetching orders:", error);
        }
      };
  
      fetchOrders();
    }, []);

  return (
    <>
    <Navbar />
    <div className="container px-4 py-8 md:px-20 md:py-12">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/4">
          <AccountSidebar />
        </div>

        <div className="flex-1">
          <Card>
            <CardHeader>
              <CardTitle className='text-xl font-semibold'>Order History</CardTitle>
              <CardDescription className='text-gray-400'>View and manage your past orders</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search orders..." className="pl-8" />
                </div>
                {/* <div className="flex gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Orders</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="newest">
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                    </SelectContent>
                  </Select>
                </div> */}
              </div>

              {/* Orders List */}
              <div className="border rounded-md divide-y overflow-y-scroll">
                {orders.map((order) => (
                  <div key={order.orderId} className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">Order: {order.orderId}</p>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              order.orderStatus === "Delivered"
                                ? "bg-green-100 text-green-800"
                                : order.orderStatus === "Processing"
                                  ? "bg-blue-100 text-blue-800"
                                    : "bg-red-100 text-red-800"
                            }`}
                          >
                            {order.orderStatus}
                          </span>
                        </div>
                        <p className='text-sm'>{new Date(order.orderDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p> {/* ADD DATE PROCESSING */}
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-medium">₹{Number(order.totalPrice).toFixed(2)}</p>
                          <p className="text-sm text-muted-foreground">{order.totalQuantity} items</p>
                        </div>
                        <Link href={`/account/orders/${order.orderId}`}>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    <Footer />
    </>
  )
}
