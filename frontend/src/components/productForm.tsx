// src/components/ProductForm.tsx
"use client"; // Keep this if components inside use client hooks/features

import type React from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { categories } from "@/app/constants";

interface Product {
  name: string;
  category: string;
  price: string;
  image: File|  string; 
  rating?: string;
  stock: string;
  shortDescription: string;
  longDescription: string;
  status: string;
}

interface ProductFormProps {
  formData: Product;
  imagePreview: string | null;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: () => void;
}

export function ProductForm({
  formData,
  imagePreview,
  handleInputChange,
  handleSelectChange,
  handleImageChange,
  removeImage,
}: ProductFormProps) {
  return (
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
              <Button className="text-white bg-blue-500" type="button" variant="outline" size="sm" onClick={() => { }}>
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
                {(imagePreview.startsWith('data:') || imagePreview.startsWith('http')) ? (
                   <img
                      src={imagePreview}
                      alt="Product preview"
                      className="rounded-md border object-cover h-64 w-full"
                    />
                ) : (
                   <Image
                      src={imagePreview || "/placeholder.svg"}
                      alt="Product preview"
                      width={400}
                      height={256}
                      className="rounded-md border object-cover h-64 w-full"
                    />
                )}
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
                <Input name="image" id="image" type="file" accept="image/*" className="hidden cursor-pointer" onChange={handleImageChange} />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}