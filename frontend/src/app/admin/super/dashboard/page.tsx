/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import type React from "react"
import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Upload, Check, X, Search, ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { AdminSidebar } from "@/components/adminSidebar"
import { useUserStore } from "@/store/userStore"
import { useAuthStore } from "@/store/authStore"
import { toast } from "react-hot-toast"
import { getAdmins, adminApproval, getBanners, addBanner, Banner as BannerType } from "@/lib/api" // Updated imports
import Fuse from "fuse.js"
import type { User } from "@/store/userStore"

export default function SuperAdminDashboard() {
  const router = useRouter()
  const user = useUserStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  const [admins, setAdmins] = useState<User[]>([])
  const [adminRequests, setAdminRequests] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  const [bannerImages, setBannerImages] = useState<BannerType[]>([]) // Use BannerType
  const [newBannerFiles, setNewBannerFiles] = useState<File[]>([]) // Store File objects
  const [newBannerTitles, setNewBannerTitles] = useState<string[]>([]) // Store titles for new banners
  const [isLoadingBanners, setIsLoadingBanners] = useState(true);

  const [isBannerDialogOpen, setIsBannerDialogOpen] = useState(false)
  const [activeBannerIndex, setActiveBannerIndex] = useState(0)

  const [isDeleteAdminDialogOpen, setIsDeleteAdminDialogOpen] = useState(false)
  const [isDeleteRequestDialogOpen, setIsDeleteRequestDialogOpen] = useState(false)
  const [adminToDelete, setAdminToDelete] = useState<string | null>(null)
  const [requestToDelete, setRequestToDelete] = useState<string | null>(null)

  useEffect(() => {
    if (!user || !(user.role === "superadmin")) {
      if (user.role === "admin") {
        router.push("/admin/dashboard")
        toast.error("You are not authorized to access this page")
      } else if (user.role === "user") {
        router.push("/")
        toast.error("You are not authorized to access this page")
      }
    } else if (user.role === "superadmin") {
      const fetchInitialData = async () => {
        setIsLoadingBanners(true);
        try {
          const [adminsRes, pendingAdminsRes, bannersRes] = await Promise.all([
            getAdmins("active"),
            getAdmins("pending"),
            getBanners(),
          ]);
          setAdmins(adminsRes);
          setAdminRequests(pendingAdminsRes);
          setBannerImages(bannersRes || []); // Ensure bannerImages is an array
          if (bannersRes && bannersRes.length > 0) {
            setActiveBannerIndex(0);
          }
        } catch (error) {
          console.error("Error fetching initial data: ", error);
          toast.error("Failed to fetch initial data");
          setBannerImages([]); // Set to empty array on error
        } finally {
          setIsLoadingBanners(false);
        }
      };
      fetchInitialData();
    }
  }, [router, user, logout]);

  const handleBannerImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const imageFiles = Array.from(files).filter((file) => file.type.startsWith("image/"));
      setNewBannerFiles((prevFiles) => [...prevFiles, ...imageFiles]);
      setNewBannerTitles((prevTitles) => [...prevTitles, ...Array(imageFiles.length).fill("")]);
    }
     // Reset file input to allow selecting the same file again if needed
    if (e.target) {
      e.target.value = "";
    }
  };

  const updateNewBannerTitle = (index: number, title: string) => {
    setNewBannerTitles((prev) => {
      const updated = [...prev];
      if (updated[index] !== undefined) {
        updated[index] = title;
      }
      return updated;
    });
  };

  const removeNewBannerPreview = (index: number) => {
    setNewBannerFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setNewBannerTitles((prevTitles) => prevTitles.filter((_, i) => i !== index));
  };

  const saveBannerImages = async () => {
    if (newBannerFiles.length > 0) {
      let successfulUploads = 0;
      const currentBannerCount = bannerImages.length;
      try {
        const uploadPromises = newBannerFiles.map((file, index) => {
          const title = newBannerTitles[index] || `Banner ${currentBannerCount + index + 1}`;
          return addBanner({ title, image: file, active: true });
        });
        
        const newBanners = await Promise.all(uploadPromises);
        
        setBannerImages((prev) => [...prev, ...newBanners]);
        successfulUploads = newBanners.length;

        setNewBannerFiles([]);
        setNewBannerTitles([]);
        setIsBannerDialogOpen(false);
        if (successfulUploads > 0) {
          toast.success(`${successfulUploads} banner${successfulUploads > 1 ? "s" : ""} added successfully`);
        }
      } catch (error) {
        console.error("Error uploading banners:", error);
        toast.error("Failed to upload some banners. Please try again.");
      }
    }
  };

  const deleteBanner = async (id: string) => {
    try {
      await deleteBanner(id);
      const updatedBanners = bannerImages.filter((banner) => banner.id !== id);
      setBannerImages(updatedBanners);
      if (activeBannerIndex >= updatedBanners.length && updatedBanners.length > 0) {
        setActiveBannerIndex(updatedBanners.length - 1);
      } else if (updatedBanners.length === 0) {
        setActiveBannerIndex(0);
      }
      toast.success("Banner deleted successfully");
    } catch (error) {
      console.error("Error deleting banner:", error);
      toast.error("Failed to delete banner");
    }
  };

  const prevBanner = () => {
    if (bannerImages.length === 0) return;
    setActiveBannerIndex((prevIndex) =>
      prevIndex === 0 ? bannerImages.length - 1 : prevIndex - 1
    );
  };

  const nextBanner = () => {
    if (bannerImages.length === 0) return;
    setActiveBannerIndex((prevIndex) =>
      prevIndex === bannerImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const confirmDeleteAdmin = (adminId: string) => {
    setAdminToDelete(adminId)
    setIsDeleteAdminDialogOpen(true)
  }

  const deleteAdmin = () => {
    if (adminToDelete) {
      setAdmins(admins.filter((admin) => admin.id !== adminToDelete)) //delete admin API
      setIsDeleteAdminDialogOpen(false)
      setAdminToDelete(null)
      toast.success("Admin removed successfully")
    }
  }

  const approveAdminRequest = async (requestEmail: string) => {
    try {
      await adminApproval(requestEmail, "approved")
      const requestedAdmin = adminRequests.find((req) => req.email === requestEmail)
      setAdminRequests(adminRequests.filter((req) => req.email !== requestEmail))
      setAdmins([...admins, requestedAdmin as User])
      toast.success("Admin request approved successfully")
    } catch (err) {
      toast.error("Error approving admin request")
      console.error("Error approving admin request: ", err)
    }
  }

  const rejectAdminRequest = async (requestEmail: string) => {
    try {
      await adminApproval(requestEmail, "rejected")
      setAdminRequests(adminRequests.filter((req) => req.email !== requestEmail))
      toast("Admin request rejected")
    } catch (err) {
      toast.error("Error rejecting admin request")
      console.error("Error rejecting admin request: ", err)
    }
  }

  const confirmDeleteRequest = (requestEmail: string) => {
    setRequestToDelete(requestEmail)
    setIsDeleteRequestDialogOpen(true)
  }

  const deleteRequest = async () => {
    if (requestToDelete) {
      try {
        await adminApproval(requestToDelete, "deleted")
        setAdminRequests(adminRequests.filter((req) => req.email !== requestToDelete))
        toast.success("Admin request deleted successfully")
        setIsDeleteRequestDialogOpen(false)
        setRequestToDelete(null)
      } catch (err) {
        toast.error("Error deleting admin request")
        console.error("Error deleting admin request: ", err)
      }
    }
  }

  const initials = (name: string) => {
    let answer = ""
    const nameParts = name.split(" ")
    answer += nameParts[0].charAt(0).toUpperCase()
    if (nameParts.length > 1) {
      answer += nameParts[nameParts.length - 1].charAt(0).toUpperCase()
    }
    return answer
  }

  const fuseOptions = {
    keys: ["name", "email", "shortDescription"],
    threshold: 0.3,
  }
  const filteredAdmins = searchQuery.trim()
    ? new Fuse(admins, fuseOptions).search(searchQuery).map((result) => result.item)
    : admins

  if (!user) {
    return null
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar />
      <div className="flex-1">
        <header className="bg-card bg-white border-b sticky top-0 z-10">
          <div className="flex items-center justify-between p-4">
            <h1 className="text-xl font-semibold hidden md:block">SuperAdmin Dashboard</h1>
            <div className="flex items-center gap-2">
              <Button className="bg-blue-500 text-white" onClick={() => setIsBannerDialogOpen(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Add Banners
              </Button>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Homepage Banners</CardTitle>
                <CardDescription>Manage the banners displayed on the homepage slider</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoadingBanners ? (
                  <div className="relative w-full aspect-[3/1] rounded-md overflow-hidden border flex items-center justify-center bg-gray-100">
                    <p className="text-muted-foreground">Loading banners...</p>
                  </div>
                ) : bannerImages.length > 0 ? (
                  <>
                    <div className="relative w-full aspect-[3/1] rounded-md overflow-hidden border">
                      <div className="relative h-full w-full">
                        <Image
                          src={bannerImages[activeBannerIndex]?.image_url || "/placeholder.svg"} // MODIFIED: Use image_url
                          alt={bannerImages[activeBannerIndex]?.title || "Banner"}
                          fill
                          className="object-cover transition-opacity duration-300"
                        />

                        {bannerImages.length > 1 && (
                          <div className="absolute inset-0 flex items-center justify-between p-4">
                            <button
                              className="text-gray-300 cursor-pointer rounded-full bg-background/80 transform transition-transform duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-[1.03] hover:-translate-y-0.5"
                              onClick={prevBanner}>
                              <ChevronLeft size={50} />
                            </button>
                            <button
                              className="text-gray-300 cursor-pointer rounded-full bg-background/80 transform transition-transform duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-[1.03] hover:-translate-y-0.5"
                              onClick={nextBanner}>
                              <ChevronRight size={50} />
                            </button>
                          </div>
                        )}

                        {bannerImages.length > 1 && (
                          <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-md text-xs">
                            {activeBannerIndex + 1} / {bannerImages.length}
                          </div>
                        )}
                      </div>
                    </div>

                    {bannerImages.length > 1 && (
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">All Banners</h3>
                        <div className="border rounded-md divide-y">
                          {bannerImages.map((banner, index) => (
                            <div key={banner.id} className="p-3 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="relative h-16 w-24 rounded-md overflow-hidden border">
                                  <Image
                                    src={banner.image_url || "/placeholder.svg"} // MODIFIED: Use image_url
                                    alt={banner.title || `Banner ${index + 1}`}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div>
                                  <p className="font-medium">{banner.title}</p>
                                  <div className="flex items-center mt-1">
                                    <Badge
                                      variant={banner.active ? "default" : "secondary"}
                                      className={`text-xs ${banner.active ? "bg-green-100 text-green-800" : ""}`}
                                    >
                                      {banner.active ? "Active" : "Inactive"}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" onClick={() => toggleBannerActive(banner.id)}>
                                  {banner.active ? "Deactivate" : "Activate"}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-red-500 hover:text-red-700"
                                  onClick={() => deleteBanner(banner.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end mt-4">
                      <Button className="bg-blue-500 text-white" onClick={() => setIsBannerDialogOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add More Banners
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="border border-dashed rounded-md p-8 text-center">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-4">No banners added yet</p>
                    <Button className="bg-blue-500 text-white" onClick={() => setIsBannerDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Banner
                    </Button>
                  </div>
                )}
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
                    <TabsTrigger
                      value="admins"
                      className="text-sm font-medium transition-all  data-[state=active]:bg-white data-[state=active]:text-black  data-[state=active]:shadow-none"
                    >
                      Admin Users
                    </TabsTrigger>
                    <TabsTrigger
                      value="requests"
                      className="text-sm font-medium transition-all  data-[state=active]:bg-white data-[state=active]:text-black  data-[state=active]:shadow-none"
                    >
                      Approval Requests
                      {adminRequests.length > 0 && (
                        <Badge
                          className="text-white p-0 m-0 px-2 justify-center items-center bg-red-500 text-center rounded-full"
                          variant="default"
                        >
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
                                          <AvatarFallback className="bg-gray-300">
                                            {initials(admin.name)}
                                          </AvatarFallback>
                                        </Avatar>
                                        <div>
                                          <div className="font-medium">{admin.name}</div>
                                          <div className="text-sm text-muted-foreground">{admin.email}</div>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                      <Badge
                                        variant={"outline"}
                                        className={admin.role === "superadmin" ? "text-blue-500" : "text-green-500"}
                                      >
                                        {admin.role}
                                      </Badge>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">10</td>{" "}
                                    {/* Replace with actual products count */}
                                    <td className="px-4 py-3 whitespace-nowrap">Today</td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                      <div className={"flex items-center justify-start gap-2"}>
                                        <Link href={`/admin/superadmin/admins/${admin.id}`}>
                                          <Button variant="ghost" size="sm">
                                            View
                                          </Button>
                                        </Link>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="text-red-500"
                                          disabled={admin.role === "superadmin"}
                                          onClick={() => confirmDeleteAdmin(admin.id)}
                                        >
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
                                  <AvatarImage src={"request.picture"} alt="Profile" />
                                  <AvatarFallback>{initials(request.name)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{request.name}</div>
                                  <div className="text-sm text-muted-foreground">{request.email}</div>
                                  <div className="text-xs text-muted-foreground">
                                    Requested on{" "}
                                    {new Date(request.created_at).toLocaleDateString("en-GB", {
                                      day: "numeric",
                                      month: "numeric",
                                      year: "numeric",
                                    })}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-500 bg-white"
                                  onClick={() => rejectAdminRequest(request.email)}
                                >
                                  <X className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                                <Button
                                  variant="outline"
                                  className="text-green-500 bg-white"
                                  size="sm"
                                  onClick={() => approveAdminRequest(request.email)}
                                >
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

      <Dialog open={isBannerDialogOpen} onOpenChange={(isOpen) => {
        setIsBannerDialogOpen(isOpen);
        if (!isOpen) { // Reset previews when dialog is closed
          setNewBannerFiles([]);
          setNewBannerTitles([]);
        }
      }}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle>{newBannerFiles.length > 0 ? `New Banners (${newBannerFiles.length})` : "Add New Banners"}</DialogTitle>
            <DialogDescription className={newBannerFiles.length > 0 ? "hidden" : ""}>
              Upload multiple images for the homepage banner slider. Recommended size is 1920x640 pixels.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className={newBannerFiles.length > 0 ? "hidden" : "border border-dashed rounded-md text-center"}>
              <Label htmlFor="banner-images-input" className="p-10 cursor-pointer w-full h-full flex flex-col items-center justify-center">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-2">Click to browse and upload images</p>
                <p className="text-xs text-muted-foreground">You can select multiple images</p>
              </Label>
              <Input
                id="banner-images-input"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleBannerImageChange}
              />
            </div>

            {/* Preview of new banners */} 
            {newBannerFiles.length > 0 && (
              <div className="space-y-4">
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                  {newBannerFiles.map((file, index) => {
                    const previewUrl = URL.createObjectURL(file);
                    return (
                      <div key={index} className="border rounded-md p-3">
                        <div className="flex flex-col gap-3">
                          <div className="relative aspect-[3/1] w-full rounded-md overflow-hidden">
                            <Image
                              src={previewUrl} // Use createObjectURL for preview
                              alt={newBannerTitles[index] || `Banner preview ${index + 1}`}
                              fill
                              className="object-cover"
                              onLoad={() => URL.revokeObjectURL(previewUrl)} // Clean up object URL after load
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2 h-6 w-6"
                              onClick={() => removeNewBannerPreview(index)} // Updated function name
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`banner-title-${index}`} className="text-xs">
                              Banner Title
                            </Label>
                            <Input
                              id={`banner-title-${index}`}
                              value={newBannerTitles[index]}
                              onChange={(e) => updateNewBannerTitle(index, e.target.value)}
                              placeholder="Enter a title for this banner"
                              className="h-8 text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsBannerDialogOpen(false);
              setNewBannerFiles([]); // Clear previews on cancel
              setNewBannerTitles([]);
            }}>
              Cancel
            </Button>
            <Button
              className="bg-green-500 text-white"
              onClick={saveBannerImages}
              disabled={newBannerFiles.length === 0}
            >
              Add {newBannerFiles.length} {newBannerFiles.length === 1 ? "Banner" : "Banners"}
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

      {/* Delete Request Dialog */}
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
  )
}
