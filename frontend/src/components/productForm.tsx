"use client"

import type React from "react"
import { Upload, X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { categories } from "@/app/constants"
import type { Product } from "@/store/productStore"

interface ProductFormProps {
  formData: Product
  imagePreviews: string[]
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  handleSelectChange: (name: string, value: string) => void
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  removeImage: (index: number) => void
  setMainImage?: (imageUrl: string) => void // Changed: accepts imageUrl string
}

export function ProductForm({
  formData,
  imagePreviews,
  handleInputChange,
  handleSelectChange,
  handleImageChange,
  removeImage,
  setMainImage,
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
              <Input
                id="name"
                name="name"
                placeholder="Enter product name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2 flex flex-row space-x-4">
              <div className="w-1/2">
                <Label htmlFor="price">Price (₹)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="10.00"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  className="w-full mt-2"
                />
              </div>
              <div className="w-1/2">
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  min="1"
                  max="100000"
                  placeholder="1"
                  value={formData.stock}
                  onChange={handleInputChange}
                  required
                  className="w-full mt-2"
                />
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
              <Button className="text-white bg-blue-500" type="button" variant="outline" size="sm" onClick={() => {}}>
                Add Specification
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Product Images</CardTitle>
          <CardDescription>Upload multiple images for the product</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Main Image Display */}
            <div className="mb-6">
              <Label htmlFor="main-image" className="block text-sm font-medium text-gray-700 mb-1">
                Main Product Image
              </Label>
              <div className="mt-1 p-2 border border-gray-300 rounded-md aspect-square max-w-xs mx-auto">
                <img
                  src={formData.image || "/placeholder.svg"}
                  alt="Main product image"
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
              {/* Optional: Add a button here if you want a dedicated "Change Main Image" functionality */}
            </div>

            <Separator className="my-4" />

            {/* Additional Images */}
            {imagePreviews.length > 0 && (
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <Label>Additional Images ({imagePreviews.length})</Label>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div
                      key={index}
                      className="relative group border rounded-md overflow-hidden aspect-square"
                    >
                      <img
                        src={preview || "/placeholder.svg"}
                        alt={`Product preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="flex gap-2">
                          {setMainImage && formData.image !== preview && ( // Show if setMainImage is provided and this preview is not already the main image
                            <Button
                              type="button"
                              variant="secondary"
                              size="sm"
                              className="bg-white text-black"
                              onClick={() => setMainImage(preview)} // Changed: pass preview URL
                              title="Set as main image"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="bg-white text-black"
                            onClick={() => removeImage(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="border border-dashed rounded-md text-center">
              <Label htmlFor="image" className="p-8 cursor-pointer w-full h-full flex flex-col">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-2">Drag and drop, or click to browse</p>
                <p className="text-xs text-muted-foreground">You can upload multiple images at once</p>
              </Label>
              <Input
                name="image"
                id="image"
                type="file"
                accept="image/*"
                multiple
                className="hidden cursor-pointer"
                onChange={handleImageChange}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
