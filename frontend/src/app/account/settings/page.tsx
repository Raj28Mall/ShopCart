"use client"

import { useState } from "react"
import Link from "next/link"
import { User, Package, Settings, Heart, CreditCard, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { toast } from "react-hot-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navbar } from "@/components/navbar"

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter();
  
  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve)=>setTimeout(resolve, 2000)); // Simulating API call
    setIsSaving(false);
    toast.success("Settings updated");
  }

  return (
    <>
    <Navbar />
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
            <CardTitle className='text-xl font-semibold'>Settings</CardTitle>
            <CardDescription className='text-gray-400'>Manage your account settings and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid grid-cols-3 w-full bg-gray-200 rounded-full">
                  <TabsTrigger
                    value="profile"
                    className="text-sm font-medium rounded-full transition-all  data-[state=active]:bg-white   data-[state=active]:text-black  data-[state=active]:shadow-none">
                    Profile
                  </TabsTrigger>
                  <TabsTrigger
                    value="addresses"
                    className="text-sm font-medium rounded-full transition-all  data-[state=active]:bg-white   data-[state=active]:text-black data-[state=active]:shadow-none">
                    Addresses
                  </TabsTrigger>
                  <TabsTrigger
                    value="preferences"
                    className="text-sm font-medium rounded-full transition-all  data-[state=active]:bg-white   data-[state=active]:text-black data-[state=active]:shadow-none">
                    Preferences
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-6 pt-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Change Password</h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input id="currentPassword" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input id="newPassword" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input id="confirmPassword" type="password" />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button variant={'outline'} className="bg-green-400 disabled:bg-green-300 disabled:text-black disabled:opacity-95" onClick={handleSave} disabled={isSaving}>
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="addresses" className="space-y-6 pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Saved Addresses</h3>
                      <Button variant="outline" size="sm">
                        Add New Address
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {addresses.map((address, index) => (
                        <div key={index} className="border rounded-md p-4 relative">
                          {address.isDefault && (
                            <span className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                              Default
                            </span>
                          )}
                          <div className="h-28">
                            <p className="font-semibold mb-3">{address.name}</p>
                            <p className="text-sm">{address.street}</p>
                            {address.apt && <p className="text-sm">{address.apt}</p>}
                            <p className="text-sm">
                                {address.city}, {address.state} {address.zip}
                            </p>
                            <p className="text-sm">{address.country}</p>
                          </div>
                          <div className="flex items-center gap-2 mt-4">
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                            {!address.isDefault && (
                              <Button variant="outline" size="sm">
                                Set as Default
                              </Button>
                            )}
                            {!address.isDefault && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                              >
                                Remove
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="preferences" className="space-y-6 pt-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Account Preferences</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="language">Language</Label>
                        <Select defaultValue="en">
                          <SelectTrigger id="language">
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                            <SelectItem value="de">German</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="currency">Currency</Label>
                        <Select defaultValue="inr">
                          <SelectTrigger id="currency">
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            <SelectItem value="inr">INR (₹)</SelectItem>
                            <SelectItem value="usd">USD ($)</SelectItem>
                            <SelectItem value="eur">EUR (€)</SelectItem>
                            <SelectItem value="gbp">GBP (£)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button variant={'outline'} className="bg-green-400 disabled:bg-green-300 disabled:text-black disabled:opacity-95" onClick={handleSave} disabled={isSaving}>
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </>
  )
}

const addresses = [
  {
    name: "John Doe",
    street: "123 Main Street",
    apt: "Apt 4B",
    city: "New York",
    state: "NY",
    zip: "10001",
    country: "United States",
    isDefault: true,
  },
  {
    name: "John Doe",
    street: "456 Park Avenue",
    apt: "",
    city: "Boston",
    state: "MA",
    zip: "02108",
    country: "United States",
    isDefault: false,
  },
]
