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
import AccountSidebar from '@/components/accountSidebar';
import { useRouter } from "next/navigation";
import { toast } from 'react-hot-toast';
import { Navbar } from '@/components/navbar';
import { useAuthStore } from '@/store/authStore';
import { useUserStore } from '@/store/userStore';
import { RequireAuth } from '@/components/requireAuth';

// Helper function to format date
const formatDate = (dateString: string) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  // Function to add ordinal suffix (1st, 2nd, 3rd, etc.)
  const getOrdinalSuffix = (day: number) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };
  
  const day = date.getDate();
  const suffix = getOrdinalSuffix(day);
  
  return `${day}${suffix} ${date.toLocaleString('en-US', { month: 'long' })}, ${date.getFullYear()}`;
};

export default function AccountClientPage() {
  const user=useUserStore((state)=>state.user);     
  const handleProfileChanges=async()=>{
    // add form validation for name, email, phone
    setProfileUpdating(true);
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate a network request
    setProfileUpdating(false);
    setProfileChange(false);
    toast.success("Profile updated successfully");
  };
  
  const [name, setName]=useState<string>(user.name);
  const [email, setEmail]=useState<string>(user.email);
  const [phone, setPhone]=useState<number>(9167601208);
  const [profileChange, setProfileChange]= useState<boolean>(false);
  const [profileUpdating, setProfileUpdating] = useState<boolean>(false);
  
  return (
    <RequireAuth>
    <Navbar/>
    <div className="container px-4 py-8 md:px-20 md:py-12">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/4">
          <AccountSidebar />
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
                    <p className='text-sm'>{formatDate(user.dateJoined)}</p> {/* Format date to 11th April, 2025 type shi */}
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
                  <p className="font-semibold">Home</p>
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
    </RequireAuth>
  )
}

