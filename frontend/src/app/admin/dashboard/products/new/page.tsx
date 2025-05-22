"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AdminSidebar } from "@/components/adminSidebar"
import { addProduct } from "@/lib/api"
import { toast } from "react-hot-toast"
import { ProductForm } from "@/components/productForm"
import type { Product } from "@/store/productStore"

export default function NewProductPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])

  const defaultInfo = {
    name: "",
    category: "",
    price: "",
    image: "",
    images: [],
    rating: "0.0",
    stock: "",
    shortDescription: "",
    longDescription: "",
    status: "active",
  }
  const [formData, setFormData] = useState<Product>(defaultInfo)

  useEffect(() => {
    setUser({
      name: "Test Admin",
      email: "admin@example.com",
      role: "admin",
    })
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      // Convert FileList to array and add to existing files
      const newFiles = Array.from(files)
      setImageFiles((prev) => [...prev, ...newFiles])

      // Create previews for new images
      newFiles.forEach((file) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          setImagePreviews((prev) => [...prev, reader.result as string])
        }
        reader.readAsDataURL(file)
      })

      // Set the first image as the main image if none exists
      if (!formData.image && newFiles.length > 0) {
        setFormData({ ...formData, image: newFiles[0] })
      }

      // Add all files to the images array in formData
      setFormData((prev) => ({
        ...prev,
        images: [...(prev.images || []), ...newFiles],
      }))
    }
  }

  const removeImage = (index: number) => {
    // Remove from previews
    setImagePreviews((prev) => prev.filter((_, i) => i !== index))

    // Remove from files
    const newFiles = [...imageFiles]
    newFiles.splice(index, 1)
    setImageFiles(newFiles)

    // Update formData
    setFormData((prev) => {
      const newImages = [...(prev.images || [])]
      newImages.splice(index, 1)

      // If we're removing the main image, set the first remaining image as main
      let newMainImage = prev.image
      if (index === 0 && newImages.length > 0) {
        newMainImage = newImages[0]
      } else if (newImages.length === 0) {
        newMainImage = ""
      }

      return {
        ...prev,
        images: newImages,
        image: newMainImage,
      }
    })
  }

  const setMainImage = (index: number) => {
    if (index >= 0 && index < imageFiles.length) {
      setFormData((prev) => ({
        ...prev,
        image: imageFiles[index],
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Update the formData to include all images
      const productData = {
        ...formData,
        images: imageFiles,
      }

      await addProduct(productData)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success("Product created successfully")
      setFormData(defaultInfo)
      setImageFiles([])
      setImagePreviews([])
    } catch (error) {
      console.error("Failed to create product:", error)
      toast.error("Failed to create product")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user) {
    return null
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
            <ProductForm
              formData={formData}
              imagePreviews={imagePreviews}
              handleInputChange={handleInputChange}
              handleSelectChange={handleSelectChange}
              handleImageChange={handleImageChange}
              removeImage={removeImage}
              setMainImage={setMainImage}
              mainImageIndex={imagePreviews.length > 0 ? 0 : -1}
            />

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
