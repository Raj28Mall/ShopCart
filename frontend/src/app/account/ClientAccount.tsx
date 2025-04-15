/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import * as React from 'react';
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from 'react';
import { Settings, Package, LogOut, User, CreditCard, Heart, Phone, Router, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useRouter } from "next/navigation";
import { toast } from 'react-hot-toast';
import { Navbar } from '@/components/navbar';

interface User{
    id: number
    name: string
    email: string
    phone: number
    joinDate: string
    address: {
        street: string;
        apartment?: string;
        city: string;
        state: string;
        country: string;
    }
}

export default function AccountClientPage() {
//   const user=useUserStore((state)=>state.user);      // for when user zustand global state is implemented
//   if(!user){
//     router.push('/login');
//     return;
//   }
  const handleProfileChanges=async()=>{
    // add form validation for name, email, phone
    setProfileUpdating(true);
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate a network request
    setProfileUpdating(false);
    setProfileChange(false);
    toast.success("Profile updated successfully");
  };

  const router= useRouter();
  const user: User={
    "id": 1,
    "name": "Raj Mall",
    "email": "rajmall.0206@gmail.com",
    "phone": 9167601208,
    "joinDate": "11/04/2025",
    "address":{street:"Rambuag, Nahar, Powai", apartment:"A-101", city:"Mumbai -400076", state:"Maharashtra", country:"India"}
  }
  const [name, setName]=useState<string>(user.name);
  const [email, setEmail]=useState<string>(user.email);
  const [phone, setPhone]=useState<number>(user.phone);
  const [profileChange, setProfileChange]= useState<boolean>(false);
  const [profileUpdating, setProfileUpdating] = useState<boolean>(false);
  return (
    <>
    <Navbar/>
    <div className="container px-4 py-8 md:px-20 md:py-12">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/4">
          <Card className="pb-3">
            <CardHeader>
              <CardTitle className='text-xl'>Account</CardTitle>
              <CardDescription className="text-gray-400">Manage your account settings and preferences</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <nav className="flex flex-col">
                <Button variant={'ghost'} onClick={() => router.push('/account')} className="justify-start flex gap-2 mx-2 text-sm bg-muted font-medium">
                  <User className="h-4 w-4" />
                  Account Overview
                </Button>
                <Button variant={'ghost'} onClick={() => router.push('/account/orders')} className="flex justify-start gap-2 mx-2 text-sm hover:bg-muted/50 transition-colors">
                  <Package className="h-4 w-4" />
                  Orders
                </Button>
                <Button variant={'ghost'} onClick={() => router.push('/account/settings')} className="flex justify-start gap-2 mx-2 text-sm hover:bg-muted/50 transition-colors">
                  <Settings className="h-4 w-4" />
                  Settings
                </Button>
                <Button variant={'ghost'} onClick={() => router.push('/account/wishlist')} className="flex justify-start gap-2 mx-2 text-sm hover:bg-muted/50 transition-colors">
                  <Heart className="h-4 w-4" />
                  Wishlist
                </Button>
                <Button variant={'ghost'} onClick={() => router.push('/account/payment')} className="flex justify-start gap-2 mx-2 text-sm hover:bg-muted/50 transition-colors">
                  <CreditCard className="h-4 w-4" />
                  Payment Methods
                </Button>
                <Button variant={'ghost'} onClick={() => router.push('/account/payment')} className="flex justify-start gap-2 mx-2 text-red-500 hover:text-red-600 transition-colors">
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </nav>
            </CardContent>
          </Card>
        </div>

        <div className="flex-1">
          <Card>
            <CardHeader>
              <CardTitle className='text-xl font-semibold'>Account Overview</CardTitle>
              <CardDescription className='text-gray-400'>View your account information and recent activity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor='name' className="pl-2 text-gray-400 text-sm py-1">Name</Label>
                    <Input id='name' className='w-5/6' value={name} onChange={(e:React.ChangeEvent<HTMLInputElement>)=>{setProfileChange(true); setName(e.target.value);}}/>
                  </div>
                  <div>
                    <Label htmlFor='email' className="pl-2 text-sm text-gray-400  py-1">Email</Label>
                    <Input id='email' className='w-5/6' value={email} onChange={(e:React.ChangeEvent<HTMLInputElement>)=>{setProfileChange(true); setEmail(e.target.value);}}/>
                  </div>
                  <div>
                    <Label htmlFor='phone' className="pl-2 text-sm text-gray-400  py-1">Phone</Label>
                    <Input id='phone' className='w-5/6' value={phone} onChange={(e:React.ChangeEvent<HTMLInputElement>)=>{setProfileChange(true); setPhone(parseInt(e.target.value));}}/>
                  </div>
                  <div>
                    <p className=" text-gray-400 text-sm py-2">Member Since</p>
                    <p className='text-sm'>{user.joinDate}</p> {/* Format date to 11th April, 2025 type shi */}
                  </div>
                </div>
                <div className="mt-8">
                    <Button variant="ghost" size="sm" className='bg-green-400 disabled:bg-green-300 disabled:text-black disabled:opacity-95' disabled={!profileChange} onClick={handleProfileChanges}>
                      {profileUpdating? <Loader2 className='animate-spin h-5 w-5'/>: "Save Changes"}
                    </Button>
                </div>
              </div>

              <div className="px-2 py-6 bg-white space-y-4">
                <h2 className="text-lg font-semibold">Default Address</h2>

                <div className="bg-white border p-4 rounded-md">
                  <p className="font-medium">Raj Mall</p>
                  <p className="text-sm text-muted-foreground">Rambaug, Nahar, Powai</p>
                  <p className="text-sm text-muted-foreground">A-101</p>
                  <p className="text-sm text-muted-foreground">Mumbai - 400076</p>
                  <p className="text-sm text-muted-foreground">India</p>

                  <Button variant="outline" className="mt-4 bg-white">
                    Manage Addresses
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </>
  )
}

const recentOrders = [
  {
    id: "ORD-123456",
    date: "June 15, 2023",
    status: "Delivered",
    total: 159.97,
  },
  {
    id: "ORD-789012",
    date: "July 23, 2023",
    status: "Processing",
    total: 89.99,
  },
  {
    id: "ORD-345678",
    date: "August 10, 2023",
    status: "Shipped",
    total: 249.5,
  },
]
