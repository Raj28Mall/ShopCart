"use client"
import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import Fuse from "fuse.js"
import { Upload, Check, X, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label";
import { AdminSidebar } from "@/components/adminSidebar";
import { useAuthStore } from "@/store/authStore";
import { toast } from "react-hot-toast";
import { getAdmins } from "@/lib/api"
import { adminApproval } from "@/lib/api"
import { User } from "@/store/authStore"
import { RequireAdminAuth } from "@/components/requireAdminAuth"

export default function SuperAdminDashboard() {
  const router = useRouter()
  const user= useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const [admins, setAdmins] = useState<User[]>([])
  const [adminRequests, setAdminRequests] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState("");

  const [bannerImage, setBannerImage] = useState<string>("/hero.png");
  const [newBannerImage, setNewBannerImage] = useState<string | null>(null);
  const [isBannerDialogOpen, setIsBannerDialogOpen] = useState(false)

  const [isDeleteAdminDialogOpen, setIsDeleteAdminDialogOpen] = useState(false);
  const [isDeleteRequestDialogOpen, setIsDeleteRequestDialogOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState<string | null>(null);
  const [requestToDelete, setRequestToDelete] = useState<string | null>(null);
  
  useEffect(() => {
    if (!user || !((user.role)==='superadmin')) {
      if(!user){
        return;
      }
      else if(user.role==="admin"){
        router.push("/admin/dashboard");
        toast.error("You are not authorized to access this page");
      }
      else if(user.role==="user"){
        router.push("/");
        toast.error("You are not authorized to access this page");
      }
    } else if(user.role==="superadmin"){
      const fetchAdmins = async () =>{
        try {
          const response1 = await getAdmins("active");
          const response2 = await getAdmins("pending");
          setAdmins(response1);
          setAdminRequests(response2);
        } catch (error) {
          console.error("Error fetching admins: ", error);
          toast.error("Failed to fetch admins");
        }
      }
      fetchAdmins();
    }
  }
  , [router, user, logout]);

  const handleBannerImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setNewBannerImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const saveBannerImage = () => {
    if (newBannerImage) {
      setBannerImage(newBannerImage)  // Save the new image and delete the old one using multer
      setNewBannerImage(null)
      setIsBannerDialogOpen(false)
    }
  }

  const confirmDeleteAdmin = (adminId: string) => {
    setAdminToDelete(adminId)
    setIsDeleteAdminDialogOpen(true)
  }

  const deleteAdmin = () => {
    if (adminToDelete) {
      setAdmins(admins.filter((admin) => admin.id !== adminToDelete)) //delete admin API
      setIsDeleteAdminDialogOpen(false)
      setAdminToDelete(null)
    }
  }

  const approveAdminRequest = async (requestEmail: string) => {
    try{
      await adminApproval(requestEmail, "approved");
      const requestedAdmin = adminRequests.find((req) => req.email === requestEmail);
      setAdminRequests(adminRequests.filter((req) => req.email !== requestEmail));
      setAdmins([...admins, requestedAdmin as User]);
      toast.success("Admin request approved successfully");
    } catch(err){
      toast.error("Error approving admin request");
      console.error("Error approving admin request: ", err);
    }
  }

  const rejectAdminRequest = async (requestEmail: string) => {
    try{
      await adminApproval(requestEmail, "rejected");
      setAdminRequests(adminRequests.filter((req) => req.email !== requestEmail));
      toast("Admin request rejected");
    } catch(err){
      toast.error("Error rejecting admin request");
      console.error("Error rejecting admin request: ", err);
    }
  }
  
  const confirmDeleteRequest = (requestEmail: string) => {
    setRequestToDelete(requestEmail);
    setIsDeleteRequestDialogOpen(true);
  }
  
  const deleteRequest = async () => {
    if (requestToDelete) {
      try {
        await adminApproval(requestToDelete, "deleted");
        setAdminRequests(adminRequests.filter((req) => req.email !== requestToDelete));
        toast.success("Admin request deleted successfully");
        setIsDeleteRequestDialogOpen(false);
        setRequestToDelete(null);
      } catch(err) {
        toast.error("Error deleting admin request");
        console.error("Error deleting admin request: ", err);
      }
    }
  }

  const initials = (name: string)=>{
    let answer="";
    const nameParts= name.split(" ");
    answer+=nameParts[0].charAt(0).toUpperCase();
    if(nameParts.length>1){
      answer+=nameParts[nameParts.length-1].charAt(0).toUpperCase();
    }
    return answer;
  }

  const fuseOptions = {
    keys: ['name', 'email', 'shortDescription'],
    threshold: 0.3,
  }
  const filteredAdmins= searchQuery.trim()? new Fuse(admins, fuseOptions).search(searchQuery).map(result => result.item): admins;

  if (!user) {
    return null;
  }

  return (
    <RequireAdminAuth>
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar />
      <div className="flex-1">
        <header className="bg-card bg-white border-b sticky top-0 z-10">
          <div className="flex items-center justify-between p-4">
            <h1 className="text-xl font-semibold hidden md:block">SuperAdmin Dashboard</h1>
            <div className="flex items-center gap-2">
              <Button className="bg-blue-500 text-white" onClick={() => setIsBannerDialogOpen(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Update Banner
              </Button>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Current Homepage Banner</CardTitle>
                <CardDescription>The banner currently displayed on the homepage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative w-full aspect-[3/1] rounded-md overflow-hidden border">
                  <Image src={bannerImage || "/placeholder.svg"} alt="Homepage Banner" fill className="object-cover" />
                </div>
                <div className="flex justify-end mt-4">
                  <Button className="bg-blue-500 text-white" onClick={() => setIsBannerDialogOpen(true)}>Change Banner</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Admin Management</CardTitle>
                <CardDescription>Manage admin users and approval requests</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="admins" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4 bg-gray-300">
                    <TabsTrigger value="admins" className="text-sm font-medium transition-all  data-[state=active]:bg-white data-[state=active]:text-black  data-[state=active]:shadow-none">Admin Users</TabsTrigger>
                    <TabsTrigger value="requests" className="text-sm font-medium transition-all  data-[state=active]:bg-white data-[state=active]:text-black  data-[state=active]:shadow-none">
                      Approval Requests
                      {adminRequests.length > 0 && (
                        <Badge className="text-white p-0 m-0 px-2 justify-center items-center bg-red-500 text-center rounded-full" variant="default" >
                          {adminRequests.length}
                        </Badge>
                      )}
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="admins">
                    <div className="space-y-4">
                      <div className="relative w-[100%]">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search admins..."
                          className="pl-8"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>

                      <div className="border rounded-md w-[100%]">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="bg-muted/50">
                                <th className="text-left whitespace-nowrap pl-16 pr-4 py-3 text-sm font-medium text-muted-foreground">
                                  Admin
                                </th>
                                <th className="text-left whitespace-nowrap px-4 py-3 text-sm font-medium text-muted-foreground">
                                  Role
                                </th>
                                <th className="text-left whitespace-nowrap px-4 py-3 text-sm font-medium text-muted-foreground">
                                  Products
                                </th>
                                <th className="text-left whitespace-nowrap px-4 py-3 text-sm font-medium text-muted-foreground">
                                  Last Active
                                </th>
                                <th className="text-left whitespace-nowrap pl-8 pr-4 py-3 text-sm font-medium text-muted-foreground">
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredAdmins.length > 0 ? (
                                filteredAdmins.map((admin) => (
                                  <tr key={admin.id} className="border-t">
                                    <td className="pl-16 pr-4 py-3">
                                      <div className="flex items-center gap-3">
                                        <Avatar>
                                          <AvatarImage src={"https://picsum.photos/200/300"} alt="Profile" />
                                          <AvatarFallback className="bg-gray-300">{initials(admin.name)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                          <div className="font-medium">{admin.name}</div>
                                          <div className="text-sm text-muted-foreground">{admin.email}</div>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                      <Badge variant={"outline"} className={admin.role === "superadmin" ? "text-blue-500" : "text-green-500"}>
                                        {admin.role}
                                      </Badge>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">10</td>  {/* Replace with actual products count */}
                                    <td className="px-4 py-3 whitespace-nowrap">Today</td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                      <div className={"flex items-center justify-start gap-2" }>
                                        <Link href={`/admin/superadmin/admins/${admin.id}`}>
                                          <Button variant="ghost" size="sm">
                                            View
                                          </Button>
                                        </Link>
                                          <Button variant="ghost" size="sm" className="text-red-500" disabled={admin.role==="superadmin"} onClick={() => confirmDeleteAdmin(admin.id)}>
                                            Remove
                                          </Button>
                                      </div>
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                                    No admins found. Try adjusting your search.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="requests">
                    {adminRequests.length > 0 ? (
                      <div className="space-y-4">
                        {adminRequests.map((request) => (
                          <div key={request.id} className="border rounded-md p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarImage src={'request.picture'} alt="Profile" />
                                  <AvatarFallback>{initials(request.name)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{request.name}</div>
                                  <div className="text-sm text-muted-foreground">{request.email}</div>
                                  <div className="text-xs text-muted-foreground">
                                    Requested on {new Date(request.created_at).toLocaleDateString('en-GB', {
                                      day: 'numeric',
                                      month: 'numeric', 
                                      year: 'numeric'
                                    })}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" className="text-red-500 bg-white" onClick={() => rejectAdminRequest(request.email)}>
                                  <X className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                                <Button variant="outline" className="text-green-500 bg-white" size="sm" onClick={() => approveAdminRequest(request.email)}>
                                  <Check className="h-4 w-4 mr-1" />
                                  Approve
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">No pending admin requests.</div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      <Dialog open={isBannerDialogOpen} onOpenChange={setIsBannerDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle>Update Homepage Banner</DialogTitle>
            <DialogDescription>
              Upload a new image for the homepage banner. Recommended size is 1920x640 pixels.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {newBannerImage ? (
              <div className="relative w-full aspect-[3/1] rounded-md overflow-hidden border">
                <Image
                  src={newBannerImage || "/placeholder.svg"}
                  alt="New Banner Preview"
                  fill
                  className="object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => setNewBannerImage(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="border border-dashed rounded-md text-center">
                <div className="space-y-4">
                    {newBannerImage ? (
                        <div className="relative w-full max-w-md mx-auto">
                            <Image
                                src={"/hero.png"}
                                alt="Product preview"
                                fill
                                priority={true}
                                className="rounded-md border object-cover h-64 w-full"
                            />
                        </div>
                    ) : (
                        <div className="border border-dashed rounded-md text-center">
                        <Label htmlFor="image" className="p-10 cursor-pointer w-full h-full flex flex-col">
                            <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground mb-2">Drag and drop, or click to browse</p>
                        </Label>
                        <Input name="image" id="image" type="file" accept="image/*" className="hidden cursor-pointer" onChange={handleBannerImageChange} />
                        </div>
                    )}
                    </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBannerDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-green-500 text-white" onClick={saveBannerImage} disabled={!newBannerImage}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteAdminDialogOpen} onOpenChange={setIsDeleteAdminDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Remove Admin</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this admin? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteAdminDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-red-500 text-white" variant="destructive" onClick={deleteAdmin}>
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete {NOT IMPLEMENTED YET}*/}
      <Dialog open={isDeleteRequestDialogOpen} onOpenChange={setIsDeleteRequestDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Delete Request</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this request? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteRequestDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" className="bg-red-500 text-white" onClick={deleteRequest}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </RequireAdminAuth>
  )
};
