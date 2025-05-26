"use client";
import Fuse from "fuse.js";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Plus, Search, Edit, Trash2, ChevronLeft, ChevronRight, LogOut, LayoutDashboard, Settings, ShoppingBag,} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,} from "@/components/ui/dialog";
import { getProducts, deleteProduct as deleteProductApi } from "@/lib/api";
import { categories } from "@/app/constants";
import { AdminSidebar } from "@/components/adminSidebar";
import { useProductStore } from "@/store/productStore";
import { useAuthStore } from "@/store/authStore";
import { useUserStore } from "@/store/userStore";
import toast from "react-hot-toast";
import { RequireAdminAuth } from "@/components/requireAdminAuth";

export default function AdminDashboard() {
  const router = useRouter();
  const products = useProductStore((state) => state.products);
  const setProducts = useProductStore((state) => state.setProducts);
  const logout= useAuthStore((state)=>state.logout);
  const user = useUserStore((state) => state.user);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
        try {
          const response = await getProducts();
          setProducts(response);
        } catch (error) {
        console.error("Error fetching products:", error);
        } finally{
          // console.log(products);
        }
    };
    fetchProducts();
  }, [setProducts]);

  const confirmDelete = (productId: string) => {
    setProductToDelete(productId);
    setIsDeleteDialogOpen(true);
  }

  const deleteProduct = async () => {
      if (productToDelete) {
        try{
          await deleteProductApi(productToDelete);
          toast.success("Product deleted successfully");
          setProducts(products.filter((product) => product.id.toString() !== productToDelete.toString()));
        } catch (error) {
          console.error("Error deleting product:", error);
          toast.error("Error deleting product");
        }
        setIsDeleteDialogOpen(false);
      }
    };
    
    const fuseOptions = {
        keys: ['name', 'category', 'shortDescription'],
        threshold: 0.3,
    };
    const searchedProducts = searchQuery.trim()? new Fuse(products, fuseOptions).search(searchQuery).map((result) => result.item): products;

    const filteredProducts = searchedProducts.filter((product) => {
        const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
        const matchesStatus = statusFilter === "all" || product.status === statusFilter;
        return matchesCategory && matchesStatus;
    });

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar />

      <div className="flex-1">
        <header className="bg-card border-b sticky top-0 z-10 bg-white">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2 md:hidden">
              <Link href="/" className="flex items-center gap-2">
                <div className="relative h-8 w-8">
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="40" height="40" viewBox="0 0 48 48">
                        <path fill="#1976D2" d="M37.216,11.78c-0.023-0.211-0.211-0.305-0.351-0.305s-3.21-0.234-3.21-0.234s-2.132-2.132-2.39-2.343   c-0.234-0.234-0.68-0.164-0.867-0.117c-0.023,0-0.469,0.141-1.195,0.375c-0.726-2.086-1.968-3.984-4.194-3.984h-0.211   C24.187,4.375,23.391,4,22.735,4c-5.155,0-7.639,6.444-8.412,9.725c-2.015,0.633-3.445,1.054-3.609,1.125   c-1.125,0.351-1.148,0.375-1.289,1.429c-0.117,0.797-3.046,23.456-3.046,23.456L29.179,44l12.373-2.671 C41.575,41.282,37.24,11.991,37.216,11.78z M27.937,9.483c-0.562,0.164-1.242,0.375-1.921,0.609V9.671  c0-1.265-0.164-2.296-0.469-3.117C26.718,6.695,27.445,7.984,27.937,9.483L27.937,9.483z M24.117,6.812 c0.305,0.797,0.516,1.922,0.516,3.468v0.234c-1.265,0.398-2.601,0.797-3.984,1.242C21.422,8.804,22.899,7.351,24.117,6.812  L24.117,6.812z M22.617,5.359c0.234,0,0.469,0.094,0.656,0.234c-1.664,0.773-3.421,2.718-4.148,6.655   c-1.101,0.351-2.156,0.656-3.163,0.984C16.806,10.233,18.915,5.359,22.617,5.359z"></path>
                        <path fill="#1976D2" d="M36.865,11.428c-0.141,0-3.21-0.234-3.21-0.234s-2.132-2.132-2.39-2.343    C31.17,8.757,31.053,8.71,30.96,8.71L29.249,44l12.373-2.671c0,0-4.335-29.338-4.359-29.549    C37.169,11.569,37.005,11.475,36.865,11.428z"></path>
                        <path fill="#fff" d="M24.792,18.593l-1.475,4.449c0,0-1.337-0.715-2.927-0.715c-2.374,0-2.489,1.498-2.489,1.867   c0,2.028,5.301,2.812,5.301,7.583c0,3.757-2.374,6.177-5.578,6.177c-3.872,0-5.808-2.397-5.808-2.397l1.037-3.411   c0,0,2.028,1.752,3.734,1.752c1.129,0,1.59-0.876,1.59-1.521c0-2.651-4.333-2.766-4.333-7.145c0-3.665,2.628-7.214,7.952-7.214  C23.777,17.994,24.792,18.593,24.792,18.593z"></path>
                    </svg>
                </div>
                <span className="text-xl font-bold text-black">Shopcart</span>
              </Link>
            </div>
            <h1 className="text-xl font-semibold hidden md:block">Admin Dashboard</h1>
            <div className="flex items-center gap-2">
              <div className="md:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href="/admin/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/admin/dashboard/products">Products</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/admin/dashboard/settings">Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="" onClick={logout}>Log out</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <Link href="/admin/dashboard/products/new">
                <Button className="bg-blue-500">
                  <Plus className="h-4 w-4 mr-2 text-white" />
                  <p className="text-white">Add Product</p>
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-6">
          <div className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{products.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">+2.5% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Active Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{products.filter((p) => p.status === "active").length}</div>
                  <p className="text-xs text-muted-foreground mt-1">+1.2% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{categories.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">No change from last month</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Products</CardTitle>
                <CardDescription>Manage your product inventory</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search products..." className="pl-8" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
                    </div>
                    <div className="flex gap-2">
                      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger className="w-[160px]">
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="all">All Categories</SelectItem>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.name}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[160px]">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="draft">Draft</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="border rounded-md">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-muted/50">
                            <th className="text-left whitespace-nowrap px-4 py-3 text-sm font-medium text-muted-foreground">
                              Product
                            </th>
                            <th className="text-left whitespace-nowrap px-4 py-3 text-sm font-medium text-muted-foreground">
                              Category
                            </th>
                            <th className="text-left whitespace-nowrap px-4 py-3 text-sm font-medium text-muted-foreground">
                              Price
                            </th>
                            <th className="text-left whitespace-nowrap px-4 py-3 text-sm font-medium text-muted-foreground">
                              Status
                            </th>
                            <th className="text-right whitespace-nowrap px-4 py-3 text-sm font-medium text-muted-foreground">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => (
                              <tr key={product.id} className="border-t">
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-3">
                                    <div className="relative h-10 w-10 rounded-md overflow-hidden border">
                                      <Image
                                        src={product.image || "/placeholder.svg"}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                        sizes="40px"
                                      />
                                    </div>
                                    <div>
                                      <div className="font-medium">{product.name}</div>
                                      <div className="text-sm text-muted-foreground hidden md:block">
                                        {product.shortDescription.substring(0, 30)}...
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <Badge variant="outline">{product.category}</Badge>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">₹{Number(product.price).toFixed(2)}</td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <Badge className={product.status === "active" ? "bg-green-500 text-white" : product.status === "draft" ? "bg-blue-500 text-white" : "bg-red-500 text-white"}>
                                    {product.status}
                                  </Badge>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <Link href={`/admin/dashboard/products/${product.id}`}>
                                      <Button variant="ghost" size="icon">
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                    </Link>
                                    <Button variant="ghost" size="icon" onClick={() => confirmDelete(product.id)}>
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                                No products found. Try adjusting your filters.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* It would be good to add pagination here for better efficiency */}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Delete confirmation dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen} >
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" className="bg-red-500 text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60" onClick={deleteProduct}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

