"use client";
import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Upload, X, } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { AdminSidebar } from "@/components/adminSidebar";
import { categories } from "@/app/constants";
import { addProduct } from "@/lib/api";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { set } from "zod";

interface Product{
  name: string;
  category: string;
  price: string;
  image: File | string;
  rating?: string;
  stock: string;
  shortDescription: string;
  longDescription: string;
  status: string;
}

export default function NewProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState<Product>(
    {
      name: "",
      category: "",
      price: "",
      image: "",
      rating: "0.0",
      stock: "",
      shortDescription: "",
      longDescription: "",
      status: "active",
    }
  );

  useEffect(() => {
    setUser({
      name: "Test Admin",
      email: "admin@example.com",
      role: "admin",
    })
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setFormData({ ...formData, image: "" });
    setImagePreview(null);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await addProduct(formData);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Product created successfully");
    } catch (error) {
      console.error("Failed to create product:", error);
      toast.error("Failed to create product");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar />

      <div className="flex-1">
        <header className="bg-card bg-white border-b sticky top-0 z-10">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
              <Link href="/admin/dashboard" className="flex items-center text-sm hover:text-primary">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Dashboard
              </Link>
            </div>
            <h1 className="text-xl font-semibold">Add New Product</h1>
            <div className="w-20"></div>
          </div>
        </header>

        <main className="p-4 md:p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle>Product Information</CardTitle>
                  <CardDescription>Basic information about the product</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Product Name</Label>
                      <Input id="name" name="name" placeholder="Enter product name" value={formData.name} onChange={handleInputChange} required className="w-full"
                      />
                    </div>
                    <div className="space-y-2 flex flex-row space-x-4">
                      <div className="w-1/2">
                        <Label htmlFor="price">Price (₹)</Label>
                        <Input id="price" name="price" type="number" step="0.01" min="0" placeholder="10.00" value={formData.price} onChange={handleInputChange} required className="w-full mt-2" />
                      </div>
                      <div className="w-1/2">
                        <Label htmlFor="stock">Stock</Label>
                        <Input id="stock" name="stock" type="number" min="1" max="100000" placeholder="1" value={formData.stock} onChange={handleInputChange} required className="w-full mt-2" />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                        <SelectTrigger className="w-full text-black" id="category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.name}>
                                {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                        <SelectTrigger className="w-full text-black" id="status">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shortDescription">Short Description</Label>
                    <Textarea
                      id="shortDescription"
                      name="shortDescription"
                      placeholder="Brief description of the product"
                      value={formData.shortDescription}
                      onChange={handleInputChange}
                      rows={2}
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Product Details</CardTitle>
                  <CardDescription>Detailed information about the product</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="longDescription">Long Description</Label>
                    <Textarea
                      id="longDescription"
                      name="longDescription"
                      placeholder="Detailed description of the product"
                      value={formData.longDescription}
                      onChange={handleInputChange}
                      rows={6}
                    />
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Product Specifications</Label>
                      <Button className="text-white bg-blue-500" type="button" variant="outline" size="sm" onClick={()=>{}}>
                        Add Specification
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Product Image</CardTitle>
                  <CardDescription>Upload an image for the product</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {imagePreview ? (
                      <div className="relative w-full max-w-md mx-auto">
                        <img
                          src={imagePreview || "/placeholder.svg"}
                          alt="Product preview"
                          className="rounded-md border object-cover h-64 w-full"
                        />
                        <Button type="button" variant="destructive" size="sm" className="bg-white absolute top-2 right-2" onClick={removeImage}>
                          <X className="text-black h-6 w-6" />
                        </Button>
                      </div>
                    ) : (
                      <div className="border border-dashed rounded-md text-center">
                        <Label htmlFor="image" className="p-8 cursor-pointer w-full h-full flex flex-col">
                          <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground mb-2">Drag and drop, or click to browse</p>
                        </Label>
                        <Input id="image" type="file" accept="image/*" className="hidden cursor-pointer" onChange={handleImageChange}/>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex items-center justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => router.push("/admin/dashboard")}>
                Cancel
              </Button>
              <Button className="bg-green-500 text-white" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Product"}
              </Button>
            </div>
          </form>
        </main>
      </div>
    </div>
  )
}
